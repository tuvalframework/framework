import React, { Fragment, useState } from "react";
import { UIViewClass } from "../../components/UIView/UIViewClass";
import { VStackClass } from "./VStackClass";


export interface IControlProperties {
    control: VStackClass
}


function VStackRenderer({ control }: IControlProperties) {

    return (
        <Fragment>
            {
                control.vp_Chidren.map((view: UIViewClass) => {
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