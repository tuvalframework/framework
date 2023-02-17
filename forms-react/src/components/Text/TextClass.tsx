import { UIView } from '../UIView/UIView';
import TextRenderer from './TextRenderer';
import { Renderer } from '../../RendererDecorator';
import React from "react";
import UIViewRenderer from '../UIView/UIViewRenderer';
import { ViewProperty } from '../UIView/ViewProperty';


export enum RenderingTypes {
    Normal = 1,
    Markdown = 2
}

export enum TextAlignment {
    center = 0,
    leading = 1,
    trailing = 2
}

export class TextClass extends UIView {

    /** @internal */
    @ViewProperty() MultilineTextAlignment: TextAlignment = TextAlignment.leading;

    /** @internal */
    @ViewProperty() RenderingType: RenderingTypes = RenderingTypes.Normal;

    /** @internal */
    @ViewProperty() HtmlFor: string;

    /** @internal */
    @ViewProperty() TextAlign: string;

    /** @internal */
    @ViewProperty() WhiteSpace: string;

    /** @internal */
    @ViewProperty() TextOverflow: string;

    /** @internal */
    @ViewProperty() SearchWords: string[];

    /** @internal */
    @ViewProperty() vp_Text: string;

    public constructor() {
        super();

        this.Appearance.FontSize = 'var(--font-size)';
        // Sola yaslanmıyor
        this.Appearance.Display = 'flex';
        this.Appearance.AlignItems = 'inherit';
        this.Appearance.JustifyContent = 'inherit';

        this.MultilineTextAlignment = TextAlignment.center;
        this.RenderingType = RenderingTypes.Normal;


        this.SearchWords = [];
    }

    public text(buttonLabel: string) {
        this.vp_Text = buttonLabel;
        return this;
    }
    public textAlign(value: string) {
        this.TextAlign = value;
        return this;
    }
    public renderingType(type: RenderingTypes): this {
        this.RenderingType = type;
        if (type === RenderingTypes.Markdown) {
            this.Appearance.Display = 'block'; // flex olmasını istemiyoruz markdown modda.
        }
        return this;
    }
    public multilineTextAlignment(value: TextAlignment): this {
        this.MultilineTextAlignment = value;
        return this;
    }
    public whiteSpace(value: string): this {
        this.WhiteSpace = value;
        return this;
    }
    public textOverflow(value: string): this {
        this.TextOverflow = value;
        return this;
    }
    public searchWords(value: string[]): this {
        this.SearchWords = value;
        return this;
    }

    public render() {
         return (<UIViewRenderer wrap={true} control={this} renderer={TextRenderer}></UIViewRenderer>) 
       
    }
}
