import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { ClassInfo, is, int } from '@tuval/core';
import { InputText } from "../../inputtext/TuInputText";
import { Control, Modes } from '../Control';
import { ControlTypes } from "../../ControlTypes";
import { RatingComponent } from '../../rating/Rating';

export class Rating extends Control<Rating> {

    public get StarColor(): string {
        return this.GetProperty('StarColor');
    }
    public set StarColor(value: string) {
        this.SetProperty('StarColor', value);
    }

    public get Stars(): int {
        return this.GetProperty('Stars');
    }
    public set Stars(value: int) {
        this.SetProperty('Stars', value);
    }

    public get Size(): int {
        return this.GetProperty('Size');
    }
    public set Size(value: int) {
        this.SetProperty('Size', value);
    }

    public get Value(): int {
        return this.GetProperty('Value');
    }
    public set Value(value: int) {
        this.SetProperty('Value', value);
    }

    public get Cancel(): boolean {
        return this.GetProperty('Cancel');
    }
    public set Cancel(value: boolean) {
        this.SetProperty('Cancel', value);
    }

    public get ReadOnly(): boolean {
        return this.GetProperty('ReadOnly');
    }
    public set ReadOnly(value: boolean) {
        this.SetProperty('ReadOnly', value);
    }

    public SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.Stars = 5;
        this.Value = 0;
        this.Cancel = false;
        this.ReadOnly = false;
        this.Size = 14;
        this.StarColor = '';
    }

    public CreateElements(): any {
        return (<RatingComponent value={this.Value} onChange={(e) => this.Value = e.value} readOnly={this.ReadOnly} stars={5} starSize={this.Size} color={this.StarColor} cancel={this.Cancel}/>);
    }

}