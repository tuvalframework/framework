
import { useContext } from "../../../hooks"
import { createContext } from "../../../preact/compat"

import { VisualElement } from "../../render/types"

export interface MotionContextProps {
    visualElement?: VisualElement
    initial?: false | string | string[]
    animate?: string | string[]
}

export const MotionContext = createContext/* <MotionContextProps> */({})

export function useVisualElementContext() {
    return useContext(MotionContext).visualElement
}
