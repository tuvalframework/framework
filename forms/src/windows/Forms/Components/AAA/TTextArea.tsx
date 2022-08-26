import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { is, Delegate, Event, ClassInfo } from '@tuval/core';
import { InputText } from "../inputtext/TuInputText";
import { Control } from './Control';
import { InputTextarea } from "../inputtextarea/InputTextarea";
import { ControlTypes } from "../ControlTypes";

@ClassInfo({
    fullName: ControlTypes.TextArea,
    instanceof: [
        ControlTypes.TextArea,
    ]
})
export class TTextArea extends Control<TTextArea> {
    public get Label(): string {
        return this.GetProperty('Label');
    }
    public set Label(value: string) {
        this.SetProperty('Label', value);
    }

    public CreateElements(): any {
        return (
            <Fragment>
                <InputTextarea id="firstname1" rows={5} cols={30} value={this.Text} onInput={(e) => this.Text = e.target.value} />
            </Fragment>
        );
    }
    public OnTextChange(text: string) {
        this.Text = text;
    }
}