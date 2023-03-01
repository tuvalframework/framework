import { css } from '@emotion/css';
import { OverlayPanel } from 'primereact';
import React, { Fragment, useEffect, useRef } from "react";
import { UIImageClass } from './UIImageClass';



export interface IControlProperties {
    control: UIImageClass
}



function UIImageRenderer({ control }: IControlProperties) {


    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
`;

    return (
        <img
            src={control.vp_Src}
            className={className}
            style={{
                width: control.vp_ImageWidth ?? control.Appearance.Width,
                height: control.vp_ImageHeight ?? control.Appearance.Height,
                maxWidth: control.Appearance.MaxWidth,
                maxHeight: control.Appearance.MaxHeight,
                borderRadius: control.Appearance.BorderRadius

            }}>

        </img>
    )


}

export default UIImageRenderer;