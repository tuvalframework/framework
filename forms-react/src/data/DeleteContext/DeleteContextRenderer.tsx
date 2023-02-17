import { is } from "@tuval/core";
import { useCreate, useDelete, useGetOne, useUpdate } from "ra-core";
import React, { Fragment } from "react";
import { useFormController } from "../../UIFormController";
import { DeleteContextClass } from "./DeleteContextClass";


export interface IControlProperties {
    control: DeleteContextClass;
}


function DeleteContextRenderer({ control }: IControlProperties) {

    const formController = useFormController();


    const getOneResult = useGetOne(control.vp_Resource, control.vp_Filter, {
        onSuccess: (data) => {
            if (!formController.IsLoaded) {
                for (const key in data) {
                    formController.SetValue(key, data[key], false);
                }
                console.log('form loaded.')
                formController.IsLoaded = true;
            }
        }
    });

   /*  if (getOneResult.isLoading) {
        this.WriteComponent(
            <div>Loading...</div>
        );
    }

    if (getOneResult.error) {
        this.WriteComponent(
            <div>Error</div>
        );
    } */


    const [deleteOne, { isLoading, isSuccess }] = useDelete();

    const handleDelete = () => {

        deleteOne(control.vp_Resource, { id: getOneResult.data.id, previousData: getOneResult.data },
            {
                onSuccess: () => {
                    if (is.function(control.vp_OnSuccess)) {
                        control.vp_OnSuccess();
                    }
                }
            })



    }

    /*   if (isLoading) {
          this.WriteComponent(
              <div>Loading...</div>
          );
      } */



    // const { data, isLoading, error } = useGetOne(control.vp_Resource, control.vp_Filter);
    const view = control.vp_Children(handleDelete, isLoading, isSuccess);
    return (
        <Fragment>
            {view.render()}
        </Fragment>
    )

}

export default DeleteContextRenderer;