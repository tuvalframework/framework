import { UIViewClass } from "../../UIView/UIViewClass";
import { UIRouteFunction } from "../UIRoute/UIRoute";
import { UIRouteClass } from "../UIRoute/UIRouteClass";
import { UIRouteLinkClass } from "../UIRouteLink/UIRouteLinkClass";
import { UIRoutesClass } from "./UIRoutesClass";


export function UIRoutes(...routes: UIRouteClass[] ): UIRoutesClass {
        return new UIRoutesClass().children(...routes);
}