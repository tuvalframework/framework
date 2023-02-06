import { css } from "@emotion/css";
import { is } from '@tuval/core';
import { Dropdown } from 'primereact';
import React from "react";
import { DropdownClass } from "./DropdownClass";

export interface IControlProperties {
    control: DropdownClass
}


function DropdownRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (
        <Dropdown
            className={className}
            value={control.vp_Value}
            onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e.value) : void 0}
            options={control.vp_Model}
            optionLabel={control.vp_fields?.text}
            optionValue={control.vp_fields?.value}
            placeholder="Select a City"
        />
    );

}

export default DropdownRenderer;