import { UIViewClass } from '../UIView/UIViewClass';
import TextRenderer from './TextRenderer';
import { Renderer } from '../../RendererDecorator';
import React from "react";
import UIViewRenderer from '../UIView/UIViewRenderer';
import { ViewProperty } from '../UIView/ViewProperty';


export class TextClass extends UIViewClass{

    @ViewProperty()
    public sv_Text: string;

    public text(value: string) {
        this.sv_Text = value;
        return this;
    }



    public render() {
        return (<UIViewRenderer wrap={true} control = {this} renderer={TextRenderer}></UIViewRenderer>)
    }
}
