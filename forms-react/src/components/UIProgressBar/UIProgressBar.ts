import { int, is } from "@tuval/core";
import { UIView } from "../UIView/UIView";
import { UIProgressBarClass } from "./UIProgressBarClass";

export type UIProgressBarTemplate = (value: int) => UIView;

export function UIProgressBar(viewTemplate: UIProgressBarTemplate): UIProgressBarClass;
export function UIProgressBar(): UIProgressBarClass;
export function UIProgressBar(...args: any[]): UIProgressBarClass {
    if (args.length === 0) {
            return new UIProgressBarClass()
    } else if (args.length === 1 && is.function(args[0])) {
        const templateFunc: UIProgressBarTemplate = args[0];

            return new UIProgressBarClass().valueTemplate(templateFunc)

    }

    throw new Error('Argument Exceprion In UIProgressBar')
}