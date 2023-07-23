import { UIView } from "../../components/UIView/UIView";
import { OptionsContextClass } from "./OptionsContextClass";


export function OptionsContext(childFunc:()=> UIView): OptionsContextClass {
    return new OptionsContextClass().childFunc(childFunc);
}