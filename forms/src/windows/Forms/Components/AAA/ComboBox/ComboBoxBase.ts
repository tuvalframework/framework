import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { is, Delegate, Event, List, int, foreach, ClassInfo } from '@tuval/core';
import { Control } from "../Control";
import { ComboBoxItemCollection } from "./ComboBoxItemCollection";
import { ComboBoxItem } from "./ComboBoxItem";
import { ControlTypes } from "../../ControlTypes";
import { Property } from "../Reflection/PropertyDecorator";


@ClassInfo({
    fullName: ControlTypes.ComboBoxBase,
    instanceof: [
        ControlTypes.ComboBoxBase,
    ]
})
export abstract class ComboBoxBase extends Control<ComboBoxBase> {

    public get OnChanged(): any {
        return this.GetProperty('OnChanged');
    }
    public set OnChanged(value: any) {
        this.SetProperty('OnChanged', value);
    }

    public get Label(): string {
        return this.GetProperty('Label');
    }
    public set Label(value: string) {
        this.SetProperty('Label', value);
    }

    public get SelectedItem(): ComboBoxItem {
        return this.GetProperty('SelectedItem');
    }
    public set SelectedItem(value: ComboBoxItem) {
        this.SetProperty('SelectedItem', value);
    }

    public get Items(): ComboBoxItemCollection {
        return this.GetProperty('Items');
    }

    public set Items(value: ComboBoxItemCollection) {
        this.SetProperty('Items', value);
    }

    public get Placeholder(): string {
        return this.GetProperty('Placeholder');
    }

    public set Placeholder(value: string) {
        this.SetProperty('Placeholder', value);
    }
    public get Filter(): boolean {
        return this.GetProperty('Filter');
    }

    public set Filter(value: boolean) {
        this.SetProperty('Filter', value);
    }

    @Property()
    public Editable: boolean;

    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.Items = new ComboBoxItemCollection(this);
        this.Filter = false;
        this.Label = '';
        this.OnChanged = new Event();
        this.Editable = false;
    }
    public InitComponents() {

    }


}