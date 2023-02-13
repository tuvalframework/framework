import { UIViewClass } from "../../components/UIView/UIViewClass";
import { DataContextClass } from "./DataContextClass";

 export function DataContext(...views: UIViewClass[]): DataContextClass {
        return new DataContextClass().children(...views);
}