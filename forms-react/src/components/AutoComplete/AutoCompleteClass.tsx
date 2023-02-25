import React from "react";
import { UIView } from "../UIView/UIView";
import {UIViewRenderer} from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import AutoCompleteRenderer from "./AutoCompleteRenderer";




export class AutoCompleteClass extends UIView {

    /** @internal */
    @ViewProperty() vp_Field: string;

    public field(value: string) {
        this.vp_Field = value;
        return this;
    }

      /** @internal */
      @ViewProperty() vp_DataSource: object[];

      public datasource(value: object[]) {
          this.vp_DataSource = value;
          return this;
      }

    /** @internal */
    @ViewProperty() vp_Value: string;

    public value(value: string) {
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
       @ViewProperty() vp_CompleteMethod: Function;

       public completeMethod(value: Function) {
           this.vp_CompleteMethod = value;
           return this;
       }
    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={AutoCompleteRenderer}></UIViewRenderer>)
    }
}
