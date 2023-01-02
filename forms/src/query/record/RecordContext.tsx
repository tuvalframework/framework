
import React, { createElement, Fragment } from "../../preact/compat";
import { Teact } from "../../windows/Forms/Components/Teact";

/**
 * Context to store a record.
 *
 * @see RecordContextProvider
 * @see useRecordContext
 */
export const RecordContext = React.createContext(
    undefined
);

export const RecordsContext = React.createContext(
    undefined
);


/**
 * Provider for the Record Context, to store a record.
 *
 * Use the useRecordContext() hook to read the context.
 * That's what the Edit and Show components do in react-admin.
 *
 * Many react-admin components read the RecordContext, including all Field
 * components.
 *
 * @example
 *
 * import { useGetOne, RecordContextProvider } from 'ra-core';
 *
 * const Show = ({ resource, id }) => {
 *     const { data } = useGetOne(resource, { id });
 *     return (
 *         <RecordContextProvider value={data}>
 *             ...
 *         </RecordContextProvider>
 *     );
 * };
 */
export const RecordContextProvider = ({
    children,
    value,
}: any) => (
    <RecordContext.Provider value={value}>{children}</RecordContext.Provider>
);

export interface RecordContextProviderProps<RecordType> {
    children: any;
    value?: RecordType;
}

export const RecordsContextProvider = ({
    children,
    value,
}: any) => (
    <RecordsContext.Provider value={value}>{children}</RecordsContext.Provider>
);