import React from "react";
import { UIView } from '../UIView/UIView';
import { UIViewRenderer } from '../UIView/UIViewRenderer';
import { ViewProperty } from '../UIView/ViewProperty';
import LoaderRenderer from "./LoaderRenderer";
import { LoaderSizes } from "../UISpinner/UISpinnerClass";





export class LoaderClass extends UIView {

     /** @internal */
     @ViewProperty(LoaderSizes.MEDIUM) vp_Size:LoaderSizes;
     public size(value: LoaderSizes): this {
         this.vp_Size = value;
         return this;
     }


     /** @internal */
    @ViewProperty() vp_HeaderTemplate:UIView;
    public headerTemplate(value: UIView): this {
        this.vp_HeaderTemplate = value;
        return this;
    }


    public constructor() {
        super();
        this.width(50);
        this.height(50);
    }


    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={LoaderRenderer}></UIViewRenderer>)
    }
}
