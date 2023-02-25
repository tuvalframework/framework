import { foreach, int, is } from "@tuval/core";
import React from "react";
import { AlignmentType, cBottom, cBottomLeading, cBottomTrailing, cCenter, cLeading, cTop, cTopLeading, cTopTrailing, cTrailing } from "../../Constants";
import { UIController } from "../../UIController";
import { UIView } from "../../components/UIView/UIView";
import {UIViewRenderer} from "../../components/UIView/UIViewRenderer";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import HStackRenderer from "./DesktopRenderer";
import DesktopRenderer from "./DesktopRenderer";

export class DesktopClass extends UIView {

     /** @internal */
     @ViewProperty() vp_BaseUrl: string;

     public baseUrl(value: string) {
         this.vp_BaseUrl = value;
         return this;
     }

    public constructor() {
        super();

    }



    public render() {
        return (<UIViewRenderer wrap={false}  control={this} renderer={DesktopRenderer}></UIViewRenderer>)
    }
}