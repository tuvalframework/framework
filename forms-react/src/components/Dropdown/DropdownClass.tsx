import React from "react";
import { UIView } from "../UIView/UIView";
import UIViewRenderer from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import PrimeRenderer from "./Renderers/PrimeRenderer";
import VibeRenderer from "./Renderers/VibeRenderer";

export class DropdownClass extends UIView {

    @ViewProperty() vp_fields: {text: string, value: string};
    public fields(value: {text: string, value: string}): this {
        this.vp_fields = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Value: string;

    public value(value: string) {
        this.vp_Value = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Model: object[];

    public model(value: object[]) {
        this.vp_Model = value;
        return this;
    }

     /** @internal */
     @ViewProperty() vp_OnChange: Function;

     public onChange(value: Function) {
         this.vp_OnChange = value;
         return this;
     }
    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={VibeRenderer}></UIViewRenderer>)
    }
}
