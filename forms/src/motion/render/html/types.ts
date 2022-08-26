import { ResolvedValues } from "../types"

import { MotionProps } from "../../motion/types"
import { HTMLElements } from "./supported-elements"

export interface TransformOrigin {
    originX?: number | string
    originY?: number | string
    originZ?: number | string
}

export interface HTMLRenderState {
    /**
     * A mutable record of transforms we want to apply directly to the rendered Element
     * every frame. We use a mutable data structure to reduce GC during animations.
     */
    transform: ResolvedValues

    /**
     * A mutable record of transform keys we want to apply to the rendered Element. We order
     * this to order transforms in the desired order. We use a mutable data structure to reduce GC during animations.
     */
    transformKeys: string[]

    /**
     * A mutable record of transform origins we want to apply directly to the rendered Element
     * every frame. We use a mutable data structure to reduce GC during animations.
     */
    transformOrigin: TransformOrigin

    /**
     * A mutable record of styles we want to apply directly to the rendered Element
     * every frame. We use a mutable data structure to reduce GC during animations.
     */
    style: ResolvedValues

    /**
     * A mutable record of CSS variables we want to apply directly to the rendered Element
     * every frame. We use a mutable data structure to reduce GC during animations.
     */
    vars: ResolvedValues
}

/**
 * @public
 */
export type ForwardRefComponent<T, P> = any/* ForwardRefExoticComponent<
    PropsWithoutRef<P> & RefAttributes<T>
> */

/**
 * Support for React component props
 */
type UnwrapFactoryAttributes<F> = F extends any/* DetailedHTMLFactory<infer P, any> */
    ? any
    : never
type UnwrapFactoryElement<F> = F extends any/* DetailedHTMLFactory<any, infer P> */
    ? any
    : never

type HTMLAttributesWithoutMotionProps<
    Attributes extends any/* HTMLAttributes<Element> */,
    Element extends HTMLElement
> = { [K in Exclude<keyof Attributes, keyof MotionProps>]?: Attributes[K] }

/**
 * @public
 */
export type HTMLMotionProps<
    TagName extends keyof any/* ReactHTML */
> = HTMLAttributesWithoutMotionProps<
    UnwrapFactoryAttributes<any/* ReactHTML[TagName] */>,
    UnwrapFactoryElement<any/* ReactHTML[TagName] */>
> &
    MotionProps

/**
 * Motion-optimised versions of React's HTML components.
 *
 * @public
 */
export type HTMLMotionComponents = {
    [K in HTMLElements]: ForwardRefComponent<
        UnwrapFactoryElement<any/* ReactHTML[K] */>,
        HTMLMotionProps<K>
    >
}
