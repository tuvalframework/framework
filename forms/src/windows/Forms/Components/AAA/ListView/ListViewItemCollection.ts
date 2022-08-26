import { List, foreach, int, is, BREAK } from '@tuval/core';
import { ListView } from './ListView';
import { ListViewItem } from './ListViewItem';

export class ListViewItemCollection extends List<ListViewItem> {
    public ListView: ListView = null as any;
    public constructor(listView:ListView) {
        super();
        this.ListView = listView;
    }

    public Add(text: string, icon: string): ListViewItem;
    public Add(treeNode: ListViewItem): int
    public Add(...args: any[]): ListViewItem | int {
        if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const text: string = args[0];
            const icon: string = args[1];
            const tab = new ListViewItem();
            tab.Text = text;
            tab.Icon = icon;
            super.Add(tab);
            if (this.ListView != null) {
                this.ListView.ForceUpdate();
            }
            return tab;
        } else {
            const treeNode: ListViewItem = args[0];
            const result = super.Add(treeNode);
            if (this.ListView != null) {
                this.ListView.ForceUpdate();
            }
            return result;
        }
    }
}
