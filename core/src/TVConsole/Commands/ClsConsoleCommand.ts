import { TextConsole } from "../TextConsole";
import { IConsoleCommand } from "./IConsoleCommand";
import { ConsoleCommandBase } from "./CommandBase";
import { int } from "../../float";
import { TextTVC } from "../TextTVC";

export class ClsConsoleCommand  extends ConsoleCommandBase {
    public CommandName: string = 'Cls';
    public Color: int = undefined as any;

    public constructor(console:TextConsole<TextTVC>, color?:int) {
        super(console);
        this.Color = color as any;
    }

    public Execute(console: TextConsole<TextTVC>): void {
        console.tvc.currentScreen.cls(this.Color);
    }
}