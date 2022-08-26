import { ConsoleCommandBase, int } from "@tuval/core";
import { LazyValue, lazy } from "@tuval/core";
import { GuiConsole } from "../GuiConsole";
import { GuiTVC } from "../GuiTVC";

export class ScreenCommand extends ConsoleCommandBase {
    public CommandName: string = 'Screen';

    public constructor(console: GuiConsole<GuiTVC>, public index: LazyValue<int>) {
        super(console);
    }

    public Execute(console: GuiConsole<GuiTVC>): void {
        console.tvc.setScreen(this.index.Value);
       // console.tvc.screenToFront(console.tvc.getScreen(this.index.Value));
    }
}