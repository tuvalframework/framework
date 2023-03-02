import { UIView } from "../UIView/UIView";
import { PopupButtonClass } from "./PopupButtonClass";

export type PopupButtonFunction = (...views: UIView[]) => PopupButtonClass;

export function PopupButton(view: UIView): PopupButtonFunction {
    return (...views: UIView[]) => {
        return new PopupButtonClass().view(view).children(views);
    }
    
}