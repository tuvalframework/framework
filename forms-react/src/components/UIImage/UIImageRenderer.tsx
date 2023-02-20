import { OverlayPanel } from 'primereact';
import React, { Fragment, useEffect, useRef } from "react";
import { UIImageClass } from './UIImageClass';



export interface IControlProperties {
    control: UIImageClass
}



function UIImageRenderer({ control }: IControlProperties) {

    return (
        <img
            src={control.vp_Src}
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