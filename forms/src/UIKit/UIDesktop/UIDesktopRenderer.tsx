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

import { Sidebar } from "../Components/sidebar/Sidebar";
import { UIDesktopClass } from "./UIDesktopClass";

DomHandler.addCssToDocument(require('../Components/sidebar/Sidebar.css'));
DomHandler.addCssToDocument(require('../Components/sidebar/Theme.css'));

export class UIDesktopRenderer extends ControlHtmlRenderer<UIDesktopClass> {
    overlay: any;

    public GenerateElement(obj: UIDesktopClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public override GetCustomJss<UIDesktopClass>(obj: UIDesktopClass): Object {
        return {

        }
    }

    public GenerateBody(obj: UIDesktopClass): void {
        this.WriteComponent(
            obj.vp_Desktop.CreateMainElement()
        );
    }
}