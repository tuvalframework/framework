import { IControl } from "../IControl";
import { Event } from '@tuval/core';

export interface ITextBox extends IControl {
    Autofocus:boolean;
    LeftIcon: string;
    Disabled:boolean;
    Placeholder: string;
    OnKeyDownInternal:Function;
}