import { ConsoleCommandBase } from "./CommandBase";
import { TextConsole } from "../TextConsole";
import { int } from "../../float";
import { TextTVC } from "../TextTVC";

export class DrawBarConsoleCommand extends ConsoleCommandBase {
    public CommandName: string = 'DrawBar';
    public X: int = 0;
    public Y: int = 0;
    public Width: int = 0;
    public Height: int = 0;

    public constructor(console: TextConsole<TextTVC>, x: int, y: int, width: int, height: int) {
        super(console);
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
    }

    public Execute(console: TextConsole<TextTVC>): void {
        this.console.tvc.currentScreen.bar({ x: this.X, y: this.Y, width: this.Width, height: this.Height });
    }
}