import { css } from "@emotion/css";
import { SelectButton, SelectItemOptionsType } from "primereact";



import React from "react";
import { SelectButtonClass } from "./SelectButtonClass";
import { is } from "@tuval/core";


export interface IControlProperties {
    control: SelectButtonClass
}

function SelectButtonRenderer({ control }: IControlProperties) {
    /*  const className = css`
     ${control.Appearance.ToString()}
     ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
     ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
     ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
     `; */

    return (
        <SelectButton
            options={control.vp_Options}
            value={control.vp_Value}
            onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e) : void 0}
        ></SelectButton>
    );

}

export default SelectButtonRenderer;