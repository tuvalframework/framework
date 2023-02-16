import { UIView } from "../../UIView/UIView";
import { BodyClass, BodyParams } from "./BodyClass";


export type FunctionBody = (...views: UIView[]) => BodyClass;

export function TBody(): BodyClass;
export function TBody(...views: (UIView)[]): BodyClass;
export function TBody(value: BodyParams): FunctionBody;
export function TBody(...args: any[]): FunctionBody | BodyClass {
    if (args.length === 0) {
        return new BodyClass();
    } else if (args.length === 1 && typeof args[0] === 'object' && args[0].constructor === Object && !(args[0] instanceof UIView)) {
        const params: BodyParams = args[0];
        return (...views: UIView[]) => {
            return new BodyClass().children(...views);
        }
    } else {
        return new BodyClass().children(...args);

    }
}