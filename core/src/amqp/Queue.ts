import { generateId, sortByPriority } from './shared';
import { Message } from './Message';



const kConsumers = Symbol.for('consumers');
const kConsuming = Symbol.for('consuming');
const kExclusive = Symbol.for('exclusive');
const kInternalQueue = Symbol.for('internalQueue');
const kIsReady = Symbol.for('isReady');
const kOnConsumed = Symbol.for('kOnConsumed');
const kAvailableCount = Symbol.for('availableCount');
const kStopped = Symbol.for('stopped');

export class Queue {
    name: any;
    options: any;
    messages: any[];
    events: any;
    public constructor(name, options, eventEmitter?) {
        if (!name) name = `smq.qname-${generateId()}`;
        this.name = name;

        this.options = { autoDelete: true, ...options };

        this.messages = [];
        this.events = eventEmitter;
        this[kConsumers] = [];
        this[kStopped] = false;
        this[kAvailableCount] = 0;
        this[kExclusive] = false;
        this[kOnConsumed] = this._onMessageConsumed.bind(this);
    }

    public get consumerCount() {
        return this[kConsumers].length;
    }

    public get consumers() {
        return this[kConsumers].slice();
    }

    public get exclusive() {
        return this[kExclusive];
    }

    public get messageCount() {
        return this.messages.length;
    }

    public get stopped() {
        return this[kStopped];
    }


    public queueMessage(fields, content, properties) {
        if (this[kStopped]) return;

        const messageTtl = this.options.messageTtl;
        const messageProperties = { ...properties };
        if (messageTtl && !('expiration' in messageProperties)) {
            messageProperties.expiration = messageTtl;
        }
        const message: any = new Message(fields, content, messageProperties, this[kOnConsumed]);

        const capacity = this._getCapacity();
        this.messages.push(message);
        this[kAvailableCount]++;

        let discarded;
        switch (capacity) {
            case 0:
                discarded = this.evictFirst(message);
                break;
            case 1:
                this.emit('saturated', this);
                break;
        }

        this.emit('message', message);

        return discarded ? 0 : this._consumeNext();
    }

    public evictFirst(compareMessage) {
        const evict = this.get();
        if (!evict) return;
        evict.nack(false, false);
        return evict === compareMessage;
    }

    private _consumeNext() {
        if (this[kStopped] || !this[kAvailableCount]) return;

        const consumers = this[kConsumers];
        let consumed = 0;
        if (!consumers.length) return consumed;

        for (const consumer of consumers) {
            if (!consumer.ready) continue;
            const msgs = this._consumeMessages(consumer.capacity, consumer.options);
            if (!msgs.length) return consumed;
            consumer._push(msgs);
            consumed += msgs.length;
        }

        return consumed;
    }

    public consume(onMessage, consumeOptions: any = {}, owner?) {
        const consumers = this[kConsumers];
        const noOfConsumers = consumers.length;

        if (noOfConsumers) {
            if (this[kExclusive]) throw new Error(`Queue ${this.name} is exclusively consumed by ${consumers[0].consumerTag}`);
            if (consumeOptions.exclusive) throw new Error(`Queue ${this.name} already has consumers and cannot be exclusively consumed`);
        }

        const consumer = new Consumer(this, onMessage, consumeOptions, owner, new ConsumerEmitter(this));
        consumers.push(consumer);
        consumers.sort(sortByPriority);

        if (consumer.options.exclusive) {
            this[kExclusive] = true;
        }

        this.emit('consume', consumer);

        const pendingMessages: any = this._consumeMessages(consumer.capacity, consumer.options);
        if (pendingMessages.length) (consumer as any)._push(pendingMessages);

        return consumer;
    }

