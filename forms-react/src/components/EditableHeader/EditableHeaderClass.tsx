import React from "react";
import { UIView } from "../UIView/UIView";
import { UIViewRenderer } from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import EditableHeaderRenderer from "./EditableHeaderRenderer";


export enum EditableHeadingTypes {
    h1 = "h1",
    h2 = "h2",
    h3 = "h3",
    h4 = "h4",
    h5 = "h5",
    h6 = "h6"
}
export enum EditableHeadingSizes {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
    XXS = "xxs",
    XS = "xs"
}


export class EditableHeaderClass extends UIView {
    /** @internal */
    @ViewProperty() vp_Value: string;

    public value(value: string) {
        this.vp_Value = value;
        return this;
    }

     /** @internal */
     @ViewProperty(EditableHeadingTypes.h3) vp_Type: EditableHeadingTypes;

     public type(value: EditableHeadingTypes) {
         this.vp_Type = value;
         return this;
     }

    /** @internal */
    @ViewProperty(EditableHeadingSizes.MEDIUM) vp_Size: EditableHeadingSizes;

    public size(value: EditableHeadingSizes) {
        this.vp_Size = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_OnChange: Function;

    public onChange(value: Function) {
        this.vp_OnChange = value;
        return this;
    }
    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={EditableHeaderRenderer}></UIViewRenderer>)
    }
}
