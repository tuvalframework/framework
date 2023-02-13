import React from "react";
import { Navigate, Route } from "react-router-dom";
import { UIViewClass } from "../../UIView/UIViewClass";
import UIViewRenderer from "../../UIView/UIViewRenderer";
import { ViewProperty } from "../../UIView/ViewProperty";

export class UIRouteClass extends UIViewClass {

    /** @internal */
    @ViewProperty() vp_To: string;

    public to(value: string) {
        this.vp_To = value;
        return this;
    }


    public render() {
        return (
            <Navigate to={this.vp_To} />
        )
    }
}
