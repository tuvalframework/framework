import { ConsoleCommandBase, LazyValue, int } from '@tuval/core';
import { GuiConsole } from '../GuiConsole';
import { GuiTVC } from '../GuiTVC';
export class ScreenDisplayCommand extends ConsoleCommandBase {
    public CommandName: string = 'Screen Display';

    public constructor(console: GuiConsole<GuiTVC>,
        public index: LazyValue<int>,
        public x: LazyValue<int>,
        public y: LazyValue<int>,
        public width: LazyValue<int>,
        public height: LazyValue<int>) {
        super(console);
    }

    public Execute(console: GuiConsole<GuiTVC>): void {
        console.tvc.getScreen(this.index.Value).setPosition({ x: this.x.Value, y: this.y.Value }, '#update');
        console.tvc.getScreen(this.index.Value).setSize({ width: this.width.Value, height: this.height.Value }, '#update');
    }
}