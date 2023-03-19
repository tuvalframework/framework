import React from "react";
import { UIView } from "../UIView/UIView";
import {UIViewRenderer} from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import InputSwitchRenderer from "./InputSwitchRenderer";

export class InputSwitchClass extends UIView {

     /** @internal */
     @ViewProperty() vp_OnLabel: string;

     public onlabel(value: string) {
         this.vp_OnLabel = value;
         return this;
     }

      /** @internal */
    @ViewProperty() vp_offLabel: string;

    public offlabel(value: string) {
        this.vp_offLabel = value;
        return this;
    }

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

    public constructor() {
        super();
        this.Appearance.Width = '60';
        this.Appearance.Height = '30';

    }
    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={InputSwitchRenderer}></UIViewRenderer>)
    }
}
