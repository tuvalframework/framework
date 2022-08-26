import { ConsoleCommandBase } from "./CommandBase";
import { TextConsole } from "../TextConsole";
import { int } from "../../float";
import { TextTVC } from "../TextTVC";

export class SetInkConsoleCommand extends ConsoleCommandBase {
    public CommandName: string = 'SetPaper';
    public inkColor: int = 0;

    public constructor(console: TextConsole<TextTVC>, color: int) {
        super(console);
        this.inkColor = color;
    }

    public Execute(console: TextConsole<TextTVC>): void {
        this.console.tvc.currentScreen.setInk(this.inkColor);
    }
}