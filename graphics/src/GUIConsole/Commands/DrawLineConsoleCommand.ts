import { CGRectangle } from "@tuval/cg";
import { ConsoleCommandBase, int, lazy } from "@tuval/core";
import { Pen } from "../../drawing/Pen";
import { Pens } from "../../drawing/Pens";
import { LazyValue } from "@tuval/core";
import { GuiConsole } from "../GuiConsole";
import { GuiTVC } from "../GuiTVC";

export class DrawLineConsoleCommand extends ConsoleCommandBase {
    public CommandName: string = 'DrawLine';
    public pen: LazyValue<Pen> = lazy(Pens.White);
    public x1: LazyValue<int> = null as any;
    public y1: LazyValue<int> = null as any;
    public x2: LazyValue<int> = null as any;
    public y2: LazyValue<int> = null as any;

    public constructor(console: GuiConsole<GuiTVC>, pen: LazyValue<Pen>, x1: LazyValue<int>, y1: LazyValue<int>, x2: LazyValue<int>, y2: LazyValue<int>) {
        super(console);
        this.pen = pen;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    public Execute(console: GuiConsole<GuiTVC>): void {
        console.tvc.currentScreen.DrawLine(this.pen.Value, new CGRectangle(this.x1.Value, this.y1.Value, this.x2.Value - this.x1.Value, this.y2.Value - this.y1.Value));
    }
}