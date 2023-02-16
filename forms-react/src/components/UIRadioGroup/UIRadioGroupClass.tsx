import React from "react";
import { UIView } from '../UIView/UIView';
import UIViewRenderer from '../UIView/UIViewRenderer';
import { ViewProperty } from '../UIView/ViewProperty';
import UIRadioGroupRenderer from "./UIRadioGroupRenderer";
import UIAvatarRenderer from './UIRadioGroupRenderer';



export interface IRadioButton {
    value: string;
    label: string;
}

export class UIRadioGroupClass extends UIView {

    @ViewProperty() vp_RadioButtons: IRadioButton[];
    public radioButtons(value:IRadioButton[]): this {
        this.vp_RadioButtons = value;
        return this;
    }

    public constructor() {
        super();
    }


    public render() {
        return (<UIViewRenderer wrap={true} control={this} renderer={UIRadioGroupRenderer}></UIViewRenderer>)
    }
}
