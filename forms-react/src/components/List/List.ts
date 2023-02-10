import { UIViewClass } from "../UIView/UIViewClass";
import { ListClass } from "./ListClass";


export function List(...children: UIViewClass[]) {
    return new ListClass().children(children);
}