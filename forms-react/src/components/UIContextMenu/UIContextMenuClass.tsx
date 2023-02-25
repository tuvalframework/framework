import React from "react";
import { UIView } from '../UIView/UIView';
import {UIViewRenderer} from '../UIView/UIViewRenderer';
import { ViewProperty } from '../UIView/ViewProperty';
import UIContextMenuRenderer from './UIContextMenuRenderer';




export class UIContextMenuClass extends UIView {

    /** @internal */
    @ViewProperty() vp_Children: UIView[];
    public children(...value: UIView[]): this {
        this.vp_Children = value;
        return this;
    }

    @ViewProperty()
    public items: UIView[];
    public setItems(...items: UIView[]): this {
        this.items = items;
        return this;
     }

    public constructor() {
        super();
    }


    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={UIContextMenuRenderer}></UIViewRenderer>)
    }
}
