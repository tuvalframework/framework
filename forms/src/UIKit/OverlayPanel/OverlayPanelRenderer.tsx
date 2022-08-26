import { foreach } from "@tuval/core";
import { useEffect, useRef } from "../../hooks";
import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { Teact } from "../../windows/Forms/Components/Teact";
import { OverlayPanel } from "../Components/overlaypanel/OverlayPanel";
import { getView } from "../getView";
import { IRenderable } from "../IView";
import { UIController } from "../UIController";
import { OverlayPanelClass } from "./OverlayPanelClass";


export class OverlayPanelRenderer extends ControlHtmlRenderer<OverlayPanelClass> {
    shadowDom: any;
    protected menu: any;
    public get UseShadowDom(): boolean {
        return true;
    }


    public GenerateElement(obj: OverlayPanelClass): boolean {
        this.WriteStartFragment();
        return true;
    }


    public GenerateBody(obj: OverlayPanelClass): void {
        const op = useRef(null);

        useEffect(() => {
            if (obj._show) {
                op.current.show();
            } else {
                op.current.hide();
            }
        }, []);

        this.WriteComponent(
            <OverlayPanel ref={op} showCloseIcon dismissable>
                {this.CreateControls(obj)}
            </OverlayPanel>
        );
    }

    protected CreateControls(obj: OverlayPanelClass): any[] {
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