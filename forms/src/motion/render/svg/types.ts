import { ResolvedValues } from "../types"

import { MakeMotion, MotionProps } from "../../motion/types"
import { SVGElements } from "./supported-elements"
import { ForwardRefComponent, HTMLRenderState } from "../html/types"

export interface SVGRenderState extends HTMLRenderState {
    /**
     * Measured dimensions of the SVG element to be used to calculate a transform-origin.
     */
    dimensions?: SVGDimensions

    /**
     * A mutable record of attributes we want to apply directly to the rendered Element
     * every frame. We use a mutable data structure to reduce GC during animations.
     */
    attrs: ResolvedValues
}

export type SVGDimensions = {
    x: number
    y: number
    width: number
    height: number
}

interface SVGAttributesWithoutMotionProps<T>
    extends Pick<any
        /* SVGAttributes<T> */,
        Exclude<keyof any/*SVGAttributes<T> */, keyof MotionProps>
    > {}

/**
 * Blanket-accept any SVG attribute as a `MotionValue`
 * @public
 */
export type SVGAttributesAsMotionValues<T> = MakeMotion<
    SVGAttributesWithoutMotionProps<T>
>

type UnwrapSVGFactoryElement<F> = F extends any/* React.SVGProps<infer P> */ ? any : never

/**
 * @public
 */
export interface SVGMotionProps<T>
    extends SVGAttributesAsMotionValues<T>,
        MotionProps {}

/**
 * Motion-optimised versions of React's SVG components.
 *
 * @public
 */
export type SVGMotionComponents = {
    [K in SVGElements]: ForwardRefComponent<
        UnwrapSVGFactoryElement<any/* JSX.IntrinsicElements[K] */>,
        SVGMotionProps<UnwrapSVGFactoryElement<any/* JSX.IntrinsicElements[K] */>>
    >
}
