import { VStack, VStackClass } from './VStack';
import { UIView } from "./UIView";
import { IControl } from '../windows/Forms/Components/AAA/IControl';
import { UIController } from './UIController';
import { Text } from './Text/Text';
import { Control } from '../windows/Forms/Components/AAA/Control';
import { cHorizontal, cTopLeading, cVertical } from './Constants';



interface ScrollViewParams {
    axes?: 'cHorizontal' | 'cVertical';
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
                    .overflowX(value === cHorizontal ? 'auto' : 'hidden')
                    .overflowY(value === cVertical ? 'auto' : 'hidden')
            )
        }
    } else if (args.length === 1 && typeof args[0] === 'object' && args[0].constructor === Object && !(args[0] instanceof UIView || args[0] instanceof UIController || args[0] instanceof Control)) {
        const { axes, showsIndicators, content }: ScrollViewParams = args[0];
        return (...views: UIView[]) => {
            return (
                VStack({ alignment: cTopLeading })(
                    VStack({ alignment: cTopLeading })(
                        ...views
                    ).position('absolute')
                )
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
            ).overflowX('auto').overflowY('auto')
        )
    }

    throw 'Error with parameter.'

}

/*
type FunctionScrollView = (...views: UIView[]) => VStackClass;

export function ScrollView(...views: (UIView | IControl | UIController)[]): VStackClass;
export function ScrollView(value: ScrollViewParams): FunctionScrollView;
export function ScrollView(...args: any[]): FunctionScrollView | VStackClass {
    if (args.length === 0) {
        return new VStackClass();
    } else if (args.length === 1 && typeof args[0] === 'object' && args[0].constructor === Object && !(args[0] instanceof UIView || args[0] instanceof UIController || args[0] instanceof Control)) {
        const params: ScrollViewParams = args[0];
        return (...views: UIView[]) => {
            return (
                VStack(
                    VStack(
                        ...views
                    )
                        .position('absolute')
                )
                    .overflowX(params.axes === cHorizontal ? 'auto' : 'hidden')
                    .overflowY(params.axes === cVertical ? 'auto' : 'hidden')
            )
        }
    } else {
        return (
            VStack(
                VStack(
                    ...args
                ).position('absolute')
            ).overflowX('hidden').overflowY('auto')
        )
    }
} */