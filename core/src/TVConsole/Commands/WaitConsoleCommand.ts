import { float } from "../../float";
import { Override } from "../../Reflection/Decorators/ClassInfo";
import { ConsoleBase } from "../ConsoleBase";
import { TextConsole } from "../TextConsole";
import { TextTVC } from "../TextTVC";
import { TVC } from "../TVC";
import { ConsoleCommandBase } from "./CommandBase";

export class WaitConsoleCommand extends ConsoleCommandBase {
    public CommandName: string = 'Wait';
    public timeout: float = 0;
    public constructor(console: ConsoleBase<TVC>, timeout: float) {
        super(console);
        this.timeout = timeout;
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
            type: 12,
            waitThis: this.console.tvc,
            callFunction: "wait",
            waitFunction: "wait_wait",
            args: [this.timeout]
        };
    }
}