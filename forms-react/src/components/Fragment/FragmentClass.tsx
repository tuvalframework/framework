import React from "react";
import { UIView } from "../UIView/UIView";
import {UIViewRenderer} from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import FragmentRenderer from "./FragmentRenderer";

export class FragmentClass extends UIView {

    /** @internal */
    @ViewProperty() vp_Children: UIView[];

    public children(value: UIView[]) {
        this.vp_Children = value;
        return this;
    }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={FragmentRenderer}></UIViewRenderer>)
    }
}
