
import { css } from "@emotion/css";
import { Editor } from "primereact";

import React, { Fragment } from "react";
import { is } from '@tuval/core';
import { DateFieldClass } from "./DateFieldClass";
import { TextField } from "monday-ui-react-core";
import  "monday-ui-react-core/dist/TextField.css";
import { Icons } from "../Icon/Icons";

export enum TextFieldTextType {
    TEXT = "text",
    PASSWORD = "password",
    SEARCH = "search",
    DATE = "date",
    DATE_TIME = "datetime-local",
    NUMBER = "number"
}


export interface IControlProperties {
    control: DateFieldClass;
}

function DateFieldRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `

    return (
        <div>
            <span>{control.vp_Value?.toJSON()}</span>
        <TextField size={TextField.sizes.MEDIUM} type={TextFieldTextType.DATE_TIME} iconName={Icons.API} value={'2005-06-07'} wrapperClassName={className} onChange={(e) => control.vp_OnChange?.(new Date(e))} />
        </div>
    );

}

export default DateFieldRenderer;