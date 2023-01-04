import { foreach, is } from "@tuval/core";
import { useEffect, useRef } from "../../hooks";
import { Fragment } from "../../preact/compat";
import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { Teact } from "../../windows/Forms/Components/Teact";
import { Avatar } from "../Components/avatar/Avatar";
import { Chips } from "../Components/chips/Chips";
import { OverlayPanel } from "../Components/overlaypanel/OverlayPanel";
import { SlideMenu } from "../Components/slidemenu/SlideMenu";
import { getView } from "../getView";
import { IRenderable } from "../IView";
import { UIController } from "../UIController";
import { DomHandler } from "../../windows/Forms/Components/DomHandler";
import { UISidebarClass } from "./UISidebarClass";
import { Sidebar } from "../Components/sidebar/Sidebar";

DomHandler.addCssToDocument(require('../Components/sidebar/Sidebar.css'));
DomHandler.addCssToDocument(require('../Components/sidebar/Theme.css'));

export class UISidebarRenderer extends ControlHtmlRenderer<UISidebarClass> {
    overlay: any;

    public get UseFrameStyles(): boolean {
        return false;
    }

    public GenerateElement(obj: UISidebarClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    /* public override GetCustomJss<UISidebarClass>(obj: UISidebarClass): Object {
        return {
            '& .p-sidebar': {
                background: '#ffffff',
                color: '#495057',
                border: '0 none',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
            },
            '& .p-sidebar .p-sidebar-header': {
                padding: '1.25rem'
            },
            '& .p-sidebar .p-sidebar-header .p-sidebar-close, & .p-sidebar .p-sidebar-header .p-sidebar-icon': {
                width: '2rem',
                height: '2rem',
                color: '#6c757d',
                border: '0 none',
                background: 'transparent',
                borderRadius: '50%',
                transition: 'background-color 0.2s, color 0.2s, box-shadow 0.2s'
            },
            '& .p-sidebar .p-sidebar-header .p-sidebar-close:enabled:hover, & .p-sidebar .p-sidebar-header .p-sidebar-icon:enabled:hover': {
                color: '#343a40',
                borderColor: 'transparent',
                background: '#e9ecef',
            },
            '& .p-sidebar .p-sidebar-header .p-sidebar-close:focus, & .p-sidebar .p-sidebar-header .p-sidebar-icon:focus': {
                outline: '0 none',
                outlineOffset: 0,
                boxShadow: '0 0 0 0.2rem #C7D2FE'
            },
            '& .p-sidebar .p-sidebar-header + .p-sidebar-content ': {
                paddingTop: 0
            },
            '& .p-sidebar .p-sidebar-content': {
                padding: '1.25rem'
            }
        }
    } */

    public GenerateBody(obj: UISidebarClass): void {
        this.WriteComponent(
            <Sidebar position={obj.vp_SiodebarPosition} style={obj.Appearance.GetStyleObject()} modal={false} visible={obj.vp_Visible} onHide={() => is.function(obj.vp_OnHide) ? obj.vp_OnHide() : void 0}>
                {this.CreateControls(obj)}
            </Sidebar>
        );
    }

    protected CreateControls(obj: UISidebarClass): any[] {
        const vNodes: any[] = [];
        if (obj.Controls != null) {
            foreach(obj.Controls, (control) => {
                vNodes.push(control.CreateMainElement());
            });
        }
        if (obj.GetViews != null) {
            let viewCount = obj.GetViews().length;
            let index = 0;
            foreach(obj.GetViews(), (root: IRenderable) => {
                const view = getView(obj instanceof UIController ? obj : (obj as any).controller, root);

                if (view != null) {
                    vNodes.push(view.Render());
                }
                index++;
            });
        }

        return vNodes;
    }


}