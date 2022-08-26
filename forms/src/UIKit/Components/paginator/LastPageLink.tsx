import React, { createElement, Fragment } from "../../../preact/compat";
import { Teact } from "../../../windows/Forms/Components/Teact";

import { ariaLabel } from '../api/Api';
import { Button } from '../button/Button';
import { classNames, ObjectUtils } from '../utils/Utils';

export const LastPageLink = React.memo((props) => {
    const className = classNames('p-paginator-last p-paginator-element p-link', { 'p-disabled': props.disabled });
    const iconClassName = 'p-paginator-icon pi pi-angle-double-right';
    const element = (
        <Button type='button' className={className} icon={iconClassName} onClick={props.onClick} disabled={props.disabled} aria-label={ariaLabel('lastPageLabel')}/>
    );

    if (props.template) {
        const defaultOptions = {
            onClick: props.onClick,
            className,
            iconClassName,
            disabled: props.disabled,
            element,
            props
        };

        return ObjectUtils.getJSXElement(props.template, defaultOptions);
    }

    return element;
});

// LastPageLink.displayName = 'LastPageLink';
(LastPageLink as any).defaultProps = {
    __TYPE: 'LastPageLink',
    disabled: false,
    onClick: null,
    template: null
}