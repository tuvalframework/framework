import { is } from "@tuval/core";
import { useFormController } from "../../UIFormController";
import { VStack } from "../../layout/VStack/VStack";
import { cTopLeading } from "../../Constants";
import { Text, UIRadioGroup } from "../../components";

export const RadioGroupoFormView = (textData: any) => {
    const formController = useFormController();
    return (
        VStack({ alignment: cTopLeading, spacing: 4 })(
            Text(textData.label).kerning('0.00938em').lineHeight('24px')
                .foregroundColor('#333D47').fontSize(14),
            UIRadioGroup()
                .radioButtons(textData.options.map(option => option.items.map(item => {
                    if (is.string(item)) {
                        return {
                            label: item,
                            value: item
                        }
                    } else if (item.value == null) {
                        return {
                            label: item.label,
                            value: item.label
                        }
                    } else {
                        return {
                            label: item.label,
                            value: item.value
                        }
                    }
                }))[0])
                .value(formController.GetValue(textData.name))
                .onChange((e) => formController.SetValue(textData.name, e))
            // .formField(textData.name, [])
        ).height().marginBottom('16px')
    )
}