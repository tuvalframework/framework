import { UIViewClass } from "./UIView/UIViewClass";
import { FormClass } from "./FormClass";


export function Form(...controls:UIViewClass[]) {
    return new FormClass().controls(controls);
}