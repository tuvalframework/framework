import { int } from "@tuval/core";
import { UIView } from "../UIView";

export interface IRecordContextContentFunctionParams<T> {
    data?: T;
    isLoading?: boolean;
    error?: string;
}

export type RecordContextContentFunction<T> = (params:IRecordContextContentFunctionParams<T>) => UIView | Function