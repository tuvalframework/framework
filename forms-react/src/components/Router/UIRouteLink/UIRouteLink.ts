import { UIView } from "../../UIView/UIView";
import { UIRouteLinkClass } from "./UIRouteLinkClass";


type FunctionUIRouteLink = (...views: UIView[]) => UIRouteLinkClass;

export function UIRouteLink(): UIRouteLinkClass ;
export function UIRouteLink(path: string, state?: any): FunctionUIRouteLink;
export function UIRouteLink(...args: any[]): UIRouteLinkClass | FunctionUIRouteLink {
    if (args.length === 0) {
        return new UIRouteLinkClass();
    } else {
        const path = args[0];
        const state = args[1];
        
        return (...views: UIView[]) => {
            const a: any = new UIRouteLinkClass().children(...views).link(path).state(state);
            return a;
        };
    }
   
}
