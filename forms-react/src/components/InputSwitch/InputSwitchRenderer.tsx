import { css } from "@emotion/css";
import { InputMask } from 'primereact';
import Switch from "react-switch";

import React, { Fragment } from "react";
import { is } from '@tuval/core';
import { InputSwitchClass } from "./InputSwitchClass";
import { InputSwitch } from "primereact";


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
        <Switch
            checked={control.vp_Checked}
            onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e) : void 0}
            handleDiameter={30}
            offColor="#F8F9FA"
            onColor="#E14818"
            offHandleColor="#FFF"
            onHandleColor="#FFF"
            height={40}
            width={120}
            borderRadius={0}
            activeBoxShadow="0px 0px 1px 2px #fffc35"
            uncheckedIcon={
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        fontSize: 15,
                        color: "orange",
                        paddingRight: 2
                    }}
                >
                    Inactive
                </div>
            }
            checkedIcon={
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        fontSize: 15,
                        color: "orange",
                        paddingRight: 2
                    }}
                >
                    Active
                </div>
            }
           
            id="small-radius-switch"
        />
        /*   <InputSwitch checked={control.vp_Checked} onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e.value) : void 0} /> */
    )

}

export default InputSwitchRenderer;