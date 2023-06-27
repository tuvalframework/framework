
import { cLeading } from "../../Constants";
import { Text, TextAlignment, TooltipPositions } from "../../components";
import { Fragment } from "../../components/Fragment/Fragment";
import { Icon } from "../../components/Icon/Icon";
import { HStack } from "../../layout/HStack/HStack";
import { helpIcon } from "../helpIcon";
import { is } from "@tuval/core";


export const description = (fieldInfo: any) => {
    const { description } = fieldInfo;
    return (
        description ?
            Text(description).multilineTextAlignment(TextAlignment.leading)
                .foregroundColor('#95ABBC')
                .fontSize('12px')
                .fontFamily('"Roboto", "Helvetica", "Arial", sans-serif')
                .kerning('0.03333em')
                .lineHeight('20px')
                .marginTop('4px')
            : Fragment()
    )
}