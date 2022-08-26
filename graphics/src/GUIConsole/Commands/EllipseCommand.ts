import { CGRectangle } from "@tuval/cg";
import { ConsoleCommandBase, int } from "@tuval/core";
import { Pen } from "../../drawing/Pen";
import { Pens } from "../../drawing/Pens";
import { LazyValue, lazy } from "@tuval/core";
import { GuiConsole } from "../GuiConsole";
import { GuiTVC } from "../GuiTVC";

export class EllipseCommand extends ConsoleCommandBase {
    public CommandName: string = 'Ellipse';

    public constructor(console: GuiConsole<GuiTVC>,
        public x: LazyValue<int>,
        public y: LazyValue<int>,
        public xRadius: LazyValue<int>,
        public yRadius: LazyValue<int>) {
        super(console);
    }

    public Execute(console: GuiConsole<GuiTVC>): void {
        console.tvc.currentScreen.ellipse({ x: this.x.Value, y: this.y.Value, width: this.xRadius.Value, height: this.yRadius.Value });
    }
}