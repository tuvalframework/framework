import { UIView } from '../UIView/UIView';
import TextRenderer from './UIAvatarRenderer';
import { Renderer } from '../../RendererDecorator';
import React from "react";
import UIViewRenderer from '../UIView/UIViewRenderer';
import { ViewProperty } from '../UIView/ViewProperty';
import { ByteArray } from '@tuval/core';
import UIFileUploadRenderer from './UIAvatarRenderer';
import UIOverlayPanelRenderer from './UIAvatarRenderer';
import UIAvatarRenderer from './UIAvatarRenderer';




export class UIAvatarClass extends UIView {

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
        return (<UIViewRenderer wrap={true} control={this} renderer={UIAvatarRenderer}></UIViewRenderer>)
    }
}
