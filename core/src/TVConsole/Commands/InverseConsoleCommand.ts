import { TextConsole } from "../TextConsole";
import { IConsoleCommand } from "./IConsoleCommand";
import { ConsoleCommandBase } from "./CommandBase";
import { int } from "../../float";
import { TextTVC } from "../TextTVC";

export class InverseConsoleCommand extends ConsoleCommandBase {
    public CommandName: string = 'Inverse';
    private m_TurnOn: boolean = false;

    public constructor(console:TextConsole<TextTVC>, turnOn: boolean) {
        super(console);
        this.m_TurnOn = turnOn;

    }

    public Execute(console: TextConsole<TextTVC>): void {
        this.console.tvc.currentScreen.currentTextWindow.setInverse(this.m_TurnOn);
    }
}