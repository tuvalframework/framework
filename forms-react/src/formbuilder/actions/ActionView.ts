import { useNavigate } from "react-router-dom";
import { useFormController } from "../../UIFormController";
import { useDialog } from "../../layout/Dialog/DialogView";
import { useFormBuilder } from "../FormBuilder";


export const ActionView = (formMeta, action) => {
    const { label, successAction, successActions } = action;
    const formController = useFormController();
    const dialog = useDialog();
    const formBuilder = useFormBuilder();
    const navigate = useNavigate();



}