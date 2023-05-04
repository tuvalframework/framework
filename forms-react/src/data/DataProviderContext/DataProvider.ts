
import { UIView } from "../../components/UIView/UIView";
import { DataProtocolClass } from "./DataProviderClass";
import { int } from "@tuval/core";

export interface IDataProtocolContentFunctionParams {
    data?: any[];
    isLoading?: boolean;
    error?: Error;
}

export type DataProtocolContentFunction = (params: IDataProtocolContentFunctionParams) => UIView

export function DataProtocol(qn: string): (content: DataProtocolContentFunction)=> DataProtocolClass<any> {
    return (content: DataProtocolContentFunction): DataProtocolClass<any> => {
        return new DataProtocolClass()._content(content).qn(qn);
    }
}

export function ProviderContext(qn: string): Function {
    return (content: DataProtocolContentFunction): DataProtocolClass<any> => {
        return new DataProtocolClass()._content(content).qn(qn);
    }
}

export function BrokerContext(qn: string): Function {
    return (content: DataProtocolContentFunction): DataProtocolClass<any> => {
        return new DataProtocolClass()._content(content).qn(qn);
    }
}