import { EventBus } from './../../Events/EventBus';
import { is } from '../../is';
import { Context } from '../Context';
declare var self;
export class GlobalObject {
    public constructor(eventBus: EventBus) {
        return is.workerContext() ? self : window;
    }
    public static get Instance(): any {
        return Context.Current.get("global");
    }
}
(GlobalObject as any).$inject = [ "eventBus"];