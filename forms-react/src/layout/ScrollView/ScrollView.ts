import { UIView } from "../../components/UIView/UIView";
import { AlignmentType, cHorizontal, cTopLeading, cVertical } from "../../Constants";
import { VStack } from "../VStack/VStack";
import { VStackClass } from "../VStack/VStackClass";



interface ScrollViewParams {
    axes?: 'cHorizontal' | 'cVertical';
    alignment?:AlignmentType;
    showsIndicators?: boolean;
    content?: any;
}

type FunctionScrollView = (...views: UIView[]) => VStackClass;

export function ScrollView(value: string): FunctionScrollView;
export function ScrollView(...views: UIView[]): VStackClass;
export function ScrollView(value: ScrollViewParams): FunctionScrollView;
export function ScrollView(...args: any[]): FunctionScrollView | VStackClass {
    if (args.length === 1 && typeof args[0] === 'string') {
        const value: string = args[0];
        return (...views: UIView[]) => {
            return (
                VStack({ alignment: cTopLeading })(
                    VStack({ alignment: cTopLeading })(
                        ...views
                    ).position('absolute')
                )
                    .width('100%')
                    .overflowX(value === cHorizontal ? 'auto' : 'hidden')
                    .overflowY(value === cVertical ? 'auto' : 'hidden')
            )
        }
    } else if (args.length === 1 && typeof args[0] === 'object' && args[0].constructor === Object && !(args[0] instanceof UIView)) {
        const { axes, showsIndicators, content, alignment = cTopLeading }: ScrollViewParams = args[0];

        return (...views: UIView[]) => {
            return (
                VStack({ alignment: alignment })(
                    VStack({ alignment: alignment })(
                        ...views
                    ).position('absolute')
                )
                    .width('100%')
                    .overflowX((axes === cHorizontal || axes == null) ? 'auto' : 'hidden')
                    .overflowY((axes === cVertical || axes == null) ? 'auto' : 'hidden')
            )
        }
    } else {
        return (
            VStack({ alignment: cTopLeading })(
                VStack({ alignment: cTopLeading })(
                    ...args
                ).position('absolute')
            ).overflowX('auto').overflowY('auto').width('100%')
        )
    }

    throw 'Error with parameter.'

}