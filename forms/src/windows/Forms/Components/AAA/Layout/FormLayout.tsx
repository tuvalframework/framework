import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { is, Delegate, Event, foreach } from '@tuval/core';
import { InputText } from "../../inputtext/TuInputText";
import { Control, Modes } from '../Control';
import { ControlCollection } from "../ControlCollection";
import { TTextBox } from '../TextBox/TTextBox';
import { ControlTypes } from '../../ControlTypes';
import { TTextArea } from "../TTextArea";
import { ComboBoxBase } from "../ComboBox";
import { MultiComboBox } from '../MultiComboBox/MultiComboBox';

export enum FormLayoutModes {
    Vertical = 0,
    VerticalGrid = 1,
    HorizontalFixed = 2,
    HorizontalFluid = 3
}
export class FormLayout extends Control<FormLayout> {

    public get Layout(): FormLayoutModes {
        return this.GetProperty('Layout');
    }

    public set Layout(value: FormLayoutModes) {
        this.SetProperty('Layout', value);
    }

    public get Controls(): ControlCollection {
        return this.GetProperty('Controls');
    }

    public set Controls(value: ControlCollection) {
        this.SetProperty('Controls', value);
    }


    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.Controls = new ControlCollection(this);
        this.Layout = FormLayoutModes.Vertical;
    }


    private CreateVerticalLayout(): any {
        return (

            <div className="p-fluid" style={{ padding: '10px' }}>
                {this.CreateControlsForVerticalLayout()}
            </div>

        );
    }

    private CreateControlsForVerticalLayout(): any[] {
        const vNodes: any[] = [];
        foreach(this.Controls, (control: Control<any>) => {
            if (
                is.typeof<TTextBox>(control, ControlTypes.TextBox) ||
                is.typeof<TTextArea>(control, ControlTypes.TextArea) ||
                is.typeof<ComboBoxBase>(control, ControlTypes.ComboBoxBase) ||
                is.typeof<MultiComboBox>(control, ControlTypes.MultiComboBox)
            ) {
                vNodes.push((
                    <div className="p-field">
                        <label style="font-size: 1.05em;line-height: 1.4em;font-weight: 600;color: #2e4354;margin-bottom: 4px;position: relative;" htmlFor="firstname3">{control.Label}</label>
                        {(control as any).CreateMainElement()}
                    </div>
                ));
            } else {
                vNodes.push((
                    <div className="p-field">
                        {(control as any).CreateMainElement()}
                    </div>
                ));
            }

        });
        return vNodes;
    }


    private CreateVerticalGridLayout(): any {
        return (
            <div className="p-fluid p-formgrid p-grid">
                {this.CreateControlsForVerticalGridLayout()}
            </div>

        );
    }

    private CreateControlsForVerticalGridLayout(): any[] {
        const vNodes: any[] = [];
        foreach(this.Controls, (control: Control<any>) => {
            if (
                is.typeof<TTextBox>(control, ControlTypes.TextBox) ||
                is.typeof<TTextArea>(control, ControlTypes.TextArea) ||
                is.typeof<ComboBoxBase>(control, ControlTypes.ComboBoxBase) ||
                is.typeof<MultiComboBox>(control, ControlTypes.MultiComboBox)
            ) {
                vNodes.push((
                    <div className="p-field p-col">
                        <label htmlFor="firstname3">{control.Label}</label>
                        {(control as any).CreateMainElement()}
                    </div>
                ));
            } else {
                vNodes.push((
                    <div className="p-field p-col">
                        {(control as any).CreateMainElement()}
                    </div>
                ));
            }
        });
        return vNodes;
    }


    private CreateHorizontalFixedLayout(): any {
        return (
            this.CreateControlsForHorizontalFixedLayout()
        );
    }

    private CreateControlsForHorizontalFixedLayout(): any[] {
        const vNodes: any[] = [];
        foreach(this.Controls, (control: Control<any>) => {

            if (is.typeof<TTextBox>(control, ControlTypes.TextBox) || is.typeof<TTextArea>(control, ControlTypes.TextArea)) {
                vNodes.push((
                    <div className="p-field p-grid">
                        <label htmlFor="firstname3" className="p-col-fixed" style={{ width: '100px' }}>{control.Label}</label>
                        <div className="p-col">
                            {(control as any).CreateMainElement()}
                        </div>
                    </div>
                ));
            } else {
                vNodes.push((
                    <div className="p-field p-grid">
                        <div className="p-field p-col">
                            {(control as any).CreateMainElement()}
                        </div>
                    </div>
                ));
            }
        });
        return vNodes;
    }

    private CreateHorizontalFluidLayout(): any {
        return (

            <div className="p-fluid">
                {this.CreateControlsForHorizontalFluidLayout()}
            </div>

        );
    }

    private CreateControlsForHorizontalFluidLayout(): any[] {
        const vNodes: any[] = [];
        foreach(this.Controls, (control: Control<any>) => {
            if (is.typeof<TTextBox>(control, ControlTypes.TextBox) || is.typeof<TTextArea>(control, ControlTypes.TextArea)) {
                vNodes.push((
                    <div className="p-field p-grid">
                        <label htmlFor="firstname3" className="p-col-12 p-md-2" >{control.Label}</label>
                        <div className="p-col-12 p-md-10">
                            {(control as any).CreateMainElement()}
                        </div>
                    </div>
                ));
            } else {
                vNodes.push((
                    <div className="p-field p-grid">
                        {(control as any).CreateMainElement()}
                    </div>
                ));
            }
        });
        return vNodes;
    }

    public CreateElements(): any {
        switch (this.Layout) {
            case FormLayoutModes.Vertical:
                return this.CreateVerticalLayout();
            case FormLayoutModes.VerticalGrid:
                return this.CreateVerticalGridLayout();
            case FormLayoutModes.HorizontalFixed:
                return this.CreateHorizontalFixedLayout();
            case FormLayoutModes.HorizontalFluid:
                return this.CreateHorizontalFluidLayout();
        }
    }
}