import { Override } from "../../Reflection";
import { TextConsole } from "../TextConsole";
import { TextTVC } from "../TextTVC";
import { ConsoleCommandBase } from "./CommandBase";
import { InputConsoleCommand } from "./InputConsoleCommand";

export class _LoopProxyCommand extends ConsoleCommandBase {
    public command : ConsoleCommandBase = null as any;
    public constructor(console: TextConsole<TextTVC>, command: ConsoleCommandBase) {
        super(console);
        this.command = command;
    }
    public Execute(console: TextConsole<TextTVC>): void {
        this.command.Execute(console);
    }

    @Override
    public  GetReturnObject(): any {
        if (this.command.IsWaitable()) {
            return this.command.GetReturnObject();
        }

        return {
            type: 1,
            label: 10
        }
    }
}