import { viewFunc } from "../getView";
import { UIView } from "../UIView";
import { OverlayPanelClass } from "./OverlayPanelClass";

export function OverlayPanel(...content: UIView[]): OverlayPanelClass {
    return viewFunc(OverlayPanelClass, (controller, propertyBag) => {
        return new OverlayPanelClass().setController(controller).PropertyBag(propertyBag).setChilds(...content);
    });
}