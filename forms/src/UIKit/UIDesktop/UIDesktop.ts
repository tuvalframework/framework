import { viewFunc } from "../getView";
import { UIDesktopClass } from "./UIDesktopClass";


export function UIDesktop(): UIDesktopClass {
    return viewFunc(UIDesktopClass, (controller, propertyBag) => {
        return new UIDesktopClass().setController(controller).PropertyBag(propertyBag)
    });
}