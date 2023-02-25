import { foreach, int, is } from "@tuval/core";
import React from "react";
import { AlignmentType, cBottom, cBottomLeading, cBottomTrailing, cCenter, cLeading, cTop, cTopLeading, cTopTrailing, cTrailing } from "../../Constants";
import { UIController } from "../../UIController";
import { UIView } from "../UIView/UIView";
import {UIViewRenderer} from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import TooltipRenderer from "./TooltipRenderer";
import HStackRenderer from "./TooltipRenderer";

export class TooltipClass extends UIView {

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

    }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={TooltipRenderer}></UIViewRenderer>)
    }
}