import { viewFunc } from "../getView";
import { UIView } from "../UIView";
import { CreateContextClass } from "./CreateContextClass";



 export function UICreateContext(content: (create?: Function, isLoading?: boolean, isSuccess?: boolean) => UIView | Function): CreateContextClass {
    return viewFunc(CreateContextClass, (controller, propertyBag) => {
        return new CreateContextClass().setController(controller).PropertyBag(propertyBag).setChilds(content as any)._content(content);
    });

}