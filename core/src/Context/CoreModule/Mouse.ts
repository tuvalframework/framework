import { EventBus } from './../../Events/EventBus';
import { is } from '../../is';
export class MouseObject {
    private eventBus: EventBus = undefined as any;
    constructor(eventBus: EventBus, global: any) {
        this.eventBus = eventBus;
        if (!is.workerContext()) {
            global.addEventListener('mousemove', this.onMouseMove.bind(this));
            global.addEventListener('mousedown', this.onMouseDown.bind(this));
            global.addEventListener('mouseup', this.onMouseUp.bind(this));
            global.document.addEventListener('contextmenu', this.onContextMenu.bind(this));
        }
    }
    private onMouseMove(event: MouseEvent) {
        return this.eventBus.fire('mouse.move', { x: event.x, y: event.y });
        //console.log(event);
    }
    private onMouseDown(event: MouseEvent) {
        return this.eventBus.fire('mouse.down', { mouseEvent: event });
        //console.log(event);
    }
    private onMouseUp(event: MouseEvent) {
        return this.eventBus.fire('mouse.up', { mouseEvent: event });
        //console.log(event);
    }
    private onContextMenu(event: MouseEvent) {
        console.log(event);
        return false; //this.eventBus.fire('mouse.menu', { mouseEvent: event });
        //console.log(event);
    }
}

(MouseObject as any).$inject = ["eventBus", "global"];