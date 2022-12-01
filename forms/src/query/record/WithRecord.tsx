import React, { createElement, Fragment } from "../../preact/compat";
import { Teact } from "../../windows/Forms/Components/Teact";

import { useRecordContext } from './useRecordContext';

/**
 * Render prop version of useRecordContext
 *
 * @example
 * const BookShow = () => (
 *    <Show>
 *       <SimpleShowLayout>
 *          <WithRecord render={record => <span>{record.title}</span>} />
 *      </SimpleShowLayout>
 *   </Show>
 * );
 */
export const WithRecord = <RecordType extends any>({
    render,
}: WithRecordProps<RecordType>) => {
    const record = useRecordContext();
    return record ? render(record) : null;
};

export interface WithRecordProps<RecordType extends any> {
    render: (record: RecordType) => any;
    label?: string;
}