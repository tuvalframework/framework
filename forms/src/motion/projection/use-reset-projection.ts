
import { useCallback } from "../../hooks"
import { rootProjectionNode } from "./node/HTMLProjectionNode"

export function useResetProjection() {
    const reset = useCallback(() => {
        const root = rootProjectionNode.current
        if (!root) return
        root.resetTree()
    }, [])

    return reset
}
