import { int, is } from "@tuval/core";
import React from "react";
import { UIView } from "../UIView/UIView";
import { UIViewRenderer } from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import PopoverRenderer from "./PopoverRenderer";
import PopupButtonRenderer from "./PopoverRenderer";


export class PopoverClass extends UIView {

    /** @internal */
    @ViewProperty() vp_View: UIView;

    /** @internal */
    public view(value: UIView) {
        this.vp_View = value;
        return this;
    }
    
    /** @internal */
    @ViewProperty() vp_Children: UIView[];

    public children(value: UIView[]) {
        if (is.nullOrUndefined(value)) {
            this.vp_Children = [];
        } else {
            this.vp_Children = value;
        }
        return this;
    }
    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={PopoverRenderer}></UIViewRenderer>)
    }
}
