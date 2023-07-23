
import React, { createContext, useRef, useMemo, useLayoutEffect, useCallback } from "react";
import { DataProtocolContentFunction } from "./DataProvider";
import DataProtocolRenderer from "./DataProviderRenderer";
import { UIView } from "../../components/UIView/UIView";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import { useAsync } from 'react-async-hook';
import { Convert, Encoding, Guid, is } from "@tuval/core";
import { MutateOptions, UseMutationOptions, UseMutationResult, useMutation, useQuery, useQueryClient } from "react-query";
import { CreateParams, Identifier, RaRecord, useEvent } from "ra-core";


interface UseCreateMutateParams<
    RecordType extends Omit<RaRecord, 'id'> = any
> {
    resource?: string;
    data?: Partial<Omit<RecordType, 'id'>>;
    meta?: any;
}

type UseCreateOptions<
    RecordType extends Omit<RaRecord, 'id'> = any,
    MutationError = unknown,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier }
> = UseMutationOptions<
    ResultRecordType,
    MutationError,
    Partial<UseCreateMutateParams<RecordType>>
> & { returnPromise?: boolean };

type CreateMutationFunction<
    RecordType extends Omit<RaRecord, 'id'> = any,
    TReturnPromise extends boolean = boolean,
    MutationError = unknown,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier }
> = (
    resource?: string,
    params?: Partial<CreateParams<Partial<RecordType>>>,
    options?: MutateOptions<
        ResultRecordType,
        MutationError,
        Partial<UseCreateMutateParams<RecordType>>,
        unknown
    > & { returnPromise?: TReturnPromise }
) => Promise<TReturnPromise extends true ? ResultRecordType : void>;

type UseCreateResult<
    RecordType extends Omit<RaRecord, 'id'> = any,
    TReturnPromise extends boolean = boolean,
    MutationError = unknown,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier }
> = [
        CreateMutationFunction<
            RecordType,
            TReturnPromise,
            MutationError,
            ResultRecordType
        >,
        UseMutationResult<
            ResultRecordType,
            MutationError,
            Partial<UseCreateMutateParams<RecordType>>,
            unknown
        >
    ];

type MutateType = (variables: any, {
    onError,
    onSettled,
    onSuccess,
}?: {
    onError?: Function,
    onSettled?: Function,
    onSuccess?: Function,
}) => void;

