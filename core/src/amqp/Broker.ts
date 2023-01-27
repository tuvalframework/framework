import { Exchange, EventExchange } from './Exchange';
import { Queue } from './Queue';
import { Shovel } from './Shovel';

const kEntities = Symbol.for('entities');
const kEventHandler = Symbol.for('eventHandler');

export class Broker<W = any> {
    public readonly owner: W = undefined as any;
    events: any;

    public constructor(owner: W) {
        if (!(this instanceof Broker)) {
            return new Broker(owner);
        }
        this.owner = owner;
        this.events = new (EventExchange as any)('broker__events');
        const entities = this[kEntities] = {
            exchanges: [],
            queues: [],
            consumers: [],
            shovels: [],
        };
        this[kEventHandler] = new EventHandler(this, entities);
    }

    public get exchangeCount() {
        return this[kEntities].exchanges.length;
    }

    public get queueCount() {
        return this[kEntities].queues.length;
    }

    public get consumerCount() {
        return this[kEntities].consumers.length;
    }

    public subscribe(exchangeName, pattern, queueName, onMessage, options: any = { durable: true }) {
        if (!exchangeName || !pattern || typeof onMessage !== 'function') throw new Error('exchange name, pattern, and message callback are required');
        if (options && options.consumerTag) this.validateConsumerTag(options.consumerTag);

        const exchange = this.assertExchange(exchangeName);
        const queue = this.assertQueue(queueName, options);

        exchange.bindQueue(queue, pattern, options);

        return queue.assertConsumer(onMessage, options, this.owner);
    }

    public subscribeTmp(exchangeName, pattern, onMessage, options) {
        return this.subscribe(exchangeName, pattern, null, onMessage, { ...options, durable: false });
    }

    public subscribeOnce(exchangeName, pattern, onMessage, options: any = {}) {
        if (typeof onMessage !== 'function') throw new Error('message callback is required');
        if (options && options.consumerTag) this.validateConsumerTag(options.consumerTag);

        const exchange = this.assertExchange(exchangeName);
        const onceOptions = { autoDelete: true, durable: false, priority: options.priority || 0 };

        const onceQueue = this.createQueue(null, onceOptions);
        exchange.bindQueue(onceQueue, pattern, onceOptions);

        return this.consume(onceQueue.name, wrappedOnMessage, { noAck: true, consumerTag: options.consumerTag });

        function wrappedOnMessage(...args) {
            onceQueue.delete();
            onMessage(...args);
        }
    };

    public unsubscribe(queueName, onMessage) {
        const queue = this.getQueue(queueName);
        if (!queue) return;
        queue.dismiss(onMessage);
    }

    public assertExchange(exchangeName: string, type?: string, options?: any) {
        let exchange = this.getExchange(exchangeName);
        if (exchange) {
            if (type && exchange.type !== type) throw new Error('Type doesn\'t match');
            return exchange;
        }

        exchange = new (Exchange as any)(exchangeName, type || 'topic', options);
        this[kEventHandler].listen(exchange.events);
        this[kEntities].exchanges.push(exchange);

        return exchange;
    }

    public bindQueue(queueName, exchangeName, pattern, bindOptions) {
        const exchange = this.getExchange(exchangeName);
        const queue = this.getQueue(queueName);
        return exchange.bindQueue(queue, pattern, bindOptions);
    }

    public unbindQueue(queueName, exchangeName, pattern) {
        const exchange = this.getExchange(exchangeName);
        if (!exchange) return;
        const queue = this.getQueue(queueName);
        if (!queue) return;
        exchange.unbindQueue(queue, pattern);
    }

    public consume(queueName, onMessage, options) {
        const queue = this.getQueue(queueName);
        if (!queue) throw new Error(`Queue with name <${queueName}> was not found`);

        if (options) this.validateConsumerTag(options.consumerTag);

        return queue.consume(onMessage, options, this.owner);
    }

    public cancel(consumerTag, requeue = true) {
        const consumer = this.getConsumer(consumerTag);
        if (!consumer) return false;
        consumer.cancel(requeue);
        return true;
    }

    public getConsumers() {
        return this[kEntities].consumers.map((consumer) => {
            return {
                queue: consumer.queue.name,
                consumerTag: consumer.options.consumerTag,
                options: { ...consumer.options },
            };
        });
    }

    public getConsumer(consumerTag) {
        return this[kEntities].consumers.find((c) => c.consumerTag === consumerTag);
    }

    public getExchange(exchangeName) {
        return this[kEntities].exchanges.find(({ name }) => name === exchangeName);
    }

