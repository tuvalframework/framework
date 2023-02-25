import React from "react";
import { UIView } from "../../UIView/UIView";
import {UIViewRenderer} from "../../UIView/UIViewRenderer";
import UIRouteOutletRenderer from "./UIRouteOutletRenderer";

export class UIRouteOutletClass extends UIView {
    public render() {
        return (<UIViewRenderer wrap={true} control={this} renderer={UIRouteOutletRenderer}></UIViewRenderer>)
    }
}
