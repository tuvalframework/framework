import { UIView } from '../UIView/UIView';
import TextRenderer from './UIOverlayPanelRenderer';
import { Renderer } from '../../RendererDecorator';
import React from "react";
import UIViewRenderer from '../UIView/UIViewRenderer';
import { ViewProperty } from '../UIView/ViewProperty';
import { ByteArray } from '@tuval/core';
import UIFileUploadRenderer from './UIOverlayPanelRenderer';
import UIOverlayPanelRenderer from './UIOverlayPanelRenderer';




export class UIOverlayPanelClass extends UIView {

     /** @internal */
    @ViewProperty() vp_HeaderTemplate:UIView;
    public headerTemplate(value: UIView): this {
        this.vp_HeaderTemplate = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Show: boolean;
    public show(value: boolean): this {
        this.vp_Show = value;
        return this;
    }

     /** @internal */
     @ViewProperty() vp_Children: UIView[];
     public children(...value: UIView[]): this {
         this.vp_Children = value;
         return this;
     }

    public constructor() {
        super();
    }


    public render() {
        return (<UIViewRenderer wrap={true} control={this} renderer={UIOverlayPanelRenderer}></UIViewRenderer>)
    }
}
