import { int, Integer, float } from "../../float";
import { IntMap } from "../../Collections/IntMap";
import { Input, TextInputListener, Peripheral, Orientation } from "../../Input";
import { IntSet } from "../../Collections/IntSet";
import { Override } from "../../Reflection/Decorators/ClassInfo";
import { is } from "../../is";
import { InputProcessor } from "../../InputProcessor";
import { foreach } from '../../foreach';
import { KeyCodes } from '../../KeyCodes';
import { TString } from "../../Text/TString";
import { TArray } from "../../Extensions/TArray";

function nanoTime(): number {
    const date = new Date();
    return date.getMilliseconds() * 1000000;
}

function agentInfo(): any {
    var userAgent = navigator.userAgent.toLowerCase();
    return {
        // browser type flags
        isFirefox: userAgent.indexOf("firefox") != -1,
        isChrome: userAgent.indexOf("chrome") != -1,
        isSafari: userAgent.indexOf("safari") != -1,
        isOpera: userAgent.indexOf("opera") != -1,
        isIE: userAgent.indexOf("msie") != -1 || userAgent.indexOf("trident") != -1,
        // OS type flags
        isMacOS: userAgent.indexOf("mac") != -1,
        isLinux: userAgent.indexOf("linux") != -1,
        isWindows: userAgent.indexOf("win") != -1
    };
}

const MAX_TOUCHES: number = 20;

// these are absent from KeyCodes; we know not why...
const KEY_PAUSE: int = 19;
const KEY_CAPS_LOCK: int = 20;
const KEY_SPACE: int = 32;
const KEY_INSERT: int = 45;
const KEY_0: int = 48;
const KEY_1: int = 49;
const KEY_2: int = 50;
const KEY_3: int = 51;
const KEY_4: int = 52;
const KEY_5: int = 53;
const KEY_6: int = 54;
const KEY_7: int = 55;
const KEY_8: int = 56;
const KEY_9: int = 57;
const KEY_A: int = 65;
const KEY_B: int = 66;
const KEY_C: int = 67;
const KEY_D: int = 68;
const KEY_E: int = 69;
const KEY_F: int = 70;
const KEY_G: int = 71;
const KEY_H: int = 72;
const KEY_I: int = 73;
const KEY_J: int = 74;
const KEY_K: int = 75;
const KEY_L: int = 76;
const KEY_M: int = 77;
const KEY_N: int = 78;
const KEY_O: int = 79;
const KEY_P: int = 80;
const KEY_Q: int = 81;
const KEY_R: int = 82;
const KEY_S: int = 83;
const KEY_T: int = 84;
const KEY_U: int = 85;
const KEY_V: int = 86;
const KEY_W: int = 87;
const KEY_X: int = 88;
const KEY_Y: int = 89;
const KEY_Z: int = 90;
const KEY_LEFT_WINDOW_KEY: int = 91;
const KEY_RIGHT_WINDOW_KEY: int = 92;
const KEY_SELECT_KEY: int = 93;
const KEY_NUMPAD0: int = 96;
const KEY_NUMPAD1: int = 97;
const KEY_NUMPAD2: int = 98;
const KEY_NUMPAD3: int = 99;
const KEY_NUMPAD4: int = 100;
const KEY_NUMPAD5: int = 101;
const KEY_NUMPAD6: int = 102;
const KEY_NUMPAD7: int = 103;
const KEY_NUMPAD8: int = 104;
const KEY_NUMPAD9: int = 105;
const KEY_MULTIPLY: int = 106;
const KEY_ADD: int = 107;
const KEY_SUBTRACT: int = 109;
const KEY_DECIMAL_POINT_KEY: int = 110;
const KEY_DIVIDE: int = 111;
const KEY_F1: int = 112;
const KEY_F2: int = 113;
const KEY_F3: int = 114;
const KEY_F4: int = 115;
const KEY_F5: int = 116;
const KEY_F6: int = 117;
const KEY_F7: int = 118;
const KEY_F8: int = 119;
const KEY_F9: int = 120;
const KEY_F10: int = 121;
const KEY_F11: int = 122;
const KEY_F12: int = 123;
const KEY_NUM_LOCK: int = 144;
const KEY_SCROLL_LOCK: int = 145;
const KEY_SEMICOLON: int = 186;
const KEY_EQUALS: int = 187;
const KEY_COMMA: int = 188;
const KEY_DASH: int = 189;
const KEY_PERIOD: int = 190;
const KEY_FORWARD_SLASH: int = 191;
const KEY_GRAVE_ACCENT: int = 192;
const KEY_OPEN_BRACKET: int = 219;
const KEY_BACKSLASH: int = 220;
const KEY_CLOSE_BRACKET: int = 221;
const KEY_SINGLE_QUOTE: int = 222;

