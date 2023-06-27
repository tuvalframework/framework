import { int } from "@tuval/core";
import { UIView } from "../UIView/UIView";
import { ViewProperty } from "../UIView/ViewProperty";
import React from "react";
import { UIViewRenderer } from "../UIView/UIViewRenderer";
import UIProgressBarRenderer from "./UIProgressBarRenderer";

export class UIProgressBarClass extends UIView {

    /** @internal */
    @ViewProperty() vp_value: int;
    public value(value: int): this {
        this.vp_value = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_LabelOffset: int;
    public labelOffset(value: int): this {
        this.vp_LabelOffset = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_ValueTemplate: (option: any) => UIView;
    public valueTemplate(value: (option: any) => UIView): this {
        this.vp_ValueTemplate = value;
        return this;
    }


    public constructor() {
        super();

        this.Appearance.Width = '100%';
        this.Appearance.Height = '20px';
    }

    public render() {
        return (<UIViewRenderer wrap={true} control={this} renderer={UIProgressBarRenderer}></UIViewRenderer>)
    }

}