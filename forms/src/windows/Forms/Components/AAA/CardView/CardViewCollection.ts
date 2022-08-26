import { List, foreach,  is, BREAK } from '@tuval/core';
import { CardViewItem } from './CardViewItem';
import { CardView } from './CardView';
import { int } from '@tuval/core';

export class CardViewItemCollection extends List<CardViewItem> {
    public ListView: CardView = null as any;
    public constructor(listView:CardView) {
        super();
        this.ListView = listView;
    }

    public Add(text: string, icon: string): CardViewItem;
    public Add(treeNode: CardViewItem): int
    public Add(...args: any[]): CardViewItem | int {
        if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const text: string = args[0];
            const icon: string = args[1];
            const tab = new CardViewItem();
            tab.Title = text;
            tab.Image = icon;
            tab.CardView = this.ListView;
            super.Add(tab);
            if (this.ListView != null) {
                this.ListView.ForceUpdate();
            }
            return tab;
        } else {
            const treeNode: CardViewItem = args[0];
            treeNode.CardView = this.ListView;
            const result = super.Add(treeNode);
            if (this.ListView != null) {
                this.ListView.ForceUpdate();
            }
            return result;
        }
    }
    public Clear(): int {
        const result = super.Clear();
        if (this.ListView != null) {
            this.ListView.ForceUpdate();
        }
        return result;

    }
}
