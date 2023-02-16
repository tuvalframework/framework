import { UIView } from "../UIView/UIView";
import { UIOverlayPanelClass } from "./UIOverlayPanelClass";

export function OverlayPanel(headerTemplate: UIView): (...content: UIView[]) =>UIOverlayPanelClass {
    return (...content: UIView[]) => {
            return new UIOverlayPanelClass().children(...content).headerTemplate(headerTemplate);
    }
}