import { ClassInfo, Event } from "@tuval/core";
import { ControlTypes } from "../../ControlTypes";
import { Control } from "../Control";
import { ListBoxItem } from "./ListBoxItem";
import { ListBoxItemCollection } from "./ListBoxItemCollection";

@ClassInfo({
    fullName: ControlTypes.ListBoxBase,
    instanceof: [
        ControlTypes.ListBoxBase,
    ]
})
export abstract class ListBoxBase extends Control<ListBoxBase> {

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

    public get SelectedItem(): ListBoxItem {
        return this.GetProperty('SelectedItem');
    }
    public set SelectedItem(value: ListBoxItem) {
        this.SetProperty('SelectedItem', value);
    }

    public get Items(): ListBoxItemCollection {
        return this.GetProperty('Items');
    }

    public set Items(value: ListBoxItemCollection) {
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

    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.Items = new ListBoxItemCollection(this);
        this.Filter = false;
        this.Label = '';
        this.OnChanged = new Event();
    }
    public InitComponents() {

    }


}