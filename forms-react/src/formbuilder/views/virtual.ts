//import { Validator } from "jsonschema";

import { useFormController } from "../../UIFormController";
import { Fragment } from "../../components/Fragment/Fragment";

//const v = new Validator();

var schema = {
    "type": "object",
    "properties": {
        "type": {
            "type": "string",
            "value": "text"
        },
    }
}

export interface TextFieldInfo {
    type: 'text';
    label: string;
}


export const VirtualView = (fieldInfo: any) => {
    const { name, value } = fieldInfo;

    const formController = useFormController();
    const currentValue = formController.GetValue(name);

    if (currentValue !== value){
        formController.SetValue(name, value);
    }

    return Fragment();



}