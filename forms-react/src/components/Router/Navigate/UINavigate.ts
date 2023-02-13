import { UIController } from "../../../UIController";
import { UIViewClass } from "../../UIView/UIViewClass";
import { UIRouteLinkClass } from "../UIRouteLink/UIRouteLinkClass";
import { UIRouteClass } from "./UINavigateClass";


export function UINavigate(path: string): UIRouteClass {
        return new UIRouteClass().to(path);
}