    public assertConsumer(onMessage, consumeOptions: any = {}, owner) {
        const consumers = this[kConsumers];
        if (!consumers.length) return this.consume(onMessage, consumeOptions, owner);
        for (const consumer of consumers) {
            if (consumer.onMessage !== onMessage) continue;

            if (consumeOptions.consumerTag && consumeOptions.consumerTag !== consumer.consumerTag) {
                continue;
            } else if ('exclusive' in consumeOptions && consumeOptions.exclusive !== consumer.options.exclusive) {
                continue;
            }

            return consumer;
        }
        return this.consume(onMessage, consumeOptions, owner);
    }

    public get({ noAck = undefined, consumerTag = undefined } = {}) {
        const message = this._consumeMessages(1, { noAck, consumerTag })[0];
        if (!message) return false;
        if (noAck) this._dequeueMessage(message);

        return message;
    }

    private _consumeMessages(n, consumeOptions) {
        const msgs: any[] = [];

        if (this[kStopped] || !this[kAvailableCount] || !n) return msgs;

        const messages: any = this.messages;
        if (!messages.length) return msgs;

        const evict: any = [];
        for (const message of messages) {
            if (message.pending) continue;
            if (message.properties.expiration && message.properties.ttl < Date.now()) {
                evict.push(message);
                continue;
            }
            message._consume(consumeOptions);
            this[kAvailableCount]--;
            msgs.push(message);
            if (!--n) break;
        }

        if (evict.length) {
            for (const expired of evict) this.nack(expired, false, false);
        }

        return msgs;
    }

    public ack(message, allUpTo) {
        this._onMessageConsumed(message, 'ack', allUpTo, false);
    }

    public nack(message, allUpTo, requeue = true) {
        this._onMessageConsumed(message, 'nack', allUpTo, requeue);
    }

    public reject(message, requeue = true) {
        this._onMessageConsumed(message, 'nack', false, requeue);
    }

    private _onMessageConsumed(message, operation, allUpTo, requeue) {
        if (this[kStopped]) return;

        const msgIdx = this._dequeueMessage(message);
        if (msgIdx === -1) return;

        const messages = this.messages;
        const pending = allUpTo && this._getPendingMessages(msgIdx);

        let deadLetterExchange;
        switch (operation) {
            case 'ack':
                break;
            case 'nack': {
                if (requeue) {
                    this[kAvailableCount]++;
                    messages.splice(msgIdx, 0, new Message({ ...message.fields, redelivered: true }, message.content, message.properties, this[kOnConsumed]));
                } else {
                    deadLetterExchange = this.options.deadLetterExchange;
                }
                break;
            }
        }

        let capacity;
        if (!messages.length) this.emit('depleted', this);
        else if ((capacity = this._getCapacity()) === 1) this.emit('ready', capacity);

        const pendingLength = pending && pending.length;
        if (!pendingLength) this._consumeNext();

        if (!requeue && message.properties.confirm) {
            this.emit('message.consumed.' + operation, { operation, message: { ...message } });
        }

        if (deadLetterExchange) {
            const deadLetterRoutingKey = this.options.deadLetterRoutingKey;
            const deadMessage = new Message(message.fields, message.content, { ...message.properties, expiration: undefined });
            if (deadLetterRoutingKey) (deadMessage as any).fields.routingKey = deadLetterRoutingKey;

            this.emit('dead-letter', {
                deadLetterExchange,
                message: deadMessage,
            });
        }

        if (pendingLength) {
            for (const msg of pending) {
                msg[operation](false, requeue);
            }
        }
    }

    public ackAll() {
        for (const msg of this._getPendingMessages()) {
            msg.ack(false);
        }
    }

    public nackAll(requeue = true) {
        for (const msg of this._getPendingMessages()) {
            msg.nack(false, requeue);
        }
    }

    private _getPendingMessages(untilIndex?): any[] {
        const messages = this.messages;
        const l = messages.length;
        const result: any[] = [];
        if (!l) return result;

        const until = untilIndex === undefined ? l : untilIndex;

        for (let i = 0; i < until; ++i) {
            const msg = messages[i];
            if (!msg.pending) continue;
            result.push(msg);
        }

        return result;
    }

