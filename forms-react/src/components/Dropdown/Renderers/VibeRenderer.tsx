import { css } from "@emotion/css";

import Dropdown from "monday-ui-react-core/dist/Dropdown";

import React from "react";
import { DropdownClass } from "../DropdownClass";

export interface IControlProperties {
    control: DropdownClass
}


function VibeRenderer({ control }: IControlProperties) {
    control.Appearance.FontFamily = ' "Figtree", sans-serif';
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (
        <Dropdown
            className={className}
            onBlur={function noRefCheck() { }}
            onChange={(e) => console.log(e)}
            onClear={function noRefCheck() { }}
            onFocus={function noRefCheck() { }}
            onInputChange={function noRefCheck() { }}
            onMenuClose={function noRefCheck() { }}
            onMenuOpen={function noRefCheck() { }}
            onOptionRemove={function noRefCheck() { }}
            onOptionSelect={function noRefCheck() { }}
            openMenuOnFocus={function noRefCheck() { }}
            options={control.vp_Model.map(item => {
                return {
                    label: item[control.vp_fields.text],
                    value: item[control.vp_fields.value]
                }
            })
            }
            placeholder="Placeholder text here"
        />
    );

}

export default VibeRenderer;