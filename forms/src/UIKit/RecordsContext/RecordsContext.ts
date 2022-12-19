import { int } from "@tuval/core";
import { viewFunc } from "../getView";
import { UIView } from "../UIView";
import { RecordsContextClass } from "./RecordsContextClass";


export function UIRecordsContext(content: (data?: any[], total?: int, isLoading?: boolean, error?: string, refetch?: boolean) => UIView | Function): RecordsContextClass {
    return viewFunc(RecordsContextClass, (controller, propertyBag) => {
        return new RecordsContextClass().setController(controller).PropertyBag(propertyBag).setChilds(content as any)._content(content);
    });

}