    public peek(ignoreDelivered) {
        const message = this.messages[0];
        if (!message) return;

        if (!ignoreDelivered) return message;
        if (!message.pending) return message;

        for (const msg of this.messages) {
            if (!msg.pending) return msg;
        }
    }

    public cancel(consumerTag) {
        const consumers = this[kConsumers];
        const idx = consumers.findIndex((c) => c.consumerTag === consumerTag);
        if (idx === -1) return;

        const consumer = consumers[idx];
        this.unbindConsumer(consumer);
    }

    public dismiss(onMessage) {
        const consumers = this[kConsumers];
        const consumer = consumers.find((c) => c.onMessage === onMessage);
        if (!consumer) return;
        this.unbindConsumer(consumer);
    }

    public unbindConsumer(consumer) {
        const consumers = this[kConsumers];
        const idx = consumers.indexOf(consumer);
        if (idx === -1) return;

        consumers.splice(idx, 1);

        this[kExclusive] = false;

        consumer.stop();
        consumer.nackAll(true);

        this.emit('consumer.cancel', consumer);

        if (!consumers.length && this.options.autoDelete) return this.emit('delete', this);
    }

    public emit(eventName, content) {
        const eventEmitter = this.events;
        if (!eventEmitter) return;
        eventEmitter.emit(`queue.${eventName}`, content);
    }

    public on(eventName, handler) {
        const eventEmitter = this.events;
        if (!eventEmitter) return;
        return eventEmitter.on(`queue.${eventName}`, handler);
    }

    public off(eventName, handler) {
        const eventEmitter = this.events;
        if (!eventEmitter) return;
        return eventEmitter.off(`queue.${eventName}`, handler);
    }

    public purge() {
        const toDelete = this.messages.filter(({ pending }) => !pending);
        this[kAvailableCount] = 0;

        for (const msg of toDelete) {
            this._dequeueMessage(msg);
        }

        if (!this.messages.length) this.emit('depleted', this);
        return toDelete.length;
    }

    private _dequeueMessage(message) {
        const messages = this.messages;
        const msgIdx = messages.indexOf(message);
        if (msgIdx === -1) return msgIdx;
        messages.splice(msgIdx, 1);
        return msgIdx;
    }

    public getState() {
        const msgs = this.messages;
        const state: any = {
            name: this.name,
            options: { ...this.options },
        };
        if (msgs.length) {
            try {
                state.messages = JSON.parse(JSON.stringify(msgs));
            } catch (err: any) {
                err.code = 'EQUEUE_STATE';
                err.queue = this.name;
                throw err;
            }
        }

        return state;
    }

    public recover(state) {
        this[kStopped] = false;
        const consumers = this[kConsumers];
        if (!state) {
            for (const c of consumers.slice()) c.recover();
            return this._consumeNext();
        }

        this.name = state.name;

        this.messages.splice(0);

        let continueConsume;
        if (consumers.length) {
            for (const c of consumers) c.nackAll(false);
            continueConsume = true;
        }

        if (!state.messages) return this;

        const onConsumed = this[kOnConsumed];
        for (const { fields, content, properties } of state.messages) {
            if (properties.persistent === false) continue;
            const msg = new Message({ ...fields, redelivered: true }, content, properties, onConsumed);
            this.messages.push(msg);
        }
        this[kAvailableCount] = this.messages.length;
        consumers.forEach((c) => c.recover());
        if (continueConsume) {
            this._consumeNext();
        }

        return this;
    }

    public delete({ ifUnused = undefined, ifEmpty = undefined } = {}) {
        const consumers = this[kConsumers];
        if (ifUnused && consumers.length) return;
        const messages = this.messages;
        if (ifEmpty && messages.length) return;

        this[kStopped] = true;
        const messageCount = messages.length;
        for (const consumer of this[kConsumers].splice(0)) {
            this.emit('consumer.cancel', consumer);
        }

        messages.splice(0);

        this.emit('delete', this);
        return { messageCount };
    }

    public close() {
        for (const consumer of this[kConsumers].slice()) {
            this.unbindConsumer(consumer);
        }
    }

