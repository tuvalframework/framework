import { UIView } from '../UIView/UIView';
import TextRenderer from './UISpinnerRenderer';
import { Renderer } from '../../RendererDecorator';
import React from "react";
import {UIViewRenderer} from '../UIView/UIViewRenderer';
import { ViewProperty } from '../UIView/ViewProperty';
import { ByteArray } from '@tuval/core';
import UIFileUploadRenderer from './UISpinnerRenderer';
import UIOverlayPanelRenderer from './UISpinnerRenderer';
import UISpinnerRenderer from './UISpinnerRenderer';



export enum LoaderSizes {
    XS = 16,
    SMALL = 24,
    MEDIUM = 40,
    LARGE = 64
}

export class UISpinnerClass extends UIView {

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
        return (<UIViewRenderer wrap={false} control={this} renderer={UISpinnerRenderer}></UIViewRenderer>)
    }
}
