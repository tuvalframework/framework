import { css } from "@emotion/css";
import { InputMask } from 'primereact';


import React, { Fragment } from "react";
import { is } from '@tuval/core';
import { InputSwitchClass } from "./InputSwitchClass";
import { InputSwitch } from "primereact";
import BootstrapSwitchButton from "./BootstrapSwitchButton";
import { Toggle } from "monday-ui-react-core";


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
        <Toggle
            onOverrideText={control.vp_OnLabel ? control.vp_OnLabel : ''}
            offOverrideText={control.vp_offLabel ? control.vp_offLabel : ''}
            isDefaultSelected={false}
            isSelected={control.vp_Checked}
            onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e) : void 0} />

        /*   <InputSwitch checked={control.vp_Checked} onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e.value) : void 0} /> */
    )

    /* <BootstrapSwitchButton
            checked={control.vp_Checked}
            onlabel={control.vp_OnLabel ? control.vp_OnLabel  : 'On'}
            onstyle='primary'
            offlabel={control.vp_offLabel ? control.vp_offLabel  : 'Off'}
            offstyle='light'
            width={control.Appearance.Width?.replace('px', '')}
            height={control.Appearance.Height?.replace('px', '')}
            onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e) : void 0}
        /> */

}

export default InputSwitchRenderer;