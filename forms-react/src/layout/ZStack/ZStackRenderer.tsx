import { css } from "@emotion/css";
import React, { Fragment, useState } from "react";
import { UIViewClass } from "../../components/UIView/UIViewClass";
import { ZStackClass } from "./ZStackClass";



export interface IControlProperties {
    control: ZStackClass
}


function ZStackRenderer({ control }: IControlProperties) {
    const _className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
`;

    return (
        //@ts-ignore
        <Fragment>
            {
                control.vp_Chidren.map((view: UIViewClass) => {
                    if (control.vp_Spacing) {
                        view.Appearance.MarginBottom = control.vp_Spacing;
                    }
                    return view.render();
                })
            }
        </Fragment>
    );

}

export default ZStackRenderer;