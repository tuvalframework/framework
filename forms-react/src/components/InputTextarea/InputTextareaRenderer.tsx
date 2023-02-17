import { css } from "@emotion/css";
import { is } from "@tuval/core";
import { InputTextarea } from 'primereact';
import React from "react";
import { InputTextareaClass } from "./InputTextareaClass";

export interface IControlProperties {
    control: InputTextareaClass
}


function InputTextareaRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (
        <InputTextarea
            className={className}
            value={control.vp_Value}
            onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e.target.value) : void 0}
            rows={5}
            cols={30} />
    );

}

export default InputTextareaRenderer;