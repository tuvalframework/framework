import { is } from "@tuval/core";
import { WidgetClass } from "./WidgetClass";


export function UIWidget(qn: string): WidgetClass;
export function UIWidget(): WidgetClass;
export function UIWidget(...args: any[]): WidgetClass {
    if (args.length === 0) {
        return new WidgetClass();
    } else {
        const widget = new WidgetClass();
        widget.qn(args[0]);
        return widget;
    }
}