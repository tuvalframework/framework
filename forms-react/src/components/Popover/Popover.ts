import { PopupButtonClass } from "../PopupButton";
import { UIView } from "../UIView/UIView";
import { PopoverClass } from "./PopoverClass";

export type PopoverFunction = (...views: UIView[]) => PopoverClass;

export function Popover(view: UIView): PopoverFunction {
    return (...views: UIView[]) => {
        return new PopoverClass().view(view).children(views);
    }
    
}