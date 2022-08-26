import { Teact } from "../../windows/Forms/Components/Teact";
import { warning } from "../../hey-listen"
import { useEffect } from "../../hooks"

import { useConstant } from "../utils/use-constant"
import { LayoutGroup } from "./LayoutGroup"

let id = 0
export const AnimateSharedLayout: any/* React.FunctionComponent */ = ({
    children,
}: any/* React.PropsWithChildren<{}> */) => {
    useEffect(() => {
        warning(
            false,
            "AnimateSharedLayout is deprecated: https://www.framer.com/docs/guide-upgrade/##shared-layout-animations"
        )
    }, [])

    return (
        <LayoutGroup id={useConstant(() => `asl-${id++}`)}>
            {children}
        </LayoutGroup>
    )
}
