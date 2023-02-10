import React from "react";
import { UIViewClass } from "../UIView/UIViewClass";
import UIViewRenderer from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import ListRenderer from "./ListRenderer";
import ListBoxRenderer from "./ListRenderer";

export class ListClass extends UIViewClass {

    /** @internal */
    @ViewProperty() vp_Children: UIViewClass[];

    public children(value: UIViewClass[]) {
        this.vp_Children = value;
        return this;
    }


     /** @internal */
     @ViewProperty() vp_OnChange: Function;

     public onChange(value: Function) {
         this.vp_OnChange = value;
         return this;
     }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={ListRenderer}></UIViewRenderer>)
    }
}
