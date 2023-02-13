import { convertLegacyDataProvider, DataProviderContext, RecordContextProvider, useGetOne } from "ra-core";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { UIViewClass } from "../../components/UIView/UIViewClass";
import { RecordContextClass } from "./RecordContextClass";


export interface IControlProperties {
    control: RecordContextClass<any>
}


function RecordContextRenderer({ control }: IControlProperties) {
    const { data, isLoading, error } = useGetOne(control.vp_Resource, control.vp_Filter);
    const view = control.vp_Chidren({ data, isLoading, error });
    return (
        <RecordContextProvider value={data}>
            {
                view.render()
            }
        </RecordContextProvider>
    );

}

export default RecordContextRenderer;