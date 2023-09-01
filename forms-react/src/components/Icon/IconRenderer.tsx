import { css } from "@emotion/css";
import { is } from "@tuval/core";
import { Icon } from "monday-ui-react-core";
import { InputText } from 'primereact';

import React from "react";
import { IconClass } from "./IconClass";
import  "monday-ui-react-core/dist/Icon.css";




export interface IControlProperties {
    control: IconClass;
}

function IconRenderer({ control }: IControlProperties) {

    if (is.string(control.vp_Icon)) {
        const iconClassName = css`
        font-family: "TuvalProcetraIcons";
        speak:none;
        font-style:normal;
        font-weight:normal;
        font-variant:normal;
        font-size: ${control.Appearance.FontSize == null ? 'inherit' : control.Appearance.FontSize } ;
        text-transform:none;
        line-height:1;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color:${control.Appearance.Color};
        &:before {
            content: "${control.vp_Icon}"
        }
        &:after {
            content: "${control.vp_Icon2}"
        }
        `;
        return (
            <i className={iconClassName}></i>
        )
    } else {
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


}

export default IconRenderer;