import { EventBus } from '../Events/EventBus';
import { Export } from '../exportToGlobal';

@Export('tuval$core')
export class MouseDriver {
    public static Start(): void {
        function createEventObject(e: MouseEvent): any {
            return {
                screenX: e.screenX,
                screenY: e.screenY,
                clientX: e.clientX,
                clientY: e.clientY,
                button: e.button,
                ctrlKey: e.ctrlKey,
                altKey: e.altKey,
                shiftKey: e.shiftKey,
                wheelDelta: (e as any).wheelDelta
            };
        }
        document.addEventListener('click', function (event) {
            EventBus.Default.fire('driver.mouse.click', createEventObject(event));
        });
        document.addEventListener('dblclick', function (event) {
            EventBus.Default.fire('driver.mouse.dblclick', createEventObject(event));
        });
        document.addEventListener('mouseover', function (event) {
            EventBus.Default.fire('driver.mouse.mouseover', createEventObject(event));
        });
        document.addEventListener('mouseout', function (event) {
            EventBus.Default.fire('driver.mouse.mouseout', createEventObject(event));
        });
        document.addEventListener('mouseenter', function (event) {
            EventBus.Default.fire('driver.mouse.mouseenter', createEventObject(event));
        });
        document.addEventListener('mouseleave', function (event) {
            EventBus.Default.fire('driver.mouse.mouseleave', createEventObject(event));
        });
        document.addEventListener('mousedown', function (event) {
            EventBus.Default.fire('driver.mouse.mousedown', createEventObject(event));
        });

        document.addEventListener('mouseup', function (event) {
            EventBus.Default.fire('driver.mouse.mouseup', createEventObject(event));
        });
        document.addEventListener('mousemove', function (event) {
            EventBus.Default.fire('driver.mouse.mousemove', createEventObject(event));
        });

        document.addEventListener('contextmenu', function (event) {
            EventBus.Default.fire('driver.mouse.contextmenu', createEventObject(event));
        });

        document.addEventListener('mousewheel', function (event) {
            EventBus.Default.fire('driver.mouse.mousewheel', createEventObject(event as any));
        });

        console.log('Mouse driver has been started.');
    }
}