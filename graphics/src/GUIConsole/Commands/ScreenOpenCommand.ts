import { ConsoleCommandBase, LazyValue, int, lazy } from '@tuval/core';
import { GuiConsole } from '../GuiConsole';
import { GuiTVC } from '../GuiTVC';

export class ScreenOpenCommand extends ConsoleCommandBase {
    public CommandName: string = 'Cls';

    public constructor(console: GuiConsole<GuiTVC>,
        public index: LazyValue<int>,
        public width: LazyValue<int>,
        public height: LazyValue<int>,
        public numberOfColor: LazyValue<int> = lazy(32),
        public pixelMode: LazyValue<int> = lazy(0),
        public columns: LazyValue<int> = lazy(undefined),
        public lines: LazyValue<int> = lazy(undefined),
        public tags$: LazyValue<int> = lazy(undefined),) {
        super(console);
    }

    public Execute(console: GuiConsole<GuiTVC>): void {
        console.tvc.screenOpen(
            {
            index:this.index.Value,
            width:this.width.Value,
            height:this.height.Value,
            depth:undefined,
            numberOfColors:this.numberOfColor.Value,
            pixelMode:0,
            palette:undefined,
            columns:this.columns.Value,
            lines:this.lines.Value,
            x:undefined,
            y:undefined,
            z:undefined,
            hotspotX:undefined,
            hotspotY:undefined,
            hotspotZ:undefined,
            offsetX:undefined,
            offsetY:undefined,
            offsetZ:undefined,
            skewX:undefined,
            skewY:undefined,
            skewZ:undefined,
            scaleX:undefined,
            scaleY:undefined,
            scaleZ:undefined,
            angle:undefined,
            alpha:undefined,
            visible:undefined
            }, this.tags$.Value);
    }
}