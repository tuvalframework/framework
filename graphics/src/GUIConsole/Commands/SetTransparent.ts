import { CGRectangle } from "@tuval/cg";
import { ConsoleCommandBase, int } from "@tuval/core";
import { Pen } from "../../drawing/Pen";
import { Pens } from "../../drawing/Pens";
import { LazyValue, lazy } from "@tuval/core";
import { GuiConsole } from "../GuiConsole";
import { GuiTVC } from "../GuiTVC";

export class SetTransparentCommand extends ConsoleCommandBase {
    public CommandName: string = 'Set Transparent';

    public constructor(console: GuiConsole<GuiTVC>, public index: LazyValue<int>) {
        super(console);
    }

    public Execute(console: GuiConsole<GuiTVC>): void {
        console.tvc.currentScreen.setTransparent([this.index.Value], true);
    }
}