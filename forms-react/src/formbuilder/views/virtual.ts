//import { Validator } from "jsonschema";

import { useFormController } from "../../UIFormController";
import { Fragment } from "../../components/Fragment/Fragment";
import { FormBuilder } from "../FormBuilder";

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
    let { name, value } = fieldInfo;
    value = FormBuilder.compileFormula(value);

    const formController = useFormController();
    let currentValue = formController.GetValue(name);

    if (currentValue !== value){
        formController.SetValue(name, value);
    }

    return Fragment();



}