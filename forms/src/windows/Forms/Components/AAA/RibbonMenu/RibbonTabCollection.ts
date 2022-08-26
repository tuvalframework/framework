import { List, foreach, int, is, BREAK } from '@tuval/core';
import { RibbonMenu } from './RibbonMenu';
import { RibbonTab } from './RibbonTab';

export class RibbonTabCollection extends List<RibbonTab> {
    public RibbonMenu: RibbonMenu = null as any;
    public constructor(ribbonMenu:RibbonMenu) {
        super();
        this.RibbonMenu = ribbonMenu;
    }

    public Add(text: string): RibbonTab;
    public Add(treeNode: RibbonTab): int
    public Add(...args: any[]): RibbonTab | int {
        if (is.string(args[0])) {
            const text: string = args[0];
            const tab = new (RibbonTab as any)(this.RibbonMenu); // for private contructor.
            tab.Text = text;
            super.Add(tab);
            if (this.RibbonMenu != null) {
                this.RibbonMenu.ForceUpdate();
            }
            return tab;
        } else {
            const treeNode: RibbonTab = args[0];
            const result = super.Add(treeNode);
            if (this.RibbonMenu != null) {
                this.RibbonMenu.ForceUpdate();
            }
            return result;
        }
    }
    public ToModel(): any[] {
        return this.ToArray().map((tab:RibbonTab)=>{
            return tab.ToModel();
        });
    }
}
