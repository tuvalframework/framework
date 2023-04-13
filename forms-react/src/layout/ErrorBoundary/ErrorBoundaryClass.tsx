import React from "react";
import { UIView } from "../../components/UIView/UIView";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import ErrorBoundaryRenderer from "./ErrorBoundaryRenderer";

export type ErrorBoundaryFunc = () => UIView;

export class ErrorBoundaryClass extends UIView {

    /** @internal */
    @ViewProperty() vp_ContentFunc: ErrorBoundaryFunc;

    public contentFunc(value:ErrorBoundaryFunc) {
        this.vp_ContentFunc = value;
        return this;
    }

    public constructor() {
        super();
    }

    public render() {
        return (<ErrorBoundaryRenderer control={this}></ErrorBoundaryRenderer>)
    }
}