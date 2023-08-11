import { useFormController } from "../../UIFormController";
import { Text } from "../../components";
import { Button } from "../../components/Button/Button";
import { useDialog } from "../../layout";
import { useFormBuilder } from "../FormBuilder";

export const PostToCallerAction = (formMeta, action) => {
    const { label } = action;
    const formController = useFormController();
    const formBuilder = useFormBuilder();
    const dialog = useDialog();

    const views = []
    const { fieldMap, layout, mode, resource, resourceId, title, protocol, mutation, query, actions } = formMeta as any;




    return (
        Button(
            Text(label)
        )
            .onClick(() => {
                (dialog as any).ShowDialogAsyncResolve(formController.GetFormData());
                dialog.Hide();
            })
    )
}