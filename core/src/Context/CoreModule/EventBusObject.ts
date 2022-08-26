import { is } from './../../is';
import { EventBus } from '../../Events/EventBus';
import { Keyboard } from '../../Keyboard/Keyboard';
import { EventBusPreProcesser } from '../../Events/EventBusPreProcess';
import { Dictionary } from '../../Collections/Generic/Dictionary';
export class EventBusObject extends EventBus {

    private processers: Dictionary<string, EventBusPreProcesser>;
    public constructor() {
        super();
        this.processers = new Dictionary();
    }
    public registerPreProcesser(prefix: string, pp: EventBusPreProcesser) {
        this.processers.Add(prefix, pp);
    }
    public on(events: string | Array<string>, priority: number | Function, callback?: Function, that?: any) {
        if (is.string(events)) {
            const parts = events.split('.');
            if (parts.length > 1) {
                const prefix = parts[0];
                if (this.processers.ContainsKey(prefix)) {
                    const preprocessor = this.processers.Get(prefix);
                    if (preprocessor != null) {
                        const eventText = parts.slice(1, parts.length).join('.');
                        let realCallback;
                        if (is.function(priority)) {
                            realCallback = priority;
                        } else {
                            realCallback = callback;
                        }
                        return preprocessor.process(eventText, realCallback);
                    }
                }
            }
            /* if (events.indexOf('$keyboard.') === 0) {
                const key = events.substring(10, events.length);
                let realCallback;
                if (is.function(priority)) {
                    realCallback = priority;
                } else {
                    realCallback = callback;
                }
                this.keyboard.bind(key, realCallback);
            } */
        }
        super.on(events, priority, callback, that);
    }
}