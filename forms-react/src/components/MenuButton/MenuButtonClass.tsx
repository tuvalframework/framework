import { SubIcon } from "monday-ui-react-core/dist/types/types";
import React from "react";
import { UIView } from "../UIView/UIView";
import { UIViewRenderer } from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import ColorPickerRenderer from "./MenuButtonRenderer";
import ChipsRenderer from "./MenuButtonRenderer";


export interface IMenuItemModel {
    icon?: UIView | SubIcon;
    title?: string;
    type?: 'Divider' | 'MenuItem' | 'Title';
    onClick?: Function;

}
export class MenuButtonClass extends UIView {

    /** @internal */
    @ViewProperty() vp_Model: IMenuItemModel[];

    public model(value: IMenuItemModel[]) {
        this.vp_Model = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Icon: any;

    public icon(value: any) {
        this.vp_Icon = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Value: string;

    public value(value: string) {
        this.vp_Value = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_OnChange: Function;

    public onChange(value: Function) {
        this.vp_OnChange = value;
        return this;
    }
    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={ColorPickerRenderer}></UIViewRenderer>)
    }
}
