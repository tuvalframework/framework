import { UIView } from "../../components/UIView/UIView";
import { RecordContextClass } from "./RecordContextClass";

export interface IRecordContextContentFunctionParams<T> {
    data?: T;
    isLoading?: boolean;
    error?: any;
}

export type RecordContextContentFunction<T> = (params: IRecordContextContentFunctionParams<T>) => UIView;

export function UIRecordContext<T = any>(content: RecordContextContentFunction<T>): RecordContextClass<T> {
    return new RecordContextClass<T>().children(content);
}