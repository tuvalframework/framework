import React, { Fragment, useMemo, useState } from "react";
import { UIViewClass } from "../../components/UIView/UIViewClass";
import { HStackClass } from "./HStackClass";


export interface IControlProperties {
    control: HStackClass
}


function HStackRenderer({ control }: IControlProperties) {

    return (
        <Fragment>
            {
                control.vp_Chidren.map((view: UIViewClass) => view.render())
            }
        </Fragment>

    );

}

export default HStackRenderer;