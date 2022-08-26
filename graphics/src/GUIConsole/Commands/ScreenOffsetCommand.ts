import { ConsoleCommandBase, LazyValue, int } from '@tuval/core';
import { GuiConsole } from '../GuiConsole';
import { GuiTVC } from '../GuiTVC';
export class ScreenOffsetCommand extends ConsoleCommandBase {
    public CommandName: string = 'Screen Offset';

    public constructor(console: GuiConsole<GuiTVC>,
        public index: LazyValue<int>,
        public x: LazyValue<int>,
        public y: LazyValue<int>) {
        super(console);
    }

    public Execute(console: GuiConsole<GuiTVC>): void {
        console.tvc.getScreen(this.index.Value).setOffset({ x: this.x.Value, y: this.y.Value }, '#update');
    }
}