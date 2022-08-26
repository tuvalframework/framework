

export class _Event {
    [key: string]: any;

    public type: string;

    public readonly target: any;

    protected currentTarget: object;

    private eventPhase: number;

    protected readonly bubbles: boolean;

    protected readonly cancelable: boolean;

    private readonly timeStamp: number;

    private defaultPrevented: boolean;


    private propagationStopped: boolean;

    private immediatePropagationStopped: boolean;

    private removed: boolean;
    constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
        this.type = type;
        this.target = null as any;
        this.currentTarget = null as any;
        this.eventPhase = 0;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        this.timeStamp = new Date().getTime();
        this.defaultPrevented = false;
        this.propagationStopped = false;
        this.immediatePropagationStopped = false;
        this.removed = false;
    }


    public preventDefault(): _Event {
        this.defaultPrevented = this.cancelable;
        return this;
    }

    public stopPropagation(): _Event {
        this.propagationStopped = true;
        return this;
    }


    public stopImmediatePropagation(): _Event {
        this.immediatePropagationStopped = this.propagationStopped = true;
        return this;
    }


    public remove(): _Event {
        this.removed = true;
        return this;
    }


    public clone(): _Event {
        const event: _Event = new _Event(this.type, this.bubbles, this.cancelable);
        for (let n in this) {
            if (this.hasOwnProperty(n)) {
                event[n] = this[n];
            }
        }
        return event;
    }


    public set(props: any): _Event {
        for (let n in props) { this[n] = props[n]; }
        return this;
    }

    public toString(): string {
        return `[${this.constructor.name} (type=${this.type})]`;
    }

}
