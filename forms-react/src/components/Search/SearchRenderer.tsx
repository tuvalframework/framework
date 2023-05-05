import { css } from "@emotion/css";
import { is } from "@tuval/core";
import { InputText, InputTextarea, InputNumber } from 'primereact';
import { useRecordContext } from "ra-core";
import React, { Fragment } from "react";
import { UIFormController, useFormController } from "../../UIFormController";
import { UIView } from "../UIView/UIView";
import { SearchClass } from "./SearchClass";
import { Search } from "monday-ui-react-core";

export interface IControlProperties {
    control: SearchClass
}




function SearchRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;


    return (
        <h1>serach</h1>
       /*  <Search
            wrapperClassName={className}
            tabIndex={control.vp_TabIndex}
            value={control.vp_Value}
            placeholder={control.vp_Placeholder}
            size={"medium"}
            //@ts-ignore
            onChange={(e: string) => is.function(control.vp_OnChange) ? control.vp_OnChange(e) : void 0}>
        </Search> */
    );

}

export default SearchRenderer;