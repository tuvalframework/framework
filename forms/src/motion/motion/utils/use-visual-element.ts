
import { PresenceContext } from "../../context/PresenceContext"
import { MotionProps } from "../../motion/types"
import { useVisualElementContext } from "../../context/MotionContext"
import { CreateVisualElement, VisualElement } from "../../render/types"
import { useIsomorphicLayoutEffect } from "../../utils/use-isomorphic-effect"
import { VisualState } from "./use-visual-state"
import { LazyContext } from "../../context/LazyContext"
import { MotionConfigProps } from "../../components/MotionConfig"
import { useReducedMotionConfig } from "../../utils/use-reduced-motion"
import { useContext, useEffect, useRef } from "../../../hooks"

export function useVisualElement<Instance, RenderState>(
    Component: string | any/* | React.ComponentType */,
    visualState: VisualState<Instance, RenderState>,
    props: MotionProps & MotionConfigProps,
    createVisualElement?: CreateVisualElement<Instance>
): VisualElement<Instance> | undefined {
    const lazyContext = useContext(LazyContext)
    const parent = useVisualElementContext()
    const presenceContext = useContext(PresenceContext)
    const shouldReduceMotion = useReducedMotionConfig()

    const visualElementRef: any /* MutableRefObject<VisualElement | undefined> */ =
        useRef(undefined)

    /**
     * If we haven't preloaded a renderer, check to see if we have one lazy-loaded
     */
    if (!createVisualElement) createVisualElement = lazyContext.renderer

    if (!visualElementRef.current && createVisualElement) {
        visualElementRef.current = createVisualElement(Component, {
            visualState,
            parent,
            props,
            presenceId: presenceContext?.id,
            blockInitialAnimation: presenceContext?.initial === false,
            shouldReduceMotion,
        })
    }

    const visualElement = visualElementRef.current
    useIsomorphicLayoutEffect(() => {
        visualElement?.syncRender()
    })

    useEffect(() => {
        visualElement?.animationState?.animateChanges()
    })

    useIsomorphicLayoutEffect(() => () => visualElement?.notifyUnmount(), [])

    return visualElement
}
