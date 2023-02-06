import React, { useState } from "react";
import { InputText } from 'primereact';
import { TextFieldClass } from "./TextFieldClass";
import { css } from "@emotion/css";

export interface IControlProperties {
    control: TextFieldClass
}


function TextFieldRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (
        <InputText
            key={control.vp_Key}
            className={className}
            value={control.vp_Value}
            onChange={control.vp_OnChange?.bind(control)}
        />
    );

}

export default TextFieldRenderer;