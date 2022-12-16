import { viewFunc } from "../getView";
import { UIView } from "../UIView";
import { UpdateContextClass } from "./UpdateContextClass";



 export function UIUpdateContext(content: (create?: Function, data?: any[], isLoading?: boolean, isSuccess?: boolean) => UIView | Function): UpdateContextClass {
    return viewFunc(UpdateContextClass, (controller, propertyBag) => {
        return new UpdateContextClass().setController(controller).PropertyBag(propertyBag).setChilds(content as any)._content(content);
    });

}