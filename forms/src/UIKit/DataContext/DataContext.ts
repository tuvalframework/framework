import { viewFunc } from "../getView";
import { UIView } from "../UIView";
import { DataContextClass } from "./DataContextClass";


export function _DataContext(...content: UIView[]): DataContextClass {

    return viewFunc(DataContextClass, (controller, propertyBag) => {
        return new DataContextClass().setController(controller).PropertyBag(propertyBag).setChilds(...content);
    });

}

 export function DataContext(content: () => UIView | Function): DataContextClass {
    return viewFunc(DataContextClass, (controller, propertyBag) => {
        return new DataContextClass().setController(controller).PropertyBag(propertyBag).setChilds(content as any);
    });

}
 