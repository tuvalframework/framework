import { DatePicker, Tab, TabList } from "monday-ui-react-core";
import { Tag } from "primereact";
import React from "react";
import { TagClass } from "./TagClass";
import { moment } from "@tuval/core";
import { css } from "@emotion/css";

export interface IControlProperties {
    control: TagClass
}


function TagRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;
    return (
        <Tag className={className} severity={control.vp_Severity} value={control.vp_Value} rounded={control.vp_Rounded}></Tag>
    );

}

export default TagRenderer;