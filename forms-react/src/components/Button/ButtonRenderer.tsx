import { css } from "@emotion/css";
import { is } from "@tuval/core";
import { Button } from "primereact";
import React from "react";
import { ButtonClass } from "./ButtonClass";

export interface IControlProperties {
    control: ButtonClass
}


function ButtonRenderer({ control }: IControlProperties) {

    debugger;

    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
`;

    if (is.array(control.vp_Children) && control.vp_Children.length > 0) {
        return (
            <Button
                className={className}
                label={control.vp_Label}
                disabled={control.vp_Disabled}
                loading={control.vp_Loading}
                onClick={(e) => is.function(control.vp_OnClick) ? control.vp_OnClick(e) : void 0}
                style={{ display: 'flex', justifyContent: 'center' }}>
                    {
                        control.vp_Children.map(view=> view && view.render())
                    }
            </Button >
        )
    } else {
        return (
            <Button className={className}>
                <img alt="logo" src="https://primefaces.org/cdn/primereact/images/primereact-logo-light.svg" className="h-2rem"></img>
            </Button>
        );
    }


}

export default ButtonRenderer;