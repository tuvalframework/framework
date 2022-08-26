import { RadioButtonGroup } from "./RadioButtonGroup";
import { Guid, ClassInfo } from '@tuval/core';
import { ControlTypes } from '../../ControlTypes';

@ClassInfo({
    fullName: ControlTypes.RadioButtonGroup.RadioButtonGroupItem,
    instanceof: [
        ControlTypes.RadioButtonGroup.RadioButtonGroupItem
    ]
})
export class RadioButtonGroupItem {
    public Parent: RadioButtonGroup;
    public Key: string;
    public Text: string;
    public Tag: any;

    public constructor(text: string);
    public constructor(key: string, text: string);
    public constructor(...args: any[]) {
        if (args.length === 1) {
            const text = args[0];
            this.Key = Guid.NewGuid().ToString();
            this.Text = text;
        } else if (args.length === 2) {
            this.Key = args[0];
            this.Text = args[1];
        }
    }
    public ToObject(): any {
        return {
            text: this.Text,
            value: this
        };
    }
}