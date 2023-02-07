import React from "react";
import { UIViewClass } from "../UIView/UIViewClass";
import UIViewRenderer from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import InputSwitchRenderer from "./InputSwitchRenderer";

export class InputSwitchClass extends UIViewClass {
    /** @internal */
    @ViewProperty() vp_Value: boolean;

    public value(value: boolean) {
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
        return (<UIViewRenderer wrap={false} control={this} renderer={InputSwitchRenderer}></UIViewRenderer>)
    }
}
