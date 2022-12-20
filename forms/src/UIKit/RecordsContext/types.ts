import { int } from "@tuval/core";
import { UIView } from "../UIView";

export interface IRecordsContextContentFunctionParams {
    data?: any[];
    isLoading?: boolean;
    error?: string; 
    total?: int;
    refetch?: boolean;
}

export type RecordsContextContentFunction = (params:IRecordsContextContentFunctionParams) => UIView | Function