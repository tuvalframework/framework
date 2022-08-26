import { HStack } from "../HStack";
import { Alignment, UIView } from "../UIView";
import { VStack } from "../VStack";
import { cTopLeading } from '../Constants';

export interface TwoColumnWithHeaderLayoutParams {
    header: UIView[];
    left: UIView[];
    right: UIView[];
}
export function TwoColumnWithHeaderLayout(params: TwoColumnWithHeaderLayoutParams): UIView {
    return VStack(
        ...params.header,
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