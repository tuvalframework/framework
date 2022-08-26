import { ConsoleCommandBase, int } from "@tuval/core";
import { LazyValue, lazy } from "@tuval/core";
import { GuiConsole } from "../GuiConsole";
import { GuiTVC } from "../GuiTVC";

export class ScreenCenterCommand extends ConsoleCommandBase {
    public CommandName: string = 'Screen';

    public constructor(console: GuiConsole<GuiTVC>,
        public index: LazyValue<int>,
        public centerX: LazyValue<boolean>,
        public centerY: LazyValue<boolean>) {
        super(console);
    }

    public Execute(console: GuiConsole<GuiTVC>): void {
        console.tvc.getScreen(this.index.Value).setCenter(this.centerX.Value ? console.tvc.platformTrue : 0, this.centerY.Value ? console.tvc.platformTrue : 0, '#update');
        // console.tvc.screenToFront(console.tvc.getScreen(this.index.Value));
    }
}