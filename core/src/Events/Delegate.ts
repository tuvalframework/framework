import { EventSimple } from "./EventSimple";


export class _Delegate<T extends Function> extends EventSimple<T> {
    public scope: any;
    public constructor(func: T) {
        super();
        this.add(func);
    }

    public dispatch(...params: any[]): void {
        const listeners = this._listeners;
        for (let f of listeners) {
            f(...params);
        }
    }
}