    public deleteExchange(exchangeName: string, ifUnused?: boolean): boolean {
        const exchanges = this[kEntities].exchanges;
        const idx = exchanges.findIndex((exchange) => exchange.name === exchangeName);
        if (idx === -1) return false;

        const exchange = exchanges[idx];
        if (ifUnused && exchange.bindingCount) return false;

        exchanges.splice(idx, 1);
        exchange.close();
        return true;
    }

    public stop() {
        const { exchanges, queues } = this[kEntities];
        for (const exchange of exchanges) exchange.stop();
        for (const queue of queues) queue.stop();
    }

    public close() {
        const { shovels, exchanges, queues } = this[kEntities];
        for (const shovel of shovels) shovel.close();
        for (const exchange of exchanges) exchange.close();
        for (const queue of queues) queue.close();
    }

    public reset() {
        this.stop();
        this.close();
        this[kEntities].exchanges.splice(0);
        this[kEntities].queues.splice(0);
        this[kEntities].consumers.splice(0);
        this[kEntities].shovels.splice(0);
    }

    public getState(onlyWithContent) {
        const exchanges = this._getExchangeState(onlyWithContent);
        const queues = this._getQueuesState(onlyWithContent);

        if (onlyWithContent && !exchanges && !queues) return;

        return {
            exchanges,
            queues,
        };
    }

    public recover(state) {
        const self = this;
        const boundGetQueue = self.getQueue.bind(self);
        if (state) {
            if (state.queues) for (const qState of state.queues) recoverQueue(qState);
            if (state.exchanges) for (const eState of state.exchanges) recoverExchange(eState);
        } else {
            const { queues, exchanges } = self[kEntities];
            for (const queue of queues) {
                if (queue.stopped) queue.recover();
            }
            for (const exchange of exchanges) {
                if (exchange.stopped) exchange.recover(null, boundGetQueue);
            }
        }

        return self;

        function recoverQueue(qState) {
            const queue = self.assertQueue(qState.name, qState.options);
            queue.recover(qState);
        }

        function recoverExchange(eState) {
            const exchange = self.assertExchange(eState.name, eState.type, eState.options);
            exchange.recover(eState, boundGetQueue);
        }
    }

    public bindExchange(source: string, destination: string, pattern: string = '#', args: any = {}) {
        const name = `e2e-${source}2${destination}-${pattern}`;
        const { priority } = args;
        const shovel = this.createShovel(name, {
            broker: this,
            exchange: source,
            pattern,
            priority,
            consumerTag: `smq.ctag-${name}`,
        }, {
            broker: this,
            exchange: destination,
        }, {
            ...args,
        });

        const { consumerTag, source: shovelSource } = shovel;

        return {
            name,
            source,
            destination,
            queue: shovelSource.queue,
            consumerTag,
            on(...onargs) {
                return (shovel as any).on(...onargs);
            },
            close() {
                return shovel.close();
            },
        };
    }

    public unbindExchange(source, destination, pattern = '#') {
        const name = `e2e-${source}2${destination}-${pattern}`;
        return this.closeShovel(name);
    }

    public publish(exchangeName, routingKey, content, options) {
        const exchange = this.getExchange(exchangeName);
        if (!exchange) return;
        return exchange.publish(routingKey, content, options);
    }

    public purgeQueue(queueName) {
        const queue = this.getQueue(queueName);
        if (!queue) return;
        return queue.purge();
    }

    public sendToQueue(queueName, content, options = {}) {
        const queue = this.getQueue(queueName);
        if (!queue) throw new Error(`Queue named ${queueName} doesn't exists`);
        return queue.queueMessage(null, content, options);
    }

    private _getQueuesState(onlyWithContent) {
        return this[kEntities].queues.reduce((result, queue) => {
            if (!queue.options.durable) return result;
            if (onlyWithContent && !queue.messageCount) return result;
            if (!result) result = [];
            result.push(queue.getState());
            return result;
        }, undefined);
    }

    private _getExchangeState(onlyWithContent) {
        return this[kEntities].exchanges.reduce((result, exchange) => {
            if (!exchange.options.durable) return result;
            if (onlyWithContent && !exchange.undeliveredCount) return result;
            if (!result) result = [];
            result.push(exchange.getState());
            return result;
        }, undefined);
    }

    public createQueue(queueName, options) {
        const self = this;
        if (self.getQueue(queueName)) throw new Error(`Queue named ${queueName} already exists`);

        const queueEmitter = EventExchange(queueName + '__events');
        this[kEventHandler].listen(queueEmitter);
        const queue = new Queue(queueName, options, queueEmitter);

        self[kEntities].queues.push(queue);
        return queue;
    }

    public getQueue(queueName) {
        if (!queueName) return;
        const queues = this[kEntities].queues;
        const idx = queues.findIndex((queue) => queue.name === queueName);
        if (idx > -1) return queues[idx];
    }

