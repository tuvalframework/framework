import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { is, Delegate, Event, TString, int } from '@tuval/core';
import { Control } from "../Control";
import { ButtonComponent } from "../../button/TuButtonElement";
import { DomHandler } from '../../DomHandler';
import { Desktop } from "./Desktop";
import { Ripple } from "../../ripple/Ripple";

export class DesktopIconTitle extends Control<DesktopIconTitle> {
    protected CreateElements() {
        const str = this.wordWrap(this.Text, 14);
        if (str != null) {
            return (
                str.split('___').map(s => this.getTextElement(s))
            );
        }
    }

    public get Text(): string {
        return this.GetProperty('Text');
    }
    public set Text(value: string) {
        this.SetProperty('Text', value);
    }

    /*  public constructor(props) {
         super(props);

     } */

    private getTextElement(text): any {
        return (<span>{text}<br /></span>);
    }
    private wordWrap(str, maxWidth): string {
        if (str == null)
            return str;

        var newLineStr = "___";
        let done: boolean = false;
        let res: string = '';
        let found: boolean = false;
        while (str.length > maxWidth) {
            found = false;
            // Inserts new line at first whitespace of the line
            for (let i: int = maxWidth - 1; i >= 0; i--) {
                if (this.testWhite(str.charAt(i))) {
                    res = res + [str.slice(0, i), newLineStr].join('');
                    str = str.slice(i + 1);
                    found = true;
                    break;
                }
            }
            // Inserts new line at maxWidth position, the word is too long to wrap
            if (!found) {
                res += [str.slice(0, maxWidth), newLineStr].join('');
                str = str.slice(maxWidth);
            }

        }

        return res + str;
    }

    private testWhite(x) {
        var white = new RegExp(/^\s$/);
        return white.test(x.charAt(0));
    }

}