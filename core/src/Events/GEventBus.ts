import { int } from "../float";
import { is } from './../is';
import { EventProcessor } from "./EventBusPreProcess";

export class GEventBus {
    private m_Listeners: Function[][];
    private m_Filters: EventProcessor[][];
    public constructor() {
        this.m_Listeners = [];
        this.m_Filters = [];
    }

    public registerProcessor(processorId: int, processor: EventProcessor): void {
        if (this.m_Filters[processorId] == null) {
            this.m_Filters[processorId] = [];
        }
        this.m_Filters[processorId].push(processor);
    }

    public on(event: int, callback: Function);
    public on(filter: int, event: int, callback: Function);
    public on(...args: any[]) {
        if (args.length === 2 && is.number(args[0]) && is.function(args[1])) {
            const event: int = args[0];
            const callback: Function = args[1];
            if (this.m_Listeners[event] == null) {
                this.m_Listeners[event] = [];
            }
            this.m_Listeners[event].push(callback);
        } else if (args.length === 3 && is.number(args[0]) && is.number(args[1]) && is.function(args[2])) {
            const filter: int = args[0];
            const event: int = args[1];
            const callback: Function = args[2];
            if (this.m_Filters[filter] != null) {
                this.m_Filters[filter].forEach(f => {
                    f.on(event, callback);
                });
            }
        }
    }
    public fire(event: int, eventArgs: any);
    public fire(filter: int, event: int, eventArgs: any);
    public fire(...args: any[]) {
        if (args.length === 2 && is.number(args[0])) {
            const event: int = args[0];
            const eventArgs: any = args[1];
            const functions = this.m_Listeners[event];
            if (functions != null) {
                functions.forEach(f => f(eventArgs));
            }
        } else if (args.length === 3 && is.number(args[0]) && is.number(args[1])) {
            const filter: int = args[0];
            const event: int = args[1];
            const eventArgs: any = args[2];
            if (this.m_Filters[filter] != null) {
                this.m_Filters[filter].forEach(f => {
                    f.fire(event, eventArgs);
                });
            }
        }
    }
}