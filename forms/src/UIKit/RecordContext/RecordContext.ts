import { viewFunc } from "../getView";
import { UIView } from "../UIView";
import { RecordContextClass } from "./RecordContextClass";


export function _RecordContext(...content: UIView[]): RecordContextClass {

    return viewFunc(RecordContextClass, (controller, propertyBag) => {
        return new RecordContextClass().setController(controller).PropertyBag(propertyBag).setChilds(...content);
    });

}

 export function UIRecordContext(content: (data?: any) => UIView | Function): RecordContextClass {
    return viewFunc(RecordContextClass, (controller, propertyBag) => {
        return new RecordContextClass().setController(controller).PropertyBag(propertyBag).setChilds(content as any)._content(content);
    });

}