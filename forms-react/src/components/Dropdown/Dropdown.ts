import { UIView } from "../UIView/UIView";
import { DropdownClass } from "./DropdownClass";


export type DropDownItemFunction = (selectedItemTemplate: (option: any) => UIView) => DropdownClass;

export function Dropdown(itemTemplate: (option: any) => UIView): DropDownItemFunction {
    return (selectedItemTemplate: (option: any) => UIView) => {
        return new DropdownClass().itemTemplate(itemTemplate).selectedItemTemplate(selectedItemTemplate);
    }
}