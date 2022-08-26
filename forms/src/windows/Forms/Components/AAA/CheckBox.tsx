import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { is, Delegate, Event, Console } from '@tuval/core';
import { InputText } from "../inputtext/TuInputText";
import { Control, Modes } from './Control';
import { CheckboxComponent } from '../checkbox/Checkbox';
import { UniqueComponentId } from '../../../../UniqueComponentId';

export class CheckedChangedEventHandler extends Delegate<(checked: boolean) => void> { };
export class Checkbox extends Control<Checkbox> {

    public get Checked(): boolean {
        return this.GetProperty('Checked');
    }
    public set Checked(value: boolean) {
        this.SetProperty('Checked', value);
    }

    public get CheckedChanged(): Event<CheckedChangedEventHandler> {
        return this.GetProperty('CheckedChanged');
    }
    public set CheckedChanged(value: Event<CheckedChangedEventHandler>) {
        this.SetProperty('CheckedChanged', value);
    }


    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.CheckedChanged = new Event();
    }
    protected SetupComponentDefaults(): void {
        super.SetupComponentDefaults();
        this.OnChangeInternal = this.OnChangeInternal.bind(this);


    }


    public CreateElements(): any {
        return (
            <div class='p-field-checkbox'>
                <CheckboxComponent inputId={this.Id} onChange={e => this.OnChangeInternal(e)} checked={this.Checked}></CheckboxComponent>
                <label htmlFor={this.Id}> {this.Text}</label>
            </div>
        );
    }
    private OnChangeInternal(e: any): void {
        this.Checked = e.checked;
        this.CheckedChanged(e.checked);
        this.OnChange();
    }
    public OnChange(): void {
    }
}