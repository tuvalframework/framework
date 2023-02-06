import { int } from "@tuval/core";
import { AlignmentType } from "../Constants";
import { UIViewClass } from "../UIView/UIViewClass";
import { HStackClass } from "./HStackClass";


interface HStackParams {
    alignment?: AlignmentType;
    spacing?: int;
}

type FunctionHStack = (...views: UIViewClass[]) => HStackClass;


/* export function VStack(value: string): FunctionVStack; */
export function HStack(): HStackClass;
export function HStack(...views: (UIViewClass)[]): HStackClass;
export function HStack(value: HStackParams): FunctionHStack;
export function HStack(...args: any[]): FunctionHStack | HStackClass {
    if (args.length === 0) {
        return new HStackClass();
    } else if (args.length === 1 && typeof args[0] === 'object' && args[0].constructor === Object && !(args[0] instanceof UIViewClass)) {
        const params: HStackParams = args[0];


        return (...views: UIViewClass[]) => {

                return new HStackClass().children(...views).alignment(params.alignment).spacing(params.spacing)

        }
    } else {

            return new HStackClass().children(...args);

    }
}