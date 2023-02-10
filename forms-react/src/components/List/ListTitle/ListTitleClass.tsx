import React from "react";
import { UIViewClass } from "../../UIView/UIViewClass";
import UIViewRenderer from "../../UIView/UIViewRenderer";
import { ViewProperty } from "../../UIView/ViewProperty";
import ListTitleRenderer from "./ListTitleRenderer";

import ListRenderer from "./ListTitleRenderer";
import ListBoxRenderer from "./ListTitleRenderer";

export class ListTitleClass extends UIViewClass {

    /** @internal */
    @ViewProperty() vp_Title: string;

    public title(value: string) {
        this.vp_Title = value;
        return this;
    }


    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={ListTitleRenderer}></UIViewRenderer>)
    }
}
