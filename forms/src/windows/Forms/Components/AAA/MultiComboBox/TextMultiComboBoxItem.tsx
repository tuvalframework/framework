
import { Guid } from '@tuval/core';
import { Teact } from '../../Teact';
import { MultiComboBoxItem } from './MultiComboBoxItem';

export class TextMultiComboBoxItem extends MultiComboBoxItem {


    public constructor(text: string);
    public constructor(key: string, text: string);
    public constructor(...args: any[]) {
        super();
        if (args.length === 1) {
            const text = args[0];
            this.Key = Guid.NewGuid().ToString();
            this.Text = text;
        } else if (args.length === 2) {
            this.Key = args[0];
            this.Text = args[1];
        }
    }
    public GetItemTemplate() {
       return ( <div>{this.Text}</div>);
    }

    public ToObject(): any {
        return {
            text: this.Text,
            value: this
        };
    }
}