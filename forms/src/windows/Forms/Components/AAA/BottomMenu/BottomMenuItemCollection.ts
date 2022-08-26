import { List, foreach, int, is, BREAK } from '@tuval/core';
import { BottomMenu } from './BottomMenu';
import { BottomMenuItem } from './BottomMenuItem';


export class BottomMenuItemCollection extends List<BottomMenuItem> {
    public ListView: BottomMenu = null as any;
    public constructor(listView: BottomMenu) {
        super();
        this.ListView = listView;
    }

    public Add( icon: string): BottomMenuItem;
    public Add(treeNode: BottomMenuItem): int
    public Add(...args: any[]): BottomMenuItem | int {
        if (args.length === 1 && is.string(args[0]) ) {
            const icon: string = args[0];
            const tab = new BottomMenuItem(this.ListView);
            tab.Icon = icon;
            super.Add(tab);
            if (this.ListView != null) {
                this.ListView.ForceUpdate();
            }
            return tab;
        } else {
            const treeNode: BottomMenuItem = args[0];
            const result = super.Add(treeNode);
            if (this.ListView != null) {
                this.ListView.ForceUpdate();
            }
            return result;
        }
    }
}
