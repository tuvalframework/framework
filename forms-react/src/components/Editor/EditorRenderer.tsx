import { css } from "@emotion/css";
import {Editor} from "primereact";

import React, { Fragment } from "react";
import { EditorClass } from "./EditorClass";
import { is } from '@tuval/core';


export interface IControlProperties {
    control: EditorClass;
}

function EditorRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (
        <Editor value={control.vp_Value} onTextChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e.htmlValue) : void 0 } />
    );

}

export default EditorRenderer;