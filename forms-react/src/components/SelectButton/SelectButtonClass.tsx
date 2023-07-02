import { SelectButtonChangeEvent, SelectItemOptionsType } from "primereact";
import React from "react";
import { UIView } from "../UIView/UIView";
import { UIViewRenderer } from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import SelectButtonRenderer from "./SelectButtonRenderer";


export class SelectButtonClass extends UIView {
    /** @internal */
    @ViewProperty() vp_Value: any | undefined;

    public value(value: any | undefined) {
        this.vp_Value = value;
        return this;
    }

     /** @internal */
     @ViewProperty() vp_Options: SelectItemOptionsType;

     public options(value: SelectItemOptionsType) {
         this.vp_Options = value;
         return this;
     }

       /** @internal */
       @ViewProperty() vp_OnChange: SelectButtonChangeEvent;

       public onChange(value: SelectButtonChangeEvent) {
           this.vp_OnChange = value;
           return this;
       }



    public constructor() {
        super();


    }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={SelectButtonRenderer}></UIViewRenderer>)
    }
}
