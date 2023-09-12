
import { cTopLeading, cLeading, cVertical } from "../../Constants";
import { UIFormController, useFormController } from "../../UIFormController";
import { HStack, VStack } from "../../layout";
import { FormBuilder, compileFormula } from "../FormBuilder";
import { DateField, DatePicker, PresetDate, RangePicker, RangeValue, Segmented, Text, TimePicker, TreeSelect } from "../../components";
import { FunctionComponent, useEffect } from "react";
import { moment } from '@tuval/core'

interface IRangePickerViewPropeties {
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
    value?: any[];
    start_date_name?: string;
    end_date_name?: string;
    presets:PresetDate<Exclude<RangeValue, null>>[]
    renderer?: FunctionComponent<any>;
    onChange?: (formController: UIFormController, value: string | number) => void;
}

export const RangePickerView = (fieldInfo: IRangePickerViewPropeties) => {
    // v.validate(fieldInfo, schema).valid;

    const formController = useFormController();
    let { renderer, visibleWhen,
        required, description, name, defaultValue, startAdornment, endAdornment, defaultDisabled, formula,
        value, onChange = void 0 , presets, start_date_name, end_date_name} = fieldInfo;

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
                        RangePicker().presets(presets)
                        .onChange((values, formatString) => {
                            formController.SetValue(start_date_name, values[0]);
                            formController.SetValue(end_date_name, values[1]);
                        }),
                        endAdornment && endAdornment && Text(endAdornment).foregroundColor('#677A89').fontSize(17).fontFamily('source sans pro').lineHeight(22),
                    ).height().padding(cVertical, 5),
                ).height().marginBottom('16px')
            )
        )
    }
}