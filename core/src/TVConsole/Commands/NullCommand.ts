import { TextConsole } from "../TextConsole";
import { TextTVC } from "../TextTVC";
import { ConsoleCommandBase } from "./CommandBase";

export class NullCommand extends ConsoleCommandBase {
    public CommandName: string = 'Null Command';
    public Args: any[] = null as any;
    public IsLine: boolean = true;

    public constructor(console: TextConsole<TextTVC>) {
        super(console);
    }
    public Execute(console: TextConsole<TextTVC>): void {

    }
}