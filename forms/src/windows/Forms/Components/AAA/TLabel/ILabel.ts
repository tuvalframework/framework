import { IControl } from "../IControl";

export interface ILabel extends IControl {
    HtmlFor: string;
    TextAlign: string;
}
