import React, { useState } from "react";
import { UIViewClass } from "../UIView/UIViewClass";
import { TextClass } from "./TextClass";

export interface IControlProperties {
    control: TextClass
}


function TextRenderer({ control }: IControlProperties) {

    return (<span onClick={control.vp_OnClick?.bind(control)}>{control.sv_Text}</span>);

}

export default TextRenderer;