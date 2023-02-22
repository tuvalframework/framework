import { css } from "@emotion/css";
import { InputMask } from 'primereact';


import React, { Fragment } from "react";
import { is } from '@tuval/core';
import { InputSwitchClass } from "./InputSwitchClass";
import { InputSwitch } from "primereact";
import BootstrapSwitchButton from "./BootstrapSwitchButton";


export interface IControlProperties {
    control: InputSwitchClass;
}

function InputSwitchRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (
        <BootstrapSwitchButton
            checked={control.vp_Checked}
            onlabel='Active'
            onstyle='primary'
            offlabel='Inactive'
            offstyle='light'
            width={100}
            height={34}
            onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e) : void 0}
        />
        /*   <InputSwitch checked={control.vp_Checked} onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e.value) : void 0} /> */
    )

}

export default InputSwitchRenderer;