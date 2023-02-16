import React from "react";
import { Route } from "react-router-dom";
import { UIView } from "../../UIView/UIView";
import UIViewRenderer from "../../UIView/UIViewRenderer";
import { ViewProperty } from "../../UIView/ViewProperty";
import { ControllerConstructor } from "./UIRoute";
import UIRouteRenderer from "./UIRouteRenderer";

export class UIRouteClass extends UIView {

    /** @internal */
    @ViewProperty() vp_RoutePath: string;

    public routePath(value: string) {
        this.vp_RoutePath = value;
        return this;
    }


    /** @internal */
    @ViewProperty() vp_IsIndex: boolean;

    public isIndex(value: boolean) {
        this.vp_IsIndex = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_RouteController: ControllerConstructor;

    public routeController(value: ControllerConstructor) {
        this.vp_RouteController = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Chidren: UIView[];

    public children(...value: UIView[]) {
        this.vp_Chidren = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_RedirectTo: string;

    public redirectTo(value: string) {
        this.vp_RedirectTo = value;
        return this;
    }

    public render() {
        return (
            <Route path={this.vp_RoutePath} element={React.createElement(this.vp_RouteController, {}, [])}>
                {
                    this.vp_Chidren?.map((view: UIView) => view.render())
                }
            </Route>
        )
    }
}
