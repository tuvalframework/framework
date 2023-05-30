import { Fragment } from "../Fragment";
import { IconClass } from "./IconClass";

export function Icon(icon: any) {
        return new IconClass().icon(icon);
}