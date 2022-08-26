import { NotImplementedException } from "../Exceptions/NotImplementedException";
import { int } from "../float";
import { Type } from "../Reflection/Type";
import { TString } from "../Text/TString";

export class IPCMessage {
    private msg: int = 0;
    private hwnd: int = 0;
    private lParam: int = 0;
    private wParam: int = 0;
    private result: int = 0;

    //#region Public Instance Properties
    public get HWnd(): int {
        return this.hwnd;
    }
    public set HWnd(value: int) {
        this.hwnd = value;
    }

    public get LParam(): int {
        return this.lParam;
    }
    public set LParam(value: int) {
        this.lParam = value;
    }


    public get Msg(): int {
        return this.msg;
    }
    public set Msg(value: int) {
        this.msg = value;
    }

    public get Result(): int {
        return this.result;
    }
    public set Result(value: int) {
        this.result = value;
    }

    public get WParam(): int {
        return this.wParam;
    }
    public set WParam(value: int) {
        this.wParam = value;
    }
    //#endregion	// Public Instance Properties

    //#region Public Static Methods
    public static Create(hWnd: int, msg: int, wparam: int, lparam: int): IPCMessage {
        const new_message: IPCMessage = new IPCMessage();
        new_message.msg = msg;
        new_message.hwnd = hWnd;
        new_message.wParam = wparam;
        new_message.lParam = lparam;
        return new_message;
    }


    public static isEqual(a: IPCMessage, b: IPCMessage): boolean {
        return (a.hwnd === b.hwnd) && (a.lParam === b.lParam) && (a.msg === b.msg) && (a.result === b.result) && (a.wParam === b.wParam);
    }

    public static isNotEqual(a: IPCMessage, b: IPCMessage): boolean {
        return !(IPCMessage.isEqual(a, b));
    }
    //#endregion	// Public Static Methods

    //#region Public Instance Methods
    public /* override */  equals(o: IPCMessage): boolean {
        /* if (!(o is Message)) {
            return false;
        } */

        return ((this.msg === o.msg) && this.hwnd === o.hwnd) && this.lParam === o.lParam && this.wParam === o.wParam && this.result === o.result;
    }

    public /* override */  getHashCode(): int {
        throw new NotImplementedException('getHashCode');
    }

    public getLParam(cls: Type): any {
        throw new NotImplementedException('getLParam');
    }

    public /* override */  toString(): string {
        return TString.Empty;
        //String.Format("msg=0x{0:x} ({1}) hwnd=0x{2:x} wparam=0x{3:x} lparam=0x{4:x} result=0x{5:x}", msg, ((Msg) msg).ToString(), hwnd.ToInt32(), wParam.ToInt32(), lParam.ToInt32(), result.ToInt32());
    }
    //#endregion	// Public Instance Methods
}