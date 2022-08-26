import { IllegalArgumentException } from "./Exceptions/IllegalArgumentException";
import { Dictionary } from "./Collections/Generic/Dictionary";
import { float, int } from "./float";
import { InputProcessor } from "./InputProcessor";


export interface TextInputListener {
    input(text: string): void;
    canceled(): void;
}

export enum Orientation {
    Landscape,
    Portrait
}

export enum Peripheral {
    HardwareKeyboard,
    OnscreenKeyboard,
    MultitouchScreen,
    Accelerometer,
    Compass,
    Vibrator,
    Gyroscope,
    RotationVector,
    Pressure
}
export abstract class Input {
    public static keyNames: Dictionary<string, number>;
    public static valueOf(keyname: string): number {
        if (Input.keyNames == null) {
            Input.initializeKeyNames();
        }
        return Input.keyNames.Get(keyname);
    }


    public static initializeKeyNames(): void {
        Input.keyNames = new Dictionary<string, number>();
        for (let i = 0; i < 256; i++) {
            const name: string = Input.Keys.toString(i);
            if (name != null) Input.keyNames.Set(name, i);
        }
    }

    public abstract getAccelerometerX(): float;
    public abstract getAccelerometerY(): float;
    public abstract getAccelerometerZ(): float;
    public abstract getGyroscopeX(): float;
    public abstract getGyroscopeY(): float;
    public abstract getGyroscopeZ(): float;
    public abstract getMaxPointers(): int;
    public abstract getX(): int;
    public abstract getX(pointer: int): int;
    public abstract getDeltaX(): int;
    public abstract getDeltaX(pointer: int): int;
    public abstract getY(): int;
    public abstract getY(pointer: int): int;
    public abstract getDeltaY(): int;
    public abstract getDeltaY(pointer: int): int;
    //public abstract isTouched(): boolean;
    public abstract justTouchedMethod(): boolean;
    public abstract isTouched(pointer: int): boolean;
    public abstract getPressure(): float;
    public abstract getPressure(pointer: int): float;
    public abstract isButtonPressed(button: int): boolean;
    public abstract isButtonJustPressed(button: int): boolean;
    public abstract isKeyPressed(key: int): boolean;
    public abstract isKeyJustPressed(key: int): boolean;
    public abstract getTextInput(listener: TextInputListener, title: String, text: String, hint: String): void;
    public abstract setOnscreenKeyboardVisible(visible: boolean): void;
    public abstract vibrate(milliseconds: int): void;
    public abstract vibrate(pattern: number[], repeat: int): void;
    public abstract cancelVibrate(): void;
    public abstract getAzimuth(): float;
    public abstract getPitch(): float;
    public abstract getRoll(): float;
    public abstract getRotationMatrix(matrix: float[]): void;
    public abstract getCurrentEventTime(): number;
    public abstract setCatchBackKey(catchBack: boolean): void;
    public abstract isCatchBackKey(): boolean;
    public abstract setCatchMenuKey(catchMenu: boolean): void;
    public abstract isCatchMenuKey(): boolean;
    public abstract setInputProcessor(processor:  InputProcessor): void;
    public abstract getInputProcessor(): InputProcessor ;
    public abstract isPeripheralAvailable(peripheral: Peripheral): boolean;
    public abstract getRotation(): int;
    public abstract getNativeOrientation(): Orientation;
    public abstract setCursorCatched(catched: boolean): void;
    public abstract isCursorCatched(): boolean;
    public abstract setCursorPosition(x: int, y: int): void;
}

