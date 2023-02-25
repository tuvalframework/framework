import React from "react";
import { UIView } from "../UIView/UIView";
import {UIViewRenderer} from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import UIViewBuilderRenderer from "./UIViewBuilderRenderer";

export class UIViewBuilderClass extends UIView {

    @ViewProperty() vp_Content: () => UIView;
    public _content(value: () => UIView): this {
        this.vp_Content = value;
        return this;
    }

    public constructor() {
        super();
    }


    public render() {
        return (<UIViewBuilderRenderer control={this} ></UIViewBuilderRenderer>)
    }
}
