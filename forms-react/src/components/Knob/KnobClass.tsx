import React from "react";
import { UIView } from "../UIView/UIView";
import UIViewRenderer from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import KnobRenderer from "./KnobRenderer";
import InputSwitchRenderer from "./KnobRenderer";
import { int } from '@tuval/core';

export class KnobClass extends UIView {
    /** @internal */
    @ViewProperty() vp_Value: int;

    public value(value: int) {
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
        return (<UIViewRenderer wrap={false} control={this} renderer={KnobRenderer}></UIViewRenderer>)
    }
}
