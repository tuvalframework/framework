import React, { useState } from "react";
import { UIViewClass } from "./UIView/UIViewClass";
import { LabelClass } from "./LabelClass";

export interface IControlProperties {
    control: LabelClass
}


function LabelRenderer({ control }: IControlProperties) {

    return (<div onClick={control.vp_OnClick.bind(control)}>{control.sv_Text}</div>);

}

export default LabelRenderer;