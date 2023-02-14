import { foreach, int, is } from "@tuval/core";
import React from "react";
import { AlignmentType, cBottom, cBottomLeading, cBottomTrailing, cCenter, cLeading, cTop, cTopLeading, cTopTrailing, cTrailing } from "../../Constants";
import { UIController } from "../../UIController";
import { UIViewClass } from "../../components/UIView/UIViewClass";
import UIViewRenderer from "../../components/UIView/UIViewRenderer";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import HStackRenderer from "./DesktopRenderer";
import DesktopRenderer from "./DesktopRenderer";

export class DesktopClass extends UIViewClass {


    public constructor() {
        super();

    }



    public render() {
        return (<UIViewRenderer wrap={false}  control={this} renderer={DesktopRenderer}></UIViewRenderer>)
    }
}