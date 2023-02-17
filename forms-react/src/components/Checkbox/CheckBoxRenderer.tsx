import { css } from "@emotion/css";
import { is } from '@tuval/core';
import { Checkbox } from 'primereact';
import React from "react";
import { CheckBoxClass } from "./CheckboxClass";

export interface IControlProperties {
    control: CheckBoxClass
}


function CheckBoxRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (
        <div className="flex align-items-right">
            <Checkbox inputId={control.vp_Key} onChange={e => is.function(control.vp_OnChange) ? control.vp_OnChange(e.checked) : void 0} checked={control.vp_Checked}></Checkbox>
            <label htmlFor={control.vp_Key} className="ml-2">
                {control.vp_LabelView.render()}
            </label>
        </div>
    );

}

export default CheckBoxRenderer;