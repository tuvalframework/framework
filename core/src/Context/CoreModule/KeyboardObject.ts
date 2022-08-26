import { Keyboard } from './../../Keyboard/Keyboard';
export class KeyboardObject extends Keyboard {
    public constructor(global) {
        super(global, document);
    }
}

(KeyboardObject as any).$inject = ["global" ];