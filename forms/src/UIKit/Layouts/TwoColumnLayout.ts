import { HStack } from "../HStack";
import { Alignment, UIView } from "../UIView";
import { VStack } from "../VStack";
import { cTopLeading } from '../Constants';

export interface TwoColumnLayoutParams {
    left: UIView[];
    right: UIView[];
}
export function TwoColumnLayout(params: TwoColumnLayoutParams): UIView {
    return VStack(
        HStack({ alignment: cTopLeading })(
            VStack(
                ...params.left
            ).width('auto'),
            VStack(
                ...params.right
            ).grow()
        )
            .overflowY('auto')
            .overflowX('hidden')
            .width('100%'),
    )
        .width('100%')
        .justifyContent('start')
}

export function TwoColumnLayout2(params: TwoColumnLayoutParams): UIView {
    return VStack(
        HStack({ alignment: cTopLeading })(
            VStack(
                ...params.left
            ).grow(),
            VStack(
                ...params.right
            ).width('auto')
        )
            .overflowY('auto')
            .overflowX('hidden')
            .width('100%'),
    )
        .width('100%')
        .justifyContent('start')
}