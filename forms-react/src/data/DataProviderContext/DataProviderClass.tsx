
import React, { createContext } from "react";
import { DataProtocolContentFunction } from "./DataProvider";
import DataProtocolRenderer from "./DataProviderRenderer";
import { UIView } from "../../components/UIView/UIView";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import { useAsync } from 'react-async-hook';
import { Guid, is } from "@tuval/core";
import { useMutation, useQuery, useQueryClient } from "react-query";
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

/* export const useProvider = (): any => {
    const provider = React.useContext(DataProtocolContext);
    return provider;
} */

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

export const useProtocol = (provider: symbol | string) => {


    const context = React.useContext(DataProtocolContext);

    //return context.dataProtocolContextObject[provider];
    const dataProviderContextValue = context.dataProtocolContextObject[provider];
    return {
        query: (query: string, variables: any = {}) => {
            debugger
            const client = useQueryClient();

            console.log(dataProviderContextValue.config)
            const vars = Object.assign({ ...variables }, dataProviderContextValue.config.variables || {});
            let keys = Object.keys(vars);

            for (let i = 0; i < keys.length; i++) {
                if (vars[keys[i]] == null) {
                    delete vars[keys[i]];
                }
            }

            const domainVariablesDefs = Object.keys(vars).map(key => {
                const value = vars[key];
                if (is.string(value)) {
                    return ['$' + key, ':', 'String'].join('')
                }
            })

            // alert(JSON.stringify(domainVariablesDefs.join(',')))

            /*  keys = Object.keys(dataProviderContextValue.config.variables);
 
             for (let i = 0; i < keys.length; i++) {
                 if (dataProviderContextValue.config.variables[keys[i]] == null) {
                     delete dataProviderContextValue.config.variables[keys[i]];
                 }
             } */

            const domainVariables = Object.keys(vars).map(key => {
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
                ['__query__', query, { ...vars }],
                () =>
                    dataProvider['query'](client, _query, vars, dataProviderContextValue.config),
                {
                    // cacheTime: 0
                }
            );
            const data = ((_data as any)?.data as any)?.domain;
            return { data: data ? data : {}, isLoading, error };
        },
        lazyQuery: (query: string, _variables: any = {}) => {

            const dataProvider = dataProviderContextValue.provider;

            const client = useQueryClient();
            const mutation = useMutation((variables: any) => {

                const domainVariablesDefs = Object.keys(variables).map(key => {
                    const value = variables[key];
                    if (is.string(value)) {
                        return ['$' + key, ':', 'String'].join('')
                    }
                })

                const domainVariables = Object.keys(variables).map(key => {
                    return [key, ':', '$' + key].join('')
                })

                let _query = '';
                if (Object.keys(variables).length > 0) {
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

                return dataProvider['query'](client, _query, variables, dataProviderContextValue.config)
            })

            return [mutation.mutate, mutation.isLoading, mutation.data];

        },
        service: (name: string, options: { onSuccess: Function } = {} as any) : any=> {

            const dataProvider = dataProviderContextValue.provider;

            const client = useQueryClient();
            const mutation = useMutation(variables => {
                return dataProvider[name](client, variables)
            }, {
                onSuccess: (
                    data: any,
                    variables: any = {},
                    context: unknown
                ) => {
                    const { onSuccess } = options;
                    if (is.function(onSuccess)) {
                        onSuccess(data, variables, context);
                    }
                }
            })

            
            const resultObject = {};
            resultObject['isLoading'] = mutation.isLoading;
            resultObject[name] = mutation.mutate;
            const data: any = mutation.data;
            if (data != null && data.data! != null) {
                resultObject['result'] = data.data[name];
            } else {
                resultObject['result'] = {};
            }

            return resultObject ;
        }
    }
}


export class DataProtocolClass<T> extends UIView {

    @ViewProperty() vp_Protocol: any;
    public protocol(value: any): this {
        this.vp_Protocol = value;
        return this;
    }

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