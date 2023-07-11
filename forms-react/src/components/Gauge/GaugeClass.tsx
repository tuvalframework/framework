import React from "react";
import { UIView } from "../UIView/UIView";
import { UIViewRenderer } from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import HeadingRenderer from "./GaugeRenderer";
import { int } from "@tuval/core";
import GaugeRenderer from "./GaugeRenderer";




export class GaugeClass extends UIView {
    /** @internal */
    @ViewProperty() vp_Color: string = 'blue';

    public color(value: string) {
        this.vp_Color = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_MaskColor: string = 'rgba(100, 100, 100, 0.2)';

    public maskColor(value: string) {
        this.vp_MaskColor = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Value: int;

    public value(value: int) {
        this.vp_Value = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Stroke: int;

    public stroke(value: int) {
        this.vp_Stroke = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Radius: int;

    public radius(value: int) {
        this.vp_Radius = value;
        return this;
    }



    public constructor() {
        super();
      
        this.vp_Color = 'blue';
        this.vp_MaskColor = 'rgba(100, 100, 100, 0.2)';
        this.vp_Value = 1;
        this.vp_Stroke = 1;
        this.vp_Radius  =100;

    }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={GaugeRenderer}></UIViewRenderer>)
    }
}