export namespace Input {
    export class Buttons {
        public static readonly LEFT: number = 0;
        public static readonly RIGHT: number = 1;
        public static readonly MIDDLE: number = 2;
        public static readonly BACK: number = 3;
        public static readonly FORWARD: number = 4;
    }
    export class Keys {
        public static readonly ANY_KEY: number = -1;
        public static readonly NUM_0: number = 7;
        public static readonly NUM_1: number = 8;
        public static readonly NUM_2: number = 9;
        public static readonly NUM_3: number = 10;
        public static readonly NUM_4: number = 11;
        public static readonly NUM_5: number = 12;
        public static readonly NUM_6: number = 13;
        public static readonly NUM_7: number = 14;
        public static readonly NUM_8: number = 15;
        public static readonly NUM_9: number = 16;
        public static readonly A: number = 29;
        public static readonly ALT_LEFT: number = 57;
        public static readonly ALT_RIGHT: number = 58;
        public static readonly APOSTROPHE: number = 75;
        public static readonly AT: number = 77;
        public static readonly B: number = 30;
        public static readonly BACK: number = 4;
        public static readonly BACKSLASH: number = 73;
        public static readonly C: number = 31;
        public static readonly CALL: number = 5;
        public static readonly CAMERA: number = 27;
        public static readonly CLEAR: number = 28;
        public static readonly COMMA: number = 55;
        public static readonly D: number = 32;
        public static readonly DEL: number = 67;
        public static readonly BACKSPACE: number = 67;
        public static readonly FORWARD_DEL: number = 112;
        public static readonly DPAD_CENTER: number = 23;
        public static readonly DPAD_DOWN: number = 20;
        public static readonly DPAD_LEFT: number = 21;
        public static readonly DPAD_RIGHT: number = 22;
        public static readonly DPAD_UP: number = 19;
        public static readonly CENTER: number = 23;
        public static readonly DOWN: number = 20;
        public static readonly LEFT: number = 21;
        public static readonly RIGHT: number = 22;
        public static readonly UP: number = 19;
        public static readonly E: number = 33;
        public static readonly ENDCALL: number = 6;
        public static readonly ENTER: number = 66;
        public static readonly ENVELOPE: number = 65;
        public static readonly EQUALS: number = 70;
        public static readonly EXPLORER: number = 64;
        public static readonly F: number = 34;
        public static readonly FOCUS: number = 80;
        public static readonly G: number = 35;
        public static readonly GRAVE: number = 68;
        public static readonly H: number = 36;
        public static readonly HEADSETHOOK: number = 79;
        public static readonly HOME: number = 3;
        public static readonly I: number = 37;
        public static readonly J: number = 38;
        public static readonly K: number = 39;
        public static readonly L: number = 40;
        public static readonly LEFT_BRACKET: number = 71;
        public static readonly M: number = 41;
        public static readonly MEDIA_FAST_FORWARD: number = 90;
        public static readonly MEDIA_NEXT: number = 87;
        public static readonly MEDIA_PLAY_PAUSE: number = 85;
        public static readonly MEDIA_PREVIOUS: number = 88;
        public static readonly MEDIA_REWIND: number = 89;
        public static readonly MEDIA_STOP: number = 86;
        public static readonly MENU: number = 82;
        public static readonly MINUS: number = 69;
        public static readonly MUTE: number = 91;
        public static readonly N: number = 42;
        public static readonly NOTIFICATION: number = 83;
        public static readonly NUM: number = 78;
        public static readonly O: number = 43;
        public static readonly P: number = 44;
        public static readonly PERIOD: number = 56;
        public static readonly PLUS: number = 81;
        public static readonly POUND: number = 18;
        public static readonly POWER: number = 26;
        public static readonly Q: number = 45;
        public static readonly R: number = 46;
        public static readonly RIGHT_BRACKET: number = 72;
        public static readonly S: number = 47;
        public static readonly SEARCH: number = 84;
        public static readonly SEMICOLON: number = 74;
        public static readonly SHIFT_LEFT: number = 59;
        public static readonly SHIFT_RIGHT: number = 60;
        public static readonly SLASH: number = 76;
        public static readonly SOFT_LEFT: number = 1;
        public static readonly SOFT_RIGHT: number = 2;
        public static readonly SPACE: number = 62;
        public static readonly STAR: number = 17;
        public static readonly SYM: number = 63;
        public static readonly T: number = 48;
        public static readonly TAB: number = 61;
        public static readonly U: number = 49;
        public static readonly UNKNOWN: number = 0;
        public static readonly V: number = 50;
        public static readonly VOLUME_DOWN: number = 25;
        public static readonly VOLUME_UP: number = 24;
        public static readonly W: number = 51;
        public static readonly X: number = 52;
        public static readonly Y: number = 53;
        public static readonly Z: number = 54;
        public static readonly META_ALT_LEFT_ON: number = 16;
        public static readonly META_ALT_ON: number = 2;
        public static readonly META_ALT_RIGHT_ON: number = 32;
        public static readonly META_SHIFT_LEFT_ON: number = 64;
        public static readonly META_SHIFT_ON: number = 1;
        public static readonly META_SHIFT_RIGHT_ON: number = 128;
        public static readonly META_SYM_ON: number = 4;
        public static readonly CONTROL_LEFT: number = 129;
        public static readonly CONTROL_RIGHT: number = 130;
        public static readonly ESCAPE: number = 131;
        public static readonly END: number = 132;
        public static readonly INSERT: number = 133;
        public static readonly PAGE_UP: number = 92;
        public static readonly PAGE_DOWN: number = 93;
        public static readonly PICTSYMBOLS: number = 94;
        public static readonly SWITCH_CHARSET: number = 95;
        public static readonly BUTTON_CIRCLE: number = 255;
        public static readonly BUTTON_A: number = 96;
        public static readonly BUTTON_B: number = 97;
        public static readonly BUTTON_C: number = 98;
        public static readonly BUTTON_X: number = 99;
        public static readonly BUTTON_Y: number = 100;
        public static readonly BUTTON_Z: number = 101;
        public static readonly BUTTON_L1: number = 102;
        public static readonly BUTTON_R1: number = 103;
        public static readonly BUTTON_L2: number = 104;
        public static readonly BUTTON_R2: number = 105;
        public static readonly BUTTON_THUMBL: number = 106;
        public static readonly BUTTON_THUMBR: number = 107;
        public static readonly BUTTON_START: number = 108;
        public static readonly BUTTON_SELECT: number = 109;
        public static readonly BUTTON_MODE: number = 110;

