import React, { createElement, Fragment } from "../../preact/compat";
import { useDataProvider } from './useDataProvider';
import undoableEventEmitter from './undoableEventEmitter';
import { useQueryClient } from "../tuval/QueryClientProvider";
import { useMutation } from "../tuval/useMutation";

/**
 * Get a callback to call the dataProvider.update() method, the result and the loading state.
 *
 * @param {string} resource
 * @param {Params} params The update parameters { id, data, previousData, meta }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh(); } }
 * May include a mutation mode (optimistic/pessimistic/undoable), e.g. { mutationMode: 'undoable' }
 *
 * @typedef Params
 * @prop params.id The resource identifier, e.g. 123
 * @prop params.data The updates to merge into the record, e.g. { views: 10 }
 * @prop params.previousData The record before the update is applied
 * @prop params.meta Optional meta data
 *
 * @returns The current mutation state. Destructure as [update, { data, error, isLoading }].
 *
 * The return value updates according to the request state:
 *
 * - initial: [update, { isLoading: false, isIdle: true }]
 * - start:   [update, { isLoading: true }]
 * - success: [update, { data: [data from response], isLoading: false, isSuccess: true }]
 * - error:   [update, { error: [error from response], isLoading: false, isError: true }]
 *
 * The update() function must be called with a resource and a parameter object: update(resource, { id, data, previousData }, options)
 *
 * This hook uses react-query useMutation under the hood.
 * This means the state object contains mutate, isIdle, reset and other react-query methods.
 *
 * @see https://react-query-v3.tanstack.com/reference/useMutation
 *
 * @example // set params when calling the update callback
 *
 * import { useUpdate, useRecordContext } from 'react-admin';
 *
 * const IncreaseLikeButton = () => {
 *     const record = useRecordContext();
 *     const diff = { likes: record.likes + 1 };
 *     const [update, { isLoading, error }] = useUpdate();
 *     const handleClick = () => {
 *         update('likes', { id: record.id, data: diff, previousData: record })
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isLoading} onClick={handleClick}>Like</div>;
 * };
 *
 * @example // set params when calling the hook
 *
 * import { useUpdate, useRecordContext } from 'react-admin';
 *
 * const IncreaseLikeButton = () => {
 *     const record = useRecordContext();
 *     const diff = { likes: record.likes + 1 };
 *     const [update, { isLoading, error }] = useUpdate('likes', { id: record.id, data: diff, previousData: record });
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isLoading} onClick={() => update()}>Like</button>;
 * };
 *
 * @example // TypeScript
 * const [update, { data }] = useUpdate<Product>('products', { id, data: diff, previousData: product });
 *                    \-- data is Product
 */
export const useUpdate = (
    resource?: string,
    params: any = {},
    options: any = {}
): any => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const { id, data, meta } = params;
    const { mutationMode = 'pessimistic', ...reactMutationOptions } = options;
    const mode = React.useRef(mutationMode);
    const paramsRef = React.useRef(params);
    const snapshot = React.useRef([]);

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

        type GetListResult = Omit<any, 'data'> & {
            data?: any[];
        };

        queryClient.setQueryData(
            [resource, 'getOne', { id: String(id), meta }],
            (record: any) => ({ ...record, ...data }),
            { updatedAt }
        );
        queryClient.setQueriesData(
            [resource, 'getList'],
            (res: GetListResult) =>
                res && res.data ? { ...res, data: updateColl(res.data) } : res,
            { updatedAt }
        );
        queryClient.setQueriesData(
            [resource, 'getMany'],
            (coll: any[]) =>
                coll && coll.length > 0 ? updateColl(coll) : coll,
            { updatedAt }
        );
        queryClient.setQueriesData(
            [resource, 'getManyReference'],
            (res: GetListResult) =>
                res && res.data
                    ? { data: updateColl(res.data), total: res.total }
                    : res,
            { updatedAt }
        );
    };

    const mutation = useMutation(
        ({
            resource: callTimeResource = resource,
            id: callTimeId = paramsRef.current.id,
            data: callTimeData = paramsRef.current.data,
            meta: callTimeMeta = paramsRef.current.meta,
            previousData: callTimePreviousData = paramsRef.current.previousData,
        } = {}) =>
            dataProvider
                .update(callTimeResource, {
                    id: callTimeId,
                    data: callTimeData,
                    previousData: callTimePreviousData,
                    meta: callTimeMeta,
                })
                .then(({ data }) => data),
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
                variables: any  = {},
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
    );

    const update = async (
        callTimeResource: string = resource,
        callTimeParams: any = {},
        updateOptions: any & { mutationMode?: any; returnPromise?: boolean } = {}
    ) => {
        const {
            mutationMode,
            returnPromise,
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

        const previousRecord = queryClient.getQueryData([
            callTimeResource,
            'getOne',
            { id: String(callTimeId), meta: callTimeMeta },
        ]);

        const queryKeys = [
            [
                callTimeResource,
                'getOne',
                { id: String(callTimeId), meta: callTimeMeta },
            ],
            [callTimeResource, 'getList'],
            [callTimeResource, 'getMany'],
            [callTimeResource, 'getManyReference'],
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
            // undoable mutation: register the mutation for later
            undoableEventEmitter.once('end', ({ isUndo }) => {
                if (isUndo) {
                    // rollback
                    snapshot.current.forEach(([key, value]) => {
                        queryClient.setQueryData(key, value);
                    });
                } else {
                    // call the mutate method without success side effects
                    mutation.mutate(
                        { resource: callTimeResource, ...callTimeParams },
                        { onSettled, onError }
                    );
                }
            });
        }
    };

    return [update, mutation];
};
