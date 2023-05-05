import { css } from "@emotion/css";
import { is } from "@tuval/core";
import { Heading, Icon, Menu, MenuButton, MenuItem, MenuTitle } from "monday-ui-react-core";
import EditableHeading from "monday-ui-react-core/dist/EditableHeading";

import Bolt from "monday-ui-react-core/dist/icons/Bolt";


import React, { Fragment } from "react";
import { EditableHeaderClass } from "./EditableHeaderClass";


export interface IControlProperties {
    control: EditableHeaderClass
}

function EditableHeaderRenderer({ control }: IControlProperties) {



    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    & .element-type-h5 {
        color:  ${control.Appearance['Color']}
    }
    `;

    return (
        <Fragment>
            <EditableHeading
                className={className}
                type={control.vp_Type}
                size={control.vp_Size as any}
                placeholder={control.vp_Placeholder}
                //@ts-ignore
                value={control.vp_Value}
                onFinishEditing={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e) : void 0} />
        </Fragment>
    );

}

export default EditableHeaderRenderer;