import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { ClassInfo, is, int } from '@tuval/core';
import { InputText } from "../inputtext/TuInputText";
import { Control, Modes } from './Control';
import { ControlTypes } from "../ControlTypes";
import { DomHandler } from '../DomHandler';
import { ProgressSpinnerComponent } from '../progressspinner/ProgressSpinner.';

const css = require('./PageFrame.css');
DomHandler.addCssToDocument(css);

export class PageFrame extends Control<PageFrame> {

    private iframeEl: any;
    public get _Loaded(): boolean {
        return this.GetProperty('Loaded');
    }
    public set _Loaded(value: boolean) {
        this.SetProperty('Loaded', value);
    }

    public get Src(): string {
        return this.GetProperty('Src');
    }
    public set Src(value: string) {
        this.SetProperty('Src', value);
    }

    public SetupComponentDefaults() {
        super.SetupComponentDefaults();
        this._Loaded = false;
    }

    /* protected componentDidMount() {
        if (this.iframeEl) {
            this.iframeEl.onload = () => {
                this.iframeEl.style.height = this.iframeEl.contentWindow.document.scrollHeight + 'px';
            }
        }
    } */

    public GetContentHeight(): int {
        if (this.__Mode__ === Modes.Control && this.__m_Component__ != null) {
            return this.__m_Component__.GetContentHeight();
        } else if (this.iframeEl != null) {
            return this.iframeEl.contentWindow.document.body./* documentElement. */scrollHeight;
        }
    }
    public GetFrameElement(): any {
        if (this.__Mode__ === Modes.Control && this.__m_Component__ != null) {
            return this.__m_Component__.iframeEl;
        } else if (this.iframeEl != null) {
            return this.iframeEl;
        }
    }
    public CreateElements(): any {
        if (this.Loaded) {
            return (
                <div class='tuval-pageframe' style={{ width: '100%', height: this.Height + 'px' }}>
                    <iframe ref={e => this.iframeEl = e} src={this.Src} height={this.Height}></iframe>
                </div>);
        } else {
            return (
                <div class='tuval-pageframe' style={{ width: '100%', height: this.Height + 'px' }}>
                    <iframe ref={e => this.iframeEl = e} src={this.Src} width={0} height={0} onload={e => this._Loaded = true}></iframe>
                    <ProgressSpinnerComponent class='centered'></ProgressSpinnerComponent>
                </div>);
        }
    }

}