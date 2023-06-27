import { is } from "@tuval/core";
import { compile } from "handlebars";
//import { Validator } from "jsonschema";
import { FormBuilder, compileFormula } from "../FormBuilder";
import { helpIcon } from "../helpIcon";
import { useFormController } from "../../UIFormController";
import { VStack } from "../../layout/VStack/VStack";
import { cLeading, cTopLeading } from "../../Constants";
import { HStack } from "../../layout/HStack/HStack";
import { Text, TextAlignment, TextField, TooltipPositions } from "../../components";
import { Icon } from "../../components/Icon/Icon";

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

export const RelativeUriView = (fieldInfo: any) => {
   // v.validate(fieldInfo, schema).valid;

    const formController = useFormController();
    const { required, multiline, description, formula, helpText } = fieldInfo;

    let canRender = FormBuilder.canRender(fieldInfo, formController)

    if (canRender) {
        return (
            VStack({ alignment: cTopLeading })(
                //Text(FormBuilder.canRender(visibleWhen, formController).toString()),
                HStack({ alignment: cLeading, spacing: 5 })(
                    Text(fieldInfo.label + (required ? '*' : '')).kerning('0.00938em')
                        .lineHeight('24px').foregroundColor('#333D47').fontSize(14)
                        .fontWeight(required ? '600' : '400'),
                    HStack(
                        Icon(helpIcon).size(24)
                    ).width().height().tooltip(helpText).tooltipPosition(TooltipPositions.RIGHT)
                ).height()
                ,
                formula != null ?
                    TextField()
                        .value(compileFormula(formController.GetFormData(), formula))
                        .multiline(multiline)
                        .height(multiline ? '' : '38px')
                        .foregroundColor('rgb(51,61,71)')
                        .cornerRadius(2)
                        .border('1px solid #D6E4ED')
                        .shadow({ focus: 'none' })
                        .fontSize(15) :
                    TextField()
                        .multiline(multiline)
                        .height(multiline ? '' : '38px')
                        .foregroundColor('rgb(51,61,71)')
                        .cornerRadius(2)
                        .formField(fieldInfo.name, [])
                        .border('1px solid #D6E4ED')
                        .shadow({ focus: 'none' })
                        .fontSize(15),
                description &&
                Text(description).multilineTextAlignment(TextAlignment.leading)
                    .foregroundColor('#95ABBC')
                    .fontSize('12px')
                    .fontFamily('"Roboto", "Helvetica", "Arial", sans-serif')
                    .kerning('0.03333em')
                    .lineHeight('20px')
                    .marginTop('4px')
            ).height().marginBottom('16px')
        )
    }
}

