import { is } from "@tuval/core";
import { useFormController } from "../../UIFormController";
import { Text } from "../../components";
import { Button } from "../../components/Button";
import { useDialog } from "../../layout";
import { useProtocol } from "../../data/DataProviderContext/DataProviderClass";
import { Fragment } from "../../components/Fragment";
import { useFormBuilder } from "../FormBuilder";

export const NextFormAction = (formMeta, action) => {
    const { label } = action;
    const formController = useFormController();
    const formBuilder = useFormBuilder();

    const views = []
    const { fieldMap, layout, mode, resource, resourceId, title, protocol, mutation, query, actions } = formMeta as any;




    return (
        Button(
            Text(label)
        )
            .onClick(() => {
                formBuilder.nextForm()
            })
    )
}