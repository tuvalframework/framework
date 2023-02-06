import React, { Fragment, useState } from "react";
import { UIViewClass } from "../UIView/UIViewClass";
import { VStackClass } from "./VStackClass";


export interface IControlProperties {
    control: VStackClass
}


function VStackRenderer({ control }: IControlProperties) {

    return (
        <Fragment>
            {
                control.vp_Chidren.map((view: UIViewClass) => view.render() )
            }
        </Fragment>
    );

}

export default VStackRenderer;