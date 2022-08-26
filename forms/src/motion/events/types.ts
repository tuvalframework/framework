
import { Point } from "../projection/geometry/types"

/** @public */
export interface EventInfo {
    point: Point
}

export type EventHandler = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: EventInfo
) => void

export type ListenerControls = [() => void, () => void]

export type TargetOrRef = any/* EventTarget | RefObject<EventTarget> */

export type TargetBasedReturnType<Target> = Target extends EventTarget
    ? ListenerControls
    : undefined
