
import React, { createContext } from "react";
import { DataProtocolContentFunction } from "./DataProvider";
import DataProtocolRenderer from "./DataProviderRenderer";
import { UIView } from "../../components/UIView/UIView";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import { useAsync } from 'react-async-hook';
import { is } from "@tuval/core";
import { gql, useQuery } from "@apollo/client";


export const DataProtocolContext = createContext(null!);

export const useDataProtocol = (query: string): any => {
    const hook = React.useContext(DataProtocolContext);

    if (hook != null) {
        const { executer, variables } = React.useContext(DataProtocolContext);
        const { result: _data, loading: isLoading, error } = useAsync(executer, [query, variables]);
        return { data: ((_data as any)?.data as any)?.domain, isLoading, error };
    } else {
        const GET_LOCATIONS = gql`
       ${query}
      `;
        const { loading: isLoading, error, data } = useQuery(GET_LOCATIONS)
        return { data, isLoading, error };
    }
}


export class DataProtocolClass<T> extends UIView {
    @ViewProperty() vp_Config: any;
    public config(value: any): this {
        this.vp_Config = value;
        return this;
    }

    @ViewProperty() vp_Content: DataProtocolContentFunction;
    public _content(value: DataProtocolContentFunction): this {
        this.vp_Content = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_qn: string;
    public qn(value: any): this {
        this.vp_qn = value;
        return this;
    }


    public constructor() {
        super();
    }

    public render() {
        return (<DataProtocolRenderer control={this as any} ></DataProtocolRenderer>)
    }
}