        public static readonly NUMPAD_0: number = 144;
        public static readonly NUMPAD_1: number = 145;
        public static readonly NUMPAD_2: number = 146;
        public static readonly NUMPAD_3: number = 147;
        public static readonly NUMPAD_4: number = 148;
        public static readonly NUMPAD_5: number = 149;
        public static readonly NUMPAD_6: number = 150;
        public static readonly NUMPAD_7: number = 151;
        public static readonly NUMPAD_8: number = 152;
        public static readonly NUMPAD_9: number = 153;

        // public static final int BACKTICK = 0;
        // public static final int TILDE = 0;
        // public static final int UNDERSCORE = 0;
        // public static final int DOT = 0;
        // public static final int BREAK = 0;
        // public static final int PIPE = 0;
        // public static final int EXCLAMATION = 0;
        // public static final int QUESTIONMARK = 0;

        // ` | VK_BACKTICK
        // ~ | VK_TILDE
        // : | VK_COLON
        // _ | VK_UNDERSCORE
        // . | VK_DOT
        // (break) | VK_BREAK
        // | | VK_PIPE
        // ! | VK_EXCLAMATION
        // ? | VK_QUESTION
        public static readonly COLON: number = 243;
        public static readonly F1: number = 244;
        public static readonly F2: number = 245;
        public static readonly F3: number = 246;
        public static readonly F4: number = 247;
        public static readonly F5: number = 248;
        public static readonly F6: number = 249;
        public static readonly F7: number = 250;
        public static readonly F8: number = 251;
        public static readonly F9: number = 252;
        public static readonly F10: number = 253;
        public static readonly F11: number = 254;
        public static readonly F12: number = 255;


