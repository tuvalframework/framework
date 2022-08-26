import { _Event } from "./Event";


export class EventDispatcher {

    private _listeners: any;
    private _captureListeners: any;
    public name: string = String.Empty;

    public static initialize(target: any) {
        const p = EventDispatcher.prototype;
        target.addEventListener = p.addEventListener;
        target.on = p.on;
        target.removeEventListener = target.off = p.removeEventListener;
        target.removeAllEventListeners = p.removeAllEventListeners;
        target.hasEventListener = p.hasEventListener;
        target.dispatchEvent = p.dispatchEvent;
        target._dispatchEvent = p._dispatchEvent;
        target.willTrigger = p.willTrigger;
    }

    public constructor() {
        this._listeners = null as any;
        this._captureListeners = null as any;
    }


    public addEventListener(type: string, listener: Function | Object, useCapture: boolean = false): Function | Object {
        let listeners: any;
        if (useCapture) {
            listeners = this._captureListeners = this._captureListeners || {};
        } else {
            listeners = this._listeners = this._listeners || {};
        }
        let arr: Array<Function | Object> = listeners[type];
        if (arr) {
            this.removeEventListener(type, listener, useCapture);
            arr = listeners[type]; // remove may have deleted the array
        }
        if (arr) { arr.push(listener); }
        else { listeners[type] = [listener]; }
        return listener;
    }


    public on(type: string, listener: Function | Object, scope: any = null, once: boolean = false, data: Object = {}, useCapture: boolean = false): Object | Function {
        if ((<any>listener).handleEvent) {
            scope = scope || listener;
            listener = (<any>listener).handleEvent;
        }
        scope = scope || this;
        return this.addEventListener(type, (evt: any) => {
            (<any>listener).call(scope, evt, data);
            once && evt.remove();
        }, useCapture);
    }


    public removeEventListener(type: string, listener: Function | Object, useCapture: boolean = false): void {
        const listeners: any = useCapture ? this._captureListeners : this._listeners;
        if (!listeners) { return; }
        const arr = listeners[type];
        if (!arr) { return; }
        const l = arr.length;
        for (let i = 0; i < l; i++) {
            if (arr[i] === listener) {
                if (l === 1) { delete (listeners[type]); } // allows for faster checks.
                else { arr.splice(i, 1); }
                break;
            }
        }
    }

    public off(type: string, listener: Function | Object, useCapture: boolean = false): void {
        this.removeEventListener(type, listener, useCapture);
    }


    public removeAllEventListeners(type: string = null as any) {
        if (type) {
            if (this._listeners) { delete (this._listeners[type]); }
            if (this._captureListeners) { delete (this._captureListeners[type]); }
        } else {
            this._listeners = this._captureListeners = null;
        }
    }


    public dispatchEvent(eventObj: Object | _Event | string, bubbles: boolean = false, cancelable: boolean = false): boolean {
        if (typeof eventObj === "string") {
            const listeners = this._listeners;
            if (!bubbles && (!listeners || !listeners[eventObj])) { return true; }
            eventObj = new _Event(eventObj, bubbles, cancelable);
        } else if ((<any>eventObj).target && (<any>eventObj).clone) {
            eventObj = (<any>eventObj).clone();
        }

        try { (<any>eventObj).target = this; } catch (e) { } // try/catch allows redispatching of native events

        if (!(<any>eventObj).bubbles || !(<any>this).parent) {
            this._dispatchEvent(eventObj, 2);
        } else {
            let top = this;
            const list = [top];
            while ((<any>top).parent) { list.push(top = (<any>top).parent); }
            const l = list.length;
            let i;

            for (i = l - 1; i >= 0 && !(<any>eventObj).propagationStopped; i--) {
                list[i]._dispatchEvent(eventObj, 1 + ((i == 0) ? 1 : 0));
            }
            // bubbling
            for (i = 1; i < l && !(<any>eventObj).propagationStopped; i++) {
                list[i]._dispatchEvent(eventObj, 3);
            }
        }
        return !(<any>eventObj).defaultPrevented;
    }

    public hasEventListener(type: string): boolean {
        const listeners = this._listeners, captureListeners = this._captureListeners;
        return !!((listeners && listeners[type]) || (captureListeners && captureListeners[type]));
    }


    public willTrigger(type: string): boolean {
        let o = this;
        while (o) {
            if (o.hasEventListener(type)) { return true; }
            o = (<any>o).parent;
        }
        return false;
    }


    public toString(): string {
        return `[${this.constructor.name + this.name ? ` ${this.name}` : ""}]`;
    }

    private _dispatchEvent(eventObj: Object | _Event | string, eventPhase: Object) {
        const listeners = eventPhase === 1 ? this._captureListeners : this._listeners;
        if (eventObj && listeners) {
            let arr = listeners[(<any>eventObj).type];
            let l;
            if (!arr || (l = arr.length) === 0) { return; }
            try { (<any>eventObj).currentTarget = this; } catch (e) { }
            try { (<any>eventObj).eventPhase = eventPhase; } catch (e) { }
            (<any>eventObj).removed = false;

            arr = arr.slice(); // to avoid issues with items being removed or added during the dispatch
            for (let i = 0; i < l && !(<any>eventObj).immediatePropagationStopped; i++) {
                let o = arr[i];
                if (o.handleEvent) { o.handleEvent(eventObj); }
                else { o(eventObj); }
                if ((<any>eventObj).removed) {
                    this.off((<any>eventObj).type, o, eventPhase === 1);
                    (<any>eventObj).removed = false;
                }
            }
        }
    }
}