import { css } from "@emotion/css";
import React, { Fragment } from "react";
import { ReactViewClass } from "./ReactViewClass";


export interface IControlProperties {
    control: ReactViewClass
}


function ReactViewRenderer({ control }: IControlProperties) {

    if (control.vp_Frame) {
        const className = css`
        ${control.Appearance.ToString()}
        ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
        ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
        ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

        return (
            <div className={className}>
                {control.vp_ReactNode}
            </div>
        );
    } else {
        return (
            <Fragment>
                {control.vp_ReactNode}
            </Fragment>
        );
    }


}

export default ReactViewRenderer;