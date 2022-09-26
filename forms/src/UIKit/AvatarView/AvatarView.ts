import { viewFunc } from "../getView";
import { UIView } from "../UIView";
import { AvatarViewClass } from "./AvatarViewClass";

export function AvatarView(...content: UIView[]): AvatarViewClass {
    return viewFunc(AvatarViewClass, (controller, propertyBag) => {
        return new AvatarViewClass().setController(controller).PropertyBag(propertyBag).setChilds(...content);
    });
}