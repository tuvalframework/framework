import { Override } from "../../Reflection/Decorators/ClassInfo";
import { ConsoleBase } from "../ConsoleBase";
import { SubProcessCommandBase } from "./SubProcessCommandBase";
import { TVC } from "../TVC";

export class WaitPromiseConsoleCommand extends SubProcessCommandBase {
    public CommandName: string = 'Input';
    public Promise: Promise<any> = null as any;
    public Callback: Function;
    public ErrorCallback: Function;

    public constructor(console: ConsoleBase<TVC>, promise: Promise<any>, callback?: Function, errorCallback: Function = () => { }) {
        super(console);
        this.Promise = promise;
        this.Callback = callback!;
        this.ErrorCallback = errorCallback;
    }
    public Execute(console: ConsoleBase<TVC>): void {
        //console.tvc.currentScreen.currentTextWindow.print(this.Text, true);
    }

    @Override
    public IsWaitable(): boolean {
        return true;
    }

    @Override
    public GetReturnObject(): any {
        return {
            type: 8,
            instruction: "waitPromise",
            args: {
                promise: this.Promise,
                callback: this.Callback,
                errorCallback: this.ErrorCallback
            }
        }
    }
}