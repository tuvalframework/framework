import React, { Fragment, useMemo, useState } from "react";
import { UIView } from "../../components/UIView/UIView";
import { HStackClass } from "./HStackClass";


export interface IControlProperties {
    control: HStackClass
}


function HStackRenderer({ control }: IControlProperties) {

    return (
        <Fragment>
            {
                control.vp_Chidren.map((view: UIView) => view.render())
            }
        </Fragment>

    );

}

export default HStackRenderer;