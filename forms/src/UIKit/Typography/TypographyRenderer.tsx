import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { StringBuilder } from '@tuval/core';
import { TypographyClass } from "./TypographyClass";
import { Teact } from "../../windows/Forms/Components/Teact";
import { Fragment } from "../../preact";

const cssAttributes = {
    fontSize: 'font-size',
    fontFamily: 'font-family',
    fontWeight: 'font-weight',
    lineHeight: 'line-height',
    color: 'color',
    margin: 'margin'
}
export class TypographyRenderer extends ControlHtmlRenderer<TypographyClass> {
    public get UseShadowDom(): boolean {
        return true;
    }

    public OnStyleCreating(obj: TypographyClass, sb: StringBuilder): void {
        const variant = obj.vp_variant;

        if (obj.controller?.Theme != null) {
            if (obj.controller?.Theme?.typography?.[variant]) {
                const tag = variant;

                for (let key in obj.controller?.Theme?.typography?.[variant]) {
                    if (key.length > 0 && key[0] === '@') {
                        sb.AppendLine(`${key} {`);
                        for (let mediaKey in obj.controller?.Theme?.typography?.[variant][key]) {
                            sb.AppendLine(`${tag} {`)
                            if (cssAttributes[mediaKey]) {
                                sb.AppendLine(`${cssAttributes[mediaKey]}:${obj.controller?.Theme?.typography?.[variant][key][mediaKey]};`)
                            }
                            sb.AppendLine(`}`);
                        }
                        sb.AppendLine(`}`);
                    }
                }

                sb.AppendLine(`${tag} {`)
                for (let key in obj.controller?.Theme?.typography?.[variant]) {
                    if (key.length > 0 && key[0] !== '@') {
                        if (cssAttributes[key]) {
                            sb.AppendLine(`${cssAttributes[key]}:${obj.controller?.Theme?.typography?.[variant][key]};`)
                        }
                    }
                }
                sb.AppendLine(`}`);
            }

            if (obj.controller?.Theme?.palette?.text?.primary) {
                obj.Appearance.Color = obj.controller?.Theme?.palette?.text?.primary;
            }
        }
    }

    protected OnShadowDomDidMount(ref: HTMLElement, obj: TypographyClass): void {

    }

    public GenerateElement(obj: TypographyClass): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: TypographyClass): void {
        const variant = obj.vp_variant;

        if (obj.controller?.Theme != null) {
            if (obj.controller?.Theme?.components.Typography?.variantMapping[variant]) {
                const tag = { variant: variant };
                this.WriteComponent(
                    <tag.variant>
                        {obj.vp_text}
                    </tag.variant>
                )
            }
        }

    }
}