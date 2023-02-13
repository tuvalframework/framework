import React from "react";
import { UIViewClass } from "../UIView/UIViewClass";
import UIViewRenderer from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import IconRenderer from "./IconRenderer";

export class IconClass extends UIViewClass {
    /** @internal */
    @ViewProperty() vp_Icon: string | any;

    public icon(value: string | any) {
        this.vp_Icon = value;
        return this;
    }

     /** @internal */
     @ViewProperty(16) vp_Size: string | number;

     public size(value: string | number) {
         this.vp_Size = value;
         return this;
     }

    /** @internal */
    @ViewProperty() vp_IconType: string;

    public iconType(value: string) {
        this.vp_IconType = value;
        return this;
    }
    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={IconRenderer}></UIViewRenderer>)
    }
}
