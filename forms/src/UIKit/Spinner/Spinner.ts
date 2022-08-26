
import { TLabel } from "../../windows/Forms/Components/AAA/TLabel/TLabel";
import { TLabelRenderer } from "../../windows/Forms/Components/AAA/TLabel/TLabelRenderer";
import { UIView, ViewProperty } from "../UIView";
import { ILabel } from '../../windows/Forms/Components/AAA/TLabel/ILabel';
import { int, StringBuilder } from "@tuval/core";
import * as MarkdownIt from "markdown-it";
import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { UIController } from "../UIController";
import { viewFunc } from "../getView";
import { Teact } from "../../windows/Forms/Components/Teact";


class SpinnerRenderer extends ControlHtmlRenderer<UISpinner> {
    public get UseShadowDom(): boolean {
        return true;
    }

    public OnStyleCreating(obj: UISpinner, sb: StringBuilder): void {
        sb.AppendLine(`

@-webkit-keyframes a {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg)
    }
    to {
        -webkit-transform: rotate(1turn);
        transform: rotate(1turn)
    }
}

@keyframes a {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg)
    }
    to {
        -webkit-transform: rotate(1turn);
        transform: rotate(1turn)
    }
}

.mk-spinner-pie {
    content: "";
    display: inline-block;
    position: absolute;
    width: 18px;
    height: 18px;
    margin-top: 7px;
    margin-left: 5px;
    z-index: 1;
    background: transparent;
    border-radius: 50%;
    border-color: #cae7b9 #f3de8a #eb9486 #7e7f9a;
    border-style: solid;
    border-width: 5px;
    -webkit-animation: a 1s linear infinite;
    animation: a .4s linear infinite;
}

.indicator-small {
    position: relative;
    height: 35px;
    line-height: 35px;
    margin: 5px 0;
    white-space: nowrap;
}

.indicator-small .message {
    position: absolute;
    padding-left: 35px;
    padding-right: 70px;
    top: 0;
    font-weight: 400;
    width: 100%;
    font-size: 12px;
    color: #87a6bc;
}

.mk-spinner-wrap {
    position: relative;
}

          `);
    }


    public GenerateElement(obj: UISpinner): boolean {
        this.WriteStartElement('div');
        return true;
    }
    public GenerateBody(obj: UISpinner): void {
        this.WriteStartElement('span');
        this.WriteStartElement('div');
        this.WriteAttrVal('className', 'indicator-small');


        this.WriteStartElement('div');
        this.WriteAttrVal('className', 'mk-spinner-wrap');

        this.WriteStartElement('div');
        this.WriteAttrVal('className', 'mk-spinner-pie');

        this.WriteEndElement();

        this.WriteEndElement();

        this.WriteEndElement();

        this.WriteEndElement();
        this.WriteEndElement();

    }
}
export class UISpinner extends UIView {
    public setController(controller: UIController): this {
        super.setController(controller);

        this.Renderer = new SpinnerRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }

    public constructor() {
        super();
    }

}

export function Spinner(): UISpinner {
    return viewFunc(UISpinner, (controller, propertyBag) => {
        return new UISpinner().setController(controller).PropertyBag(propertyBag);
    });
}