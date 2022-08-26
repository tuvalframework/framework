
import { List, foreach, int, is, BREAK, ArgumentOutOfRangeException } from '@tuval/core';
import { ControlTypes } from '../../ControlTypes';
import { ListBoxBase } from './ListBoxBase';
import { ListBoxItem } from './ListBoxItem';
import { TextListBoxItem } from './TextListBoxItem';

export class ListBoxItemCollection extends List<ListBoxItem> {
    public ListBox: ListBoxBase = null as any;
    public constructor(ListBox:ListBoxBase) {
        super();
        this.ListBox = ListBox;
    }

    public Add(text: string): ListBoxItem;
    public Add(key: int, text: string): ListBoxItem;
    public Add(key: string, text: string): ListBoxItem;
    public Add(treeNode: ListBoxItem): int
    public Add(...args: any[]): ListBoxItem | int {
        if (args.length === 1 && is.string(args[0])) {
            const text: string = args[0];
            const treeNode = new TextListBoxItem(text);
            super.Add(treeNode);
            if (this.ListBox != null) {
                this.SetListBox(treeNode);
                this.ListBox.ForceUpdate();
            }
            return treeNode;
        } else if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const key: string = args[0];
            const text = args[1];
            const treeNode = new TextListBoxItem(key, text);
            super.Add(treeNode);
            if (this.ListBox != null) {
                this.SetListBox(treeNode);
                this.ListBox.ForceUpdate();
            }
            return treeNode;
        } else if (args.length === 2 && is.int(args[0]) && is.string(args[1])) {
            const key: int = args[0];
            const text = args[1];
            const treeNode = new TextListBoxItem(key.toString(), text);
            super.Add(treeNode);
            if (this.ListBox != null) {
                this.SetListBox(treeNode);
                this.ListBox.ForceUpdate();
            }
            return treeNode;
        } else if (args.length === 1 && is.typeof<ListBoxItem>(args[0], ControlTypes.TreeView.TreeNode) ){
            const treeNode: ListBoxItem = args[0];
            const result = super.Add(treeNode);
            if (this.ListBox != null) {
                this.SetListBox(treeNode);
                this.ListBox.ForceUpdate();
            }
            return result;
        }

        throw new  ArgumentOutOfRangeException('ListBoxItemCollection::Add');
    }

    public Clear(): int {
        const result = super.Clear();
        this.ListBox.ForceUpdate();
        return result;
    }
    private SetListBox(ListBoxItem: ListBoxItem): void {
        ListBoxItem.Parent = this.ListBox;
    }

    /* public GetByKey(key: string): ListBoxItem {
        let result: ListBoxItem = null as any;
        foreach(this, (item: ListBoxItem) => {
            if (item === key) {
                result = item;
                return BREAK;
            }
        });
        return result;
    } */

    public ToObject(): any[] {
        const nodes: any[] = [];
        foreach(this, (item: ListBoxItem) => {
            nodes.push(item.ToObject());
        });
        return nodes;
    }

}
