import React from "react";
import { UIView } from "../UIView/UIView";
import UIViewRenderer from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import CodeEditorRenderer from "./CodeEditorRenderer";
import InputTextareaRenderer from "./CodeEditorRenderer";



export class CodeEditorClass extends UIView {
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
    public render() {
        return (<UIViewRenderer wrap={true} control={this} renderer={CodeEditorRenderer}></UIViewRenderer>)
    }
}
