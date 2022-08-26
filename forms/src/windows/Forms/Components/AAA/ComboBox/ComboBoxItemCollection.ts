
import { List, foreach, int, is, BREAK, ArgumentOutOfRangeException } from '@tuval/core';
import { ControlTypes } from '../../ControlTypes';
import { ComboBoxBase } from './ComboBoxBase';
import { ComboBoxItem } from './ComboBoxItem';
import { TextComboBoxItem } from './TextComboBoxItem';
export class ComboBoxItemCollection extends List<ComboBoxItem> {
    public ComboBox: ComboBoxBase = null as any;
    public constructor(comboBox:ComboBoxBase) {
        super();
        this.ComboBox = comboBox;
    }

    public Add(text: string): ComboBoxItem;
    public Add(key: int, text: string): ComboBoxItem;
    public Add(key: string, text: string): ComboBoxItem;
    public Add(treeNode: ComboBoxItem): int
    public Add(...args: any[]): ComboBoxItem | int {
        if (args.length === 1 && is.string(args[0])) {
            const text: string = args[0];
            const treeNode = new TextComboBoxItem(text);
            super.Add(treeNode);
            if (this.ComboBox != null) {
                this.SetComboBox(treeNode);
                this.ComboBox.ForceUpdate();
            }
            return treeNode;
        } else if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const key: string = args[0];
            const text = args[1];
            const treeNode = new TextComboBoxItem(key, text);
            super.Add(treeNode);
            if (this.ComboBox != null) {
                this.SetComboBox(treeNode);
                this.ComboBox.ForceUpdate();
            }
            return treeNode;
        } else if (args.length === 2 && is.int(args[0]) && is.string(args[1])) {
            const key: int = args[0];
            const text = args[1];
            const treeNode = new TextComboBoxItem(key.toString(), text);
            super.Add(treeNode);
            if (this.ComboBox != null) {
                this.SetComboBox(treeNode);
                this.ComboBox.ForceUpdate();
            }
            return treeNode;
        } else if (args.length === 1 && is.typeof<ComboBoxItem>(args[0], ControlTypes.TreeView.TreeNode) ){
            const treeNode: ComboBoxItem = args[0];
            const result = super.Add(treeNode);
            if (this.ComboBox != null) {
                this.SetComboBox(treeNode);
                this.ComboBox.ForceUpdate();
            }
            return result;
        }

        throw new  ArgumentOutOfRangeException('ComboBoxItemCollection::Add');
    }

    public Clear(): int {
        const result = super.Clear();
        this.ComboBox.ForceUpdate();
        return result;
    }
    private SetComboBox(comboBoxItem: ComboBoxItem): void {
        comboBoxItem.Parent = this.ComboBox;
    }

    /* public GetByKey(key: string): ComboBoxItem {
        let result: ComboBoxItem = null as any;
        foreach(this, (item: ComboBoxItem) => {
            if (item === key) {
                result = item;
                return BREAK;
            }
        });
        return result;
    } */

    public ToObject(): any[] {
        const nodes: any[] = [];
        foreach(this, (item: ComboBoxItem) => {
            nodes.push(item.ToObject());
        });
        return nodes;
    }

}
