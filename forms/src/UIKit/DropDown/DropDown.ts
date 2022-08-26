import { viewFunc } from '../getView';
import { UIView } from '../UIView';
import { DropDownClass } from './DropDownClass';

export type DropDownItemFunction = (selectedItemTemplate: (option: any) => UIView | Function) => DropDownClass;
export function DropDown(itemTemplate: (option: any) => UIView | Function): DropDownItemFunction {
    return (selectedItemTemplate: (option: any) => UIView | Function) => {
        return viewFunc(DropDownClass, (controller, propertyBag) => {
            return new DropDownClass().setController(controller).PropertyBag(propertyBag).itemTemplate(itemTemplate).selectedItemTemplate(selectedItemTemplate);
        });
    }
}