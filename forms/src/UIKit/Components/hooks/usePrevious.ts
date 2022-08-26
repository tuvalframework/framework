import React, { createElement, Fragment } from "../../../preact/compat";

export const usePrevious = (newValue) => {
    const ref = React.useRef(undefined);

    React.useEffect(() => {
        ref.current = newValue;
    });

    return ref.current;
}