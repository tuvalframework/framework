import { css } from "@emotion/css";
import { is } from '@tuval/core';
import { ColorPicker } from 'primereact';
import React from "react";
import { ColorPickerClass } from "./ColorPickerClass";

export interface IControlProperties {
    control: ColorPickerClass
}


function ColorPickerRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (
        <ColorPicker format="hex" value={control.vp_Value} onChange={(e) => is.function(control.vp_OnChange) ? control.onChange(e.value) : void 0} />
    );

}

export default ColorPickerRenderer;