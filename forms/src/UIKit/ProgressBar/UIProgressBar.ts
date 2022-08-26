import { viewFunc } from "../getView";
import { UIView } from "../UIView";
import { UIProgressBarClass } from "./UIProgressBarClass";
import { int, is } from '@tuval/core';

export type UIProgressBarTemplate = (value: int) => UIView;

export function UIProgressBar(viewTemplate: UIProgressBarTemplate): UIProgressBarClass;
export function UIProgressBar(): UIProgressBarClass;
export function UIProgressBar(...args: any[]): UIProgressBarClass {
    if (args.length === 0) {
        return viewFunc(UIProgressBarClass, (controller, propertyBag) => {
            return new UIProgressBarClass().setController(controller).PropertyBag(propertyBag)
        })
    } else if (args.length === 1 && is.function(args[0])) {
        const templateFunc: UIProgressBarTemplate = args[0];
        return viewFunc(UIProgressBarClass, (controller, propertyBag) => {
            return new UIProgressBarClass().setController(controller).PropertyBag(propertyBag).valueTemplate(templateFunc)
        })
    }

    throw new Error('Argument Exceprion In UIProgressBar')
}