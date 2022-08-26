import { TextConsole } from "../TextConsole";
import { IConsoleCommand } from "./IConsoleCommand";
import { ConsoleCommandBase } from "./CommandBase";
import { int } from "../../float";
import { TextTVC } from "../TextTVC";

export class SetPaletteConsoleCommand extends ConsoleCommandBase {
    public CommandName: string = 'SetPalette';
    public Colors: Array<int> = null as any;

    public constructor(console: TextConsole<TextTVC>, colors: Array<int>) {
        super(console);
        this.Colors = colors;
    }

    public Execute(console: TextConsole<TextTVC>): void {
        console.tvc.currentScreen.setPalette(this.Colors);
    }
}