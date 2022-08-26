import { ConsoleCommandBase, LazyValue } from '@tuval/core';
import { int } from '../../index_web';
import { GuiConsole } from '../GuiConsole';
import { GuiTVC } from '../GuiTVC';

export class PasteBobCommand extends ConsoleCommandBase {
    public CommandName: string = 'Paste Bob';

    public constructor(console: GuiConsole<GuiTVC>,
        public x: LazyValue<int>,
        public y: LazyValue<int>,
        public imageIndex: LazyValue<int>) {
        super(console);
    }

    public Execute(console: GuiConsole<GuiTVC>): void {
        console.tvc.currentScreen.pasteImage('images', this.imageIndex.Value, this.x.Value, this.y.Value, 1, 1, -((0) * this.console.tvc.degreeRadian), 1);
    }
}