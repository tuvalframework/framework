import { FontIconRenderer } from './FontIconRenderer';
import { int, is, StringBuilder } from '@tuval/core';
import { CGColor } from '@tuval/cg';
import { Control } from '../Control';
import { ControlHtmlRenderer } from '../HtmlRenderer/ControlHtmlRenderer';
import { DomHandler } from '../../DomHandler';
import { IFontIcon } from './IFontIcon';



export class FontIcon extends Control<FontIcon> implements IFontIcon {
    public FontFamily: string = '';
    public Content: string;
    public Size: int;
    public Color: CGColor = CGColor.Empty;

    public constructor() {
        super();

    }

    public GetRenderer(): any {
        return FontIconRenderer;
    }
}