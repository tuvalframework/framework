import { foreach, int, is } from "@tuval/core";
import React from "react";
import { AlignmentType, cBottom, cBottomLeading, cBottomTrailing, cCenter, cLeading, cTop, cTopLeading, cTopTrailing, cTrailing } from "../../Constants";
import { UIController } from "../../UIController";
import { UIView } from "../UIView/UIView";
import {UIViewRenderer} from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import TooltipRenderer from "./TooltipRenderer";
import HStackRenderer from "./TooltipRenderer";

export  enum TooltipPositions {
    LEFT = "left",
    LEFT_START = "left-start",
    LEFT_END = "left-end",
    RIGHT = "right",
    RIGHT_START = "right-start",
    RIGHT_END = "right-end",
    TOP = "top",
    TOP_START = "top-start",
    TOP_END = "top-end",
    BOTTOM = "bottom",
    BOTTOM_START = "bottom-start",
    BOTTOM_END = "bottom-end"
}

export class TooltipClass extends UIView {

     /** @internal */
     @ViewProperty() vp_TooltipPosition: TooltipPositions;
     public tooltipPosition(value: TooltipPositions) {
        this.vp_TooltipPosition = value;
     }

    /** @internal */
    @ViewProperty() vp_Spacing: string;

    /** @internal */
    @ViewProperty() vp_Alignment: string;

    /** @internal */
    @ViewProperty() vp_Chidren: UIView[];

    public children(...value: UIView[]) {
        this.vp_Chidren = value;
        return this;
    }

    public constructor() {
        super();
        this.vp_TooltipPosition = TooltipPositions.BOTTOM;

    }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={TooltipRenderer}></UIViewRenderer>)
    }
}