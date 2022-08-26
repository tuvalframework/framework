import React, { createElement, Fragment } from "../../../preact/compat";
import { Teact } from "../../../windows/Forms/Components/Teact";

import { ariaLabel } from '../api/Api';
import { Button } from '../button/Button';
import { classNames, ObjectUtils } from '../utils/Utils';

export const FirstPageLink = React.memo((props) => {
    const className = classNames('p-paginator-first p-paginator-element p-link', { 'p-disabled': props.disabled });
    const iconClassName = 'p-paginator-icon pi pi-angle-double-left';
    const element = (
        <Button type='button' className={className} icon={iconClassName} onClick={props.onClick} disabled={props.disabled} aria-label={ariaLabel('firstPageLabel')}/>
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

// FirstPageLink.displayName = 'FirstPageLink';
(FirstPageLink as any).defaultProps = {
    __TYPE: 'FirstPageLink',
    disabled: false,
    onClick: null,
    template: null
}