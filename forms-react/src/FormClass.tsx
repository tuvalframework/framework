import { UIViewClass } from './UIView/UIViewClass';
import LabelRenderer from './LabelRenderer';
import { Renderer } from './RendererDecorator';
import React from "react";
import UIViewRenderer from './UIView/UIViewRenderer';
import FormRenderer from './FormRenderer';
import { ViewProperty } from './UIView/ViewProperty';


export class FormClass extends UIViewClass{

    @ViewProperty([])
    public sv_Controls: UIViewClass[];

    public controls(value: UIViewClass[]) {
        this.sv_Controls = value;
        return this;
    }



    public render() {
        return (<UIViewRenderer wrap={true} control = {this} renderer={FormRenderer}></UIViewRenderer>)
    }
}
