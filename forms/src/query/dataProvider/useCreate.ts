import React, { createElement, Fragment } from "../../preact/compat";
import { Teact } from "../../windows/Forms/Components/Teact";
import { useQueryClient } from "../tuval/QueryClientProvider";
import { useMutation } from "../tuval/useMutation";



import { useDataProvider } from './useDataProvider';

/**
 * Get a callback to call the dataProvider.create() method, the result and the loading state.
 *
 * @param {string} resource
 * @param {Params} params The create parameters { data }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh(); } }
 *
 * @typedef Params
 * @prop params.data The record to create, e.g. { title: 'hello, world' }
 *
 * @returns The current mutation state. Destructure as [create, { data, error, isLoading }].
 *
 * The return value updates according to the request state:
 *
 * - initial: [create, { isLoading: false, isIdle: true }]
 * - start:   [create, { isLoading: true }]
 * - success: [create, { data: [data from response], isLoading: false, isSuccess: true }]
 * - error:   [create, { error: [error from response], isLoading: false, isError: true }]
 *
 * The create() function must be called with a resource and a parameter object: create(resource, { data, meta }, options)
 *
 * This hook uses react-query useMutation under the hood.
 * This means the state object contains mutate, isIdle, reset and other react-query methods.
 *
 * @see https://react-query-v3.tanstack.com/reference/useMutation
 *
 * @example // set params when calling the create callback
 *
 * import { useCreate, useRecordContext } from 'react-admin';
 *
 * const LikeButton = () => {
 *     const record = useRecordContext();
 *     const like = { postId: record.id };
 *     const [create, { isLoading, error }] = useCreate();
 *     const handleClick = () => {
 *         create('likes', { data: like })
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isLoading} onClick={handleClick}>Like</button>;
 * };
 *
 * @example // set params when calling the hook
 *
 * import { useCreate, useRecordContext } from 'react-admin';
 *
 * const LikeButton = () => {
 *     const record = useRecordContext();
 *     const like = { postId: record.id };
 *     const [create, { isLoading, error }] = useCreate('likes', { data: like });
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isLoading} onClick={() => create()}>Like</button>;
 * };
 *
 * @example // TypeScript
 * const [create, { data }] = useCreate<Product>('products', { data: product });
 *                    \-- data is Product
 */
export const useCreate = (
    resource?: string,
    params: any = {},
    options: any = {}
): any => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const paramsRef = React.useRef(
        params
    );

    const mutation = useMutation(
        ({
            resource: callTimeResource = resource,
            data: callTimeData = paramsRef.current.data,
            meta: callTimeMeta = paramsRef.current.meta,
        } = {}) =>
            dataProvider
                .create(callTimeResource, {
                    data: callTimeData,
                    meta: callTimeMeta,
                })
                .then(({ data }) => data),
        {
            ...options,
            onSuccess: (
                data: any,
                variables: any = {},
                context: unknown
            ) => {
                const { resource: callTimeResource = resource } = variables;
                queryClient.setQueryData(
                    [callTimeResource, 'getOne', { id: String(data.id) }],
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
        createOptions: any & { returnPromise?: boolean } = {}
    ) => {
        const { returnPromise, ...reactCreateOptions } = createOptions;
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

    return [create, mutation];
};
