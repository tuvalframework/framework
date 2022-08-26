import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { is, Delegate, Event } from '@tuval/core';
import { InputText } from "../inputtext/TuInputText";
import { Control } from './Control';
import { SplitterComponent, SplitterPanel } from "../splitter/Splitter";
import { State } from "./Reflection/PropertyDecorator";

export class TSplitter extends Control<TSplitter> {

    @State()
    private myLeftControl: Control;

    public get LeftControl(): Control {
        return this.myLeftControl;
    }
    public set LeftControl(value: Control) {
        this.myLeftControl = value;
    }

    @State()
    private myRightControl: Control;

    public get RightControl(): Control {
        return this.myRightControl;
    }
    public set RightControl(value: Control) {
        this.myRightControl = value;
    }

    private getLeftControlNode() {
        if (this.LeftControl != null) {
            return this.LeftControl.CreateMainElement();
        }
    }
    private getRightControlNode() {
        if (this.RightControl != null) {
            return this.RightControl.CreateMainElement();
        }
    }

    public CreateElements(): any {
        return (
            <SplitterComponent style={{ width: this.Width + 'px', height: this.Height + 'px' }} onResizeEnd={(e) => console.log(e)}>
                <SplitterPanel size={90} minSize={10} style={'overflow:scroll;'}>
                    {this.getLeftControlNode()}
                </SplitterPanel>
                <SplitterPanel size={-300} minSize={-200} style={'overflow:scroll;'}>
                    {this.getRightControlNode()}
                </SplitterPanel>
            </SplitterComponent>
        );
    }

}