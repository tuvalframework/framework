import { CGRectangle } from "@tuval/cg";
import { ConsoleCommandBase, int, lazy, LazyValue } from "@tuval/core";
import { Brush } from "../../drawing/Brush";
import { Brushes } from "../../drawing/Brushes";
import { GuiConsole } from "../GuiConsole";
import { GuiTVC } from "../GuiTVC";

export class FillRectangleConsoleCommand extends ConsoleCommandBase {
    public CommandName: string = 'DrawLine';
    public brush: LazyValue<Brush> = lazy(Brushes.Yellow);
    public rect: LazyValue<CGRectangle> = lazy(CGRectangle.Empty)

    public constructor(console: GuiConsole<GuiTVC>, brush: LazyValue<Brush>, rect: LazyValue<CGRectangle>) {
        super(console);
        this.brush = brush;
        this.rect = rect;
    }

    public Execute(console: GuiConsole<GuiTVC>): void {
        console.tvc.currentScreen.FillRectangle(this.brush.Value, this.rect.Value);
    }
}