import { HStack } from "../HStack";
import { Alignment, UIView } from "../UIView";
import { VStack } from "../VStack";
import { cTopLeading } from '../Constants';

export interface TwoColumnWithHeaderFooterLayoutParams {
    header: UIView[];
    left: UIView[];
    right: UIView[];
    footer: UIView[];
}
export function TwoColumnWithHeaderFooterLayout(params: TwoColumnWithHeaderFooterLayoutParams): UIView {
    return VStack(
        ...params.header,
        HStack({ alignment: cTopLeading })(
            VStack(
                ...params.left
            ),
            VStack(
                ...params.right
            ).grow()
        )
            .overflowY('auto')
            .overflowX('hidden')
            .width('100%'),
        ...params.footer
    )
        .width('100%')
        .justifyContent('start')

}