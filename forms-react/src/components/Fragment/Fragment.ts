import { UIView } from "../UIView/UIView";
import { FragmentClass } from "./FragmentClass";


export function Fragment(...children: UIView[]) {
    return new FragmentClass().children(children);
}