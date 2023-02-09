import { UIViewClass } from "../../UIView/UIViewClass";
import { UIRouteLinkClass } from "./UIRouteLinkClass";


type FunctionUIRouteLink = (...views: UIViewClass[]) => UIRouteLinkClass;

export function UIRouteLink(path: string, state?: any): FunctionUIRouteLink {
    return (...views: UIViewClass[]) => {
        const a: any = new UIRouteLinkClass().children(...views).link(path).state(state);
        return a;
    };
}
