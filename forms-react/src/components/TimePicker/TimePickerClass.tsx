
import React, { FunctionComponent } from "react";
import { UIView } from "../UIView/UIView";
import { UIViewRenderer } from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import { TimePickerProperties } from "./TimePickerProperties";

export class TimePickerClass extends UIView implements TimePickerProperties{

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
       
    /** @internal */
    @ViewProperty() vp_Renderer: FunctionComponent<any>;

    public renderer(value: FunctionComponent<any>) {
        this.vp_Renderer = value;
        return this;
    }
    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={this.vp_Renderer}></UIViewRenderer>)
    }
}
