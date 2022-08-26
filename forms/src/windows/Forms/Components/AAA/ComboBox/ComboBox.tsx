import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { is, Delegate, Event, List, int, foreach } from '@tuval/core';
import { Control } from "../Control";
import { ComboBoxItemCollection } from "./ComboBoxItemCollection";
import { ComboBoxBase } from "./ComboBoxBase";
import { DropdownComponent } from "../../dropdown/DropDown";
import { ComboBoxItem } from "./ComboBoxItem";

export class ComboBox extends ComboBoxBase {

    private GetItemTemplate(option: any, props) {
            return option.value.GetItemTemplate();
    }

    public CreateElements() {
        return (<DropdownComponent
            style={this.GetStyleObject()}
            optionLabel='text'
            optionValue="value"
            value={this.SelectedItem}
            options={this.Items.ToObject()}
            onChange={(e) => {this.SelectedItem = e.value; this.OnChanged(e.value);}}
            placeholder={this.Placeholder}
            filter={this.Filter}
            showClear={this.Filter}
            editable={this.Editable}
            itemTemplate={this.GetItemTemplate}
            filterBy="text" />);
    }
}