import { UIView } from "../../components/UIView/UIView";
import { ConfigContextClass } from "./ConfigContextClass";


export function ConfigContext(childFunc:()=> UIView): ConfigContextClass {
    return new ConfigContextClass().childFunc(childFunc);
}