import React from "react";
import { UIViewClass } from "../../UIView/UIViewClass";
import UIViewRenderer from "../../UIView/UIViewRenderer";
import UIRouteOutletRenderer from "./UIRouteOutletRenderer";

export class UIRouteOutletClass extends UIViewClass {
    public render() {
        return (<UIViewRenderer wrap={true} control={this} renderer={UIRouteOutletRenderer}></UIViewRenderer>)
    }
}
