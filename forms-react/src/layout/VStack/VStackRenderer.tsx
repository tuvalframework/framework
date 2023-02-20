import { css } from "@emotion/css";
import React, { Fragment } from "react";
import { UIView } from "../../components/UIView/UIView";
import { VStackClass } from "./VStackClass";


export interface IControlProperties {
    control: VStackClass
}


function VStackRenderer({ control }: IControlProperties) {

    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
`;

    return (
        <div className={className} {...control.GetEventsObject()}>
            {
                control.vp_Chidren.map((view: UIView) => {
                    if (view == null) {
                        return null;
                    }

                    if (control.vp_Spacing) {
                        view.Appearance.MarginBottom = control.vp_Spacing;
                    }
                    return view.render();
                })
            }
        </div>
    );

}

export default VStackRenderer;