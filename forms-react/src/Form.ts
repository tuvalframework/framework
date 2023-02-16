import { UIView } from "./components/UIView/UIView";
import { FormClass } from "./FormClass";


export function Form(...controls:UIView[]) {
    return new FormClass().controls(controls);
}