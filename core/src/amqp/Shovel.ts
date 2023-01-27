import { EventExchange } from './Exchange';

const kBrokerInternal = Symbol.for('brokerInternal');
const kCloneMessage = Symbol.for('cloneMessage');
const kClosed = Symbol.for('closed');
const kConsumerTag = Symbol.for('consumerTag');
const kDestinationExchange = Symbol.for('destinationExchange');
const kEventHandlers = Symbol.for('eventHandlers');
const kSourceBroker = Symbol.for('sourceBroker');
const kSourceExchange = Symbol.for('sourceExchange');

export class Shovel {
    name: any;
    source: any;
    destination: any;
    events: any;
    public constructor(name, source, destination, options: any = {}) {
        const { broker: sourceBroker, exchange: sourceExchangeName, pattern, queue, priority } = source;
        const { broker: destinationBroker, exchange: destinationExchangeName } = destination;

        const sourceExchange = sourceBroker.getExchange(sourceExchangeName);
        if (!sourceExchange) {
            throw new Error(`shovel ${name} source exchange <${sourceExchangeName}> not found`);
        }

        const destinationExchange = destinationBroker.getExchange(destinationExchangeName);
        if (!destinationExchange) {
            throw new Error(`shovel ${name} destination exchange <${destinationExchangeName}> not found`);
        }

        if (!(this instanceof Shovel)) {
            return new Shovel(name, source, destination, options);
        }

        this[kBrokerInternal] = sourceBroker === destinationBroker;
        const routingKeyPattern = pattern || '#';

        this.name = name;
        this.source = { ...source, pattern: routingKeyPattern };
        this.destination = { ...destination };
        this.events = new (EventExchange as any)('shovel__events');

        const consumerTag = this[kConsumerTag] = source.consumerTag || `smq.shoveltag-${name}`;
        this[kClosed] = false;
        this[kSourceBroker] = sourceBroker;
        this[kSourceExchange] = sourceExchange;
        this[kDestinationExchange] = destinationExchange;
        this[kCloneMessage] = options.cloneMessage;

        const boundClose = this.close.bind(this);

        const eventHandlers = this[kEventHandlers] = [
            sourceExchange.on('delete', boundClose),
            destinationExchange.on('delete', boundClose),
        ];

        let consumer;
        const shovelHandler = this._onShovelMessage.bind(this);
        if (queue) {
            consumer = sourceBroker.subscribe(sourceExchangeName, routingKeyPattern, queue, shovelHandler, { consumerTag, priority });
        } else {
            consumer = sourceBroker.subscribeTmp(sourceExchangeName, routingKeyPattern, shovelHandler, { consumerTag, priority });
            this.source.queue = consumer.queue.name;
        }
        eventHandlers.push(consumer.on('cancel', boundClose));
    }

    public get closed() {
        return this[kClosed];
    }

    public get consumerTag() {
        return this[kConsumerTag];
    }


    public emit(eventName, content) {
        this.events.emit(`shovel.${eventName}`, content);
    }

    public on(eventName, handler) {
        return this.events.on(`shovel.${eventName}`, handler);
    }

    public off(eventName, handler) {
        return this.events.off(`shovel.${eventName}`, handler);
    }

    public close() {
        if (this[kClosed]) return;
        this[kClosed] = true;
        this[kEventHandlers].splice(0).forEach((e) => e.cancel());
        const events = this.events;
        this.emit('close', this);
        events.close();
        this[kSourceBroker].cancel(this[kConsumerTag]);
    }

    private _messageHandler(message) {
        const cloneMessage = this[kCloneMessage];
        if (!cloneMessage) return message;

        const { fields, content, properties } = message;
        const { content: newContent, properties: newProperties } = cloneMessage({
            fields: { ...fields },
            content,
            properties: { ...properties },
        });

        return {
            fields,
            content: newContent,
            properties: { ...properties, ...newProperties },
        };
    }

    private _onShovelMessage(routingKey, message) {
        const { content, properties } = this._messageHandler(message);
        const props = { ...properties, ...this.destination.publishProperties, 'source-exchange': this[kSourceExchange].name };
        if (!this[kBrokerInternal]) props['shovel-name'] = this.name;
        this[kDestinationExchange].publish(this.destination.exchangeKey || routingKey, content, props);
        message.ack();
    }
}