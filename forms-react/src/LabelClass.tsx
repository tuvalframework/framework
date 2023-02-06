import { UIViewClass } from './UIView/UIViewClass';
import LabelRenderer from './LabelRenderer';
import { Renderer } from './RendererDecorator';
import React from "react";
import UIViewRenderer from './UIView/UIViewRenderer';
import { ViewProperty } from './UIView/ViewProperty';


export class LabelClass extends UIViewClass{

    @ViewProperty()
    public sv_Text: string;

    public text(value: string) {
        this.sv_Text = value;
        return this;
    }



    public render() {
        return (<UIViewRenderer wrap={true} control = {this} renderer={LabelRenderer}></UIViewRenderer>)
    }
}
