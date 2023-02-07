import { css } from "@emotion/css";
import { InputMask } from 'primereact';

import React, { Fragment } from "react";
import { is } from '@tuval/core';
import { InputMaskClass } from "./InputMaskClass";


export interface IControlProperties {
    control: InputMaskClass;
}

function InputMaskRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (
        <InputMask
            value={control.vp_Value}
            onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e.target.value) : void 0}
            mask="99-999999"
        />
    )

}

export default InputMaskRenderer;