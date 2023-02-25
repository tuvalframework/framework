import { is } from "@tuval/core";
import React from "react";
import { Link } from "react-router-dom";
import { UIView } from "../../UIView/UIView";
import { UIRouteLinkClass } from "./UIRouteLinkClass";

export interface IControlProperties {
    control: UIRouteLinkClass
}


function UIRouteLinkRenderer({ control }: IControlProperties) {

    if (is.array(control.vp_Chidren) && control.vp_Chidren.length > 0) {
        return (
            <Link to={control.vp_Link} state={control.vp_State}>
                {
                    control.vp_Chidren.map((view: UIView) => view.render())
                }
            </Link>
        );
    } else {
        return (
            <Link to={control.vp_Link}></Link>
        )
    }
   

}

export default UIRouteLinkRenderer;