import React from "react";
import { UIView } from "../UIView/UIView";
import { UIViewRenderer } from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import IconRenderer from "./IconRenderer";

export class IconClass extends UIView {
    /** @internal */
    @ViewProperty() vp_Icon: string | any;

    public icon(value: string | any) {
        this.vp_Icon = value;
        return this;
    }

     /** @internal */
     @ViewProperty() vp_Icon2: string | any;

     public icon2(value: string | any) {
         this.vp_Icon2 = value;
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

    public constructor() {
        super();
        this.Appearance.Display = 'flex';
        this.Appearance.AlignItems = 'center';
    }
    public render() {
        return (<UIViewRenderer wrap={true} control={this} renderer={IconRenderer}></UIViewRenderer>)
    }
}
