//import { Validator } from "jsonschema";
import { cLeading, cTopLeading } from "../../Constants";
import { useFormController } from "../../UIFormController";
import { Text, TextAlignment, TooltipPositions } from "../../components";
import { Icon } from "../../components/Icon/Icon";
import { HStack } from "../../layout/HStack/HStack";
import { VStack } from "../../layout/VStack/VStack";
import { UIWidget } from "../../loaders/WidgetLoader/Widget";
import { FormBuilder } from "../FormBuilder";
import { helpIcon } from "../helpIcon";

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



export const WidgetView = (fieldInfo: any) => {

    const formController = useFormController();
    const { required, multiline, description, formula, helpText, widgetName, config } = fieldInfo;

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
                UIWidget(widgetName).config(config),
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

