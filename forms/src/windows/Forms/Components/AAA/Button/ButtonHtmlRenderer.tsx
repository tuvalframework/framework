import { classNames, is, StringBuilder } from "@tuval/core";
import { Fragment } from "../../../../../preact/compat";
import { InputText } from "../../inputtext/TuInputText";
import { Teact } from "../../Teact";
import { ControlHtmlRenderer } from "../HtmlRenderer/ControlHtmlRenderer";
import { Button, ButtonColors } from './Button';
import { IButton } from './IButton';

export class ButtonHtmlRenderer extends ControlHtmlRenderer<IButton> {
    public get UseShadowDom(): boolean {
        return true;
    }

    public GenerateElement(obj: IButton): boolean {
        this.WriteStartFragment();
        return true;
    }

    public OnStyleCreating(obj: IButton, sb: StringBuilder): void {
        const css = require('./Button.css');
        sb.AppendLine(css);
    }

    public GenerateBody(obj: IButton): void {
        const className = classNames('tuval-button', {
            'button-blue': obj.Color === ButtonColors.Blue,
            'button-grey': obj.Color === ButtonColors.Gray,
            'button-red': obj.Color === ButtonColors.Red,
            'button-green': obj.Color === ButtonColors.Green,
        } as any);
        this.WriteComponent(
            <span cellspacing="0" class={className} onClick={() => obj.Clicked()}>
                <em class=" unselectable" unselectable="on">
                    <button type="button" aria-label={obj.Text} class="text" aria-level="1">{obj.Text}</button>
                </em>
            </span>);
    }
}