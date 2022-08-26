import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { is, Delegate, Event } from '@tuval/core';
import { InputText } from "../inputtext/TuInputText";
import { Control } from './Control';
import { DropdownComponent } from "../dropdown/DropDown";

export class TComboBox extends Control<TComboBox> {

    public get SelectedItem(): any {
        return this.GetProperty('SelectedItem');
    }
    public set SelectedItem(value: any) {
        this.SetProperty('SelectedItem', value);
    }

    public get Label(): string {
        return this.GetProperty('Label');
    }
    public set Label(value: string) {
        this.SetProperty('Label', value);
    }

    public CreateElements(): any {
        const citySelectItems = [
            { label: 'New York', value: 'NY' },
            { label: 'Rome', value: 'RM' },
            { label: 'London', value: 'LDN' },
            { label: 'Istanbul', value: 'IST' },
            { label: 'Paris', value: 'PRS' }
        ];

        return (
            <div className="p-field">
                <label htmlFor="firstname1">{this.Label}</label>
                <DropdownComponent value={this.SelectedItem} options={citySelectItems} onChange={(e) => this.SelectedItem = e.value} />
            </div>
        );
    }

}