import { int } from "@tuval/core";
import { UIView } from "../../components/UIView/UIView";
import { RecordsContextClass } from "./RecordsContextClass";


export interface IRecordsContextContentFunctionParams {
    data?: any[];
    isLoading?: boolean;
    error?: Error; 
    total?: int;
    refetch?: any;
}

export type RecordsContextContentFunction = (params:IRecordsContextContentFunctionParams) => UIView 

export function UIRecordsContext(content: RecordsContextContentFunction): RecordsContextClass<any> {
  
        return new RecordsContextClass()._content(content);


}