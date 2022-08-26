import { is, StringBuilder } from '@tuval/core';
import { Fragment } from "../../../../../preact/compat";
import { InputText } from "../../inputtext/TuInputText";
import { Teact } from "../../Teact";
import { ControlHtmlRenderer } from "../HtmlRenderer/ControlHtmlRenderer";
import { ITextBox } from "./ITextBox";


export class TextBoxRenderer extends ControlHtmlRenderer<ITextBox> {
    public get UseShadowDom(): boolean {
        return true;
    }

    public OnStyleCreating(obj: ITextBox, sb: StringBuilder): void {
        const css = require('../../inputtext/InputText.css');
        sb.AppendLine(css);
    }
    protected OnComponentDidMount(obj: ITextBox): void {
        if (obj.Autofocus) {
            this.Ref.elementRef.current.focus();
        }
    }

    public GenerateBody(obj: ITextBox): void {
        if (is.nullOrEmpty(obj.LeftIcon)) {
            this.WriteComponent(
                <Fragment>
                    {/*  <label htmlFor="firstname1">{this.Label}</label> */}
                    <InputText
                        ref={e => {
                            this.Ref = e;
                        }}
                        type="text"
                        value={obj.Text}
                        disabled={obj.Disabled}
                        onInput={(e) => obj.Text = e.target.value}
                        placeholder={obj.Placeholder}
                        onkeydown={(e) => obj.OnKeyDownInternal(e)} />
                </Fragment>
            );
        } else {
            this.WriteComponent(<span className="p-input-icon-left">
                <i className={obj.LeftIcon} />
                <InputText
                    ref={e => {
                        this.Ref = e;
                    }}
                    value={obj.Text}
                    disabled={obj.Disabled}
                    onInput={(e) => obj.Text = e.target.value}
                    placeholder={obj.Placeholder}
                    onkeydown={(e) => obj.OnKeyDownInternal(e)} />
            </span>);
        }
    }

}