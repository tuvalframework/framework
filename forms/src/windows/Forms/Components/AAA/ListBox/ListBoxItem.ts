import { ListBoxBase } from "./ListBoxBase";

export abstract class ListBoxItem {
    public Parent: ListBoxBase;
    public Key: string;
    public Text: string;
    public Tag: any;

    public abstract  GetItemTemplate(): any ;
    public abstract ToObject(): any ;
}