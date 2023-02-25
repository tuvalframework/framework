import React from "react";
import { UIView } from "../UIView/UIView";
import {UIViewRenderer} from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import CalendarRenderer from "./CalendarRenderer";
import AutoCompleteRenderer from "./CalendarRenderer";




export class CalendarClass extends UIView {


    /** @internal */
    @ViewProperty() vp_Value: Date;

    public value(value: Date) {
        this.vp_Value = value;
        return this;
    }

     /** @internal */
     @ViewProperty() vp_ShowIcon: boolean;

     public showIcon(value: boolean) {
         this.vp_ShowIcon = value;
         return this;
     }

     /** @internal */
     @ViewProperty() vp_OnChange: Function;

     public onChange(value: Function) {
         this.vp_OnChange = value;
         return this;
     }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={CalendarRenderer}></UIViewRenderer>)
    }
}
