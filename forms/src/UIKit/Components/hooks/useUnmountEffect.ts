/* eslint-disable */
import React, { createElement, Fragment } from "../../../preact/compat";

export const useUnmountEffect = (fn) => React.useEffect(() => fn, []);
/* eslint-enable */