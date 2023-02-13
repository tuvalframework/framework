import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import { UIViewClass } from "../../UIView/UIViewClass";
import { UIRouteClass } from "./UIRouteClass";

export interface IControlProperties {
    control: UIRouteClass
}


function UIRouteRenderer({ control }: IControlProperties) {
    if (control.vp_IsIndex) {
        return (
            <Route index element={React.createElement(control.vp_RouteController, {}, [])}></Route>
        )
    } else {
        return (
            <Route path={control.vp_RoutePath} element={React.createElement(control.vp_RouteController, {}, [])}>
                {
                    control.vp_Chidren.map((view: UIViewClass) => view.render())
                }
            </Route>
        )
    }
}

export default UIRouteRenderer;