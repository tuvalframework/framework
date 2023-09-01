
import { cTopLeading, cLeading } from "../../Constants";
import { UIFormController, useFormController } from "../../UIFormController";
import { HStack, VStack } from "../../layout";
import { FormBuilder, compileFormula } from "../FormBuilder";
import { DateField, DatePicker, Text, TimePicker } from "../../components";
import { FunctionComponent, useEffect } from "react";
import { moment } from '@tuval/core'

interface DatePickerProperties {
    title?: string;
    datePickerRenderer?: FunctionComponent<any>;
    timePickerRenderer?: FunctionComponent<any>;
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
    onChange?: (formController: UIFormController, value: Date) => void;
}

export const DateTimePickerView = (fieldInfo: DatePickerProperties) => {
    // v.validate(fieldInfo, schema).valid;

    const formController = useFormController();
    let { visibleWhen, required, description, name, defaultValue, startAdornment, endAdornment, defaultDisabled, formula, datePickerRenderer, timePickerRenderer, onChange } = fieldInfo;

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
                    HStack(
                        DatePicker()
                            .disabled(defaultDisabled)
                            .value(formController.GetValue(name))
                            .foregroundColor('rgb(51,61,71)')
                            .background({ disabled: '#F0F5F9' })
                            .cornerRadius(2)
                            .border({ default: '1px solid #D6E4ED', hover: '1px solid #2776C7', focus: '1px solid #2776C7' })
                            .shadow({ focus: 'none' })
                            .fontSize(15)
                            .renderer(datePickerRenderer)
                            .onChange((e) => {
                                if (formController.GetValue(name) != null) {
                                    const momentDate = moment(e);
                                    const momentCurrentDate = moment(formController.GetValue(name));
                                    var date = momentCurrentDate.year(momentDate.year()).month(momentDate.month()).date(momentDate.date());
                                    formController.SetValue(name, date.toDate());
                                    onChange?.(formController, date.toDate());

                                } else {
                                    formController.SetValue(name, e);
                                    onChange?.(formController, e);
                                }
                                
                             
                            }),
                        TimePicker()
                            .disabled(defaultDisabled)
                            .value(formController.GetValue(name))
                            .foregroundColor('rgb(51,61,71)')
                            .background({ disabled: '#F0F5F9' })
                            .cornerRadius(2)
                            .border({ default: '1px solid #D6E4ED', hover: '1px solid #2776C7', focus: '1px solid #2776C7' })
                            .shadow({ focus: 'none' })
                            .fontSize(15)
                            .renderer(timePickerRenderer)
                            .onChange((e) => {
                                const momentDate = moment(formController.GetValue(name));
                                const momentTime = moment(e);
                                var date = momentDate.hour(momentTime.hour()).minute(momentTime.minute()).second(0);
                                formController.SetValue(name, date.toDate());
                               
                                onChange?.(formController, date.toDate());
                            })
                    ),
                    endAdornment && endAdornment && Text(endAdornment).foregroundColor('#677A89').fontSize(17).fontFamily('source sans pro').lineHeight(22),

                ).height(),
            ).height().marginBottom('16px')
        )
    }
}