import { viewFunc } from "../getView";
import { UIView } from "../UIView";
import { DeleteContextClass } from "./DeleteContextClass";



 export function UIDeleteContext(content: (create?: Function, data?: any, isLoading?: boolean, isSuccess?: boolean) => UIView | Function): DeleteContextClass {
    return viewFunc(DeleteContextClass, (controller, propertyBag) => {
        return new DeleteContextClass().setController(controller).PropertyBag(propertyBag).setChilds(content as any)._content(content);
    });

}