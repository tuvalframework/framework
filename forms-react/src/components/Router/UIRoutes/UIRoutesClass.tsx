import React from "react";
import { UIView } from "../../UIView/UIView";
import UIViewRenderer from "../../UIView/UIViewRenderer";
import { ViewProperty } from "../../UIView/ViewProperty";
import { UIRouteFunction } from "../UIRoute/UIRoute";
import { UIRouteClass } from "../UIRoute/UIRouteClass";
import UIRoutesRenderer from "./UIRoutesRenderer";

export class UIRoutesClass extends UIView {

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
     @ViewProperty() vp_Chidren: UIRouteClass[];

     public children(...value: UIRouteClass[] ) {
         this.vp_Chidren = value;
         return this;
     }

     public constructor() {
        super();
        this.Appearance.Width = '100%';
        this.Appearance.Height = '100%';
     }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={UIRoutesRenderer}></UIViewRenderer>)
    }
}
