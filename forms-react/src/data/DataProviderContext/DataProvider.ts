
import { UIView } from "../../components/UIView/UIView";
import { DataProtocolClass } from "./DataProviderClass";
import { int } from "@tuval/core";

export interface IDataProtocolContentFunctionParams {
    data?: any[];
    isLoading?: boolean;
    error?: Error; 
}

export type DataProtocolContentFunction = (params:IDataProtocolContentFunctionParams) => UIView 

export function DataProtocol(content: DataProtocolContentFunction): DataProtocolClass<any> {
  
    return new DataProtocolClass()._content(content);


}