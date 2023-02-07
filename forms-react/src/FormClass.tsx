import { UIViewClass } from './components/UIView/UIViewClass';
import TextRenderer from './components/Text/TextRenderer';
import { Renderer } from './RendererDecorator';
import React from "react";
import UIViewRenderer from './components/UIView/UIViewRenderer';
import FormRenderer from './FormRenderer';
import { ViewProperty } from './components/UIView/ViewProperty';


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
