import React from "react";
import { Link } from "react-router-dom";
import { UIView } from "../../UIView/UIView";
import { UIRouteLinkClass } from "./UIRouteLinkClass";

export interface IControlProperties {
    control: UIRouteLinkClass
}


function UIRouteLinkRenderer({ control }: IControlProperties) {

    return (
        <Link to={control.vp_Link} state={control.vp_State}>
            {
                control.vp_Chidren.map((view: UIView) => view.render())
            }
        </Link>
    );

}

export default UIRouteLinkRenderer;