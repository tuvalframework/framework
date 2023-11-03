import { RecordContextProvider, useGetOne } from "ra-core";
import React from "react";
import { RecordContextClass } from "./RecordContextClass";


export interface IControlProperties {
    control: RecordContextClass<any>
}


function RecordContextRenderer({ control }: IControlProperties) {
    const { data, isLoading, error } = useGetOne(control.vp_Resource, control.vp_Filter,{
        onError : (err:any) => {
            if (err.status === 401){
                window.location.href = '/logout'
            }
        }
    });
    
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