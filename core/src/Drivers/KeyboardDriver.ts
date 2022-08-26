import { EventBus } from '../Events/EventBus';
import { Export } from '../exportToGlobal';

@Export('tuval$core')
export class KeyboardDriver {
    public static Start(): void {
        document.addEventListener('keydown', function (event) {
            EventBus.Default.fire('driver.keyboard.keydown', { value: event });
        });
        document.addEventListener('keyup', function (event) {
            EventBus.Default.fire('driver.keyboard.keyup', { value: event });
        });

        console.log('Keyboard driver has been started.');
    }
}