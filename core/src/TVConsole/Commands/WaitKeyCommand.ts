import { float } from "../../float";
import { Override } from "../../Reflection/Decorators/ClassInfo";
import { ConsoleBase } from "../ConsoleBase";
import { TVC } from "../TVC";
import { ConsoleCommandBase } from "./CommandBase";

export class WaitKeyCommand extends ConsoleCommandBase {
    public CommandName: string = 'WaitKey';
    public constructor(console: ConsoleBase<TVC>) {
        super(console);
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
            callFunction: "waitKey",
            waitFunction: "waitKey_wait",
            args: []
        }
    }
}