import { float } from "../../float";
import { Override } from "../../Reflection/Decorators/ClassInfo";
import { TextConsole } from "../TextConsole";
import { TextTVC } from "../TextTVC";
import { ConsoleCommandBase } from "./CommandBase";
import { IConsoleCommand } from "./IConsoleCommand";

export class DepConsoleCommand extends ConsoleCommandBase {
    public CommandName: string = 'Dep';
    public constructor(console: TextConsole<TextTVC>) {
        super(console);

    }
    public Execute(console: TextConsole<TextTVC>): void {

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
            callFunction: "dep",
            waitFunction: "dep_wait",
            args: []
        };

    }
}