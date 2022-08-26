/* import { EventBusPreProcesser } from "../../../Events/EventBusPreProcess";
import { EventBusObject } from "../EventBusObject";
import { Observables } from "../../../Observable";

export class TimerBinder extends EventBusPreProcesser {
    public constructor(eventBus: EventBusObject) {
        super();
        eventBus.registerPreProcesser('timer', this);
    }
    public process(eventText: string, callback: Function) {
        const schedule = parseInt(eventText);
        Observables.Timer(schedule,schedule).subscribe(callback as any);
    }
} */