const EncodeParamsObject = (params: object = {}) => {
    const paramsString = JSON.stringify(params);
    const bytes = Encoding.UTF8.GetBytes(paramsString);
    return Convert.ToBase64String(bytes);
}

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
        query: (query: string) => {
            const client = useQueryClient();

            query = `
            query {
                 ${query}
            }
          `


            const dataProvider = dataProviderContextValue.provider;
            const { data: _data, isLoading, error } = useQuery(
                // Sometimes the id comes as a string (e.g. when read from the URL in a Show view).
                // Sometimes the id comes as a number (e.g. when read from a Record in useGetList response).
                // As the react-query cache is type-sensitive, we always stringify the identifier to get a match
                [provider, query],
                () =>
                    dataProvider['query'](client, query, {}, dataProviderContextValue.config),
                {
                    cacheTime: 0
                }
            );

            const invalidateQuery = () => {
                client.invalidateQueries([provider, query]);
            }

            const data = ((_data as any)?.data as any);

            return { data: data ? data : {}, isLoading, error, invalidateQuery };
        },
        _query: (_query: TemplateStringsArray, ...expr: Array<any>) => {

            const client = useQueryClient();

            let query = '';
            _query.forEach((string, i) => {
                query += string + ((is.string(expr[i]) ? `"${expr[i]}"` : expr[i]) || '');
            });

            query = `
            query {
                 ${query}
            }
          `

            const dataProvider = dataProviderContextValue.provider;
            const { data: _data, isLoading, error } = useQuery(
                // Sometimes the id comes as a string (e.g. when read from the URL in a Show view).
                // Sometimes the id comes as a number (e.g. when read from a Record in useGetList response).
                // As the react-query cache is type-sensitive, we always stringify the identifier to get a match
                ['__query__', query],
                () =>
                    dataProvider['query'](client, query, {}, dataProviderContextValue.config),
                {
                    // cacheTime: 0
                }
            );
            const data = ((_data as any)?.data as any);
            return { data: data ? data : {}, isLoading, error };
        },
        gql: (_query: TemplateStringsArray, ...expr: Array<any>) => {

            const client = useQueryClient();

            let query = '';
            _query.forEach((string, i) => {
                query += string + ((is.string(expr[i]) ? `"${expr[i]}"` : expr[i]) || '');
            });

            query = `
            query {
                 ${query}
            }
            `


            const dataProvider = dataProviderContextValue.provider;
            const { data: _data, isLoading, error } = useQuery(
                // Sometimes the id comes as a string (e.g. when read from the URL in a Show view).
                // Sometimes the id comes as a number (e.g. when read from a Record in useGetList response).
                // As the react-query cache is type-sensitive, we always stringify the identifier to get a match
                [provider, query],
                () =>
                    dataProvider['query'](client, query, {}, dataProviderContextValue.config),
                {
                    cacheTime: 0
                }
            );

            const invalidateQuery = () => {
                client.invalidateQueries([provider, query]);
            }

            const data = ((_data as any)?.data as any);

            return { data: data ? data : {}, isLoading, error, invalidateQuery };
        },
        lazyQuery: () => {

            const dataProvider = dataProviderContextValue.provider;

            const client = useQueryClient();
            const mutation = useMutation((variables: any) => {

                const query = `
                query {
                     ${variables.query}
                }
              `
             
               
                return dataProvider['query'](client, query, variables, dataProviderContextValue.config)
            })

            

            const resultObject = {};
            resultObject['isLoading'] = mutation.isLoading;
            resultObject['isSuccess'] = mutation.isSuccess;
            resultObject['query'] = (variables: any[], options: any) => {

                mutation.mutate(variables, {
                    onSuccess: (data: any) => {

                        if (is.function(options?.onSuccess)) {
                            if (data?.data != null) {
                                const keys = Object.keys(data.data);
                                if (keys.length > 0) {
                                    options.onSuccess(data.data[keys[0]]);
                                }
                            } else {
                                options.onSuccess();
                            }

                        }
                    }
                })


            }
            const data: any = mutation.data;
            if (data != null && data.data! != null) {
                resultObject['result'] = data.data;
            } else {
                resultObject['result'] = {};
            }

            return resultObject as any;

        },
        service: (name: string, options: { onSuccess: Function } = {} as any): any => {

            const dataProvider = dataProviderContextValue.provider;

            const client = useQueryClient();
            const mutation = useMutation(variables => {
                return dataProvider[name](client, variables, dataProviderContextValue.config || {})
            }, {
                onSuccess: (
                    data: any,
                    variables: any = {},
                    context: unknown
                ) => {
                    const { onSuccess } = options;
                    if (is.function(onSuccess)) {
                        if (data != null && data.data! != null) {
                            data = data.data[name];
                        } else {
                            data = {};
                        }
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

            return resultObject;
        },
        mutation: (query: string, options: { onSuccess: Function } = {} as any): any => {

            query = `
        mutation provider {
                   ${query}
        }
      `
            const dataProvider = dataProviderContextValue.provider;

            const client = useQueryClient();
            const mutation = useMutation(variables => {
                const keys = Object.keys(variables);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    if (is.string(variables[key])) {
                        query = query.replace('$' + key, `"${variables[key]}"`);
                    }
                }
                return dataProvider['mutation'](query, client, variables, dataProviderContextValue.config || {})
            }, {
                onSuccess: (
                    data: any,
                    variables: any = {},
                    context: unknown
                ) => {
                    /*  const { onSuccess } = options;
                     if (is.function(onSuccess)) {
                         if (data != null && data.data! != null) {
                             data = data.data[name];
                         } else {
                             data = {};
                         }
                         onSuccess(data, variables, context);
                     } */
                }
            })


            const resultObject = {};
            resultObject['isLoading'] = mutation.isLoading;
            resultObject['mutate'] = mutation.mutate;
            const data: any = mutation.data;
            if (data != null && data.data! != null) {
                resultObject['result'] = data.data;
            } else {
                resultObject['result'] = {};
            }

            return resultObject;
        },
        _mutation: (_query: TemplateStringsArray, ...expr: Array<any>): {
            mutate: (variables: any, {
                onError,
                onSettled,
                onSuccess,
            }?: {
                onError?: Function,
                onSettled?: Function,
                onSuccess?: Function,
            }) => void,
            isSuccess: boolean,
            isLoading: boolean
        } => {

            let query: string = '';
            _query.forEach((string, i) => {
                query += string + ((is.string(expr[i]) ? `"${expr[i]}"` : expr[i]) || '');
            });




            const dataProvider = dataProviderContextValue.provider;

            const client = useQueryClient();

            const mutation = useMutation((variables: any) => {
                debugger
                const index = query.indexOf('{');
                const pantesisIndex = query.indexOf('(');
                const pantesisIndex1 = query.indexOf(')');

                const keys = Object.keys(variables);
                if (index > -1 && pantesisIndex === -1 && pantesisIndex1 === -1) {
                    let paramsStr = '';
                    for (let i = 0; i < keys.length; i++) {
                        if (i === keys.length - 1) {
                            paramsStr += `${keys[i]}:$${keys[i]}`;
                        }
                        else {
                            paramsStr += `${keys[i]}:$${keys[i]},`
                        }
                    }

                    query = [query.slice(0, index), '(', paramsStr, ')', query.slice(index)].join('');



                    //alert(query)
                }

                query = `
                mutation provider {
                           ${query}
                }
              `

                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    if (is.string(variables[key])) {
                        query = query.replace('$' + key, `"${variables[key]}"`);
                    } else if (is.array(variables[key]) && variables[key].length > 0 && is.string(variables[key][0])) {

                        query = query.replace('$' + key, `[${variables[key].map(item => '"' + item + '"').join(',')}]`);


                    } else if (is.boolean(variables[key])) {
                        query = variables[key] ? query.replace('$' + key, `true`) : query.replace('$' + key, `false`);
                    } else if (is.nullOrUndefined(variables[key])) {
                        query = query.replace('$' + key, `null`);
                    }
                }

                return dataProvider['mutation'](query, client, variables, dataProviderContextValue.config || {})
            }/* , {
                onSuccess: (
                    data: any,
                    variables: any = {},
                    context: unknown
                ) => {

                      const { onSuccess } = options;
                     if (is.function(onSuccess)) {
                         if (data != null && data.data! != null) {
                             data = data.data[name];
                         } else {
                             data = {};
                         }
                         onSuccess(data, variables, context);
                     }
                }
            } */
            )


            const resultObject = {};
            resultObject['isLoading'] = mutation.isLoading;
            resultObject['isSuccess'] = mutation.isSuccess;
            resultObject['mutate'] = (variables: any[], options: any) => {

                mutation.mutate(variables, {
                    onSuccess: (data: any) => {

                        if (is.function(options?.onSuccess)) {
                            if (data?.data != null) {
                                const keys = Object.keys(data.data);
                                if (keys.length > 0) {
                                    options.onSuccess(data.data[keys[0]]);
                                }
                            } else {
                                options.onSuccess();
                            }

                        }
                    }
                })


            }
            const data: any = mutation.data;
            if (data != null && data.data! != null) {
                resultObject['result'] = data.data;
            } else {
                resultObject['result'] = {};
            }

            return resultObject as any;
        },
        __mutation: (_query: TemplateStringsArray, ...expr: Array<any>): {
            mutate: (variables: any, {
                onError,
                onSettled,
                onSuccess,
            }?: {
                onError?: Function,
                onSettled?: Function,
                onSuccess?: Function,
            }) => void,
            isSuccess: boolean,
            isLoading: boolean
        } => {

            let query: string = '';
            _query.forEach((string, i) => {
                query += string + ((expr[i]) || '');
            });




            const dataProvider = dataProviderContextValue.provider;

            const client = useQueryClient();

            const mutation = useMutation((variables: any) => {

                const index = query.indexOf('{');

                /*  let params = [];
                 for (let key in variables) {
                     if (is.string(variables[key])) {
                         params.push([key, `"${encodeURIComponent(variables[key])}"`].join(':'))
                     } else if (is.object(variables[key])) {
                         params.push([key, `"${encodeURIComponent(JSON.stringify(variables[key]))}"`].join(':'))
                     } else {
                         params.push([key, `${variables[key]}`].join(':'))
                     }
                 }

                 if (index === -1) {
                     query = `${query}(${params.join(',')})`
                 } else {
                     query = `${query.substring(0, index)}(${params.join(',')})${query.substring(index, query.length)}`
                 } */

                if (index === -1) {
                    query = `${query}(params:"${EncodeParamsObject(variables)}")`
                } else {
                    query = `${query.substring(0, index)}(params:"${EncodeParamsObject(variables)}")${query.substring(index, query.length)}`
                }


                query = `
                mutation provider {
                           ${query}
                }
              `


                return dataProvider['mutation'](query, client, variables, dataProviderContextValue.config || {})
            }/* , {
                onSuccess: (
                    data: any,
                    variables: any = {},
                    context: unknown
                ) => {

                      const { onSuccess } = options;
                     if (is.function(onSuccess)) {
                         if (data != null && data.data! != null) {
                             data = data.data[name];
                         } else {
                             data = {};
                         }
                         onSuccess(data, variables, context);
                     }
                }
            } */
            )


            const resultObject = {};
            resultObject['isLoading'] = mutation.isLoading;
            resultObject['isSuccess'] = mutation.isSuccess;
            resultObject['mutate'] = (variables: any[], options: any) => {

                mutation.mutate(variables, {
                    onSuccess: (data: any) => {
                        client.invalidateQueries(['__query__', provider]);
                        if (is.function(options?.onSuccess)) {
                            if (data?.data != null) {
                                const keys = Object.keys(data.data);
                                if (keys.length > 0) {
                                    const { dataBag } = data.data[keys[0]];
                                    options.onSuccess(dataBag);
                                }
                            } else {
                                options.onSuccess();
                            }

                        }
                    }
                })


            }
            const data: any = mutation.data;
            if (data != null && data.data! != null) {
                resultObject['result'] = data.data;
            } else {
                resultObject['result'] = {};
            }

            return resultObject as any;
        },
        _service: (_query: TemplateStringsArray, ...expr: Array<any>): {
            mutate: (variables: any, {
                onError,
                onSettled,
                onSuccess,
            }?: {
                onError?: Function,
                onSettled?: Function,
                onSuccess?: Function,
            }) => void
        } => {

            let query: string = '';
            _query.forEach((string, i) => {
                query += string + ((is.string(expr[i]) ? `"${expr[i]}"` : expr[i]) || '');
            });


            const dataProvider = dataProviderContextValue.provider;

            const client = useQueryClient();

            const mutation = useMutation((variables: any) => {
                const index = query.indexOf('{');
                const pantesisIndex = query.indexOf('(');
                const pantesisIndex1 = query.indexOf(')');

                const keys = Object.keys(variables);
                if (index > -1 && pantesisIndex === -1 && pantesisIndex1 === -1) {
                    let paramsStr = '';
                    for (let i = 0; i < keys.length; i++) {
                        if (i === keys.length - 1) {
                            paramsStr += `${keys[i]}:$${keys[i]}`;
                        }
                        else {
                            paramsStr += `${keys[i]}:$${keys[i]},`
                        }
                    }

                    query = [query.slice(0, index), '(', paramsStr, ')', query.slice(index)].join('');

                    query = `
                    service provider {
                               ${query}
                    }
                  `

                    //alert(query)
                }


                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    if (is.string(variables[key])) {
                        query = query.replace('$' + key, `"${variables[key]}"`);
                    } else if (is.nullOrUndefined(variables[key])) {
                        query = query.replace('$' + key, `null`);
                    }
                }
                // alert(query)
                return dataProvider['service'](query, client, variables, dataProviderContextValue.config || {})
            }/* , {
                onSuccess: (
                    data: any,
                    variables: any = {},
                    context: unknown
                ) => {

                      const { onSuccess } = options;
                     if (is.function(onSuccess)) {
                         if (data != null && data.data! != null) {
                             data = data.data[name];
                         } else {
                             data = {};
                         }
                         onSuccess(data, variables, context);
                     }
                }
            } */
            )


            const resultObject = {};
            resultObject['isLoading'] = mutation.isLoading;
            resultObject['mutate'] = (variables: any[], options: any) => {
                mutation.mutate(variables, {
                    onSuccess: (data: any) => {

                        if (is.function(options.onSuccess)) {
                            if (data?.data != null) {
                                const keys = Object.keys(data.data);
                                if (keys.length > 0) {
                                    options.onSuccess(data.data[keys[0]]);
                                }
                            } else {
                                options.onSuccess();
                            }

                        }
                    }
                })
            }
            const data: any = mutation.data;
            if (data != null && data.data! != null) {
                resultObject['result'] = data.data;
            } else {
                resultObject['result'] = {};
            }

            return resultObject as any;
        },
        invalidateQuery: () => {
            const client = useQueryClient();
            client.invalidateQueries(['__query__', provider]);

        },
        getList: (resource: string, params: any = {}, options?: any) => {
            const {
                pagination = { page: 1, perPage: 25 },
                sort = { field: 'id', order: 'DESC' },
                filter = {},
                meta,
            } = params;

            const queryClient = useQueryClient();

            const dataProvider = dataProviderContextValue.provider;

            const result = useQuery(
                [provider, resource, 'getList', { pagination, sort, filter, meta }],
                () =>
                    dataProvider['getList'](resource, {
                        pagination,
                        sort,
                        filter,
                        meta,
                    })
                        .then(({ data, total, pageInfo }) => ({
                            data,
                            total,
                            pageInfo,
                        })),
                {
                    ...options,
                    onSuccess: value => {
                        // optimistically populate the getOne cache
                        value?.data?.forEach(record => {
                            queryClient.setQueryData(
                                [provider, resource, 'getOne', { id: String(record.id), meta }],
                                oldRecord => oldRecord ?? record
                            );
                        });
                        // execute call-time onSuccess if provided
                        if (options?.onSuccess) {
                            options.onSuccess(value);
                        }
                    }
                }
            );


            return useMemo(
                () =>
                    result.data
                        ? {
                            ...result,
                            data: result.data?.data,
                            total: result.data?.total,
                            pageInfo: result.data?.pageInfo,
                        }
                        : result,
                [result]
            );


            /*  const { data: _data, isLoading, error } = useQuery(
               [provider, resource],
               () =>
                   dataProvider['getList'](client, resource, filter),
               {
                   //cacheTime: 0
               }
           );

           const invalidateQuery = () => {
               client.invalidateQueries([provider, resource]);
           }

           const data = ((_data as any)?.data as any);

           return { data: data ? data : {}, isLoading, error, invalidateQuery };  */
        },
        getOne: (resource: string, { id, meta }: { id: string | number, meta?: any; }, options?: any) => {

            const dataProvider = dataProviderContextValue.provider;
            return useQuery(
                // Sometimes the id comes as a string (e.g. when read from the URL in a Show view).
                // Sometimes the id comes as a number (e.g. when read from a Record in useGetList response).
                // As the react-query cache is type-sensitive, we always stringify the identifier to get a match
                [provider, resource, 'getOne', { id: String(id), meta }],
                () =>
                    dataProvider['getOne'](resource, { id, meta })
                        .then(({ data }) => data),
                options
            );

            /* const dataProvider = dataProviderContextValue.provider;
            const { data: _data, isLoading, error } = useQuery(
                   [provider, resource],
                () =>
                    dataProvider['getOne'](client, resource, id),
                {
                    //cacheTime: 0
                }
            );

            const invalidateQuery = () => {
                client.invalidateQueries([provider, resource]);
            }

            const data = ((_data as any)?.data as any);

            return { data: data ? data : {}, isLoading, error, invalidateQuery }; */
        },
        _create: (resource, options: any = {}): {
            mutate: (variables: any, {
                onError,
                onSettled,
                onSuccess,
            }?: {
                onError?: Function,
                onSettled?: Function,
                onSuccess?: Function,
            }) => void,
            isSuccess: boolean,
            isLoading: boolean
        } => {

            const dataProvider = dataProviderContextValue.provider;

            const client = useQueryClient();

            const mutation = useMutation((variables: any) => {
                return dataProvider['create'](client, resource, variables);
            },
                {
                    onSuccess: (
                        data: any,
                        variables: any = {},
                        context: unknown
                    ) => {
                        // alert(resource);
                        client.invalidateQueries([provider, resource]);
                        const { resource: callTimeResource = resource } = variables;
                        client.setQueryData(
                            [provider, callTimeResource, 'getOne', { id: String(data.id) }],
                            data
                        );

                        if (options.onSuccess) {
                            options.onSuccess(data, variables, context);
                        }
                        // call-time success callback is executed by react-query
                    }
                }
            )


            const resultObject = {};
            resultObject['isLoading'] = mutation.isLoading;
            resultObject['isSuccess'] = mutation.isSuccess;
            resultObject['mutate'] = (variables: any[], options: any) => {

                mutation.mutate(variables, {
                    onSuccess: (data: any) => {
                        if (is.function(options?.onSuccess)) {
                            if (data?.data != null) {
                                const keys = Object.keys(data.data);
                                if (keys.length > 0) {
                                    const { dataBag } = data.data[keys[0]];
                                    options.onSuccess(dataBag);
                                }
                            } else {
                                options.onSuccess();
                            }

                        }
                    }
                })


            }
            const data: any = mutation.data;
            if (data != null && data.data! != null) {
                resultObject['result'] = data.data;
            } else {
                resultObject['result'] = {};
            }

            return resultObject as any;
        },
        create: (
            resource?: string,
            params: any = {},
            options: any = {}
        ) => {
            const dataProvider = dataProviderContextValue.provider;
            const queryClient = useQueryClient();
            const paramsRef = useRef(
                params
            );

            const mutation = (useMutation as any)(
                ({
                    resource: callTimeResource = resource,
                    data: callTimeData = paramsRef.current.data,
                    meta: callTimeMeta = paramsRef.current.meta,
                } = {}) =>
                    dataProvider['create'](callTimeResource, callTimeData),
                {
                    ...options,
                    onSuccess: (
                        data: any,
                        variables: any = {},
                        context: unknown
                    ) => {
                        const { resource: callTimeResource = resource } = variables;
                        queryClient.setQueryData(
                            [provider, callTimeResource, 'getOne', { id: String(data.id) }],
                            data
                        );

                        if (options.onSuccess) {
                            options.onSuccess(data, variables, context);
                        }
                        // call-time success callback is executed by react-query
                    },
                }
            );

            const create = (
                callTimeResource: string = resource,
                callTimeParams: any = {},
                createOptions: any = {}
            ) => {
                const {
                    returnPromise = options.returnPromise,
                    ...reactCreateOptions
                } = createOptions;
                if (returnPromise) {
                    return mutation.mutateAsync(
                        { resource: callTimeResource, ...callTimeParams },
                        createOptions
                    );
                }
                mutation.mutate(
                    { resource: callTimeResource, ...callTimeParams },
                    reactCreateOptions
                );
            };

            const invalidateResourceCache = () => {
                queryClient.invalidateQueries([provider, resource]);
            }

            const resultObject = {};
            resultObject['isLoading'] = mutation.isLoading;
            resultObject['isSuccess'] = mutation.isSuccess;
            resultObject['mutate'] = (data: any, createOptions: any) => {

                const {
                    returnPromise = options.returnPromise,
                    ...reactCreateOptions
                } = createOptions;
                if (returnPromise) {
                    return mutation.mutateAsync(
                        { resource: resource, ...{ data } },
                        createOptions
                    );
                }
                mutation.mutate(
                    { resource: resource, ...{ data } },
                    reactCreateOptions
                );
            }

            const data: any = mutation.data;
            if (data != null && data.data! != null) {
                resultObject['result'] = data.data;
            } else {
                resultObject['result'] = {};
            }

            resultObject['invalidateResourceCache'] = invalidateResourceCache;
            return resultObject as any;

            // return [useEvent(create), mutation, invalidateResourceCache];
        },
        _update: (resource, options: any = {}): {
            mutate: (variables: any, {
                onError,
                onSettled,
                onSuccess,
            }?: {
                onError?: Function,
                onSettled?: Function,
                onSuccess?: Function,
            }) => void,
            isSuccess: boolean,
            isLoading: boolean
        } => {

            const dataProvider = dataProviderContextValue.provider;

            const client = useQueryClient();

            const mutation = useMutation(({ id, data }) => {
                return dataProvider['update'](resource, id, data);
            },
                {
                    onSuccess: (
                        data: any,
                        variables: any = {},
                        context: unknown
                    ) => {
                        alert(JSON.stringify(data));
                        client.invalidateQueries([provider, resource]);
                        const { resource: callTimeResource = resource } = variables;
                        client.setQueryData(
                            [provider, callTimeResource, 'getOne', { id: String(data.id) }],
                            data
                        )

                        if (options.onSuccess) {
                            options.onSuccess(data, variables, context);
                        }
                        // call-time success callback is executed by react-query
                    }
                }
            )


            const resultObject = {};
            resultObject['isLoading'] = mutation.isLoading;
            resultObject['isSuccess'] = mutation.isSuccess;
            resultObject['mutate'] = (variables: any[], options: any) => {

                mutation.mutate(variables, {
                    onSuccess: (data: any) => {
                        if (is.function(options?.onSuccess)) {
                            if (data?.data != null) {
                                const keys = Object.keys(data.data);
                                if (keys.length > 0) {
                                    const { dataBag } = data.data[keys[0]];
                                    options.onSuccess(dataBag);
                                }
                            } else {
                                options.onSuccess();
                            }

                        }
                    }
                })


            }
            const data: any = mutation.data;
            if (data != null && data.data! != null) {
                resultObject['result'] = data.data;
            } else {
                resultObject['result'] = {};
            }

            return resultObject as any;
        },

        update: (resource?: any, params: any = {}, options: any = {}): any => {

            const dataProvider = dataProviderContextValue.provider;

            const queryClient = useQueryClient();
            const { id, data, meta } = params;
            const { mutationMode = 'pessimistic', ...reactMutationOptions } = options;
            const mode = useRef(mutationMode);
            const paramsRef = useRef(params);
            const snapshot = useRef([]);

            const updateCache = ({ resource, id, data }) => {
                // hack: only way to tell react-query not to fetch this query for the next 5 seconds
                // because setQueryData doesn't accept a stale time option
                const now = Date.now();
                const updatedAt = mode.current === 'undoable' ? now + 5 * 1000 : now;

                const updateColl = (old: any[]) => {
                    if (!old) return;
                    const index = old.findIndex(
                        // eslint-disable-next-line eqeqeq
                        record => record.id == id
                    );
                    if (index === -1) {
                        return old;
                    }
                    return [
                        ...old.slice(0, index),
                        { ...old[index], ...data },
                        ...old.slice(index + 1),
                    ];
                };


                queryClient.setQueryData(
                    [provider, resource, 'getOne', { id: String(id), meta }],
                    (record: any) => ({ ...record, ...data }),
                    { updatedAt }
                );

                queryClient.setQueriesData(
                    [provider, resource, 'getList'],
                    (res: any) =>
                        res && res.data ? { ...res, data: updateColl(res.data) } : res
                    ,
                    { updatedAt }
                );

                queryClient.setQueriesData(
                    [provider, resource, 'getInfiniteList'],
                    (res: any) =>
                        res && res.pages
                            ? {
                                ...res,
                                pages: res.pages.map(page => ({
                                    ...page,
                                    data: updateColl(page.data),
                                })),
                            }
                            : res,
                    { updatedAt }
                );

                queryClient.setQueriesData(
                    [provider, resource, 'getMany'],
                    (coll: any) =>
                        coll && coll.length > 0 ? updateColl(coll) : coll,
                    { updatedAt }
                );
                queryClient.setQueriesData(
                    [provider, resource, 'getManyReference'],
                    (res: any) =>
                        res && res.data
                            ? { data: updateColl(res.data), total: res.total }
                            : res,
                    { updatedAt }
                );
            }

            const mutation = (useMutation as any)(
                ({
                    resource: callTimeResource = resource,
                    id: callTimeId = paramsRef.current.id,
                    data: callTimeData = paramsRef.current.data,
                    meta: callTimeMeta = paramsRef.current.meta,
                    previousData: callTimePreviousData = paramsRef.current.previousData,
                }) =>
                    dataProvider['update'](callTimeResource, callTimeId, callTimeData),
                {
                    ...reactMutationOptions,
                    onMutate: async (
                        variables: any
                    ) => {
                        if (reactMutationOptions.onMutate) {
                            const userContext =
                                (await reactMutationOptions.onMutate(variables)) || {};
                            return {
                                snapshot: snapshot.current,
                                // @ts-ignore
                                ...userContext,
                            };
                        } else {
                            // Return a context object with the snapshot value
                            return { snapshot: snapshot.current };
                        }
                    },
                    onError: (
                        error: any,
                        variables: any = {},
                        context: { snapshot: any }
                    ) => {
                        if (
                            mode.current === 'optimistic' ||
                            mode.current === 'undoable'
                        ) {
                            // If the mutation fails, use the context returned from onMutate to rollback
                            context.snapshot.forEach(([key, value]) => {
                                queryClient.setQueryData(key, value);
                            });
                        }

                        if (reactMutationOptions.onError) {
                            return reactMutationOptions.onError(
                                error,
                                variables,
                                context
                            );
                        }
                        // call-time error callback is executed by react-query
                    },
                    onSuccess: (
                        data: any,
                        variables: any = {},
                        context: unknown
                    ) => {
                        if (mode.current === 'pessimistic') {
                            // update the getOne and getList query cache with the new result
                            const {
                                resource: callTimeResource = resource,
                                id: callTimeId = id,
                            } = variables;
                            updateCache({
                                resource: callTimeResource,
                                id: callTimeId,
                                data,
                            });

                            if (reactMutationOptions.onSuccess) {
                                reactMutationOptions.onSuccess(
                                    data,
                                    variables,
                                    context
                                );
                            }
                            // call-time success callback is executed by react-query
                        }
                    },
                    onSettled: (
                        data: any,
                        error: any,
                        variables: any = {},
                        context: { snapshot: any }
                    ) => {
                        if (
                            mode.current === 'optimistic' ||
                            mode.current === 'undoable'
                        ) {
                            // Always refetch after error or success:
                            context.snapshot.forEach(([key]) => {
                                queryClient.invalidateQueries(key);
                            });
                        }

                        if (reactMutationOptions.onSettled) {
                            return reactMutationOptions.onSettled(
                                data,
                                error,
                                variables,
                                context
                            );
                        }
                    },
                }
            )
            const update = async (
                callTimeResource: string = resource,
                callTimeParams: any = {},
                updateOptions: any = {}
            ) => {
                const {
                    mutationMode,
                    returnPromise = reactMutationOptions.returnPromise,
                    onSuccess,
                    onSettled,
                    onError,
                } = updateOptions;

                // store the hook time params *at the moment of the call*
                // because they may change afterwards, which would break the undoable mode
                // as the previousData would be overwritten by the optimistic update
                paramsRef.current = params;

                if (mutationMode) {
                    mode.current = mutationMode;
                }

                if (returnPromise && mode.current !== 'pessimistic') {
                    console.warn(
                        'The returnPromise parameter can only be used if the mutationMode is set to pessimistic'
                    );
                }

                if (mode.current === 'pessimistic') {
                    if (returnPromise) {
                        return mutation.mutateAsync(
                            { resource: callTimeResource, ...callTimeParams },
                            { onSuccess, onSettled, onError }
                        );
                    }
                    return mutation.mutate(
                        { resource: callTimeResource, ...callTimeParams },
                        { onSuccess, onSettled, onError }
                    );
                }

                const {
                    id: callTimeId = id,
                    data: callTimeData = data,
                    meta: callTimeMeta = meta,
                } = callTimeParams;

                // optimistic update as documented in https://react-query-v3.tanstack.com/guides/optimistic-updates
                // except we do it in a mutate wrapper instead of the onMutate callback
                // to have access to success side effects

                const previousRecord = queryClient.getQueryData<any>([
                    provider,
                    callTimeResource,
                    'getOne',
                    { id: String(callTimeId), meta: callTimeMeta },
                ]);

                const queryKeys = [
                    [
                        provider,
                        callTimeResource,
                        'getOne',
                        { id: String(callTimeId), meta: callTimeMeta },
                    ],
                    [provider, callTimeResource, 'getList'],
                    [provider, callTimeResource, 'getInfiniteList'],
                    [provider, callTimeResource, 'getMany'],
                    [provider, callTimeResource, 'getManyReference'],
                ];

                /**
                 * Snapshot the previous values via queryClient.getQueriesData()
                 *
                 * The snapshotData ref will contain an array of tuples [query key, associated data]
                 *
                 * @example
                 * [
                 *   [['posts', 'getOne', { id: '1' }], { id: 1, title: 'Hello' }],
                 *   [['posts', 'getList'], { data: [{ id: 1, title: 'Hello' }], total: 1 }],
                 *   [['posts', 'getMany'], [{ id: 1, title: 'Hello' }]],
                 * ]
                 *
                 * @see https://react-query-v3.tanstack.com/reference/QueryClient#queryclientgetqueriesdata
                 */
                snapshot.current = queryKeys.reduce(
                    (prev, curr) => prev.concat(queryClient.getQueriesData(curr)),
                    [] as any
                );

                // Cancel any outgoing re-fetches (so they don't overwrite our optimistic update)
                await Promise.all(
                    snapshot.current.map(([key]) => queryClient.cancelQueries(key))
                );

                // Optimistically update to the new value
                updateCache({
                    resource: callTimeResource,
                    id: callTimeId,
                    data: callTimeData,
                });

                // run the success callbacks during the next tick
                if (onSuccess) {
                    setTimeout(
                        () =>
                            onSuccess(
                                { ...previousRecord, ...callTimeData },
                                { resource: callTimeResource, ...callTimeParams },
                                { snapshot: snapshot.current }
                            ),
                        0
                    );
                }
                if (reactMutationOptions.onSuccess) {
                    setTimeout(
                        () =>
                            reactMutationOptions.onSuccess(
                                { ...previousRecord, ...callTimeData },
                                { resource: callTimeResource, ...callTimeParams },
                                { snapshot: snapshot.current }
                            ),
                        0
                    );
                }

                if (mode.current === 'optimistic') {
                    // call the mutate method without success side effects
                    return mutation.mutate(
                        { resource: callTimeResource, ...callTimeParams },
                        { onSettled, onError }
                    );
                } else {

                    /* undoableEventEmitter.once('end', ({ isUndo }) => {
                        if (isUndo) {

                            snapshot.current.forEach(([key, value]) => {
                                queryClient.setQueryData(key, value);
                            });
                        } else {

                            mutation.mutate(
                                { resource: callTimeResource, ...callTimeParams },
                                { onSettled, onError }
                            );
                        }
                    }); */
                }
            }
            const invalidateResourceCache = () => {
                queryClient.invalidateQueries([provider, resource]);
            }

            const resultObject = {};
            resultObject['isLoading'] = mutation.isLoading;
            resultObject['isSuccess'] = mutation.isSuccess;
            resultObject['mutate'] = async (id: string | number, data: any = {}, updateOptions: any = {}) => {

                const {
                    mutationMode,
                    returnPromise = reactMutationOptions.returnPromise,
                    onSuccess,
                    onSettled,
                    onError,
                } = updateOptions;

                // store the hook time params *at the moment of the call*
                // because they may change afterwards, which would break the undoable mode
                // as the previousData would be overwritten by the optimistic update
                paramsRef.current = params;

                if (mutationMode) {
                    mode.current = mutationMode;
                }

                if (returnPromise && mode.current !== 'pessimistic') {
                    console.warn(
                        'The returnPromise parameter can only be used if the mutationMode is set to pessimistic'
                    );
                }

                if (mode.current === 'pessimistic') {
                    if (returnPromise) {
                        return mutation.mutateAsync(
                            { resource: resource, ...{ data } },
                            { onSuccess, onSettled, onError }
                        );
                    }
                    return mutation.mutate(
                        { resource: resource, ...{ id: String(id), data } },
                        { onSuccess, onSettled, onError }
                    );
                }

                /*  const {
                     id: callTimeId = id,
                     data: callTimeData = data,
                     meta: callTimeMeta = meta,
                 } = callTimeParams; */

                // optimistic update as documented in https://react-query-v3.tanstack.com/guides/optimistic-updates
                // except we do it in a mutate wrapper instead of the onMutate callback
                // to have access to success side effects

                const previousRecord = queryClient.getQueryData<any>([
                    provider,
                    resource,
                    'getOne',
                    { id: String(id), meta: {} },
                ]);

                const queryKeys = [
                    [
                        provider,
                        resource,
                        'getOne',
                        { id: String(id), meta: {} },
                    ],
                    [provider, resource, 'getList'],
                    [provider, resource, 'getInfiniteList'],
                    [provider, resource, 'getMany'],
                    [provider, resource, 'getManyReference'],
                ];

                /**
                 * Snapshot the previous values via queryClient.getQueriesData()
                 *
                 * The snapshotData ref will contain an array of tuples [query key, associated data]
                 *
                 * @example
                 * [
                 *   [['posts', 'getOne', { id: '1' }], { id: 1, title: 'Hello' }],
                 *   [['posts', 'getList'], { data: [{ id: 1, title: 'Hello' }], total: 1 }],
                 *   [['posts', 'getMany'], [{ id: 1, title: 'Hello' }]],
                 * ]
                 *
                 * @see https://react-query-v3.tanstack.com/reference/QueryClient#queryclientgetqueriesdata
                 */
                snapshot.current = queryKeys.reduce(
                    (prev, curr) => prev.concat(queryClient.getQueriesData(curr)),
                    [] as any
                );

                // Cancel any outgoing re-fetches (so they don't overwrite our optimistic update)
                await Promise.all(
                    snapshot.current.map(([key]) => queryClient.cancelQueries(key))
                );

                // Optimistically update to the new value
                updateCache({
                    resource: resource,
                    id: id,
                    data: data,
                });

                // run the success callbacks during the next tick
                if (onSuccess) {
                    setTimeout(
                        () =>
                            onSuccess(
                                { ...previousRecord, ...data },
                                { resource: resource, ...{ id: String(id), data } },
                                { snapshot: snapshot.current }
                            ),
                        0
                    );
                }
                if (reactMutationOptions.onSuccess) {
                    setTimeout(
                        () =>
                            reactMutationOptions.onSuccess(
                                { ...previousRecord, ...{ data } },
                                { resource: resource, ...{ id: String(id), data } },
                                { snapshot: snapshot.current }
                            ),
                        0
                    );
                }

                if (mode.current === 'optimistic') {
                    // call the mutate method without success side effects
                    return mutation.mutate(
                        { resource: resource, ...{ id: String(id), data } },
                        { onSettled, onError }
                    );
                } else {

                    /* undoableEventEmitter.once('end', ({ isUndo }) => {
                        if (isUndo) {

                            snapshot.current.forEach(([key, value]) => {
                                queryClient.setQueryData(key, value);
                            });
                        } else {

                            mutation.mutate(
                                { resource: callTimeResource, ...callTimeParams },
                                { onSettled, onError }
                            );
                        }
                    }); */
                }
            }

            const _data: any = mutation.data;
            if (_data != null && _data.data! != null) {
                resultObject['result'] = _data.data;
            } else {
                resultObject['result'] = {};
            }

            resultObject['invalidateResourceCache'] = invalidateResourceCache;
            return resultObject as any;

            //return [useEvent(update), mutation, invalidateResourceCache];


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
        this.vp_Config = {};
    }

    public render() {
        return (<DataProtocolRenderer control={this as any} ></DataProtocolRenderer>)
    }
}