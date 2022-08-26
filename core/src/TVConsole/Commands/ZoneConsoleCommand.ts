import { int } from "../../float";
import { lazy } from "../../LazyValue";
import { TextConsole } from "../TextConsole";
import { TextTVC } from "../TextTVC";
import { PrintConsoleCommand } from "./PrintConsoleCommand";

let zoneCount = 1;
export class ZoneConsoleCommand extends PrintConsoleCommand {
    public CommandName: string = 'Print';
    public OnMouseMove: Function = null as any;
    private m_ZoneId: int = 0;
    public GetReturnObject(): any {
        return {
            type: 1,
            label: 0
        }
    }
    public constructor(console: TextConsole<TextTVC>, text: string, onMouseMove: Function) {
        super(console,  true, lazy(text), null as any);
        this.OnMouseMove = onMouseMove;

        this.m_ZoneId = zoneCount++;

        this.console.Zones.Add(this.m_ZoneId, this);
    }
    public Execute(console: TextConsole<TextTVC>): void {
        console.tvc.currentScreen.reserveZone(zoneCount);
        console.tvc.currentScreen.currentTextWindow.print(console.tvc.currentScreen.currentTextWindow.zone$(this.Text, this.m_ZoneId));
    }
}