        public static toString(keycode: number): string {
            if (keycode < 0) throw new IllegalArgumentException("keycode cannot be negative, keycode: " + keycode);
            if (keycode > 255) throw new IllegalArgumentException("keycode cannot be greater than 255, keycode: " + keycode);
            switch (keycode) {
                // META* variables should not be used with this method.
                case Input.Keys.UNKNOWN:
                    return "Unknown";
                case Input.Keys.SOFT_LEFT:
                    return "Soft Left";
                case Input.Keys.SOFT_RIGHT:
                    return "Soft Right";
                case Input.Keys.HOME:
                    return "Home";
                case Input.Keys.BACK:
                    return "Back";
                case Input.Keys.CALL:
                    return "Call";
                case Input.Keys.ENDCALL:
                    return "End Call";
                case Input.Keys.NUM_0:
                    return "0";
                case Input.Keys.NUM_1:
                    return "1";
                case Input.Keys.NUM_2:
                    return "2";
                case Input.Keys.NUM_3:
                    return "3";
                case Input.Keys.NUM_4:
                    return "4";
                case Input.Keys.NUM_5:
                    return "5";
                case Input.Keys.NUM_6:
                    return "6";
                case Input.Keys.NUM_7:
                    return "7";
                case Input.Keys.NUM_8:
                    return "8";
                case Input.Keys.NUM_9:
                    return "9";
                case Input.Keys.STAR:
                    return "*";
                case Input.Keys.POUND:
                    return "#";
                case Input.Keys.UP:
                    return "Up";
                case Input.Keys.DOWN:
                    return "Down";
                case Input.Keys.LEFT:
                    return "Left";
                case Input.Keys.RIGHT:
                    return "Right";
                case Input.Keys.CENTER:
                    return "Center";
                case Input.Keys.VOLUME_UP:
                    return "Volume Up";
                case Input.Keys.VOLUME_DOWN:
                    return "Volume Down";
                case Input.Keys.POWER:
                    return "Power";
                case Input.Keys.CAMERA:
                    return "Camera";
                case Input.Keys.CLEAR:
                    return "Clear";
                case Input.Keys.A:
                    return "A";
                case Input.Keys.B:
                    return "B";
                case Input.Keys.C:
                    return "C";
                case Input.Keys.D:
                    return "D";
                case Input.Keys.E:
                    return "E";
                case Input.Keys.F:
                    return "F";
                case Input.Keys.G:
                    return "G";
                case Input.Keys.H:
                    return "H";
                case Input.Keys.I:
                    return "I";
                case Input.Keys.J:
                    return "J";
                case Input.Keys.K:
                    return "K";
                case Input.Keys.L:
                    return "L";
                case Input.Keys.M:
                    return "M";
                case Input.Keys.N:
                    return "N";
                case Input.Keys.O:
                    return "O";
                case Input.Keys.P:
                    return "P";
                case Input.Keys.Q:
                    return "Q";
                case Input.Keys.R:
                    return "R";
                case Input.Keys.S:
                    return "S";
                case Input.Keys.T:
                    return "T";
                case Input.Keys.U:
                    return "U";
                case Input.Keys.V:
                    return "V";
                case Input.Keys.W:
                    return "W";
                case Input.Keys.X:
                    return "X";
                case Input.Keys.Y:
                    return "Y";
                case Input.Keys.Z:
                    return "Z";
                case Input.Keys.COMMA:
                    return ",";
                case Input.Keys.PERIOD:
                    return ".";
                case Input.Keys.ALT_LEFT:
                    return "L-Alt";
                case Input.Keys.ALT_RIGHT:
                    return "R-Alt";
                case Input.Keys.SHIFT_LEFT:
                    return "L-Shift";
                case Input.Keys.SHIFT_RIGHT:
                    return "R-Shift";
                case Input.Keys.TAB:
                    return "Tab";
                case Input.Keys.SPACE:
                    return "Space";
                case Input.Keys.SYM:
                    return "SYM";
                case Input.Keys.EXPLORER:
                    return "Explorer";
                case Input.Keys.ENVELOPE:
                    return "Envelope";
                case Input.Keys.ENTER:
                    return "Enter";
                case Input.Keys.DEL:
                    return "Delete"; // also BACKSPACE
                case Input.Keys.GRAVE:
                    return "`";
                case Input.Keys.MINUS:
                    return "-";
                case Input.Keys.EQUALS:
                    return "=";
                case Input.Keys.LEFT_BRACKET:
                    return "[";
                case Input.Keys.RIGHT_BRACKET:
                    return "]";
                case Input.Keys.BACKSLASH:
                    return "\\";
                case Input.Keys.SEMICOLON:
                    return ";";
                case Input.Keys.APOSTROPHE:
                    return "'";
                case Input.Keys.SLASH:
                    return "/";
                case Input.Keys.AT:
                    return "@";
                case Input.Keys.NUM:
                    return "Num";
                case Input.Keys.HEADSETHOOK:
                    return "Headset Hook";
                case Input.Keys.FOCUS:
                    return "Focus";
                case Input.Keys.PLUS:
                    return "Plus";
                case Input.Keys.MENU:
                    return "Menu";
                case Input.Keys.NOTIFICATION:
                    return "Notification";
                case Input.Keys.SEARCH:
                    return "Search";
                case Input.Keys.MEDIA_PLAY_PAUSE:
                    return "Play/Pause";
                case Input.Keys.MEDIA_STOP:
                    return "Stop Media";
                case Input.Keys.MEDIA_NEXT:
                    return "Next Media";
                case Input.Keys.MEDIA_PREVIOUS:
                    return "Prev Media";
                case Input.Keys.MEDIA_REWIND:
                    return "Rewind";
                case Input.Keys.MEDIA_FAST_FORWARD:
                    return "Fast Forward";
                case Input.Keys.MUTE:
                    return "Mute";
                case Input.Keys.PAGE_UP:
                    return "Page Up";
                case Input.Keys.PAGE_DOWN:
                    return "Page Down";
                case Input.Keys.PICTSYMBOLS:
                    return "PICTSYMBOLS";
                case Input.Keys.SWITCH_CHARSET:
                    return "SWITCH_CHARSET";
                case Input.Keys.BUTTON_A:
                    return "A Button";
                case Input.Keys.BUTTON_B:
                    return "B Button";
                case Input.Keys.BUTTON_C:
                    return "C Button";
                case Input.Keys.BUTTON_X:
                    return "X Button";
                case Input.Keys.BUTTON_Y:
                    return "Y Button";
                case Input.Keys.BUTTON_Z:
                    return "Z Button";
                case Input.Keys.BUTTON_L1:
                    return "L1 Button";
                case Input.Keys.BUTTON_R1:
                    return "R1 Button";
                case Input.Keys.BUTTON_L2:
                    return "L2 Button";
                case Input.Keys.BUTTON_R2:
                    return "R2 Button";
                case Input.Keys.BUTTON_THUMBL:
                    return "Left Thumb";
                case Input.Keys.BUTTON_THUMBR:
                    return "Right Thumb";
                case Input.Keys.BUTTON_START:
                    return "Start";
                case Input.Keys.BUTTON_SELECT:
                    return "Select";
                case Input.Keys.BUTTON_MODE:
                    return "Button Mode";
                case Input.Keys.FORWARD_DEL:
                    return "Forward Delete";
                case Input.Keys.CONTROL_LEFT:
                    return "L-Ctrl";
                case Input.Keys.CONTROL_RIGHT:
                    return "R-Ctrl";
                case Input.Keys.ESCAPE:
                    return "Escape";
                case Input.Keys.END:
                    return "End";
                case Input.Keys.INSERT:
                    return "Insert";
                case Input.Keys.NUMPAD_0:
                    return "Numpad 0";
                case Input.Keys.NUMPAD_1:
                    return "Numpad 1";
                case Input.Keys.NUMPAD_2:
                    return "Numpad 2";
                case Input.Keys.NUMPAD_3:
                    return "Numpad 3";
                case Input.Keys.NUMPAD_4:
                    return "Numpad 4";
                case Input.Keys.NUMPAD_5:
                    return "Numpad 5";
                case Input.Keys.NUMPAD_6:
                    return "Numpad 6";
                case Input.Keys.NUMPAD_7:
                    return "Numpad 7";
                case Input.Keys.NUMPAD_8:
                    return "Numpad 8";
                case Input.Keys.NUMPAD_9:
                    return "Numpad 9";
                case Input.Keys.COLON:
                    return ":";
                case Input.Keys.F1:
                    return "F1";
                case Input.Keys.F2:
                    return "F2";
                case Input.Keys.F3:
                    return "F3";
                case Input.Keys.F4:
                    return "F4";
                case Input.Keys.F5:
                    return "F5";
                case Input.Keys.F6:
                    return "F6";
                case Input.Keys.F7:
                    return "F7";
                case Input.Keys.F8:
                    return "F8";
                case Input.Keys.F9:
                    return "F9";
                case Input.Keys.F10:
                    return "F10";
                case Input.Keys.F11:
                    return "F11";
                case Input.Keys.F12:
                    return "F12";
                // BUTTON_CIRCLE unhandled, as it conflicts with the more likely to be pressed F12
                default:
                    // key name not found
                    return null as any;
            }
        }
    }
}