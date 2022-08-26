import { ConsoleCommandBase, int } from "@tuval/core";
import { LazyValue, lazy } from "@tuval/core";
import { GuiConsole } from "../GuiConsole";
import { GuiTVC } from "../GuiTVC";

export class ScreenToFrontCommand extends ConsoleCommandBase {
    public CommandName: string = 'ScreenToFront';

    public constructor(console: GuiConsole<GuiTVC>, public index: LazyValue<int>) {
        super(console);
    }

    public Execute(console: GuiConsole<GuiTVC>): void {
        console.tvc.screenToFront(console.tvc.getScreen(this.index.Value));
    }
}