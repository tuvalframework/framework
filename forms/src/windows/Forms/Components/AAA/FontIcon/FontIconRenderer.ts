import { is, StringBuilder } from '@tuval/core';
import { DomHandler } from "../../DomHandler";
import { ControlHtmlRenderer } from "../HtmlRenderer/ControlHtmlRenderer";
import { IFontIcon } from "./IFontIcon";

export class FontIconRenderer extends ControlHtmlRenderer<IFontIcon> {
    private addedCss;
    public get UseShadowDom(): boolean {
        return true;
    }

    protected OnComponentDidMount(ref: any, obj: IFontIcon): void {
        super.OnComponentDidMount(ref, obj);
        if (!this.UseShadowDom) {
            let css: string = `.icon-${obj.Id}:before {
            content: "${obj.Appearance.Content}"
        }`;

            this.addedCss = DomHandler.addCssToDocument(css);
        }


    }
    protected OnComponentWillUnmount(obj: IFontIcon): void {
        super.OnComponentWillUnmount(obj);
        if (!this.UseShadowDom) {
            DomHandler.removeCssToDocument(this.addedCss);
        }
    }

    public OnStyleCreating(obj: IFontIcon, sb: StringBuilder): void {
        let css: string = `.icon-${obj.Id}:before {
            content: "${obj.Appearance.Content}"
        }`;
        sb.AppendLine(css);
    }

    public GenerateElement(obj: IFontIcon): boolean {
        this.WriteStartElement('i');
        return true;
    }
    public GenerateAttributes(obj: IFontIcon): void {
        if (!is.nullOrEmpty(obj.Appearance.Content)) {
            this.WriteStyleAttrVal('font-family', obj.FontFamily);
            this.WriteStyleAttrVal('speak', 'none');
            this.WriteStyleAttrVal('font-style', 'normal');
            this.WriteStyleAttrVal('font-weight', 'normal');
            this.WriteStyleAttrVal('font-variant', 'normal');
            this.WriteStyleAttrVal('font-size', 'inherit'/* obj.Size */);
            this.WriteStyleAttrVal('text-transform', 'none');
            this.WriteStyleAttrVal('line-height', '1');
            this.WriteStyleAttrVal('-webkit-font-smoothing', 'antialiased');
            this.WriteStyleAttrVal('-moz-osx-font-smoothing', 'grayscale');

            if (!obj.Color.IsEmpty) {
                this.WriteStyleAttrVal('color', this.TranslateColor(obj.Color));
            }
            this.WriteAttrVal('class', `icon-${obj.Id}`);
        }
    }
    public GenerateBody(obj: IFontIcon): void {

    }
}