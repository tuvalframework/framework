import { int } from "@tuval/core";
import { AlignmentType } from "../../Constants";
import { UIView } from "../../components/UIView/UIView";
import {  ZStackClass } from "./ZStackClass";


interface ZStackParams {
    alignment?: AlignmentType;
    spacing?: int;
}

type FunctionVStack = (...views: UIView[]) => ZStackClass;


/* export function VStack(value: string): FunctionVStack; */
export function ZStack(): ZStackClass;
export function ZStack(...views: (UIView)[]): ZStackClass;
export function ZStack(value: ZStackParams): FunctionVStack;
export function ZStack(...args: any[]): FunctionVStack | ZStackClass {
    if (args.length === 0) {
        return new ZStackClass();
    } else if (args.length === 1 && typeof args[0] === 'object' && args[0].constructor === Object && !(args[0] instanceof UIView)) {
        const params: ZStackParams = args[0];

        return (...views: UIView[]) => {
                return new ZStackClass().children(...views).alignment(params.alignment).spacing(params.spacing)
        }
    } else {

            return new ZStackClass().children(...args);

    }
}