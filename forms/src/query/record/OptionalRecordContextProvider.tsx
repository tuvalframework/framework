import React, { createElement, Fragment } from "../../preact/compat";
import { Teact } from "../../windows/Forms/Components/Teact";


import { RecordContextProvider } from './RecordContext';

/**
 * Wrap children with a RecordContext provider only if the value is defined.
 *
 * Allows a component to work outside of a record context.
 *
 * @example
 *
 * import { OptionalRecordContextProvider, TextField } from 'react-admin';
 *
 * const RecordTitle = ({ record }) => (
 *     <OptionalRecordContextProvider value={record}>
 *         <TextField source="title" />
 *     </OptionalRecordContextProvider>
 * );
 */
export const OptionalRecordContextProvider = ({
    value,
    children,
}: {
    children: any;
    value?: any;
}) =>
    value ? (
        <RecordContextProvider value={value}>{children}</RecordContextProvider>
    ) : (
        children
    );