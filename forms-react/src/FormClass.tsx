import { UIView } from './components/UIView/UIView';
import TextRenderer from './components/Text/TextRenderer';
import { Renderer } from './RendererDecorator';
import React from "react";
import {UIViewRenderer} from './components/UIView/UIViewRenderer';
import FormRenderer from './FormRenderer';
import { ViewProperty } from './components/UIView/ViewProperty';


export class FormClass extends UIView{

    @ViewProperty([])
    public sv_Controls: UIView[];

    public controls(value: UIView[]) {
        this.sv_Controls = value;
        return this;
    }



    public render() {
        return (<UIViewRenderer wrap={true} control = {this} renderer={FormRenderer}></UIViewRenderer>)
    }
}
