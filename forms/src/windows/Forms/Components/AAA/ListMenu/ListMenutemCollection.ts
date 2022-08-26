import { List, foreach, int, is, BREAK } from '@tuval/core';
import { ListMenuItem, ListMenuItemBase } from './ListMenuItem';
import { ListMenu } from './ListMenu';

export class ListMenuItemCollection extends List<ListMenuItemBase> {
    public ListView: ListMenu = null as any;
    public constructor(listView: ListMenu) {
        super();
        this.ListView = listView;
    }

    public Add(text: string/* , icon: string */): ListMenuItem;
  /*   public Add(text: string, icon: string, selectedIcon: string): ListMenuItem;
    public Add(text: string, icon: string, selectedIcon: string,icon2: string, selectedIcon2: string ): ListMenuItem; */
    public Add(treeNode: ListMenuItemBase): int
    public Add(...args: any[]): ListMenuItemBase | int {
        if (args.length === 1 && is.string(args[0]) /* && is.string(args[1]) */) {
            const text: string = args[0];
            const icon: string = args[1];
            const tab = new ListMenuItem();
            tab.Parent = this.ListView;
            tab.Text = text;
            tab.Image = icon;
            super.Add(tab);
            if (this.ListView != null) {
                this.ListView.ForceUpdate();
            }
            return tab;
        } else if (args.length === 3 && is.string(args[0]) && is.string(args[1]) && is.string(args[2])) {
            const text: string = args[0];
            const icon: string = args[1];
            const iconSelected: string = args[2];
            const tab = new ListMenuItem();
            tab.Parent = this.ListView;
            tab.Text = text;
            tab.Image = icon;
            tab.ImageSelected = iconSelected;
            super.Add(tab);
            if (this.ListView != null) {
                this.ListView.ForceUpdate();
            }
            return tab;
        } else if (args.length === 5 && is.string(args[0]) && is.string(args[1]) && is.string(args[2])) {
            const text: string = args[0];
            const icon: string = args[1];
            const iconSelected: string = args[2];
            const icon2: string = args[3];
            const iconSelected2: string = args[4];
            const tab = new ListMenuItem();
            tab.Parent = this.ListView;
            tab.Text = text;
            tab.Image = icon;
            tab.ImageSelected = iconSelected;
            tab.ImageRight = icon2;
            tab.ImageRightSelected = iconSelected2;
            super.Add(tab);
            if (this.ListView != null) {
                this.ListView.ForceUpdate();
            }
            return tab;
        } else {
            const treeNode: ListMenuItemBase = args[0];
            treeNode.Parent = this.ListView;
            const result = super.Add(treeNode);
            if (this.ListView != null) {
                this.ListView.ForceUpdate();
            }
            return result;
        }
    }
}
