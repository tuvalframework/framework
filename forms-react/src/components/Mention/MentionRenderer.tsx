import { css } from "@emotion/css";
import { is } from "@tuval/core";
import { Mention } from 'primereact';
import React from "react";
import { MentionClass } from "./MentionClass";

export interface IControlProperties {
    control: MentionClass
}


function MentionRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (
        <Mention
            value={control.vp_Value}
            onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e.target.value) : void 0}
            suggestions={control.vp_Suggestions}
            onSearch={control.vp_OnSearch}
            field={control.vp_Field}
            placeholder={control.vp_Placeholder}
            rows={5}
            cols={40}
       /*  itemTemplate={itemTemplate} */ />
    );

}

export default MentionRenderer;