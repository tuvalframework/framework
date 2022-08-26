import { EventBusPreProcesser } from "../../../Events/EventBusPreProcess";
import { EventBusObject } from "../EventBusObject";
import { Router } from "../../../Router/Router";
import { is } from "../../../is";

export class RouterBinder extends EventBusPreProcesser {
    private router: Router = undefined as any;
    public constructor(eventBus: EventBusObject) {
        super();
        if (!is.workerContext()) {
            this.router = new Router('/');
            eventBus.registerPreProcesser('router', this);
        }
    }
    public process(eventText: string, callback: Function) {
        this.router.on(eventText, callback);
        this.router.resolve();

    }
}