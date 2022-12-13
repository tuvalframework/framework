import { is } from '@tuval/core';
import { IControl } from '../../windows/Forms/Components/AAA/IControl';
import { viewFunc } from '../getView';
import { UIController } from '../UIController';
import { UIView } from '../UIView';
import { ButtonView, IButtonProps } from './ButtonView';

export type ButtonTemplate = (...subViews: (UIView | IControl | UIController)[]) => ButtonView;

export function Button(props: IButtonProps): ButtonTemplate;
export function Button(...subViews: (UIView | IControl | UIController)[]): ButtonView;
export function Button(...args: any[]): ButtonView | ButtonTemplate {
    if (args.length === 1 && !(args[0] instanceof UIView) && !is.function(args[0])) {
        const { variant, color } = args[0];
        return (...subViews: (UIView | IControl | UIController)[]) => {
            return viewFunc(ButtonView, (controller, propertyBag) => {
                return new ButtonView().setController(controller).PropertyBag(propertyBag).variant(variant).color(color).setChilds(...subViews);
            })
        }
    } else {
        return viewFunc(ButtonView, (controller, propertyBag) => {
            return new ButtonView().setController(controller).PropertyBag(propertyBag).setChilds(...args);
        });
    }
}