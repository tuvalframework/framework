import React from "react";
import { UIViewClass } from "../UIView/UIViewClass";
import UIViewRenderer from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import FragmentRenderer from "./FragmentRenderer";

export class FragmentClass extends UIViewClass {

    /** @internal */
    @ViewProperty() vp_Children: UIViewClass[];

    public children(value: UIViewClass[]) {
        this.vp_Children = value;
        return this;
    }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={FragmentRenderer}></UIViewRenderer>)
    }
}
