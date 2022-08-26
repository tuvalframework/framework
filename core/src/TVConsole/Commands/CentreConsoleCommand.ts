import { TextConsole } from "../TextConsole";
import { IConsoleCommand } from "./IConsoleCommand";
import { ConsoleCommandBase } from "./CommandBase";
import { ConsoleBase } from "../ConsoleBase";
import { TextTVC } from "../TextTVC";

export class CentreConsoleCommand extends ConsoleCommandBase {
    public CommandName: string = 'Centre';
    public Text: string = '';

    public constructor(console: TextConsole<TextTVC>, text: string) {
        super(console);
        this.Text = text;
    }

    public Execute(console: TextConsole<TextTVC>): void {
        console.tvc.currentScreen.currentTextWindow.centre(this.Text);
    }
}