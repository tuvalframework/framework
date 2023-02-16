import { UIController } from "../../../UIController";
import { UIView } from "../../UIView/UIView";
import { UIRouteLinkClass } from "../UIRouteLink/UIRouteLinkClass";
import { UIRouteClass } from "./UINavigateClass";


export function UINavigate(path: string): UIRouteClass {
        return new UIRouteClass().to(path);
}


