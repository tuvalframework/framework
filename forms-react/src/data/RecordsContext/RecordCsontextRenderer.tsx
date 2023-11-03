import { useGetList } from "ra-core";
import React, { Fragment } from "react";
import { RecordsContextClass } from "./RecordsContextClass";


export interface IControlProperties {
    control: RecordsContextClass<any>
}


function RecordContextRenderer({ control }: IControlProperties) {
    const { data, total, isLoading, error, refetch } = useGetList(control.vp_Resource, {
        pagination: control.vp_Pagination,
        sort: control.vp_Sort,
        filter: control.vp_Filter
    },
    {
        onError : (err:any) => {
          
            if (err.status === 401){
                window.location.href = '/logout'
            }
        }
    });

    const view = control.vp_Content({ data, isLoading, total, error, refetch });
    return (
        <Fragment>
            {
                view.render()
            }
        </Fragment>
    );

}

export default RecordContextRenderer;