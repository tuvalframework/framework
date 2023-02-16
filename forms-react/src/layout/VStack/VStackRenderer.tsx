import React, { Fragment, useState } from "react";
import { UIView } from "../../components/UIView/UIView";
import { VStackClass } from "./VStackClass";


export interface IControlProperties {
    control: VStackClass
}


function VStackRenderer({ control }: IControlProperties) {

    return (
        <Fragment>
            {
                control.vp_Chidren.map((view: UIView) => {
                    if (control.vp_Spacing) {
                        view.Appearance.MarginBottom = control.vp_Spacing;
                    }
                    return view.render();
                })
            }
        </Fragment>
    );

}

export default VStackRenderer;