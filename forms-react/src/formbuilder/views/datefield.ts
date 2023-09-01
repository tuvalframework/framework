import { TextField } from "monday-ui-react-core";
import { cTopLeading, cLeading } from "../../Constants";
import { useFormController } from "../../UIFormController";
import { HStack, VStack } from "../../layout";
import { FormBuilder, compileFormula } from "../FormBuilder";
import { DateField, DatePicker, Text } from "../../components";
import { FunctionComponent, useEffect } from "react";

interface DatePickerProperties {
    title?: string;
    renderer?: FunctionComponent<any>;
    name?: string;
    description?: string;
    required?: boolean;
    fieldId?: string;
    visibleWhen?: any;
    defaultValue?: Date;
    startAdornment?: string;
    endAdornment?: string;
    defaultDisabled?: boolean;
    formula?: string;
}

export const DatePickerView = (fieldInfo: DatePickerProperties) => {
    // v.validate(fieldInfo, schema).valid;

    const formController = useFormController();
    let { visibleWhen, required, description, fieldId, name, defaultValue, startAdornment, endAdornment, defaultDisabled, formula, renderer } = fieldInfo;

    let canRender = FormBuilder.canRender(fieldInfo, formController);


    useEffect(() => {
        if (defaultValue != null) {
            formController.SetValue(fieldId, defaultValue);
        }
    }, [])


    if (canRender) {
        return (
            VStack({ alignment: cTopLeading })(
                //Text(FormBuilder.canRender(visibleWhen, formController).toString()),
                //label(fieldInfo),
                HStack({ alignment: cLeading, spacing: 5 })(
                    startAdornment && Text(startAdornment).foregroundColor('#677A89').fontSize(17).fontFamily('source sans pro').lineHeight(22),
                    formula != null ?
                        DatePicker()
                            .disabled(defaultDisabled)
                            //.defaultValue(defaultValue)
                            // .value(new compileFormula(formController.GetFormData(), formula))

                            .foregroundColor({ default: 'rgb(51,61,71)', disabled: '#8696A2' })
                            .background({ disabled: '#F0F5F9' })
                            .cornerRadius(2)
                            .border({ default: '1px solid #D6E4ED', hover: '1px solid #2776C7', focus: '1px solid #2776C7' })
                            .shadow({ focus: 'none' })
                            .fontSize(15)
                            .onChange((e) => formController.SetValue(fieldId, e)) :
                            DatePicker()
                            .disabled(defaultDisabled)
                            .value(formController.GetValue(fieldId))
                            .foregroundColor('rgb(51,61,71)')
                            .background({ disabled: '#F0F5F9' })
                            .cornerRadius(2)
                            .border({ default: '1px solid #D6E4ED', hover: '1px solid #2776C7', focus: '1px solid #2776C7' })
                            .shadow({ focus: 'none' })
                            .fontSize(15)
                            .renderer(renderer)
                            .onChange((e) => {
                                formController.SetValue(fieldId, e);
                            }),
                    endAdornment && endAdornment && Text(endAdornment).foregroundColor('#677A89').fontSize(17).fontFamily('source sans pro').lineHeight(22),

                ).height(),
                /* description &&
                Text(description).multilineTextAlignment(TextAlignment.leading)

                    .foregroundColor('#95ABBC')
                    .fontSize('12px')
                    .fontFamily('"Roboto", "Helvetica", "Arial", sans-serif')
                    .kerning('0.03333em')
                    .lineHeight('20px')
                    .marginTop('4px') */
            ).height().marginBottom('16px')
        )
    }
}