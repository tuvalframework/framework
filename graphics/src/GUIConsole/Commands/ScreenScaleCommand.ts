import { ConsoleCommandBase, LazyValue, int } from '@tuval/core';
import { GuiConsole } from '../GuiConsole';
import { GuiTVC } from '../GuiTVC';
export class ScreenScaleCommand extends ConsoleCommandBase {
    public CommandName: string = 'Screen Scale';

    public constructor(console: GuiConsole<GuiTVC>,
        public index: LazyValue<int>,
        public xScale: LazyValue<int>,
        public yScale: LazyValue<int>) {
        super(console);
    }

    public Execute(console: GuiConsole<GuiTVC>): void {
        console.tvc.getScreen(this.index.Value).setScale({x:this.xScale.Value,y:this.yScale.Value},'#update');
    }
}