    public stop() {
        this[kStopped] = true;
        for (const consumer of this[kConsumers].slice()) {
            consumer.stop();
        }
    }

    private _getCapacity() {
        if ('maxLength' in this.options) {
            return this.options.maxLength - this.messages.length;
        }
        return Infinity;
    }
}

export class Consumer {
    options: any;
    queue: any;
    onMessage: any;
    owner: any;
    events: any;
    public constructor(queue, onMessage, options, owner, eventEmitter) {
        if (typeof onMessage !== 'function') throw new Error('message callback is required and must be a function');

        this.options = { prefetch: 1, priority: 0, noAck: false, ...options };
        if (!this.options.consumerTag) this.options.consumerTag = 'smq.ctag-' + generateId();

        this.queue = queue;
        this.onMessage = onMessage;
        this.owner = owner;
        this.events = eventEmitter;
        this[kIsReady] = true;
        this[kStopped] = false;
        this[kConsuming] = false;

        this[kInternalQueue] = new Queue(this.options.consumerTag + '-q', {
            autoDelete: false,
            maxLength: this.options.prefetch,
        }, new ConsumerQueueEvents(this));
    }

    public get consumerTag() {
        return this.options.consumerTag;
    }

    public get ready() {
        return this[kIsReady] && !this[kStopped];
    }


    public get stopped() {
        return this[kStopped];
    }

    public get capacity() {
        return this[kInternalQueue]._getCapacity();
    }

    public get messageCount() {
        return this[kInternalQueue].messageCount;
    }

    public get queueName() {
        return this.queue.name;
    }



    private _push(messages) {
        const internalQueue = this[kInternalQueue];
        for (const message of messages) {
            internalQueue.queueMessage(message.fields, message, message.properties);
        }
        if (!this[kConsuming]) {
            this._consume();
        }
    }

    private _consume() {
        this[kConsuming] = true;

        const internalQ = this[kInternalQueue];
        let _msg;
        while ((_msg = internalQ.get())) {
            const msg = _msg;
            const options = this.options;
            msg._consume(options);
            const message = msg.content;
            message._consume(options, () => msg.ack(false));

            if (options.noAck) message.ack();
            this.onMessage(msg.fields.routingKey, message, this.owner);

            if (this[kStopped]) break;
        }

        this[kConsuming] = false;
    }

    public nackAll(requeue) {
        for (const msg of this[kInternalQueue].messages.slice()) {
            msg.content.nack(false, requeue);
        }
    }

    public ackAll() {
        for (const msg of this[kInternalQueue].messages.slice()) {
            msg.content.ack(false);
        }
    }

    public cancel(requeue = true) {
        this.stop();
        if (!requeue) this.nackAll(requeue);
        this.emit('cancel', this);
    }

    public prefetch(value) {
        this.options.prefetch = this[kInternalQueue].options.maxLength = value;
    }

    public emit(eventName, content) {
        const routingKey = `consumer.${eventName}`;
        this.events.emit(routingKey, content);
    }

    public on(eventName, handler) {
        const pattern = `consumer.${eventName}`;
        return this.events.on(pattern, handler);
    }

    public recover() {
        this[kStopped] = false;
    }

    public stop() {
        this[kStopped] = true;
    }
}

class ConsumerEmitter {
    queue: any;
    public constructor(queue) {
        this.queue = queue;
    }

    public on(...args) {
        return this.queue.on(...args);
    }

    public emit(eventName, content) {
        if (eventName === 'consumer.cancel') {
            return this.queue.unbindConsumer(content);
        }
        this.queue.emit(eventName, content);
    }
}

class ConsumerQueueEvents {
    consumer: any;
    public constructor(consumer) {
        this.consumer = consumer;
    }

    public emit(eventName) {
        switch (eventName) {
            case 'queue.saturated': {
                this.consumer[kIsReady] = false;
                break;
            }
            case 'queue.depleted':
            case 'queue.ready':
                this.consumer[kIsReady] = true;
                break;
        }
    }
}