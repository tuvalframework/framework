import { is } from "@tuval/core";
import { UIView } from "../UIView/UIView";
import { ButtonClass, IButtonProps } from "./ButtonClass";

export type ButtonTemplate = (...subViews: UIView[]) => ButtonClass;

export function Button(props: IButtonProps): ButtonTemplate;
export function Button(...subViews: UIView[]): ButtonClass;
export function Button(...args: any[]): ButtonClass | ButtonTemplate {
    if (args.length === 1 && !(args[0] instanceof UIView) && !is.function(args[0])) {
        const { variant, color } = args[0];
        return (...subViews: UIView[]) => {
            return new ButtonClass().variant(variant).color(color).children(...subViews);
        }
    } else {
        return new ButtonClass().children(...args);
    }
}

export function UIButton(props: IButtonProps): ButtonTemplate;
export function UIButton(...subViews: UIView[]): ButtonClass;
export function UIButton(...args: any[]): ButtonClass | ButtonTemplate {
    if (args.length === 1 && !(args[0] instanceof UIView) && !is.function(args[0])) {
        const { variant, color } = args[0];
        return (...subViews: UIView[]) => {
            return new ButtonClass().variant(variant).color(color).children(...subViews);
        }
    } else {
        return new ButtonClass().children(...args);
    }
}