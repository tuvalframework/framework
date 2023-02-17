import { css } from "@emotion/css";
import { Icon } from "monday-ui-react-core";
import { InputText } from 'primereact';

import React from "react";
import { IconClass } from "./IconClass";




export interface IControlProperties {
    control: IconClass;
}

function IconRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (
        <Icon
            iconType={control.vp_IconType as any}
            icon={control.vp_Icon}
            iconLabel="my bolt svg icon"
            iconSize={control.vp_Size}
            ignoreFocusStyle={true}
        />
    );

}

export default IconRenderer;