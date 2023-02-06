import { css } from "@emotion/css";
import { is } from '@tuval/core';
import { Chips } from 'primereact';
import React from "react";
import { ChipsClass } from "./ChipsClass";

export interface IControlProperties {
    control: ChipsClass
}


function ChipsRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (
        <Chips value={control.vp_Value} onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e.value) : void 0} />
    );

}

export default ChipsRenderer;