import { MultiComboBox } from "./MultiComboBox";

export abstract class MultiComboBoxItem {
    public Parent: MultiComboBox;
    public Key: string;
    public Text: string;
    public Tag: any;

    public abstract  GetItemTemplate(): any ;
    public abstract ToObject(): any ;
}