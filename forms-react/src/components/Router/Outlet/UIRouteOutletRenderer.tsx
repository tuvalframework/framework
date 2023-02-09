import React from "react";
import { Link, Outlet, Route, Routes } from "react-router-dom";
import { UIViewClass } from "../../UIView/UIViewClass";
import { UIRouteOutletClass } from "./UIRouteOutletClass";

export interface IControlProperties {
    control: UIRouteOutletClass
}


function UIRouteOutletRenderer({ control }: IControlProperties) {
    return (
        <Outlet />
    );
}

export default UIRouteOutletRenderer;