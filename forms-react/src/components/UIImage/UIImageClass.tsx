import { UIView } from '../UIView/UIView';
import TextRenderer from './UIImageRenderer';
import { Renderer } from '../../RendererDecorator';
import React from "react";
import UIViewRenderer from '../UIView/UIViewRenderer';
import { ViewProperty } from '../UIView/ViewProperty';
import { ByteArray, int, is } from '@tuval/core';
import UIFileUploadRenderer from './UIImageRenderer';
import UIOverlayPanelRenderer from './UIImageRenderer';
import UIImageRenderer from './UIImageRenderer';




export class UIImageClass extends UIView {

  
     /** @internal */
     @ViewProperty() vp_Src: string;

     public src(value: string): this {
        this.vp_Src = value;
        return this;
    }

     /** @internal */
     @ViewProperty() vp_Img: HTMLImageElement;

     public img(value: HTMLImageElement): this {
        this.vp_Img = value;
        return this;
    }

    /** @internal */
     @ViewProperty() vp_ImageWidth: string;

     public imageWidth(value: int | string): this {
        if (is.string(value)) {
            this.vp_ImageWidth = value;
        } else {
            this.vp_ImageWidth = `${value}px`;
        }

        return this;
    }
    
    /** @internal */
     @ViewProperty() vp_ImageHeight: string;

    public imageHeight(value: int | string): this {
        if (is.string(value)) {
            this.vp_ImageHeight = value;
        } else {
            this.vp_ImageHeight = `${value}px`;
        }

        return this;
    }

    /** @internal */
     @ViewProperty() vp_ImageBorder: string;

     public imageBorder(value: string): this {
        this.vp_ImageBorder = value;
        return this;
    }

    public constructor() {
        super();
    }


    public render() {
        return (<UIViewRenderer wrap={true} control={this} renderer={UIImageRenderer}></UIViewRenderer>)
    }
}