export class InputObject extends Input {
    public justTouched: boolean = false;
    private touchMap: IntMap<Integer> = new IntMap<Integer>(20);
    private touched: boolean[] = new Array(MAX_TOUCHES);
    private touchX: int[] = new Array(MAX_TOUCHES);
    private touchY: int[] = new Array(MAX_TOUCHES);
    private deltaX: int[] = new Array(MAX_TOUCHES);
    private deltaY: int[] = new Array(MAX_TOUCHES);
    pressedButtons: IntSet = new IntSet();
    pressedKeyCount: int = 0;
    pressedKeySet: IntSet = new IntSet();
    pressedKeys: boolean[] = new Array(256);
    keyJustPressed: boolean = false;
    justPressedKeys: boolean[] = new Array(256);
    justPressedButtons: boolean[] = new Array(5);
    processor: InputProcessor = undefined as any;
    lastKeyCharPressed: string = TString.Empty;
    keyRepeatTimer: float = 0;
    currentEventTimeStamp: number = 0;
    readonly globalObject: any;
    hasFocus: boolean = true;

    public constructor(global) {
        super();
        if (!is.workerContext()) {
            this.globalObject = global;
            TArray.Fill(this.touched, false);
            TArray.Fill(this.touchX, 0);
            TArray.Fill(this.touchY, 0);
            TArray.Fill(this.deltaX, 0);
            TArray.Fill(this.deltaY, 0);
            TArray.Fill(this.pressedKeys, false);
            TArray.Fill(this.justPressedKeys, false);
            TArray.Fill(this.justPressedButtons, false);

            this.hookEvents();
        }
    }
    private reset(): void {
        if (this.justTouched) {
            this.justTouched = false;
            for (let i = 0; i < this.justPressedButtons.length; i++) {
                this.justPressedButtons[i] = false;
            }
        }
        if (this.keyJustPressed) {
            this.keyJustPressed = false;
            for (let i = 0; i < this.justPressedKeys.length; i++) {
                this.justPressedKeys[i] = false;
            }
        }
    }
    @Override
    public getAccelerometerX(): float {
        return 0;
    }

    @Override
    public getAccelerometerY(): float {
        return 0;
    }

    @Override
    public getAccelerometerZ(): float {
        return 0;
    }

    @Override
    public getTextInput(listener: TextInputListener, title: String, text: String, hint: String): void {
    }

