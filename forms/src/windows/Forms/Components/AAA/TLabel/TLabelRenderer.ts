import { TLabel } from './TLabel';
import { ControlHtmlRenderer } from "../HtmlRenderer/ControlHtmlRenderer";
import { ILabel } from './ILabel';
import { StringBuilder } from '@tuval/core';

export class TLabelRenderer extends ControlHtmlRenderer<ILabel> {
    public get UseShadowDom(): boolean {
        return true;
    }

    public OnStyleCreating(obj: ILabel, sb: StringBuilder): void {
        //hacking label
        sb.AppendLine(`label { cursor:${obj.Appearance.Cursor}}`);
    }
    public GenerateElement(obj: ILabel): boolean {
        this.WriteStartElement('label');
        return true;
    }

    public GenerateAttributes(obj: ILabel): void {
        this.WriteAttrVal('htmlFor', obj.HtmlFor);
        this.WriteStyleAttrVal('textAlign', obj.TextAlign);
    }
    public GenerateBody(obj: ILabel): void {
        this.WriteTextBody(obj.Text);
    }

}