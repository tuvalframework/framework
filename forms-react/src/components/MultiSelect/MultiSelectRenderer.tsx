import React, { useState } from "react";
import { MultiSelect } from 'primereact';
import { css } from "@emotion/css";
import { is } from "@tuval/core";
import { MultiSelectClass } from "./MultiSelectClass";

export interface IControlProperties {
    control: MultiSelectClass
}


function MultiSelectRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (
        <MultiSelect
            className={className}
            value={control.vp_Value}
            onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e.value) : void 0}
            options={control.vp_Model}
            optionLabel={control.vp_Fields?.text}
            optionValue={control.vp_Fields?.value}
            placeholder={control.vp_Placeholder}
        />
    );
}

export default MultiSelectRenderer;