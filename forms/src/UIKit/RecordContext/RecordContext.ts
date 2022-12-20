import { viewFunc } from "../getView";
import { UIView } from "../UIView";
import { RecordContextClass } from "./RecordContextClass";
import { RecordContextContentFunction } from "./types";


/* export function _RecordContext(...content: UIView[]): RecordContextClass {

    return viewFunc(RecordContextClass, (controller, propertyBag) => {
        return new RecordContextClass().setController(controller).PropertyBag(propertyBag).setChilds(...content);
    });

} */

export function UIRecordContext<T= any>(content: RecordContextContentFunction<T>): RecordContextClass<T> {
    return viewFunc(RecordContextClass, (controller, propertyBag) => {
        return new RecordContextClass<T>().setController(controller).PropertyBag(propertyBag).setChilds(content as any)._content(content);
    });

}