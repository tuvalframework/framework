import { UIView } from "../UIView/UIView";
import { DropdownClass } from "./DropdownClass";


export type DropDownItemFunction = (selectedItemTemplate: (option: any) => UIView) => DropdownClass;

export function Dropdown(): DropdownClass;
export function Dropdown(itemTemplate: (option: any) => UIView): DropDownItemFunction;
export function Dropdown(...args: any[]): DropDownItemFunction | DropdownClass {
    if (args.length === 0) {
        return new DropdownClass();
    } else {
        const itemTemplate = args[0];
        return (selectedItemTemplate: (option: any) => UIView) => {
            return new DropdownClass().itemTemplate(itemTemplate).selectedItemTemplate(selectedItemTemplate);
        }
    }
}