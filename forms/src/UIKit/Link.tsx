
import { TLabel } from "../windows/Forms/Components/AAA/TLabel/TLabel";
import { TLabelRenderer } from "../windows/Forms/Components/AAA/TLabel/TLabelRenderer";
import { UIView, ViewProperty } from "./UIView";
import { ILabel } from '../windows/Forms/Components/AAA/TLabel/ILabel';
import { int } from "@tuval/core";
import * as MarkdownIt from "markdown-it";
import { ControlHtmlRenderer } from "../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { UIController } from "./UIController";
import { viewFunc } from "./getView";
import { Link } from "../router-dom";
import { Teact } from "../windows/Forms/Components/Teact";

class LinkRenderer extends ControlHtmlRenderer<UILinkCLass> {
    public get UseShadowDom(): boolean {
        return true;
    }



    public GenerateElement(obj: UILinkCLass): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: UILinkCLass): void {
        this.WriteComponent(
            <div>
                <Link to="/about">About</Link>
                <Link to="/hello">Hello</Link>
            </div>
        );
    }
}
export class UILinkCLass extends UIView {



    public setController(controller: UIController): this {
        super.setController(controller);

        this.Renderer = new LinkRenderer({
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

export function UILink(text: string): UILinkCLass {
    return viewFunc(UILinkCLass, (controller, propertyBag) => {
        return new UILinkCLass().setController(controller).PropertyBag(propertyBag);
    });
}