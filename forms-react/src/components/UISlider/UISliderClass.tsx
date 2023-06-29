import { UIViewRenderer } from '../UIView/UIViewRenderer';
import { Event, int } from "@tuval/core";
import { UIView } from "../UIView/UIView";
import { ViewProperty } from "../UIView/ViewProperty";
import React from 'react';
import UISliderRenderer from './UISliderRenderer';






export class UISliderClass extends UIView {

    /** @internal */
    @ViewProperty() Max: int = 100;

    /** @internal */
    @ViewProperty() Min: int = 0;

    /** @internal */
    @ViewProperty() Value: int = 30;

    /** @internal */
    @ViewProperty() Orientation: string = 'vertical';

    /** @internal */
    @ViewProperty() Changed: Event<any> = new Event();

    public constructor() {
        super();
        // Default renderer


        this.Max = 100;
        this.Min = 0;
        this.Value = 30;
        this.Orientation = 'vertical';
        this.Changed = new Event();;


        this.Appearance.Height = '100%';
    }


    public action(value: (value: int) => void): this {
        this.Changed.add(value);
        return this;
    }
    public value(value: int): this {
        this.Value = value;
        return this;
    }
    public render() {
        return (<UIViewRenderer wrap={true} control={this} renderer={UISliderRenderer}></UIViewRenderer>)
    }
}




