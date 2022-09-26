import { viewFunc } from "../getView";
import { UIView } from "../UIView";
import { OverlayPanelClass } from "./OverlayPanelClass";

export function OverlayPanel(headerTemplate: UIView): (...content: UIView[]) => OverlayPanelClass {
    return (...content: UIView[]) => {
        return viewFunc(OverlayPanelClass, (controller, propertyBag) => {
            return new OverlayPanelClass().setController(controller).PropertyBag(propertyBag).setChilds(...content).headerTemplate(headerTemplate);
        });
    }
}