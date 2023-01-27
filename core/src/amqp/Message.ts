import { generateId } from './shared';

const kPending = Symbol.for('pending');
const kOnConsumed = Symbol.for('onConsumed');

export class Message {
    fields: { routingKey: string, redelivered: boolean, exchange: any, consumerTag: string }[];
    content: any;
    properties: { messageId: string, persistent: boolean, timestamp: Date, expiration: number };
    public constructor(fields, content, properties, onConsumed?) {
        this[kOnConsumed] = [null, onConsumed];
        this[kPending] = false;

        const mproperties = {
            ...properties,
            messageId: properties && properties.messageId || `smq.mid-${generateId()}`,
        };
        const timestamp = (mproperties.timestamp = mproperties.timestamp || Date.now());
        if (mproperties.expiration) {
            mproperties.ttl = timestamp + parseInt(mproperties.expiration);
        }

        this.fields = { ...fields, consumerTag: undefined };
        this.content = content;
        this.properties = mproperties;
    }

    public get pending() {
        return this[kPending];
    }


    private _consume({ consumerTag }, consumedCb) {
        this[kPending] = true;
        (this as any).fields.consumerTag = consumerTag;
        this[kOnConsumed][0] = consumedCb;
    }

    public ack(allUpTo: boolean): void {
        if (!this[kPending]) return;
        for (const fn of this[kOnConsumed]) {
            if (fn) fn(this, 'ack', allUpTo);
        }
        this[kPending] = false;
    }

    public nack(allUpTo: boolean, requeue: boolean = true): void {
        if (!this[kPending]) return;
        for (const fn of this[kOnConsumed]) {
            if (fn) fn(this, 'nack', allUpTo, requeue);
        }
        this[kPending] = false;
    }

    public reject(requeue: boolean = true): void {
        this.nack(false, requeue);
    }
}