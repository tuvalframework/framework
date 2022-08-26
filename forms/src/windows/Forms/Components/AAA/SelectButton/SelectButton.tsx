import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { ClassInfo, is, int, Event } from '@tuval/core';
import { Control } from "../Control";
import { SliderComponent } from "../../slider/Slider";
import { ReplaySubject, Subject } from "rxjs";
import { SelectButtonComponent } from '../../selectbutton/SelectButton';


export class SelectButton extends Control<SelectButton> {
    public get Value(): string {
        return this.GetProperty('Value');
    }
    public set Value(value: string) {
        this.SetProperty('Value', value);
    }

    public get OptionLabel(): string {
        return this.GetProperty('OptionLabel');
    }
    public set OptionLabel(value: string) {
        this.SetProperty('OptionLabel', value);
    }

    public get OptionValue(): any {
        return this.GetProperty('OptionValue');
    }
    public set OptionValue(value: any) {
        this.SetProperty('OptionValue', value);
    }

    public get Options(): any {
        return this.GetProperty('Options');
    }
    public set Options(value: any) {
        this.SetProperty('Options', value);
    }

    public get Value$(): ReplaySubject<int> {
        return this.GetPipe('Value');
    }
    public set Value$(value: ReplaySubject<int>) {
        this.SetPipe('Value', value);
    }

    public get Changed(): Event<any> {
        return this.GetProperty('Changed');
    }
    public set Changed(value: Event<any>) {
        this.SetProperty('Changed', value);
    }
    public SetupControlDefaults() {
        super.SetupControlDefaults();
       /*  this.Value = 0;
        this.Value$.next(this.Value); */
        this.Changed = new Event();
    }

    public CreateElements(): any {
        return (
        <div class='flex tuval-buttonselect justify-content-center' style={'width:100%;padding:5px;'}>
           <SelectButtonComponent optionLabel={this.OptionLabel} optionValue={this.OptionValue}  value={this.Value} options={this.Options} onChange={this.onChange.bind(this)}></SelectButtonComponent>
        </div>);
    }

    private onChange(e: any) {
        if (this.Value !== e.value) {
            this.Value = e.value;
            this.Changed(e.value);
        }

    }

}