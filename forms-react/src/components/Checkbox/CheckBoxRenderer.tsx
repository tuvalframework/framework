import { css } from "@emotion/css";
import { is } from '@tuval/core';
import { Checkbox } from 'primereact';
import React, { useMemo } from "react";
import { CheckBoxClass } from "./CheckboxClass";
import { nanoid } from 'nanoid'

export interface IControlProperties {
    control: CheckBoxClass
}


function CheckBoxRenderer({ control }: IControlProperties) {
    const key = useMemo(() => nanoid(), [])

    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (
        <div className="flex align-items-right">
            <Checkbox inputId={key} onChange={e => is.function(control.vp_OnChange) ? control.vp_OnChange(e.checked) : void 0} checked={control.vp_Checked}></Checkbox>
            {
                control.vp_LabelView && (
                    <label htmlFor={key} className="ml-2">
                        {control.vp_LabelView.render()}
                    </label>
                )
            }

        </div>
    );

}

export default CheckBoxRenderer;