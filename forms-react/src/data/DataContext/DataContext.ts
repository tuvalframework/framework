import { UIView } from "../../components/UIView/UIView";
import { DataContextClass } from "./DataContextClass";

 export function DataContext(...views: UIView[]): DataContextClass {
        return new DataContextClass().children(...views);
}