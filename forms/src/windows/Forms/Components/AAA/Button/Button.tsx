import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Event, is, Delegate, classNames } from '@tuval/core';
import { Control } from "../Control";
import { DomHandler } from "../../DomHandler";
import { ButtonHtmlRenderer } from './ButtonHtmlRenderer';

/* const css = require('./Button.css');
DomHandler.addCssToDocument(css); */

class ClickEvent extends Delegate<() => void>{ }

export enum ButtonColors {
    Gray = 1,
    Blue = 2,
    Red = 3,
    Green = 4
}

export class Button extends Control<Button> {
    /* public get OnClick(): Event<ClickEvent> {
        return this.GetProperty('OnClick');
    }
    public set OnClick(value: Event<ClickEvent>) {
        this.SetProperty('OnClick', value);
    } */

    public get Color(): ButtonColors {
        return this.GetProperty('Color');
    }
    public set Color(value: ButtonColors) {
        this.SetProperty('Color', value);
    }

    public get Placeholder(): string {
        return this.GetProperty('Placeholder');
    }
    public set Placeholder(value: string) {
        this.SetProperty('Placeholder', value);
    }

    public get Autofocus(): boolean {
        return this.GetProperty('Autofocus');
    }
    public set Autofocus(value: boolean) {
        this.SetProperty('Autofocus', value);
    }

    public get LeftIcon(): string {
        return this.GetProperty('LeftIcon');
    }
    public set LeftIcon(value: string) {
        this.SetProperty('LeftIcon', value);
    }

    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();
        //this.OnClick = new Event();
        this.Color = ButtonColors.Gray;
        this.Appearance.Display = 'inline-block';
    }

    protected GetRenderer(): any {
       // return new ButtonHtmlRenderer(this);
       return ButtonHtmlRenderer as any;
    }
}

export class PrimaryButton extends Button {
    public InitComponents(): void {
        this.Color = ButtonColors.Blue;
    }
}