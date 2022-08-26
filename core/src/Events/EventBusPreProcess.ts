import { Dictionary } from "../Collections/Generic/Dictionary";
import { GEventBus } from './GEventBus';
import { int } from "../float";

export abstract class EventBusPreProcesser {
    public abstract process(eventText: string, callback: Function);
}

export class EventProcessor {
    private eventBus: GEventBus;
    public constructor() {
        this.eventBus = new GEventBus();
    }
    public on(event: int, callback: Function) {
        this.eventBus.on(event, callback);
    }
    public fire(event: int, args: any) {
        this.eventBus.fire(event, args);
    }
}