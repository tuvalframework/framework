import { CGRectangle } from "@tuval/cg";
import { ConsoleCommandBase, int } from "@tuval/core";
import { Pen } from "../../drawing/Pen";
import { Pens } from "../../drawing/Pens";
import { LazyValue,lazy } from "@tuval/core";
import { GuiConsole } from "../GuiConsole";
import { GuiTVC } from "../GuiTVC";

export class DrawEllipseCommand extends ConsoleCommandBase {
    public CommandName: string = 'DrawEllipse';
    public pen: LazyValue<Pen> = lazy(Pens.White);
    public rect: LazyValue<CGRectangle> = lazy(CGRectangle.Empty);

    public constructor(console: GuiConsole<GuiTVC>, pen: LazyValue<Pen>, rect: LazyValue<CGRectangle>) {
        super(console);
        this.pen  = pen;
        this.rect = rect;
    }

    public Execute(console: GuiConsole<GuiTVC>): void {
        console.tvc.currentScreen.DrawEllipse(this.pen.Value, this.rect.Value);
    }
}