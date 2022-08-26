import { Teact } from "../../../windows/Forms/Components/Teact";
import { useEffect, useMemo } from "../../../hooks"
import {
    PresenceContext,
    PresenceContextProps,
} from "../../context/PresenceContext"
import { VariantLabels } from "../../motion/types"
import { useConstant } from "../../utils/use-constant"
import { useId } from "../../utils/use-id"

interface PresenceChildProps {
    children: any /* React.ReactElement<any> */
    isPresent: boolean
    onExitComplete?: () => void
    initial?: false | VariantLabels
    custom?: any
    presenceAffectsLayout: boolean
}

export const PresenceChild = ({
    children,
    initial,
    isPresent,
    onExitComplete,
    custom,
    presenceAffectsLayout,
}: any) => {
    const presenceChildren = useConstant(newChildrenMap)
    const id = useId()

    const context = useMemo(
        (): PresenceContextProps => ({
            id,
            initial,
            isPresent,
            custom,
            onExitComplete: (childId: number) => {
                presenceChildren.set(childId, true)

                for (const isComplete of presenceChildren.values()) {
                    if (!isComplete) return // can stop searching when any is incomplete
                }

                onExitComplete?.()
            },
            register: (childId: number) => {
                presenceChildren.set(childId, false)
                return () => presenceChildren.delete(childId)
            },
        }),
        /**
         * If the presence of a child affects the layout of the components around it,
         * we want to make a new context value to ensure they get re-rendered
         * so they can detect that layout change.
         */
        presenceAffectsLayout ? undefined : [isPresent]
    )

    useMemo(() => {
        presenceChildren.forEach((_, key) => presenceChildren.set(key, false))
    }, [isPresent])

    /**
     * If there's no `motion` components to fire exit animations, we want to remove this
     * component immediately.
     */
    useEffect(() => {
        !isPresent && !presenceChildren.size && onExitComplete?.()
    }, [isPresent])

    return (
        <PresenceContext.Provider value={context}>
            {children}
        </PresenceContext.Provider>
    )
}

function newChildrenMap(): Map<number, boolean> {
    return new Map()
}
