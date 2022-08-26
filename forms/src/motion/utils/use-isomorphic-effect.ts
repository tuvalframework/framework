import { useEffect, useLayoutEffect } from "../../hooks"
import { isBrowser } from "./is-browser"

export const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect
