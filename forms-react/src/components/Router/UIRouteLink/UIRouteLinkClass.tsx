import React from "react";
import { UIView } from "../../UIView/UIView";
import UIViewRenderer from "../../UIView/UIViewRenderer";
import { ViewProperty } from "../../UIView/ViewProperty";
import UIRouteLinkRenderer from "./UIRouteLinkRenderer";
import ListBoxRenderer from "./UIRouteLinkRenderer";

export class UIRouteLinkClass extends UIView {

    /** @internal */
    @ViewProperty() vp_Link: string;

    public link(value: string) {
        this.vp_Link = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_State: object;

    public state(value: object) {
        this.vp_State = value;
        return this;
    }

     /** @internal */
     @ViewProperty() vp_Chidren: UIView[];

     public children(...value: UIView[]) {
         this.vp_Chidren = value;
         return this;
     }

    public render() {
        return (<UIViewRenderer wrap={true} control={this} renderer={UIRouteLinkRenderer}></UIViewRenderer>)
    }
}