    @Override
    public getGyroscopeX(): float {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public getGyroscopeY(): float {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public getGyroscopeZ(): float {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public getMaxPointers(): int {
        return MAX_TOUCHES;
    }

    @Override
    public getX(): int {
        return this.touchX[0];
    }

    @Override
    public getDeltaX() {
        return this.deltaX[0];
    }

    @Override
    public getY(): int {
        return this.touchY[0];
    }

    @Override
    public getDeltaY(): int {
        return this.deltaY[0];
    }

    @Override
    public isTouched(pointer?: int): boolean {
        if (pointer == null) {
            for (let pointer = 0; pointer < MAX_TOUCHES; pointer++) {
                if (this.touched[pointer]) {
                    return true;
                }
            }
            return false;
        } else {
            return this.touched[pointer];
        }
    }

    @Override
    public justTouchedMethod(): boolean {
        return this.justTouched;
    }

    @Override
    public isButtonPressed(button: int): boolean {
        return this.pressedButtons.contains(button) && this.touched[0];
    }

    @Override
    public isButtonJustPressed(button: int): boolean {
        if (button < 0 || button >= this.justPressedButtons.length) return false;
        return this.justPressedButtons[button];
    }

    @Override
    public getPressure(pointer?: int): float {
        if (pointer == null) {
            return this.getPressure(0);
        } else {
            return this.isTouched(pointer) ? 1 : 0;
        }
    }

    @Override
    public isKeyPressed(key: int): boolean {
        if (key === Input.Keys.ANY_KEY) {
            return this.pressedKeyCount > 0;
        }
        if (key < 0 || key > 255) {
            return false;
        }
        return this.pressedKeys[key];
    }

    @Override
    public isKeyJustPressed(key: int): boolean {
        if (key === Input.Keys.ANY_KEY) {
            return this.keyJustPressed;
        }
        if (key < 0 || key > 255) {
            return false;
        }
        return this.justPressedKeys[key];
    }

    @Override
    public setOnscreenKeyboardVisible(visible: boolean): void {
    }


    public vibrate(milliseconds: int): void;
    public vibrate(pattern: number[], repeat: int): void;
    @Override
    public vibrate(...args: any[]): void {
    }

    @Override
    public cancelVibrate(): void {
    }

    @Override
    public getAzimuth(): float {
        return 0;
    }

    @Override
    public getPitch(): float {
        return 0;
    }

    @Override
    public getRoll(): float {
        return 0;
    }

    @Override
    public getRotationMatrix(matrix: float[]): void {
    }

    @Override
    public getCurrentEventTime(): number {
        return this.currentEventTimeStamp;
    }

    @Override
    public setCatchBackKey(catchBack: boolean): void {
    }

    @Override
    public isCatchBackKey(): boolean {
        return false;
    }

    @Override
    public setCatchMenuKey(catchMenu: boolean): void {
    }

    @Override
    public isCatchMenuKey(): boolean {
        return false;
    }

    @Override
    public setInputProcessor(processor: InputProcessor): void {
        this.processor = processor;
    }

    @Override
    public getInputProcessor(): InputProcessor {
        return this.processor;
    }

    @Override
    public isPeripheralAvailable(peripheral: Peripheral): boolean {
        if (peripheral === Peripheral.Accelerometer) return false;
        if (peripheral === Peripheral.Compass) return false;
        if (peripheral === Peripheral.HardwareKeyboard) return !is.mobileDevice();
        if (peripheral === Peripheral.MultitouchScreen) return InputObject.isTouchScreen();
        if (peripheral === Peripheral.OnscreenKeyboard) return is.mobileDevice();
        if (peripheral === Peripheral.Vibrator) return false;
        return false;
    }
    @Override
    public getRotation(): int {
        return 0;
    }

    @Override
    public getNativeOrientation(): Orientation {
        return Orientation.Landscape;
    }

    /** from https://github.com/toji/game-shim/blob/master/game-shim.js
	 * @return is Cursor catched */
    private isCursorCatchedJSNI(): boolean {
        const navigator: any = window.navigator;
        if (!navigator.pointer) {
            navigator.pointer = navigator.webkitPointer || navigator.mozPointer;
        }
        if (navigator.pointer) {
            if (typeof (navigator.pointer.isLocked) === "boolean") {
                // Chrome initially launched with this interface
                return navigator.pointer.isLocked;
            } else if (typeof (navigator.pointer.isLocked) === "function") {
                // Some older builds might provide isLocked as a function
                return navigator.pointer.isLocked();
            } else if (typeof (navigator.pointer.islocked) === "function") {
                // For compatibility with early Firefox build
                return navigator.pointer.islocked();
            }
        }
        return false;
    }

    /** from https://github.com/toji/game-shim/blob/master/game-shim.js
	 * @param element Canvas */
    private setCursorCatchedJSNI(element: HTMLCanvasElement): void {
        const navigator: any = window.navigator;
        // Navigator pointer is not the right interface according to spec.
        // Here for backwards compatibility only
        if (!navigator.pointer) {
            navigator.pointer = navigator.webkitPointer || navigator.mozPointer;
        }
        // element.requestPointerLock
        if (!element.requestPointerLock) {
            element.requestPointerLock = (function () {
                return (element as any).webkitRequestPointerLock
                    || (element as any).mozRequestPointerLock || function () {
                        if (navigator.pointer) {
                            navigator.pointer.lock(element);
                        }
                    };
            })();
        }
        element.requestPointerLock();
    }

    /** from https://github.com/toji/game-shim/blob/master/game-shim.js */
    private exitCursorCatchedJSNI(): void {
        if (!document.exitPointerLock) {
            document.exitPointerLock = (function () {
                return (document as any).webkitExitPointerLock || (document as any).mozExitPointerLock
                    || function () {
                        if ((navigator as any).pointer) {
                            var elem = this;
                            (navigator as any).pointer.unlock();
                        }
                    };
            })();
        }
    };

	/** from https://github.com/toji/game-shim/blob/master/game-shim.js
	 * @param event JavaScript Mouse Event
	 * @return movement in x direction */
    private getMovementXJSNI(event: MouseEvent): float {
        return event.movementX || (event as any).webkitMovementX || 0;
    }

	/** from https://github.com/toji/game-shim/blob/master/game-shim.js
	 * @param event JavaScript Mouse Event
	 * @return movement in y direction */
    private getMovementYJSNI(event: MouseEvent): float {
        return event.movementY || (event as any).webkitMovementY || 0;
    }

    private static isTouchScreen(): boolean {
        return (('ontouchstart' in window) || ((navigator as any).msMaxTouchPoints > 0));
    }

    /** works only for Chrome > Version 18 with enabled Mouse Lock enable in about:flags or start Chrome with the
	 * --enable-pointer-lock flag */
    @Override
    public setCursorCatched(catched: boolean): void {
        if (catched)
            this.setCursorCatchedJSNI(this.globalObject);
        else
            this.exitCursorCatchedJSNI();
    }

    @Override
    public isCursorCatched(): boolean {
        return this.isCursorCatchedJSNI();
    }

    @Override
    public setCursorPosition(x: int, y: int): void {
        // FIXME??
    }

    // kindly borrowed from our dear playn friends...
    static addEventListener(target: HTMLElement | HTMLDocument | Window, name: string, handler: InputObject, capture: boolean): void {
        target.addEventListener(name,
            function (e) {
                handler.handleEvent(e);
            }, capture);
    }

    private static getMouseWheelVelocity(event: Event): float {
        const evt: any = event;
        var delta = 0.0;
        var agentInfo = agentInfo();

        if (agentInfo.isFirefox) {
            if (agentInfo.isMacOS) {
                delta = 1.0 * evt.detail;
            } else {
                delta = 1.0 * evt.detail / 3;
            }
        } else if (agentInfo.isOpera) {
            if (agentInfo.isLinux) {
                delta = -1.0 * evt.wheelDelta / 80;
            } else {
                // on mac
                delta = -1.0 * evt.wheelDelta / 40;
            }
        } else if (agentInfo.isChrome || agentInfo.isSafari || agentInfo.isIE) {
            delta = -1.0 * evt.wheelDelta / 120;
            // handle touchpad for chrome
            if (Math.abs(delta) < 1) {
                if (agentInfo.isWindows) {
                    delta = -1.0 * evt.wheelDelta;
                } else if (agentInfo.isMacOS) {
                    delta = -1.0 * evt.wheelDelta / 3;
                }
            }
        }
        return delta;
    }

    /** Kindly borrowed from PlayN. **/
    protected static getMouseWheelEvent(): string {
        if (navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
            return "DOMMouseScroll";
        } else {
            return "mousewheel";
        }
    }

    /** Kindly borrowed from PlayN. **/
    protected getRelativeX(e: MouseEvent, target: HTMLCanvasElement): int {
        const xScaleRatio: float = target.width * 1 / target.clientWidth; // Correct for canvas CSS scaling
        return Math.round(xScaleRatio
            * (e.clientX - target.offsetLeft + target.scrollLeft /* + target.ownerDocument.scrollLeft */));
    }

    /** Kindly borrowed from PlayN. **/
    protected getRelativeY(e: MouseEvent, target: HTMLCanvasElement): int {
        const yScaleRatio: float = target.height * 1 / target.clientHeight; // Correct for canvas CSS scaling
        return Math.round(yScaleRatio
            * (e.clientY - target.offsetTop + target.scrollTop /* + target.ownerDocument.scrollTop */));
    }

	/* protected getRelativeX ( touch:Touch,  target: HTMLCanvasElement): int {
		const xScaleRatio:float = target.width * 1 / target.clientWidth; // Correct for canvas CSS scaling
		return Math.round(xScaleRatio * touch.relativeX(target));
	}

	protected int getRelativeY (Touch touch, CanvasElement target) {
		float yScaleRatio = target.getHeight() * 1f / target.getClientHeight(); // Correct for canvas CSS scaling
		return Math.round(yScaleRatio * touch.getRelativeY(target));
	} */

    private static getWindow(): Window {
        return window;
    }

    private hookEvents(): void {
        InputObject.addEventListener(this.globalObject, "mousedown", this, true);
        InputObject.addEventListener(document, "mousedown", this, true);
        InputObject.addEventListener(this.globalObject, "mouseup", this, true);
        InputObject.addEventListener(document, "mouseup", this, true);
        InputObject.addEventListener(this.globalObject, "mousemove", this, true);
        InputObject.addEventListener(document, "mousemove", this, true);
        InputObject.addEventListener(this.globalObject, InputObject.getMouseWheelEvent(), this, true);
        InputObject.addEventListener(document, "keydown", this, false);
        InputObject.addEventListener(document, "keyup", this, false);
        InputObject.addEventListener(document, "keypress", this, false);
        InputObject.addEventListener(InputObject.getWindow(), "blur", this, false);

        InputObject.addEventListener(this.globalObject, "touchstart", this, true);
        InputObject.addEventListener(this.globalObject, "touchmove", this, true);
        InputObject.addEventListener(this.globalObject, "touchcancel", this, true);
        InputObject.addEventListener(this.globalObject, "touchend", this, true);
    }

    private getButton(button: int): int {
        if (button === 0) return Input.Buttons.LEFT;
        if (button === 2) return Input.Buttons.RIGHT;
        if (button === 1) return Input.Buttons.MIDDLE;
        return Input.Buttons.LEFT;
    }

    private handleEvent(e: any): void {
        if (e.type.equals("mousedown")) {
            if (!(e.target /* === this.canvas */) || this.pressedButtons.contains(this.getButton(e.button))) {
                const mouseX: float = this.getRelativeX(e, this.globalObject);
                const mouseY: float = this.getRelativeY(e, this.globalObject);
                /* if (mouseX < 0 || mouseX > Gdx.graphics.getCanvas().width || mouseY < 0 || mouseY > Gdx.graphics.getCanvas().height) {
                    this.hasFocus = false;
                } */
                return;
            }
            this.hasFocus = true;
            this.justTouched = true;
            this.touched[0] = true;
            this.pressedButtons.add(this.getButton(e.button));
            this.justPressedButtons[e.button] = true;
            this.deltaX[0] = 0;
            this.deltaY[0] = 0;
            if (this.isCursorCatched()) {
                this.touchX[0] += this.getMovementXJSNI(e);
                this.touchY[0] += this.getMovementYJSNI(e);
            } else {
                this.touchX[0] = this.getRelativeX(e, this.globalObject);
                this.touchY[0] = this.getRelativeY(e, this.globalObject);
            }
            this.currentEventTimeStamp = nanoTime();
            if (this.processor != null) this.processor.touchDown(this.touchX[0], this.touchY[0], 0, this.getButton(e.button));
        }

        if (e.type.equals("mousemove")) {
            if (this.isCursorCatched()) {
                this.deltaX[0] = this.getMovementXJSNI(e);
                this.deltaY[0] = this.getMovementYJSNI(e);
                this.touchX[0] += this.getMovementXJSNI(e);
                this.touchY[0] += this.getMovementYJSNI(e);
            } else {
                this.deltaX[0] = this.getRelativeX(e, this.globalObject) - this.touchX[0];
                this.deltaY[0] = this.getRelativeY(e, this.globalObject) - this.touchY[0];
                this.touchX[0] = this.getRelativeX(e, this.globalObject);
                this.touchY[0] = this.getRelativeY(e, this.globalObject);
            }
            this.currentEventTimeStamp = nanoTime();
            if (this.processor != null) {
                if (this.touched[0])
                    this.processor.touchDragged(this.touchX[0], this.touchY[0], 0);
                else
                    this.processor.mouseMoved(this.touchX[0], this.touchY[0]);
            }
        }

        if (e.type.equals("mouseup")) {
            if (!this.pressedButtons.contains(this.getButton(e.button))) return;
            this.pressedButtons.remove(this.getButton(e.button));
            this.touched[0] = this.pressedButtons.length > 0;
            if (this.isCursorCatched()) {
                this.deltaX[0] = this.getMovementXJSNI(e);
                this.deltaY[0] = this.getMovementYJSNI(e);
                this.touchX[0] += this.getMovementXJSNI(e);
                this.touchY[0] += this.getMovementYJSNI(e);
            } else {
                this.deltaX[0] = this.getRelativeX(e, this.globalObject) - this.touchX[0];
                this.deltaY[0] = this.getRelativeY(e, this.globalObject) - this.touchY[0];
                this.touchX[0] = this.getRelativeX(e, this.globalObject);
                this.touchY[0] = this.getRelativeY(e, this.globalObject);
            }
            this.currentEventTimeStamp = nanoTime();
            this.touched[0] = false;
            if (this.processor != null) this.processor.touchUp(this.touchX[0], this.touchY[0], 0, this.getButton(e.button));
        }
        if (e.type.equals(InputObject.getMouseWheelEvent())) {
            if (this.processor != null) {
                this.processor.scrolled(InputObject.getMouseWheelVelocity(e));
            }
            this.currentEventTimeStamp = nanoTime();
            e.preventDefault();
        }
        if (this.hasFocus && !e.type.equals("blur")) {
            if (e.type.equals("keydown")) {
                // Gdx.app.log("GwtInput", "keydown");
                const code: number = InputObject.keyForCode(e.keyCode);
                if (code === 67) {
                    e.preventDefault();
                    if (this.processor != null) {
                        this.processor.keyDown(code);
                        this.processor.keyTyped('\b' as any);
                    }
                } else {
                    if (!this.pressedKeys[code]) {
                        this.pressedKeySet.add(code);
                        this.pressedKeyCount++;
                        this.pressedKeys[code] = true;
                        this.keyJustPressed = true;
                        this.justPressedKeys[code] = true;
                        if (this.processor != null) {
                            this.processor.keyDown(code);
                        }
                    }
                }
            }

            if (e.type.equals("keypress")) {
                // Gdx.app.log("GwtInput", "keypress");
                const c: int = e.charCode;
                if (this.processor != null) this.processor.keyTyped(c);
            }

            if (e.type.equals("keyup")) {
                // Gdx.app.log("GwtInput", "keyup");
                const code: int = InputObject.keyForCode(e.keyCode);
                if (this.pressedKeys[code]) {
                    this.pressedKeySet.remove(code);
                    this.pressedKeyCount--;
                    this.pressedKeys[code] = false;
                }
                if (this.processor != null) {
                    this.processor.keyUp(code);
                }
            }
        }
        else if (this.pressedKeyCount > 0) {
            // Gdx.app.log("GwtInput", "unfocused");

            foreach(this.pressedKeySet, (code) => {
                if (this.pressedKeys[code]) {
                    this.pressedKeySet.remove(code);
                    this.pressedKeyCount--;
                    this.pressedKeys[code] = false;
                }
                if (this.processor != null) {
                    this.processor.keyUp(code);
                }
            });
        }

        /*  if (e.type.equals("touchstart")) {
             this.justTouched = true;
             JsArray < Touch > touches = e.getChangedTouches();
             for (int i = 0, j = touches.length(); i < j; i++) {
                 Touch touch = touches.get(i);
                 int real = touch.getIdentifier();
                 int touchId;
                 touchMap.put(real, touchId = getAvailablePointer());
                 touched[touchId] = true;
                 touchX[touchId] = getRelativeX(touch, canvas);
                 touchY[touchId] = getRelativeY(touch, canvas);
                 deltaX[touchId] = 0;
                 deltaY[touchId] = 0;
                 if (processor != null) {
                     processor.touchDown(touchX[touchId], touchY[touchId], touchId, Buttons.LEFT);
                 }
             }
             this.currentEventTimeStamp = TimeUtils.nanoTime();
             e.preventDefault();
         }
         if (e.getType().equals("touchmove")) {
             JsArray < Touch > touches = e.getChangedTouches();
             for (int i = 0, j = touches.length(); i < j; i++) {
                 Touch touch = touches.get(i);
                 int real = touch.getIdentifier();
                 int touchId = touchMap.get(real);
                 deltaX[touchId] = getRelativeX(touch, canvas) - touchX[touchId];
                 deltaY[touchId] = getRelativeY(touch, canvas) - touchY[touchId];
                 touchX[touchId] = getRelativeX(touch, canvas);
                 touchY[touchId] = getRelativeY(touch, canvas);
                 if (processor != null) {
                     processor.touchDragged(touchX[touchId], touchY[touchId], touchId);
                 }
             }
             this.currentEventTimeStamp = TimeUtils.nanoTime();
             e.preventDefault();
         }
         if (e.getType().equals("touchcancel")) {
             JsArray < Touch > touches = e.getChangedTouches();
             for (int i = 0, j = touches.length(); i < j; i++) {
                 Touch touch = touches.get(i);
                 int real = touch.getIdentifier();
                 int touchId = touchMap.get(real);
                 touchMap.remove(real);
                 touched[touchId] = false;
                 deltaX[touchId] = getRelativeX(touch, canvas) - touchX[touchId];
                 deltaY[touchId] = getRelativeY(touch, canvas) - touchY[touchId];
                 touchX[touchId] = getRelativeX(touch, canvas);
                 touchY[touchId] = getRelativeY(touch, canvas);
                 if (processor != null) {
                     processor.touchUp(touchX[touchId], touchY[touchId], touchId, Buttons.LEFT);
                 }
             }
             this.currentEventTimeStamp = TimeUtils.nanoTime();
             e.preventDefault();
         }
         if (e.getType().equals("touchend")) {
             JsArray < Touch > touches = e.getChangedTouches();
             for (int i = 0, j = touches.length(); i < j; i++) {
                 Touch touch = touches.get(i);
                 int real = touch.getIdentifier();
                 int touchId = touchMap.get(real);
                 touchMap.remove(real);
                 touched[touchId] = false;
                 deltaX[touchId] = getRelativeX(touch, canvas) - touchX[touchId];
                 deltaY[touchId] = getRelativeY(touch, canvas) - touchY[touchId];
                 touchX[touchId] = getRelativeX(touch, canvas);
                 touchY[touchId] = getRelativeY(touch, canvas);
                 if (processor != null) {
                     processor.touchUp(touchX[touchId], touchY[touchId], touchId, Buttons.LEFT);
                 }
             }
             this.currentEventTimeStamp = TimeUtils.nanoTime();
             e.preventDefault();
         } */
        // if(hasFocus) e.preventDefault();
    }

    private getAvailablePointer(): int {
        for (let i = 0; i < MAX_TOUCHES; i++) {
            if (!this.touchMap.contains(i)) return i;
        }
        return -1;
    }

    /** borrowed from PlayN, thanks guys **/
    private static keyForCode(keyCode: int): int {
        switch (keyCode) {
            case KeyCodes.KEY_ALT:
                return Input.Keys.ALT_LEFT;
            case KeyCodes.KEY_BACKSPACE:
                return Input.Keys.BACKSPACE;
            case KeyCodes.KEY_CTRL:
                return Input.Keys.CONTROL_LEFT;
            case KeyCodes.KEY_DELETE:
                return Input.Keys.DEL;
            case KeyCodes.KEY_DOWN:
                return Input.Keys.DOWN;
            case KeyCodes.KEY_END:
                return Input.Keys.END;
            case KeyCodes.KEY_ENTER:
                return Input.Keys.ENTER;
            case KeyCodes.KEY_ESCAPE:
                return Input.Keys.ESCAPE;
            case KeyCodes.KEY_HOME:
                return Input.Keys.HOME;
            case KeyCodes.KEY_LEFT:
                return Input.Keys.LEFT;
            case KeyCodes.KEY_PAGEDOWN:
                return Input.Keys.PAGE_DOWN;
            case KeyCodes.KEY_PAGEUP:
                return Input.Keys.PAGE_UP;
            case KeyCodes.KEY_RIGHT:
                return Input.Keys.RIGHT;
            case KeyCodes.KEY_SHIFT:
                return Input.Keys.SHIFT_LEFT;
            case KeyCodes.KEY_TAB:
                return Input.Keys.TAB;
            case KeyCodes.KEY_UP:
                return Input.Keys.UP;

            case KeyCodes.KEY_PAUSE:
                return Input.Keys.UNKNOWN; // FIXME
            case KEY_CAPS_LOCK:
                return Input.Keys.UNKNOWN; // FIXME
            case KEY_SPACE:
                return Input.Keys.SPACE;
            case KEY_INSERT:
                return Input.Keys.INSERT;
            case KEY_0:
                return Input.Keys.NUM_0;
            case KEY_1:
                return Input.Keys.NUM_1;
            case KEY_2:
                return Input.Keys.NUM_2;
            case KEY_3:
                return Input.Keys.NUM_3;
            case KEY_4:
                return Input.Keys.NUM_4;
            case KEY_5:
                return Input.Keys.NUM_5;
            case KEY_6:
                return Input.Keys.NUM_6;
            case KEY_7:
                return Input.Keys.NUM_7;
            case KEY_8:
                return Input.Keys.NUM_8;
            case KEY_9:
                return Input.Keys.NUM_9;
            case KEY_A:
                return Input.Keys.A;
            case KEY_B:
                return Input.Keys.B;
            case KEY_C:
                return Input.Keys.C;
            case KEY_D:
                return Input.Keys.D;
            case KEY_E:
                return Input.Keys.E;
            case KEY_F:
                return Input.Keys.F;
            case KEY_G:
                return Input.Keys.G;
            case KEY_H:
                return Input.Keys.H;
            case KEY_I:
                return Input.Keys.I;
            case KEY_J:
                return Input.Keys.J;
            case KEY_K:
                return Input.Keys.K;
            case KEY_L:
                return Input.Keys.L;
            case KEY_M:
                return Input.Keys.M;
            case KEY_N:
                return Input.Keys.N;
            case KEY_O:
                return Input.Keys.O;
            case KEY_P:
                return Input.Keys.P;
            case KEY_Q:
                return Input.Keys.Q;
            case KEY_R:
                return Input.Keys.R;
            case KEY_S:
                return Input.Keys.S;
            case KEY_T:
                return Input.Keys.T;
            case KEY_U:
                return Input.Keys.U;
            case KEY_V:
                return Input.Keys.V;
            case KEY_W:
                return Input.Keys.W;
            case KEY_X:
                return Input.Keys.X;
            case KEY_Y:
                return Input.Keys.Y;
            case KEY_Z:
                return Input.Keys.Z;
            case KEY_LEFT_WINDOW_KEY:
                return Input.Keys.UNKNOWN; // FIXME
            case KEY_RIGHT_WINDOW_KEY:
                return Input.Keys.UNKNOWN; // FIXME
            // case KEY_SELECT_KEY: return Keys.SELECT_KEY;
            case KEY_NUMPAD0:
                return Input.Keys.NUMPAD_0;
            case KEY_NUMPAD1:
                return Input.Keys.NUMPAD_1;
            case KEY_NUMPAD2:
                return Input.Keys.NUMPAD_2;
            case KEY_NUMPAD3:
                return Input.Keys.NUMPAD_3;
            case KEY_NUMPAD4:
                return Input.Keys.NUMPAD_4;
            case KEY_NUMPAD5:
                return Input.Keys.NUMPAD_5;
            case KEY_NUMPAD6:
                return Input.Keys.NUMPAD_6;
            case KEY_NUMPAD7:
                return Input.Keys.NUMPAD_7;
            case KEY_NUMPAD8:
                return Input.Keys.NUMPAD_8;
            case KEY_NUMPAD9:
                return Input.Keys.NUMPAD_9;
            case KEY_MULTIPLY:
                return Input.Keys.UNKNOWN; // FIXME
            case KEY_ADD:
                return Input.Keys.PLUS;
            case KEY_SUBTRACT:
                return Input.Keys.MINUS;
            case KEY_DECIMAL_POINT_KEY:
                return Input.Keys.PERIOD;
            case KEY_DIVIDE:
                return Input.Keys.UNKNOWN; // FIXME
            case KEY_F1:
                return Input.Keys.F1;
            case KEY_F2:
                return Input.Keys.F2;
            case KEY_F3:
                return Input.Keys.F3;
            case KEY_F4:
                return Input.Keys.F4;
            case KEY_F5:
                return Input.Keys.F5;
            case KEY_F6:
                return Input.Keys.F6;
            case KEY_F7:
                return Input.Keys.F7;
            case KEY_F8:
                return Input.Keys.F8;
            case KEY_F9:
                return Input.Keys.F9;
            case KEY_F10:
                return Input.Keys.F10;
            case KEY_F11:
                return Input.Keys.F11;
            case KEY_F12:
                return Input.Keys.F12;
            case KEY_NUM_LOCK:
                return Input.Keys.NUM;
            case KEY_SCROLL_LOCK:
                return Input.Keys.UNKNOWN; // FIXME
            case KEY_SEMICOLON:
                return Input.Keys.SEMICOLON;
            case KEY_EQUALS:
                return Input.Keys.EQUALS;
            case KEY_COMMA:
                return Input.Keys.COMMA;
            case KEY_DASH:
                return Input.Keys.MINUS;
            case KEY_PERIOD:
                return Input.Keys.PERIOD;
            case KEY_FORWARD_SLASH:
                return Input.Keys.SLASH;
            case KEY_GRAVE_ACCENT:
                return Input.Keys.UNKNOWN; // FIXME
            case KEY_OPEN_BRACKET:
                return Input.Keys.LEFT_BRACKET;
            case KEY_BACKSLASH:
                return Input.Keys.BACKSLASH;
            case KEY_CLOSE_BRACKET:
                return Input.Keys.RIGHT_BRACKET;
            case KEY_SINGLE_QUOTE:
                return Input.Keys.APOSTROPHE;
            default:
                return Input.Keys.UNKNOWN;
        }
    }
}
(InputObject as any).$inject = ["global"];