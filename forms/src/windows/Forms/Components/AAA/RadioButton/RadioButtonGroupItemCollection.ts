
import { List, foreach, int, is, BREAK, ArgumentOutOfRangeException } from '@tuval/core';
import { ControlTypes } from '../../ControlTypes';
import { RadioButtonGroup } from './RadioButtonGroup';
import { RadioButtonGroupItem } from './RadioGroupItem';

export class RadioGroupItemCollection extends List<RadioButtonGroupItem> {
    public RadioButtonGroup: RadioButtonGroup = null as any;
    public constructor(comboBox:RadioButtonGroup) {
        super();
        this.RadioButtonGroup = comboBox;
    }

    public Add(text: string): RadioButtonGroupItem;
    public Add(key: int, text: string): RadioButtonGroupItem;
    public Add(key: string, text: string): RadioButtonGroupItem;
    public Add(treeNode: RadioButtonGroupItem): int
    public Add(...args: any[]): RadioButtonGroupItem | int {
        if (args.length === 1 && is.string(args[0])) {
            const text: string = args[0];
            const treeNode = new RadioButtonGroupItem(text);
            super.Add(treeNode);
            if (this.RadioButtonGroup != null) {
                this.SetRadioGroup(treeNode);
                this.RadioButtonGroup.ForceUpdate();
            }
            return treeNode;
        } else if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const key: string = args[0];
            const text = args[1];
            const treeNode = new RadioButtonGroupItem(key, text);
            super.Add(treeNode);
            if (this.RadioButtonGroup != null) {
                this.SetRadioGroup(treeNode);
                this.RadioButtonGroup.ForceUpdate();
            }
            return treeNode;
        } else if (args.length === 2 && is.int(args[0]) && is.string(args[1])) {
            const key: int = args[0];
            const text = args[1];
            const treeNode = new RadioButtonGroupItem(key.toString(), text);
            super.Add(treeNode);
            if (this.RadioButtonGroup != null) {
                this.SetRadioGroup(treeNode);
                this.RadioButtonGroup.ForceUpdate();
            }
            return treeNode;
        } else if (args.length === 1 && is.typeof<RadioButtonGroupItem>(args[0], ControlTypes.RadioButtonGroup.RadioButtonGroupItem) ){
            const treeNode: RadioButtonGroupItem = args[0];
            const result = super.Add(treeNode);
            if (this.RadioButtonGroup != null) {
                this.SetRadioGroup(treeNode);
                this.RadioButtonGroup.ForceUpdate();
            }
            return result;
        }

        throw new  ArgumentOutOfRangeException('RadioGroupItemCollection::Add');
    }

    public Clear(): int {
        const result = super.Clear();
        this.RadioButtonGroup.ForceUpdate();
        return result;
    }
    private SetRadioGroup(comboBoxItem: RadioButtonGroupItem): void {
        comboBoxItem.Parent = this.RadioButtonGroup;
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
        foreach(this, (item: RadioButtonGroupItem) => {
            nodes.push(item.ToObject());
        });
        return nodes;
    }

}
