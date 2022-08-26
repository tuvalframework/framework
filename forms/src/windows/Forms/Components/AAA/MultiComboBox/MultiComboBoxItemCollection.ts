
import { List, foreach, int, is, BREAK, ArgumentOutOfRangeException } from '@tuval/core';
import { ControlTypes } from '../../ControlTypes';
import { MultiComboBox } from './MultiComboBox';
import { MultiComboBoxItem } from './MultiComboBoxItem';
import { TextMultiComboBoxItem } from './TextMultiComboBoxItem';

export class MultiComboBoxItemCollection extends List<MultiComboBoxItem> {
    public ComboBox: MultiComboBox = null as any;
    public constructor(comboBox:MultiComboBox) {
        super();
        this.ComboBox = comboBox;
    }

    public Add(text: string): MultiComboBoxItem;
    public Add(key: int, text: string): MultiComboBoxItem;
    public Add(key: string, text: string): MultiComboBoxItem;
    public Add(treeNode: MultiComboBoxItem): int
    public Add(...args: any[]): MultiComboBoxItem | int {
        if (args.length === 1 && is.string(args[0])) {
            const text: string = args[0];
            const treeNode = new TextMultiComboBoxItem(text);
            super.Add(treeNode);
            if (this.ComboBox != null) {
                this.SetComboBox(treeNode);
                this.ComboBox.ForceUpdate();
            }
            return treeNode;
        } else if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const key: string = args[0];
            const text = args[1];
            const treeNode = new TextMultiComboBoxItem(key, text);
            super.Add(treeNode);
            if (this.ComboBox != null) {
                this.SetComboBox(treeNode);
                this.ComboBox.ForceUpdate();
            }
            return treeNode;
        } else if (args.length === 2 && is.int(args[0]) && is.string(args[1])) {
            const key: int = args[0];
            const text = args[1];
            const treeNode = new TextMultiComboBoxItem(key.toString(), text);
            super.Add(treeNode);
            if (this.ComboBox != null) {
                this.SetComboBox(treeNode);
                this.ComboBox.ForceUpdate();
            }
            return treeNode;
        } else if (args.length === 1 && is.typeof<MultiComboBoxItem>(args[0], ControlTypes.TreeView.TreeNode) ){
            const treeNode: MultiComboBoxItem = args[0];
            const result = super.Add(treeNode);
            if (this.ComboBox != null) {
                this.SetComboBox(treeNode);
                this.ComboBox.ForceUpdate();
            }
            return result;
        }

        throw new  ArgumentOutOfRangeException('MultiComboBoxItemCollection::Add');
    }

    public Clear(): int {
        const result = super.Clear();
        this.ComboBox.ForceUpdate();
        return result;
    }
    private SetComboBox(comboBoxItem: MultiComboBoxItem): void {
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
        foreach(this, (item: MultiComboBoxItem) => {
            nodes.push(item.ToObject());
        });
        return nodes;
    }

}
