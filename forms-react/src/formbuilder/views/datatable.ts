
import { Text, UIViewBuilder } from "../../components";
import { UIDataTable } from "../../components/DataTable/DataTable";
import { Fragment } from "../../components/Fragment";
import { Spinner } from "../../components/UISpinner/UISpinner";
import { useProtocol } from "../../data/DataProviderContext";
import { UIRecordsContext } from "../../data/RecordsContext/UIRecordsContext";
import { HStack } from "../../layout/HStack/HStack";
import { is } from "@tuval/core";
import { useState } from "react";



export const DataTableView = (fieldInfo: any) => {
    const { columns, query, protocol, resource, filter, sort } = fieldInfo;

    if (protocol == null) {
        return Fragment();
    }

    return (
        UIViewBuilder(() => {
            const { query: _query, getList } = useProtocol(protocol);
            const [index, setIndex] = useState(0);
            let result: any = {};

            if (is.string(query)) {
                result = _query(query);
            } else if (is.string(resource)) {
                result = getList(resource, { filter, sort });
            }

            const { data, isLoading, invalidateQuery } = result;

            return (
                isLoading ? HStack(Spinner()) :
                    HStack(
                        /* HStack(
                            Text(String(index))
                        ).allWidth(50).allHeight(50).background('blue').onClick(() => setIndex(index + 1)), */
                        UIDataTable()
                            .columns(columns)
                            .model(is.string(query) ? data?.[resource] : data).width('100%')
                    )
                        //.border('solid 1px #DEE2E6').cornerRadius(10)
                        .padding(16)
                        .overflow('hidden')

            )
        })

    )


}