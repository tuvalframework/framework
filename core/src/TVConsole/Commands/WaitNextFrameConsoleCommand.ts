import { Override } from "../../Reflection/Decorators/ClassInfo";
import { TextConsole } from "../TextConsole";
import { TextTVC } from "../TextTVC";
import { ConsoleCommandBase } from "./CommandBase";

export class WaitNextFrameConsoleCommand extends ConsoleCommandBase {
    public Execute(console: TextConsole<TextTVC>): void {
        // do nothing
    }

    @Override
    public IsWaitable(): boolean {
        return true;
    }

    @Override
    public GetReturnObject(): any {
        return {
            type: 12,
            waitThis: this.console.tvc,
            callFunction: "waitVbl",
            waitFunction: "waitVbl_wait",
            args: []
        };
    }
}