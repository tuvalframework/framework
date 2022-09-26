import { viewFunc } from "../getView";
import { UIView } from "../UIView";
import { SlideMenuViewClass } from "./SlideMenuViewClass";

export function SlideMenuView(...content: UIView[]): SlideMenuViewClass {
    return viewFunc(SlideMenuViewClass, (controller, propertyBag) => {
        return new SlideMenuViewClass().setController(controller).PropertyBag(propertyBag).setChilds(...content);
    });
}