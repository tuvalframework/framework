import { int, is } from "@tuval/core";
import React from "react";
import { UIView } from "../../components/UIView/UIView";
import UIViewRenderer from "../../components/UIView/UIViewRenderer";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import { AlignmentType, cBottom, cBottomLeading, cBottomTrailing, cCenter, cLeading, cTop, cTopLeading, cTopTrailing, cTrailing } from "../../Constants";
import DataContextRenderer from "./DataContextRenderer";

export class DataContextClass extends UIView {

    @ViewProperty() vp_DataProvider:any;
    public dataProvider(value: any): this {
        this.vp_DataProvider = value;
        return this;
    }

    @ViewProperty() vp_QueryClient:any;
    public queryClient(value: any): this {
        this.vp_QueryClient = value;
        return this;
    }

     /** @internal */
     @ViewProperty() vp_Chidren: UIView[];

     public children(...value:UIView[]) {
        this.vp_Chidren = value;
        return this;
     }

    public constructor() {
        super();
    }

    public render() {
        return (<UIViewRenderer wrap={false}  control = {this} renderer={DataContextRenderer}></UIViewRenderer>)
    }
}