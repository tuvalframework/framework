import { UIView } from "../../UIView/UIView";
import { UIRouteLinkClass } from "./UIRouteLinkClass";


type FunctionUIRouteLink = (...views: UIView[]) => UIRouteLinkClass;

export function UIRouteLink(path: string, state?: any): FunctionUIRouteLink {
    return (...views: UIView[]) => {
        const a: any = new UIRouteLinkClass().children(...views).link(path).state(state);
        return a;
    };
}
