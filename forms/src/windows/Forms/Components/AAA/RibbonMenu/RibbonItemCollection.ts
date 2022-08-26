import { List, foreach, int, is, BREAK } from '@tuval/core';
import { RibbonGroup } from './RibbonGroup';
import { RibbonButton, RibbonItem } from './RibbonItem';
import { RibbonMenu } from './RibbonMenu';
import { RibbonTab } from './RibbonTab';

export class RibbonItemCollection extends List<RibbonItem> {
    private __RibbonMenu__: RibbonMenu = null as any;
    public constructor(ribbonMenu: RibbonMenu) {
        super();
        this.__RibbonMenu__ = ribbonMenu;
    }

    public AddButton(text: string, icon: string): RibbonButton {
        const tab = new RibbonButton();
        tab.Text = text;
        tab.Icon = icon;
        super.Add(tab);
        if (this.__RibbonMenu__ != null) {
            this.__RibbonMenu__.ForceUpdate();
        }
        return tab;
    }
}
