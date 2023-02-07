import { css } from "@emotion/css";
import { InputNumber } from 'primereact';

import React, { Fragment } from "react";
import { is } from '@tuval/core';
import { InputNumberClass } from "./InputNumberClass";


export interface IControlProperties {
    control: InputNumberClass;
}

function InputNumberRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (
        <InputNumber
            value={control.vp_Value}
            onValueChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e.value) : void 0}
        />
    )

}

export default InputNumberRenderer;