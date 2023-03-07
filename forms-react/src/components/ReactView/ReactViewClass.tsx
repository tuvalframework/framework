import { UIView } from '../UIView/UIView';

import React, { ReactNode } from "react";
import {UIViewRenderer} from '../UIView/UIViewRenderer';
import ReactViewRenderer from './ReactViewRenderer';
import { ViewProperty } from '../UIView/ViewProperty';


export class ReactViewClass extends UIView{

    @ViewProperty(false)
    public vp_Frame: boolean;

    public frame(value: boolean) {
        this.vp_Frame = value;
        return this;
    }

    @ViewProperty()
    public vp_ReactNode: ReactNode;

    public reactNode(value: ReactNode) {
        this.vp_ReactNode = value;
        return this;
    }
    public render() {
        return (<UIViewRenderer wrap={false} control = {this} renderer={ReactViewRenderer}></UIViewRenderer>)
    }
}
