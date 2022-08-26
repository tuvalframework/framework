import { int, Type, NotImplementedException, TString } from "@tuval/core";

export class Message {
    private msg: int = 0;
    private lParam: any;
    private wParam: any;
    private result: any;

    //#region Public Inies


    public get LParam(): any {
        return this.lParam;
    }
    public set LParam(value: any) {
        this.lParam = value;
    }


    public get Msg(): int {
        return this.msg;
    }
    public set Msg(value: int) {
        this.msg = value;
    }

    public get Result(): any {
        return this.result;
    }
    public set Result(value: any) {
        this.result = value;
    }

    public get WParam(): any {
        return this.wParam;
    }
    public set WParam(value: any) {
        this.wParam = value;
    }
    //#endregion	// Public Instance Properties

    //#region Public Static Methods
    public static Create(msg: int, wparam: any, lparam: any): Message {
        const new_message: Message = new Message();
        new_message.msg = msg;
        new_message.wParam = wparam;
        new_message.lParam = lparam;
        return new_message;
    }


    public static isEqual(a: Message, b: Message): boolean {
        return  (a.lParam === b.lParam) && (a.msg === b.msg) && (a.result === b.result) && (a.wParam === b.wParam);
    }

    public static isNotEqual(a: Message, b: Message): boolean {
        return !(Message.isEqual(a, b));
    }
    //#endregion	// Public Static Methods

    //#region Public Instance Methods
    public /* override */  equals(o: Message): boolean {
        /* if (!(o is Message)) {
            return false;
        } */

        return (this.msg === o.msg) && this.lParam === o.lParam && this.wParam === o.wParam && this.result === o.result;
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