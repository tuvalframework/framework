import React from "react";
import { UIView } from '../UIView/UIView';
import UIViewRenderer from '../UIView/UIViewRenderer';
import DividerRenderer from "./DividerRenderer";




export class DividerClass extends UIView {

    public constructor() {
        super();
    }


    public render() {
        return (<UIViewRenderer wrap={true} control={this} renderer={DividerRenderer}></UIViewRenderer>)
    }
}
