import { _Delegate } from "./Delegate";
import { foreach } from "../foreach";
import { Type } from "../Reflection/Type";
import { Collection } from "../Collections/Collection";
import { is } from "../is";

export class EventD<T extends _Delegate<Function>> {
    private myActionEvents: Collection<_Delegate<any>>;

    constructor(func?: Function) {
        this.myActionEvents = new Collection<T>() as any;
        if (is.function(func)) {
            this.add(new _Delegate<Function>(func));
        }

        //this.execute = <any>this.executeInternal;

        /*  if (eventHandler) {
             this.add(eventHandler);
         } */
    }

    public add(eventHandler: T | _Delegate<Function> | Function): void {
        if (eventHandler instanceof _Delegate) {
            this.myActionEvents.add(eventHandler);
        } else if (is.function(eventHandler)) {
            this.myActionEvents.add(new _Delegate<Function>(eventHandler));
        }
    }

    public remove(eventHandler: T | _Delegate<Function>): void {
        this.myActionEvents.remove(eventHandler);
    }
    public dispatch(...params: any[]) {
        foreach(this.myActionEvents as any, (eventHandler: T) => {
            eventHandler.dispatch(...params);
        });
    }
}