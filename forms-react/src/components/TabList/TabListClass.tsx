import React from "react";
import { UIView } from "../UIView/UIView";
import {UIViewRenderer} from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import TabListRenderer from "./TabListRenderer";
import AutoCompleteRenderer from "./TabListRenderer";
import { ITab } from "./ITab";




export class TabListClass extends UIView {

     /** @internal */
     @ViewProperty() vp_ActiveTabIndex: number;

     public activeTabId(value: number) {
         this.vp_ActiveTabIndex = value;
         return this;
     }


    /** @internal */
    @ViewProperty() vp_Tabs: ITab[];

    public tabs(value: ITab[]) {
        this.vp_Tabs = value;
        return this;
    }

     

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={TabListRenderer}></UIViewRenderer>)
    }
}
