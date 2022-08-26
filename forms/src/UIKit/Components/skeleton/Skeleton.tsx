import React, { createElement, Fragment } from "../../../preact/compat";
import { Teact } from "../../../windows/Forms/Components/Teact";
import { classNames, ObjectUtils } from '../utils/Utils';

export const Skeleton = React.memo(React.forwardRef((props, ref) => {
    const otherProps = ObjectUtils.findDiffKeys(props, (Skeleton as any).defaultProps);
    const style = props.size ?
        { width: props.size, height: props.size, borderRadius: props.borderRadius } :
        { width: props.width, height: props.height, borderRadius: props.borderRadius };
    const className = classNames('p-skeleton p-component', {
        'p-skeleton-circle': props.shape === 'circle',
        'p-skeleton-none': props.animation === 'none'
    }, props.className);

    return <div style={style} className={className} {...otherProps}></div>
}));

// Skeleton.displayName = 'Skeleton';
(Skeleton as any).defaultProps = {
    __TYPE: 'Skeleton',
    shape: 'rectangle',
    size: null,
    width: '100%',
    height: '1rem',
    borderRadius: null,
    animation: 'wave',
    style: null,
    className: null
}