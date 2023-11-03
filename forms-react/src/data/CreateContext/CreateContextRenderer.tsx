import { is } from "@tuval/core";
import { useCreate } from "ra-core";
import React, { Fragment } from "react";
import { useFormController } from "../../UIFormController";
import { CreateContextClass } from "./CreateContextClass";


export interface IControlProperties {
    control: CreateContextClass;
}


function CreateContextRenderer({ control }: IControlProperties) {

    const formController = useFormController();
    const [create, { isLoading, isSuccess }] = useCreate();

    const handleCreate = () => {

        const [isValid, data] = formController.validateForm();
        if (isValid) {
            create(control.vp_Resource, { data: data }, {
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
    const view = control.vp_Children(handleCreate, isLoading, isSuccess);
    return (
        <Fragment>
            {view.render()}
        </Fragment>
    )

}

export default CreateContextRenderer;