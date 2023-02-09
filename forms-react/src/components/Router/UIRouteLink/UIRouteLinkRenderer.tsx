import React from "react";
import { Link } from "react-router-dom";
import { UIViewClass } from "../../UIView/UIViewClass";
import { UIRouteLinkClass } from "./UIRouteLinkClass";

export interface IControlProperties {
    control: UIRouteLinkClass
}


function UIRouteLinkRenderer({ control }: IControlProperties) {

    return (
        <Link to={control.vp_Link} state={control.vp_State}>
            {
                control.vp_Chidren.map((view: UIViewClass) => view.render())
            }
        </Link>
    );

}

export default UIRouteLinkRenderer;