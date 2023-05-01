
import React, { createContext } from "react";
import { DataProtocolContentFunction } from "./DataProvider";
import DataProtocolRenderer from "./DataProviderRenderer";
import { UIView } from "../../components/UIView/UIView";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import { useAsync } from 'react-async-hook';
import { is } from "@tuval/core";
import { useQuery, useQueryClient } from "react-query";
import { gql } from "@apollo/client";


export const DataProtocolContext = createContext<any>(null!);

export const useDataProtocol = (query: string): any => {
    const hook = React.useContext(DataProtocolContext);

    if (hook != null) {
        const { executer, variables } = React.useContext(DataProtocolContext);
        const { result: _data, loading: isLoading, error } = useAsync(executer, [query, variables]);
        return { data: ((_data as any)?.data as any)?.domain, isLoading, error };
    } else {
        /*  const GET_LOCATIONS = gql`
        ${query}
       `;
         const { loading: isLoading, error, data } = useQuery(GET_LOCATIONS)
         return { data, isLoading, error }; */
    }
}

export const useProvider = (): any => {
    const provider = React.useContext(DataProtocolContext);
    return provider;
}

export const useProviderQuery = (query: string, variables: any = {}): any => {

    const client = useQueryClient();

    /* console.log( gql`
        query tasks {
         id
         name
        }
        `); */
    const dataProviderContextValue = React.useContext(DataProtocolContext);

    const vars = Object.assign({ ...variables }, dataProviderContextValue.config.variables || {});
    const domainVariablesDefs = Object.keys(vars).map(key => {
        const value = vars[key];
        if (is.string(value)) {
            return ['$' + key, ':', 'String'].join('')
        }
    })

    // alert(JSON.stringify(domainVariablesDefs.join(',')))

    const domainVariables = Object.keys(dataProviderContextValue.config.variables).map(key => {
        return [key, ':', '$' + key].join('')
    })


    let _query = '';
    if (Object.keys(vars).length > 0) {
        _query = `
        query provider(${domainVariablesDefs})
            {
                domain(${domainVariables}) {
                   ${query}
                }
            }
      `
    } else {
        _query = `
        query provider {
                domain {
                   ${query}
                }
        }
      `
    }




    const dataProvider = dataProviderContextValue.provider;
    const { data: _data, isLoading, error } = useQuery(
        // Sometimes the id comes as a string (e.g. when read from the URL in a Show view).
        // Sometimes the id comes as a number (e.g. when read from a Record in useGetList response).
        // As the react-query cache is type-sensitive, we always stringify the identifier to get a match
        [query, { ...vars }],
        () =>
            dataProvider['query'](client, _query, vars, dataProviderContextValue.config),
        {}
    );
    const data = ((_data as any)?.data as any)?.domain;
    return { data: data ? data : {}, isLoading, error };
}


export class DataProtocolClass<T> extends UIView {
    @ViewProperty() vp_Config: any;
    public config(value: any): this {
        this.vp_Config = value;
        return this;
    }

    @ViewProperty() vp_Content: Function/* DataProtocolContentFunction */;
    public _content(value: Function/* DataProtocolContentFunction */): this {
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