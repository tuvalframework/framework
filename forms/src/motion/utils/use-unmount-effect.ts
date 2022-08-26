import { useEffect } from "../../hooks";

export function useUnmountEffect(callback: () => void) {
    return useEffect(() => () => callback(), [])
}
