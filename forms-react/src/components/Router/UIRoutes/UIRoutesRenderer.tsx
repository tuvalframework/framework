import React from "react";
import { Link, Routes } from "react-router-dom";
import { UIViewClass } from "../../UIView/UIViewClass";
import { UIRoutesClass } from "./UIRoutesClass";

export interface IControlProperties {
    control: UIRoutesClass
}


function UIRoutesRenderer({ control }: IControlProperties) {

    return (
        <Routes>
            {
                control.vp_Chidren.map((view: UIViewClass) => view.render())
            }
        </Routes>
    );

}

export default UIRoutesRenderer;