/* eslint-disable */
import React, { createElement, Fragment } from "../../../preact/compat";

export const useUpdateEffect = (fn, deps?) => {
    const mounted = React.useRef(false);
    return React.useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            return;
        }

        return fn && fn();
    }, deps);
}
/* eslint-enable */