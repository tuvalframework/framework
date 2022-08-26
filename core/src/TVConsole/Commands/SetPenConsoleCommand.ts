import { int } from "../../float";
import { TextConsole } from "../TextConsole";
import { TextTVC } from "../TextTVC";
import { ConsoleCommandBase } from "./CommandBase";

export class SetPenConsoleCommand extends ConsoleCommandBase {
    public CommandName: string = 'SetPen';
    public penColor: int = 0;

    public constructor(console: TextConsole<TextTVC>, color: int) {
        super(console);
        this.penColor = color;
    }

    public Execute(console: TextConsole<TextTVC>): void {
        this.console.tvc.currentScreen.currentTextWindow.setPen(this.penColor);
    }
}