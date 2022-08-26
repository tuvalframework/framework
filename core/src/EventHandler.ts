import { EventArgs } from "./EventArgs";

/*
class Delegate<THandler extends Function> extends Event<THandler> {
    private myHandler: THandler;
    constructor(bindingObject: any,handler: THandler) {
        super(bindingObject,handler);
        this.myHandler = handler;
    }
} */
export type EventHandler = (sender: any, e: EventArgs) => void;

/* export class EventHandler extends Delegate<(sender: any, e: EventArgs) => void> {

} */