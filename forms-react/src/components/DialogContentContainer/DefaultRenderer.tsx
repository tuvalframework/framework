

import { css } from "@emotion/css";
import { DialogContentContainer, Heading } from "monday-ui-react-core";
import "monday-ui-react-core/dist/Heading.css";



import React from "react";
import { DialogContentContainerClass } from "./DialogContentContainerClass";



export interface IControlProperties {
    control: DialogContentContainerClass
}

export function DefaultRenderer({ control }: IControlProperties) {

    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (

        <DialogContentContainer type={DialogContentContainer.types.MODAL} className={className}>
            {
                control.vp_DialogContent?.().render()
            }
        </DialogContentContainer>

    );

}