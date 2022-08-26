import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { ClassInfo, TString } from '@tuval/core';
import { InputText } from "../inputtext/TuInputText";
import { Control, Modes } from './Control';
import { ControlTypes } from "../ControlTypes";
import { MediaPlayerComponent } from '../video';
import { DomHandler } from '../DomHandler';

const css = require('./MediaPlayer.css');
DomHandler.addCssToDocument(css);

/* @ClassInfo({
    fullName: ControlTypes.TextBox,
    instanceof: [
        ControlTypes.TextBox,
    ]
}) */
export class MediaPlayer extends Control<MediaPlayer> {
    m_videoComponent: any;

    public get Url(): string {
        return this.GetProperty('Url');
    }
    public set Url(value: string) {
        this.SetProperty('Url', value);
    }

    public get PreviewImage(): string {
        return this.GetProperty('PreviewImage');
    }
    public set PreviewImage(value: string) {
        this.SetProperty('PreviewImage', value);
    }

    public get Logo(): string {
        return this.GetProperty('Logo');
    }
    public set Logo(value: string) {
        this.SetProperty('Logo', value);
    }

    public get Playing(): boolean {
        return this.GetProperty('Playing');
    }
    public set Playing(value: boolean) {
        this.SetProperty('Playing', value);
    }

    public SetupControlDefaults() {
        super.SetupControlDefaults();
        this.Playing = false;
        this.PreviewImage = '';
        this.Logo = '';
    }
    public CreateElements(): any {

        const style = {};

        style['backgroundColor'] = 'black';

        if (this.Height > 0) {
            style['height'] = this.Height + 'px';

        }

        style['backgroundImage'] = TString.Format("url('{0}'", this.PreviewImage);

        return (
            <div class='tuval-mediaplayer' style={style}>
                <a href="" class="logo">
                    <img src={this.Logo} style="height: 64px; width: auto;" /></a>
                <MediaPlayerComponent ref={el => this.m_videoComponent = el} playing={this.Playing} controls={true} style={{ height: this.Height }} url={this.Url}  />
            </div>
        );
    }

    public Play(): void {
       this.Playing = true;
    }
    public Stop(): void {
        this.Playing = false;
     }
    public OnTextChange(text: string) {
        this.Text = text;
    }
}