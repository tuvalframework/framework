import { List, foreach, int, is, BREAK } from '@tuval/core';
import { RibbonGroup } from './RibbonGroup';
import { RibbonMenu } from './RibbonMenu';
import { RibbonTab } from './RibbonTab';

export class RibbonGroupCollection extends List<RibbonGroup> {
    private __RibbonMenu__: RibbonMenu = null as any;
    public constructor(ribbonMenu:RibbonMenu) {
        super();
        this.__RibbonMenu__ = ribbonMenu;
    }

    public Add(text: string): RibbonGroup;
    public Add(treeNode: RibbonGroup): int
    public Add(...args: any[]): RibbonGroup | int {
        if (is.string(args[0])) {
            const text: string = args[0];
            const tab = new (RibbonGroup as any)(this.__RibbonMenu__);
            tab.Text = text;
            super.Add(tab);
            if (this.__RibbonMenu__ != null) {
                this.__RibbonMenu__.ForceUpdate();
            }
            return tab;
        } else {
            const treeNode: RibbonGroup = args[0];
            const result = super.Add(treeNode);
            if (this.__RibbonMenu__ != null) {
                this.__RibbonMenu__.ForceUpdate();
            }
            return result;
        }
    }
}
