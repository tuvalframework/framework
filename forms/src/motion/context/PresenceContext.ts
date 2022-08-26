
import { createContext } from "../../preact/create-context"
import { VariantLabels } from "../motion/types"

/**
 * @public
 */
export interface PresenceContextProps {
    id: number
    isPresent: boolean
    register: (id: number) => () => void
    onExitComplete?: (id: number) => void
    initial?: false | VariantLabels
    custom?: any
}

/**
 * @public
 */
export const PresenceContext = createContext(null)
