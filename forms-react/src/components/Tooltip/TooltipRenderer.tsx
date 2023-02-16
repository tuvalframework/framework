import { Tooltip } from "monday-ui-react-core";
import React, { Fragment, useState } from "react";
import { UIView } from "../UIView/UIView";
import { TooltipClass } from "./TooltipClass";


export interface IControlProperties {
    control: TooltipClass
}


function TooltipRenderer({ control }: IControlProperties) {

    return (
        <Fragment>
            <Tooltip content="Item name: Bottom sheets" position={Tooltip.positions.RIGHT} >
                <div className="monday-storybook-tooltip_icon-wrapper">
                    {
                        control.vp_Chidren.map((view: UIView) => view.render())
                    }
                </div>
            </Tooltip>

        </Fragment>
    );

}

export default TooltipRenderer;