import { is } from "@tuval/core";
import { UIDomElementClass } from "./WidgetClass";


export function UIDomElement(qn: string): UIDomElementClass;
export function UIDomElement(): UIDomElementClass;
export function UIDomElement(...args: any[]): UIDomElementClass {
    if (args.length === 0) {
        return new UIDomElementClass();
    } else {
        const widget = new UIDomElementClass();
        widget.qn(args[0]);
        return widget;
    }
}