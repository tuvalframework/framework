
import { cLeading } from "../../Constants";
import { Text, TooltipPositions } from "../../components";
import { Fragment } from "../../components/Fragment/Fragment";
import { Icon } from "../../components/Icon/Icon";
import { HStack } from "../../layout/HStack/HStack";
import { helpIcon } from "../helpIcon";
import { is } from "@tuval/core";


export const label = (fieldInfo: any) => {
    const { label, required, helpText } = fieldInfo;
    return (
        label ?
        HStack({ alignment: cLeading, spacing: 10 })(
            Text(label + (required ? '*' : '')).kerning('0.00938em')
                .lineHeight('24px').foregroundColor('#333D47').fontSize(14)
                .fontWeight(required ? '600' : '400')
                .fontFamily(required ? 'source sans pro semibold' :'source sans pro'),
            is.nullOrEmpty(helpText) ? Fragment() :
                HStack(
                    Icon(helpIcon).size(24)
                ).width().height().tooltip(helpText).tooltipPosition(TooltipPositions.RIGHT)
        ).height()
        : Fragment()
    )
}