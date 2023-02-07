import { int } from "@tuval/core";
import { AlignmentType } from "../../Constants";
import { UIViewClass } from "../../components/UIView/UIViewClass";
import { VStackClass } from "./VStackClass";


interface VStackParams {
    alignment?: AlignmentType;
    spacing?: int;
}

type FunctionVStack = (...views: UIViewClass[]) => VStackClass;


/* export function VStack(value: string): FunctionVStack; */
export function VStack(): VStackClass;
export function VStack(...views: (UIViewClass)[]): VStackClass;
export function VStack(value: VStackParams): FunctionVStack;
export function VStack(...args: any[]): FunctionVStack | VStackClass {
    if (args.length === 0) {
        return new VStackClass();
    } else if (args.length === 1 && typeof args[0] === 'object' && args[0].constructor === Object && !(args[0] instanceof UIViewClass)) {
        const params: VStackParams = args[0];
        /*  let alignment: Alignment = null;
         switch (params.alignment) {
             case cTopLeading:
                 alignment = Alignment.topLeading;
                 break;
             case cTop:
                 alignment = Alignment.top;
                 break;
             case cTopTrailing:
                 alignment = Alignment.topTrailing;
                 break;
             case cLeading:
                 alignment = Alignment.leading;
                 break;
             case cCenter:
                 alignment = Alignment.center;
                 break;
             case cTrailing:
                 alignment = Alignment.trailing;
                 break;
             case cBottomTrailing:
                 alignment = Alignment.bottomTrailing;
                 break;
             case cBottom:
                 alignment = Alignment.bottom;
                 break;
             case cBottomLeading:
                 alignment = Alignment.bottomLeading;
                 break;
         } */

        return (...views: UIViewClass[]) => {
                return new VStackClass().children(...views).alignment(params.alignment).spacing(params.spacing)
        }
    } else {

            return new VStackClass().children(...args);

    }
}