import { UIView } from "../UIView/UIView";
import { ListClass } from "./ListClass";


export function List(...children: UIView[]) {
    return new ListClass().children(children);
}