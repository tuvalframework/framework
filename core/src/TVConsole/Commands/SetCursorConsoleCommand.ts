import { TextConsole } from "../TextConsole";
import { TextTVC } from "../TextTVC";
import { ConsoleCommandBase } from "./CommandBase";

export class SetCursorConsoleCommand extends ConsoleCommandBase {
    public CommandName: string = 'SetCursor';
    public On: boolean = false;

    public constructor(console:TextConsole<TextTVC>, on: boolean) {
        super(console);
        this.On = on;
    }
    public Execute(console: TextConsole<TextTVC>): void {
        console.tvc.currentScreen.currentTextWindow.setCursor(this.On);
    }
}