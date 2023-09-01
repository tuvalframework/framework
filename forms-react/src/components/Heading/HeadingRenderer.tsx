import { css } from "@emotion/css";
import { Heading } from "monday-ui-react-core";
import  "monday-ui-react-core/dist/Heading.css";



import React from "react";
import { HeadingClass } from "./HeadingClass";



export interface IControlProperties {
    control: HeadingClass
}

function HeadingRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (

            <Heading className={className}
            ellipsis={control.vp_Ellipsis}
            ellipsisMaxLines={control.vp_EllipsisMaxLines}
            value={control.vp_Value}
            type={control.vp_Type}
            size={control.vp_Size as any}
            />

    );

}

export default HeadingRenderer;