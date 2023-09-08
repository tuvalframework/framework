
import { cTopLeading, cLeading, cVertical } from "../../Constants";
import { UIFormController, useFormController } from "../../UIFormController";
import { HStack, VStack } from "../../layout";
import { FormBuilder, compileFormula } from "../FormBuilder";
import { DateField, DatePicker, Segmented, Text, TimePicker, TreeSelect } from "../../components";
import { FunctionComponent, useEffect } from "react";
import { moment } from '@tuval/core'

interface ITreeSelectViewPropeties {
    title?: string;
    name?: string;
    description?: string;
    required?: boolean;
    visibleWhen?: any;
    defaultValue?: Date;
    startAdornment?: string;
    endAdornment?: string;
    defaultDisabled?: boolean;
    formula?: string;
    treeData?: any[];
    renderer?: FunctionComponent<any>;
    onChange?: (formController: UIFormController, value: string | number) => void;
}

export const TreeSelectView = (fieldInfo: ITreeSelectViewPropeties) => {
    // v.validate(fieldInfo, schema).valid;

    const formController = useFormController();
    let { renderer, visibleWhen,
        required, description, name, defaultValue, startAdornment, endAdornment, defaultDisabled, formula,
        treeData, onChange } = fieldInfo;

    let canRender = FormBuilder.canRender(fieldInfo, formController);


    useEffect(() => {
        if (defaultValue != null) {
            formController.SetValue(name, defaultValue);
        }
      
    }, [])


    if (canRender) {
        return (
            VStack({ alignment: cTopLeading })(
                HStack({ alignment: cLeading, spacing: 5 })(
                    startAdornment && Text(startAdornment).foregroundColor('#677A89').fontSize(17).fontFamily('source sans pro').lineHeight(22),
                    HStack({ alignment: cLeading })(
                        TreeSelect().treeData(treeData),
                        endAdornment && endAdornment && Text(endAdornment).foregroundColor('#677A89').fontSize(17).fontFamily('source sans pro').lineHeight(22),
                    ).height().padding(cVertical, 5),
                ).height().marginBottom('16px')
            )
        )
    }
}