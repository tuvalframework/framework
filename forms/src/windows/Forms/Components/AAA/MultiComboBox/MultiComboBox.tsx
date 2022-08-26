import React, { createElement, Fragment } from "../../../../../preact/compat";
import { MultiSelect } from "../../multiselect/MultiSelect";
import { Teact } from '../../Teact';
import { Control } from "../Control";
import { Property } from "../Reflection/PropertyDecorator";
import { ClassInfo } from '@tuval/core';
import { ControlTypes } from "../../ControlTypes";
import { MultiComboBoxItemCollection } from './MultiComboBoxItemCollection';
import { TextMultiComboBoxItem } from './TextMultiComboBoxItem';

@ClassInfo({
    fullName: ControlTypes.ComboBoxBase,
    instanceof: [
        ControlTypes.ComboBoxBase,
    ]
})
export class MultiComboBox extends Control<MultiComboBox> {
    @Property()
    public Label: string;

    @Property()
    public Placeholder: string;

    @Property()
    public SelectedItems: TextMultiComboBoxItem[];

    @Property()
    public Items: MultiComboBoxItemCollection;

    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.Label = '';
        this.Placeholder = '';
        this.SelectedItems = [];
        this.Items = new MultiComboBoxItemCollection(this);
    }

    public CreateElements() {
        return (<MultiSelect
            value={this.SelectedItems}
            options={this.Items.ToObject()}
            onChange={(e) => {
                console.log(e.value);
                this.SelectedItems = e.value;
            }}
            optionLabel="text"
            placeholder={this.Placeholder}
            display="chip" />);
    }

}