    public assertQueue(queueName, options: any = {}) {
        if (!queueName) return this.createQueue(null, options);

        const queue = this.getQueue(queueName);
        options = { durable: true, ...options };
        if (!queue) return this.createQueue(queueName, options);

        if (queue.options.durable !== options.durable) throw new Error('Durable doesn\'t match');
        return queue;
    }

    public deleteQueue(queueName, options) {
        if (!queueName) return false;
        const queue = this.getQueue(queueName);
        if (!queue) return false;
        return queue.delete(options);
    }

    public get(queueName, { noAck = undefined } = {}) {
        const queue = this.getQueue(queueName);
        if (!queue) return;

        return queue.get({ noAck });
    }

    public ack(message, allUpTo) {
        message.ack(allUpTo);
    }

    public ackAll() {
        for (const queue of this[kEntities].queues) queue.ackAll();
    }

    public nack(message, allUpTo, requeue) {
        message.nack(allUpTo, requeue);
    }

    public nackAll(requeue) {
        for (const queue of this[kEntities].queues) queue.nackAll(requeue);
    }

    public reject(message, requeue) {
        message.reject(requeue);
    }

    public validateConsumerTag(consumerTag) {
        if (!consumerTag) return true;

        if (this.getConsumer(consumerTag)) {
            throw new Error(`Consumer tag must be unique, ${consumerTag} is occupied`);
        }

        return true;
    }

    public createShovel(name, source, destination, options) {
        const shovels = this[kEntities].shovels;
        if (this.getShovel(name)) throw new Error(`Shovel name must be unique, ${name} is occupied`);
        const shovel = new Shovel(name, { ...source, broker: this }, destination, options);
        this[kEventHandler].listen(shovel.events);
        shovels.push(shovel);
        return shovel;
    }

    public closeShovel(name) {
        const shovel = this.getShovel(name);
        if (shovel) {
            shovel.close();
            return true;
        }
        return false;
    }

    public getShovel(name) {
        return this[kEntities].shovels.find((s) => s.name === name);
    }

    public getShovels() {
        return this[kEntities].shovels.slice();
    }

    public on(eventName, callback, options) {
        return this.events.on(eventName, getEventCallback(), { ...options, origin: callback });

        function getEventCallback() {
            return function eventCallback(name, msg) {
                callback({
                    name,
                    ...msg.content,
                });
            };
        }
    }

    public off(eventName, callbackOrObject) {
        const { consumerTag } = callbackOrObject;
        for (const binding of this.events.bindings) {
            if (binding.pattern === eventName) {
                if (consumerTag) {
                    binding.queue.cancel(consumerTag);
                    continue;
                }

                for (const consumer of binding.queue.consumers) {
                    if (consumer.options && consumer.options.origin === callbackOrObject) {
                        consumer.cancel();
                    }
                }
            }
        }
    }

    public prefetch() { };
}


class EventHandler {
    broker: any;
    entities: any;
    public constructor(broker, entities) {
        this.broker = broker;
        this.entities = entities;
        this.handler = this.handler.bind(this);
    }

    public listen(emitter) {
        emitter.on('#', this.handler);
    }

    public handler(eventName, msg) {
        switch (eventName) {
            case 'exchange.delete': {
                const exchanges = this.entities.exchanges;
                const idx = exchanges.indexOf(msg.content);
                if (idx === -1) return;
                exchanges.splice(idx, 1);
                break;
            }
            case 'exchange.return': {
                this.broker.events.publish('return', msg.content);
                break;
            }
            case 'exchange.message.undelivered': {
                this.broker.events.publish('message.undelivered', msg.content);
                break;
            }
            case 'queue.delete': {
                const queues = this.entities.queues;
                const idx = queues.indexOf(msg.content);
                if (idx === -1) return;
                queues.splice(idx, 1);
                break;
            }
            case 'queue.dead-letter': {
                const exchange = this.broker.getExchange(msg.content.deadLetterExchange);
                if (!exchange) return;
                const { fields, content, properties } = msg.content.message;
                exchange.publish(fields.routingKey, content, properties);
                break;
            }
            case 'queue.consume': {
                this.entities.consumers.push(msg.content);
                break;
            }
            case 'queue.consumer.cancel': {
                const consumers = this.entities.consumers;
                const idx = consumers.indexOf(msg.content);
                if (idx !== -1) consumers.splice(idx, 1);
                break;
            }
            case 'queue.message.consumed.ack':
            case 'queue.message.consumed.nack': {
                const { operation, message } = msg.content;
                this.broker.events.publish('message.' + operation, message);
                break;
            }
            case 'shovel.close': {
                const shovels = this.entities.shovels;
                const idx = shovels.indexOf(msg.content);
                if (idx > -1) shovels.splice(idx, 1);
                break;
            }
        }
    }
}