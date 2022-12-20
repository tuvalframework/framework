import { int } from "@tuval/core";
import { viewFunc } from "../getView";
import { UIView } from "../UIView";
import { RecordsContextClass } from "./RecordsContextClass";
import { IRecordsContextContentFunctionParams, RecordsContextContentFunction } from "./types";



export function UIRecordsContext(content: RecordsContextContentFunction): RecordsContextClass {
    return viewFunc(RecordsContextClass, (controller, propertyBag) => {
        return new RecordsContextClass().setController(controller).PropertyBag(propertyBag).setChilds(content as any)._content(content);
    });

}