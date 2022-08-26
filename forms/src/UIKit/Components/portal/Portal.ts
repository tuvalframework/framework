import React, { createElement, Fragment, createPortal } from "../../../preact/compat";
import { Teact } from "../../../windows/Forms/Components/Teact";
import PrimeReact from '../api/Api';
import { useMountEffect, useUnmountEffect, useUpdateEffect } from '../hooks/Hooks';
import { DomHandler } from '../utils/Utils';

export const Portal = React.memo((props) => {
    const [mountedState, setMountedState] = React.useState(props.visible && DomHandler.hasDOM());

    useMountEffect(() => {
        if (DomHandler.hasDOM() && !mountedState) {
            setMountedState(true);
            props.onMounted && props.onMounted();
        }
    });

    useUpdateEffect(() => {
        props.onMounted && props.onMounted();
    }, [mountedState]);

    useUnmountEffect(() => {
        props.onUnmounted && props.onUnmounted();
    });

    const element = props.element || props.children;
    if (element && mountedState) {
        const appendTo = props.appendTo || PrimeReact.appendTo || document.body;
        return appendTo === 'self' ? element : createPortal(element, appendTo);
    }

    return null;
});

// Portal.displayName = 'Portal';
(Portal as any).defaultProps = {
    __TYPE: 'Portal',
    element: null,
    appendTo: null,
    visible: false,
    onMounted: null,
    onUnmounted: null
}