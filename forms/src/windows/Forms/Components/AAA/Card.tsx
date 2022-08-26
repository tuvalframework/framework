import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { ClassInfo, is } from '@tuval/core';
import { InputText } from "../inputtext/TuInputText";
import { Control, Modes } from './Control';
import { ControlTypes } from "../ControlTypes";
import { ControlCollection } from './ControlCollection';
import { CardComponent } from '../card/card';

export class Card extends Control<Card> {
    public get Title(): string {
        return this.GetProperty('Title');
    }
    public set Title(value: string) {
        this.SetProperty('Title', value);
    }

    public get SubTitle(): string {
        return this.GetProperty('SubTitle');
    }
    public set SubTitle(value: string) {
        this.SetProperty('SubTitle', value);
    }

    public get Content(): string {
        return this.GetProperty('Content');
    }
    public set Content(value: string) {
        this.SetProperty('Content', value);
    }

    public get Header(): Control<any> {
        return this.GetProperty('Header');
    }
    public set Header(value: Control<any>) {
        this.SetProperty('Header', value);
    }

    public get HeaderImage(): string {
        return this.GetProperty('HeaderImage');
    }
    public set HeaderImage(value: string) {
        this.SetProperty('HeaderImage', value);
    }

    public get Footer(): Control<any> {
        return this.GetProperty('Footer');
    }
    public set Footer(value: Control<any>) {
        this.SetProperty('Footer', value);
    }

    public get Controls(): ControlCollection {
        return this.GetProperty('Controls');
    }
    public set Controls(value: ControlCollection) {
        this.SetProperty('Controls', value);
    }

    public SetupControlDefaults() {
        super.SetupControlDefaults();
        this.Controls = new ControlCollection(this);
    }

    private renderControls(): any[] {
        return this.Controls.ToArray().map(c => {
            return (c as any).CreateMainElement();
        });
    }
    public CreateElements(): any {
        const hf = {};
        if (this.HeaderImage) {
            hf['header'] = /* this.Header */(<img alt="" src={this.HeaderImage}/>);
        }
        if (this.Footer) {
            hf['footer'] = this.Footer;
        }

        return (<CardComponent {...hf} title={this.Title} subTitle={this.SubTitle} style={{width:this.Width + 'px'}}>
            {/* {this.renderControls()} */}
            <p class='p-m-0'>{this.Content}</p>
        </CardComponent>);
    }
}