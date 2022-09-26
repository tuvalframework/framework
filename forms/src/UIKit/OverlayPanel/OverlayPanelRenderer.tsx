import { foreach } from "@tuval/core";
import { useEffect, useRef } from "../../hooks";
import { Fragment } from "../../preact/compat";
import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { Teact } from "../../windows/Forms/Components/Teact";
import { OverlayPanel } from "../Components/overlaypanel/OverlayPanel";
import { getView } from "../getView";
import { IRenderable } from "../IView";
import { UIController } from "../UIController";
import { OverlayPanelClass } from "./OverlayPanelClass";


export class OverlayPanelRenderer extends ControlHtmlRenderer<OverlayPanelClass> {
    overlay: any;

    public GenerateElement(obj: OverlayPanelClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public override GetCustomJss(): Object {
        return {
            '.p-overlaypanel .p-overlaypanel-content': {
                padding:'0px'
            }
        }
    }

    public GenerateBody(obj: OverlayPanelClass): void {

        const style = {};
        style['width'] = obj.Appearance.Width;
        style['height'] = obj.Appearance.Height;
        style['padding'] = obj.Appearance.Padding;

        this.WriteComponent(
            <Fragment>
                <div style={style} onclick={(e) => { this.overlay.toggle(e); /* e.stopPropagation(); e.preventDefault(); */ }}>
                    {this.createHeaderTemplate(obj)}
                    <OverlayPanel ref={el => this.overlay = el} dismissable>
                        {this.CreateControls(obj)}
                    </OverlayPanel>
                </div>
            </Fragment>
        );
    }

   /*  public override OnComponentDidUpdate(obj: OverlayPanelClass): void {
        if (obj._show) {
            this.overlay.show();
        } else {
            this.overlay.hide();
        }
    }
 */
    private createHeaderTemplate(obj: OverlayPanelClass): any {
        const vNodes: any[] = [];

        if (obj.vp_HeaderTemplate != null) {
            const view = getView(obj instanceof UIController ? obj : (obj as any).controller, obj.vp_HeaderTemplate);
            if (view != null) {
                vNodes.push(view.Render());
            }
        }

        return vNodes;
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