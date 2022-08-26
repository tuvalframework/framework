import { TextConsole } from "../TextConsole";
import { IConsoleCommand } from "./IConsoleCommand";
import { ConsoleCommandBase } from "./CommandBase";
import { int } from "../../float";
import { TextTVC } from "../TextTVC";

export class LocateConsoleCommand extends ConsoleCommandBase {
    public CommandName: string = 'Print';
    public X: int = 0;
    public Y: int = 0;

    public constructor(console:TextConsole<TextTVC>, x: int, y: int) {
        super(console);
        this.X = x;
        this.Y = y;
    }

    public Execute(console: TextConsole<TextTVC>): void {
        console.tvc.currentScreen.currentTextWindow.locate({ x: this.X, y: this.Y });
    }
}