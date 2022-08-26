import { ComboBoxBase } from './ComboBoxBase';

export abstract class ComboBoxItem {
    public Parent: ComboBoxBase;
    public Key: string;
    public Text: string;
    public Tag: any;

    public abstract  GetItemTemplate(): any ;
    public abstract ToObject(): any ;
}