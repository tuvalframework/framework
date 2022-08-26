import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { ClassInfo, is, Event } from '@tuval/core';
import { InputText } from "../../inputtext/TuInputText";
import { Control, Modes } from '../Control';
import { ControlTypes } from "../../ControlTypes";
import { TextBoxRenderer } from './TextBoxRenderer';
import { Property } from "../Reflection/PropertyDecorator";
import { ITextBox } from './ITextBox';

@ClassInfo({
    fullName: ControlTypes.TextBox,
    instanceof: [
        ControlTypes.TextBox,
    ]
})
export class TTextBox extends Control<TTextBox> implements ITextBox {

    public Label: string;
    public Placeholder: string;
    public Autofocus: boolean;
    public LeftIcon: string;

    public OnKeyDownInternal: Function;
    public KeyDown: Event<any>;

    public constructor() {
        super();
        this.KeyDown = new Event();
        this.OnKeyDownInternal = (e) => {
            this.KeyDown(e);
            this.OnKeyDown(e);
        };
    }

    public OnTextChange(text: string) {
        this.Text = text;
    }

    protected OnKeyDown(e: any): void {

    }

    protected GetRenderer(): any {
        // return new TextBoxRenderer(this);
        return TextBoxRenderer as any;
    }


    /*  public Focus(): void {
         if (this.Mode === Modes.Control && this.m_Component != null) {
             this.m_Component.Focus();
         } else {
             this.m_ElementRef.focus();
         }
     } */
}