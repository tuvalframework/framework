import { css } from "@emotion/css";
import { InputMask } from 'primereact';

import React, { Fragment } from "react";
import { is } from '@tuval/core';
import { Knob } from "primereact";
import { KnobClass } from "./KnobClass";


export interface IControlProperties {
    control: KnobClass;
}

function KnobRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (
        <Knob value={control.vp_Value} onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e.value) : void 0} />
    )

}

export default KnobRenderer;