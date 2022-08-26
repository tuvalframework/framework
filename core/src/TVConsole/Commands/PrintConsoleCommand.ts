import { lazy, LazyValue } from "../../LazyValue";
import { TString } from "../../Text/TString";
import { TextConsole } from "../TextConsole";
import { TextTVC } from "../TextTVC";
import { ConsoleCommandBase } from "./CommandBase";

export class PrintConsoleCommand extends ConsoleCommandBase {
    public CommandName: string = 'Print';
    public Text: LazyValue<string> = lazy('');
    public Args: any[] = null as any;
    public IsLine: boolean = true;

    public constructor(console: TextConsole<TextTVC>, isLine: boolean, text: LazyValue<string>, args: any[]) {
        super(console);
        this.Text = text;
        this.IsLine = isLine;
        this.Args = args;
    }
    public Execute(console: TextConsole<TextTVC>): void {
        let text;
        if (this.Args != null) {
        text = TString.Format1(TString.ToString(this.Text.Value), ...this.Args);
        } else {
            text = TString.ToString(this.Text.Value);
        }
        const splited = text.split('\n');
        for (let i = 0; i < splited.length; i++) {
            console.tvc.currentScreen.currentTextWindow.print(splited[i], this.IsLine);
        }

    }
}