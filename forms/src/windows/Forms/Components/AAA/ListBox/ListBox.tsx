import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { is, Delegate, Event, List, int, foreach } from '@tuval/core';
import { Control } from "../Control";
import { ListBoxBase } from "./ListBoxBase";
import { ListBoxComponent } from "../../listbox/ListBox";

export class ListBox extends ListBoxBase {

    private GetItemTemplate(option: any, props) {
            return option.value.GetItemTemplate();
    }

    public CreateElements() {
        return (<ListBoxComponent
            style={this.GetStyleObject()}
            optionLabel='text'
            optionValue="value"
            value={this.SelectedItem}
            options={this.Items.ToObject()}
            onChange={(e) => {this.SelectedItem = e.value; this.OnChanged();}}
            placeholder={this.Placeholder}
            filter={this.Filter}
            showClear={this.Filter}
            itemTemplate={this.GetItemTemplate}
            filterBy="text" />);
    }
}