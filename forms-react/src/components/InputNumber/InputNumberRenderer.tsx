import { css } from "@emotion/css";
import { InputNumber } from 'primereact';

import React, { Fragment } from "react";
import { is } from '@tuval/core';
import { InputNumberClass } from "./InputNumberClass";


interface IControlProperties {
    control: InputNumberClass;
}

function InputNumberRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    const rootClassName = css`
        width: 100%;
    `;

    return (
        <InputNumber
            value={control.vp_Value === undefined ? null : control.vp_Value}
            onValueChange={(e) => {
                is.function(control.vp_OnChange) ? control.vp_OnChange(e.value) : void 0
            }}
            inputClassName={className}
            pt={{
                root: { className: `${rootClassName}` },
                input: { className: `${className}` }
            }}
        />
    )

}

export default InputNumberRenderer;