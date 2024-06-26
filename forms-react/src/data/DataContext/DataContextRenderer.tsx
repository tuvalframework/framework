import { convertLegacyDataProvider, DataProviderContext } from "ra-core";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIView } from "../../components/UIView/UIView";
import { DataContextClass } from "./DataContextClass";

export const query = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry:false
        }
    },
});


export interface IControlProperties {
    control: DataContextClass
}


function DataContextRenderer({ control }: IControlProperties) {

    const finalDataProvider = React.useMemo(
        () =>
            control.vp_DataProvider instanceof Function
                ? convertLegacyDataProvider(control.vp_DataProvider)
                : control.vp_DataProvider,
        [control.vp_DataProvider]
    );


    return (
        <DataProviderContext.Provider value={finalDataProvider}>
            <QueryClientProvider client={query}>
                {
                    control.vp_Chidren.map((view: UIView) => {
                        return view.render();
                    })
                }
            </QueryClientProvider>
        </DataProviderContext.Provider>
    );

}

export default DataContextRenderer;