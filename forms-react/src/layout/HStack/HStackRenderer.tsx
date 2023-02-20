import { css } from "@emotion/css";
import { is } from "@tuval/core";
import React, { Fragment } from "react";
import { UIView } from "../../components/UIView/UIView";
import { HStackClass } from "./HStackClass";


export interface IControlProperties {
    control: HStackClass
}


function HStackRenderer({ control }: IControlProperties) {

    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
`;

    const events = {};
    events['onClick'] = is.function(control.vp_OnClick) ? (e) => control.vp_OnClick(e) : void 0;

    return (
        <div className={className} {...events}>
            {

                control.vp_Chidren.map((view: UIView) => {
                    if (view == null) {
                        return null;
                    }

                    if (control.vp_Spacing) {
                        view.Appearance.MarginRight = control.vp_Spacing;
                    }
                    return view.render();
                })
            }
        </div>

    );

}

export default HStackRenderer;