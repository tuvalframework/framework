import { foreach } from "@tuval/core";
import { useEffect, useRef } from "../../hooks";
import { Fragment } from "../../preact/compat";
import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { Teact } from "../../windows/Forms/Components/Teact";
import { Avatar } from "../Components/avatar/Avatar";
import { OverlayPanel } from "../Components/overlaypanel/OverlayPanel";
import { getView } from "../getView";
import { IRenderable } from "../IView";
import { UIController } from "../UIController";
import { AvatarViewClass } from './AvatarViewClass';


export class AvatarViewRenderer extends ControlHtmlRenderer<AvatarViewClass> {
    overlay: any;

    public GenerateElement(obj: AvatarViewClass): boolean {
        this.WriteStartFragment();
        return true;
    }


    public GenerateBody(obj: AvatarViewClass): void {
        if (obj.vp_Image) {
            this.WriteComponent(
                <Avatar image={obj.vp_Image} shape='circle' size="xlarge">
                    {this.CreateControls(obj)}
                </Avatar>
            );
        }

    }

    protected CreateControls(obj: AvatarViewClass): any[] {
        const vNodes: any[] = [];

        if ((obj as any).SubViews != null) {
            foreach(obj.GetViews(), (root: IRenderable) => {
                const view = getView(obj instanceof UIController ? obj : (obj as any).controller, root);
                if (view != null) {
                    vNodes.push(view.Render());
                }
            });
        }

        return vNodes;
    }
}