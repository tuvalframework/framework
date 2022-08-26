/* import { Collection } from "./collections_/Collection";
import { Type } from "./reflection_/Type";
import { isAllLettersOrDigits } from "./Char";
import { foreach } from "./foreach";
import { is } from "./is";



export class _Event<T extends Function> {
    private myActionEvents: Collection<T>;
    public execute: T;

    constructor(private bindingObject: any, eventHandler?:T) {
        this.myActionEvents = new Collection<T>();
        this.execute = <any>this.executeInternal;

        if (eventHandler) {
            this.add(eventHandler);
        }
    }

    public add(eventHandler: T): void;
    public add(eventHandler: _Event<T>): void;
    public add(...args: any[]): void {
        if (args.length === 1 && is.function(args[0])) {
            this.myActionEvents.add(args[0]);
        } else if (isAllLettersOrDigits.length === 1 && args[0] instanceof _Event) {
            const actions: Collection<T> = args[0].myActionEvents;
            foreach(actions, (action: T) => {
                this.myActionEvents.add(action);
            });
        }
    }


    public remove(eventHandler: T): void;
    public remove(eventHandler: _Event<T>): void;
    public remove(...args: any[]): void {
        if (args.length === 1 && is.function(args[0])) {
            this.myActionEvents.remove(args[0]);
        } else if (isAllLettersOrDigits.length === 1 && args[0] instanceof _Event) {
            const actions: Collection<T> = args[0].myActionEvents;
            foreach(actions, (action: T) => {
                this.myActionEvents.remove(action);
            });
        }
    }
    public executeInternal(...params: any[]) {
        foreach(this.myActionEvents, (eventHandler: T) => {
            eventHandler.apply(this.bindingObject, params)
        });
    }
} */

import { Delegate } from './Delegate';
//import { TSubject } from './Observable/TSubject';
import { List } from './Collections/Generic/List';
import { foreach } from './foreach';

/* export class Event<TEventHandler, TEventArgs> extends TSubject<TEventArgs> {
    public add(handler: TEventHandler) {
        super.subscribe({
            next: handler
        } as any);
    }
    public remove(handler: TEventHandler) {
        super.unsubscribe();
    }
} */

export class Event<TEventHandler extends Delegate<any>> extends Function {
    private subjects: List<TEventHandler  | ((..._args:any[])=> void)>;

    constructor();
    constructor(addFunc: Function, removeFunc: Function);
    constructor(...args: any[]) {
        super();

        this.subjects = new List<TEventHandler>();
        const self = this;

        function selfCall(sender: any, args: any) {
            foreach(self.subjects, (event: TEventHandler | ((..._args:any[])=> void)) => {
                (event as any)(sender, args);
            });
        }

        if (args.length === 0) {
            selfCall.add = (handler: TEventHandler | ((..._args:any[])=> void)) => {
                self.subjects.Add(handler);
            }
            selfCall.remove = (handler: TEventHandler | ((..._args:any[])=> void)) => {
                self.subjects.Remove(handler);
            }
        } else {
            selfCall.add = args[0];
            selfCall.remove = args[1];
        }

        selfCall.hasHandler = (): boolean => {
            return self.subjects.Count > 0;
        }
        return selfCall as any;
    }
    public add(handler: TEventHandler | ((..._args:any[])=> void)) {
        this.subjects.Add(handler);
    }
    public remove(handler: TEventHandler | ((..._args:any[])=> void)) {
        this.subjects.Remove(handler);
    }
    public hasHandler(): boolean {
        return this.subjects.Count > 0;
    }
}