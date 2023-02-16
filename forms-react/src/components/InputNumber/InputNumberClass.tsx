import React from "react";
import { UIView } from "../UIView/UIView";
import UIViewRenderer from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import InputNumberRenderer from "./InputNumberRenderer";

export class InputNumberClass extends UIView {
    /** @internal */
    @ViewProperty() vp_Value: number;

    public value(value: number) {
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
        return (<UIViewRenderer wrap={false} control={this} renderer={InputNumberRenderer}></UIViewRenderer>)
    }
}
