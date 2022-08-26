import { EventArgs } from "@tuval/core";
import { Keys } from "./Keys";
import { Enum } from "@tuval/core";

export class KeyEventArgs extends EventArgs {
    private readonly keyData: Keys;
    private handled: boolean = false;
    private suppressKeyPress: boolean = false;
    public get Alt(): boolean {
        return (this.keyData & Keys.Alt) === Keys.Alt;
    }
    public get Control(): boolean {
        return (this.keyData & Keys.Control) === Keys.Control;
    }

    public get Modifiers(): Keys {
        return this.keyData & Keys.Modifiers;
    }

    public get Shift(): boolean {
        return (this.keyData & Keys.Shift) === Keys.Shift;
    }

    public constructor(keyData: Keys) {
        super();
        this.keyData = keyData;
    }

    public get Handled(): boolean {

        return this.handled;
    }
    public set Handled(value: boolean) {
        this.handled = value;
    }

    public get KeyCode(): Keys {

        const keyGenerated: Keys = this.keyData & Keys.KeyCode;

        // since Keys can be discontiguous, keeping Enum.IsDefined.
        if (!Enum.IsDefined(typeof (Keys), keyGenerated))
            return Keys.None;
        else
            return keyGenerated;
    }

    public get KeyValue(): number {
        return (this.keyData & Keys.KeyCode);
    }

    public get KeyData(): Keys {
        return this.keyData;
    }

    public get SuppressKeyPress(): boolean {
        return this.suppressKeyPress;
    }
    public set SuppressKeyPress(value: boolean) {
        this.suppressKeyPress = value;
        this.handled = value;
    }

}