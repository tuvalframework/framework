import { Override } from "../../Reflection/Decorators/ClassInfo";
import { SubProcessCommandBase } from "./SubProcessCommandBase";
import { TextConsole } from "../TextConsole";
import { TextTVC } from "../TextTVC";
import { ConsoleCommandBase } from "./CommandBase";
import { IConsoleCommand } from "./IConsoleCommand";

export class InputConsoleCommand  extends SubProcessCommandBase  {
    public CommandName: string = 'Input';
    public Text: string = '';
    public Callback: Function;

    public constructor(console:TextConsole<TextTVC>, text: string, callback?: Function) {
        super(console);
        this.Text = text;
        this.Callback = callback!;
    }
    public Execute(console: TextConsole<TextTVC>): void {
        //console.tvc.currentScreen.currentTextWindow.print(this.Text, true);
    }

    @Override
    public IsWaitable(): boolean {
        return true;
    }

    @Override
    public GetReturnObject(): any {
        return {
            type: 8,
            instruction: "input",
            args: {
                text: this.Text,
                variables: [{
                    name: "inputVar$",
                    type: 2
                }],
                newLine: true
            }
        }
    }
}