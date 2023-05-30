import { Fragment } from "../Fragment";
import { IconClass } from "./IconClass";

export function Icon(icon: any) {
    if (icon == null) {
        return Fragment();
    } else {
        return new IconClass().icon(icon);
    }
}