import React, { createElement, Fragment } from "../../preact/compat";
import { Teact } from "../../windows/Forms/Components/Teact";

import { DataProviderContext } from './DataProviderContext';
import { defaultDataProvider } from './defaultDataProvider';
import validateResponseFormat from './validateResponseFormat';

import { reactAdminFetchActions } from './dataFetchActions';
import { is } from "@tuval/core";

// declare var logoutIfAccessDenied;
/**
 * Hook for getting a dataProvider
 *
 * Gets a dataProvider object, which behaves just like the real dataProvider
 * (same methods returning a Promise). But it's actually a Proxy object,
 * which validates the response format, and logs the user out upon error
 * if authProvider.checkError() rejects.
 *
 * @return dataProvider
 *
 * @example Basic usage
 *
 * import * as React from 'react';
 * import { useState } from 'react';
 * import { useDataProvider } from 'react-admin';
 *
 * const PostList = () => {
 *      const [posts, setPosts] = useState([])
 *      const dataProvider = useDataProvider();
 *      useEffect(() => {
 *          dataProvider.getList('posts', { filter: { status: 'pending' }})
 *            .then(({ data }) => setPosts(data));
 *      }, [])
 *
 *      return (
 *          <Fragment>
 *              {posts.map((post, key) => <PostDetail post={post} key={key} />)}
 *          </Fragment>
 *     );
 * }
 *
 * @example Handling all states (loading, error, success)
 *
 * import { useState, useEffect } from 'react';
 * import { useDataProvider } from 'react-admin';
 *
 * const UserProfile = ({ userId }) => {
 *     const dataProvider = useDataProvider();
 *     const [user, setUser] = useState();
 *     const [loading, setLoading] = useState(true);
 *     const [error, setError] = useState();
 *     useEffect(() => {
 *         dataProvider.getOne('users', { id: userId })
 *             .then(({ data }) => {
 *                 setUser(data);
 *                 setLoading(false);
 *             })
 *             .catch(error => {
 *                 setError(error);
 *                 setLoading(false);
 *             })
 *     }, []);
 *
 *     if (loading) return <Loading />;
 *     if (error) return <Error />
 *     if (!user) return null;
 *
 *     return (
 *         <ul>
 *             <li>Name: {user.name}</li>
 *             <li>Email: {user.email}</li>
 *         </ul>
 *     )
 * }
 */

const arrayReturnTypes = ['getList', 'getMany', 'getManyReference'];

export const _useDataProvider = (): any => {
    const dataProvider = React.useContext(DataProviderContext)

    return dataProvider;
};

export const useDataProvider = (): any => {
    let dp = React.useContext(DataProviderContext) 
    if (is.function(dp)) {
        dp = dp();
    }
    const dataProvider = ((dp ||
        defaultDataProvider) as unknown) as any;

    // const logoutIfAccessDenied = useLogoutIfAccessDenied();

    const dataProviderProxy = React.useMemo(() => {
        return new Proxy(dataProvider, {
            get: (target, name) => {
                if (typeof name === 'symbol' || name === 'then') {
                    return;
                }
                return (...args) => {
                    const type = name.toString();

                    if (typeof dataProvider[type] !== 'function') {
                        throw new Error(
                            `Unknown dataProvider function: ${type}`
                        );
                    }

                    try {
                        return dataProvider[type]
                            .apply(dataProvider, args)
                            .then(response => {
                                if (
                                    process.env.NODE_ENV !== 'production' &&
                                    reactAdminFetchActions.includes(type)
                                ) {
                                    validateResponseFormat(response, type);
                                }
                                return response;
                            })
                            .catch(error => {
                                if (process.env.NODE_ENV !== 'production') {
                                    console.error(error);
                                }
                                /* return logoutIfAccessDenied(error).then(
                                    loggedOut => {
                                        if (loggedOut)
                                            return {
                                                data: arrayReturnTypes.includes(
                                                    type
                                                )
                                                    ? []
                                                    : {},
                                            };
                                        throw error;
                                    }
                                ); */
                            });
                    } catch (e) {
                        if (process.env.NODE_ENV !== 'production') {
                            console.error(e);
                        }
                        throw new Error(
                            'The dataProvider threw an error. It should return a rejected Promise instead.'
                        ); 
                    }
                };
            },
        });
    }, [dataProvider /* logoutIfAccessDenied */]);

    return dataProviderProxy;
};