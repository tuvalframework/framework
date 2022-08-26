import { CGRectangle } from "@tuval/cg";
import { ConsoleCommandBase, int } from "@tuval/core";
import { Pen } from "../../drawing/Pen";
import { Pens } from "../../drawing/Pens";
import { LazyValue, lazy } from "@tuval/core";
import { GuiConsole } from "../GuiConsole";
import { GuiTVC } from "../GuiTVC";

export class DrawCommand extends ConsoleCommandBase {
    public CommandName: string = 'Draw';

    public constructor(console: GuiConsole<GuiTVC>,
        public x: LazyValue<int>,
        public y: LazyValue<int>,
        public width: LazyValue<int>,
        public height: LazyValue<int>) {
        super(console);
    }

    public Execute(console: GuiConsole<GuiTVC>): void {
        console.tvc.currentScreen.draw({ x: this.x.Value, y: this.y.Value, width: this.width.Value, height: this.height.Value });
    }
}