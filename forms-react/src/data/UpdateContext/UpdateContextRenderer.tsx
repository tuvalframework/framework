import { is } from "@tuval/core";
import { useCreate, useGetOne, useUpdate } from "ra-core";
import React, { Fragment } from "react";
import { useFormController } from "../../UIFormController";
import { UpdateContextClass } from "./UpdateContextClass";


export interface IControlProperties {
    control: UpdateContextClass;
}


function UpdateContextRenderer({ control }: IControlProperties) {

    const formController = useFormController();


    const getOneResult = useGetOne(control.vp_Resource, control.vp_Filter, {
        onSuccess: (data) => {


        }
    });

    if (getOneResult.isSuccess) {
        if (!formController.IsLoaded) {
            for (const key in getOneResult.data) {
                formController.SetValue(key, getOneResult.data[key], false);
            }
            // console.log('form loaded.')
            formController.IsLoaded = true;
        }
    }


    /* if (getOneResult.isLoading) {
        this.WriteComponent(
            <div>Loading...</div>
        );
    }

    if (getOneResult.error) {
        this.WriteComponent(
            <div>Error</div>
        );
    } */


    const [update, { isLoading, isSuccess }] = useUpdate();

    const handleUpdate= () => {
        const [isValid, formData] = formController.validateForm();
        if (isValid) {
            update(control.vp_Resource, { id: getOneResult.data.id, data: formData, previousData: getOneResult.data },
                {
                    onSuccess: (data) => {
                        if (is.function(control.vp_OnSuccess)) {
                            control.vp_OnSuccess(data);
                        }
                    },
                    onError: (e) => {
                        if (is.function(control.vp_OnError)) {
                            control.vp_OnError(e);
                        }
                    }
                })
        }
    }

    /*   if (isLoading) {
          this.WriteComponent(
              <div>Loading...</div>
          );
      } */



    // const { data, isLoading, error } = useGetOne(control.vp_Resource, control.vp_Filter);
    const view = control.vp_Children(handleUpdate,getOneResult.data, isLoading, isSuccess);
    return (
        <Fragment>
            {view.render()}
        </Fragment>
    )

}

export default UpdateContextRenderer;