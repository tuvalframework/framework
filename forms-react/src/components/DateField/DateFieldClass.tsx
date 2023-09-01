
import React from "react";
import { UIView } from "../UIView/UIView";
import {UIViewRenderer} from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import DateFieldRenderer from "./DateFieldRenderer";

export class DateFieldClass extends UIView {

     /** @internal */
     @ViewProperty() vp_DefaultValue: Date;

     public defaultValue(value: Date) {
         this.vp_DefaultValue = value;
         return this;
     }

    /** @internal */
    @ViewProperty() vp_Value: Date;

    public value(value: Date) {
       
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
        return (<UIViewRenderer wrap={false} control={this} renderer={DateFieldRenderer}></UIViewRenderer>)
    }
}
