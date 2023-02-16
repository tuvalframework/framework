import React from "react";
import { Link, Outlet, Route, Routes } from "react-router-dom";
import { UIView } from "../../UIView/UIView";
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