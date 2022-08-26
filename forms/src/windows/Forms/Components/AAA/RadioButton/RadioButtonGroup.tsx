import { Teact } from '../../Teact';
import { RadioButtonComponent } from "../../radiobutton/RadioButton";
import { Control } from "../Control";
import { RadioGroupItemCollection } from './RadioButtonGroupItemCollection';
import { RadioButtonGroupItem } from './RadioGroupItem';
import { foreach, BREAK } from '@tuval/core';
import { DomHandler } from '../../DomHandler';
import { ReplaySubject } from 'rxjs';

const css = require('./RadioGroup.css');
DomHandler.addCssToDocument(css);

export class RadioButtonGroup extends Control<RadioButtonGroup> {
    public get Items(): RadioGroupItemCollection {
        return this.GetProperty('Items');
    }

    public set Items(value: RadioGroupItemCollection) {
        this.SetProperty('Items', value);
    }

    public get Value(): RadioButtonGroupItem {
        return this.GetProperty('Value');
    }
    public set Value(value: RadioButtonGroupItem) {
        this.SetProperty('Value', value);
    }

    public get Value$(): ReplaySubject<RadioButtonGroupItem> {
        return this.GetPipe('Value');
    }
    public set Value$(value: ReplaySubject<RadioButtonGroupItem>) {
        this.SetPipe('Value', value);
    }

    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.Items = new RadioGroupItemCollection(this);
    }

    private renderItems(): any {
        return this.Items.ToArray().map(item => {
            return (
                <div className="p-field-radiobutton">
                    <RadioButtonComponent inputId={this.Id + '_' + item.Key} value={item.Key} name={this.Id + '_group'} onChange={(e) => this.setValue(e.value)} checked={this.checkedValue(item.Key)}></RadioButtonComponent>
                    <label htmlFor={this.Id + '_' + item.Key}>{item.Text}</label>
                </div>
            );
        });
    }
    private setValue(key: string) {
        foreach(this.Items, (item: RadioButtonGroupItem) => {
            if (item.Key === key) {
                this.Value = item;
                return BREAK;
            }
        });
    }
    private checkedValue(key: string) {
        if (this.Value != null) {
            return this.Value.Key === key;
        }
        return false;
    }
    public CreateElements() {
        return (
            <div class='tuval-radio-button-group'>
                {this.renderItems()}
            </div>
        );
    }

}