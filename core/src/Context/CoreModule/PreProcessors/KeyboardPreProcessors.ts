import { EventBusPreProcesser } from "../../../Events/EventBusPreProcess";
import { Keyboard } from "../../../Keyboard/Keyboard";
import { EventBusObject } from "../EventBusObject";
import { is } from "../../../is";

export class KeyboardPreProcessors extends EventBusPreProcesser {
    private keyboard: Keyboard = undefined as any;
    public constructor(eventBus: EventBusObject) {
        super();
        if (!is.workerContext()) {
            this.keyboard = new Keyboard(window, document);
            eventBus.registerPreProcesser('keyboard', this);
        }
    }
    public process(eventText: string, callback: Function) {
        this.keyboard.bind(eventText, callback);
    }
}