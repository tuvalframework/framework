import { ConsoleCommandBase } from "./CommandBase";
import { TextConsole } from "../TextConsole";
import { int } from "../../float";
import { TextTVC } from "../TextTVC";

export class SetPaperConsoleCommand extends ConsoleCommandBase {
    public CommandName: string = 'SetPaper';
    public paperColor: int = 0;

    public constructor(console: TextConsole<TextTVC>, color: int) {
        super(console);
        this.paperColor = color;
    }

    public Execute(console: TextConsole<TextTVC>): void {
        this.console.tvc.currentScreen.currentTextWindow.setPaper(this.paperColor);
    }
}