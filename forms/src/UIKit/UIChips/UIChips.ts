import { viewFunc } from "../getView";
import { UIView } from "../UIView";
import { UIChipClass } from "./UIChipClass";

export function UIChips(): UIChipClass {
    return viewFunc(UIChipClass, (controller, propertyBag) => {
        return new UIChipClass().setController(controller).PropertyBag(propertyBag);
    });
}