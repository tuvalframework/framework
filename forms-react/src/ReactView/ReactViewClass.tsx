import { UIViewClass } from '../UIView/UIViewClass';

import React, { ReactNode } from "react";
import UIViewRenderer from '../UIView/UIViewRenderer';
import ReactViewRenderer from './ReactViewRenderer';
import { ViewProperty } from '../UIView/ViewProperty';


export class ReactViewClass extends UIViewClass{

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
