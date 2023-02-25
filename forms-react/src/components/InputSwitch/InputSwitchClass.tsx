import React from "react";
import { UIView } from "../UIView/UIView";
import {UIViewRenderer} from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import InputSwitchRenderer from "./InputSwitchRenderer";

export class InputSwitchClass extends UIView {
    /** @internal */
    @ViewProperty() vp_Checked: boolean;

    public checked(value: boolean) {
        this.vp_Checked = value;
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
