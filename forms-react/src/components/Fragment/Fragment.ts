import { UIViewClass } from "../UIView/UIViewClass";
import { FragmentClass } from "./FragmentClass";


export function Fragment(...children: UIViewClass[]) {
    return new FragmentClass().children(children);
}