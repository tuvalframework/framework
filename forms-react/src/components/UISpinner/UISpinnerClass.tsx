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




export class UISpinnerClass extends UIView {

     /** @internal */
    @ViewProperty() vp_HeaderTemplate:UIView;
    public headerTemplate(value: UIView): this {
        this.vp_HeaderTemplate = value;
        return this;
    }


    public constructor() {
        super();
    }


    public render() {
        return (<UIViewRenderer wrap={true} control={this} renderer={UISpinnerRenderer}></UIViewRenderer>)
    }
}
