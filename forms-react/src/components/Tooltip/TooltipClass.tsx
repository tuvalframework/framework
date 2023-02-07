import { foreach, int, is } from "@tuval/core";
import React from "react";
import { AlignmentType, cBottom, cBottomLeading, cBottomTrailing, cCenter, cLeading, cTop, cTopLeading, cTopTrailing, cTrailing } from "../../Constants";
import { UIController } from "../../UIController";
import { UIViewClass } from "../UIView/UIViewClass";
import UIViewRenderer from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import TooltipRenderer from "./TooltipRenderer";
import HStackRenderer from "./TooltipRenderer";

export class TooltipClass extends UIViewClass {

    /** @internal */
    @ViewProperty() vp_Spacing: string;

    /** @internal */
    @ViewProperty() vp_Alignment: string;

    /** @internal */
    @ViewProperty() vp_Chidren: UIViewClass[];

    public children(...value: UIViewClass[]) {
        this.vp_Chidren = value;
        return this;
    }

    public constructor() {
        super();

    }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={TooltipRenderer}></UIViewRenderer>)
    }
}