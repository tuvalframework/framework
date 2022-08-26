import { classNames } from '@tuval/core';
import React, { createElement, createRef } from '../../../../preact/compat';
import { UniqueComponentId } from '../../../../UniqueComponentId';
import { ObjectUtils } from '../ObjectUtils';
import { Teact } from "../Teact";

export class Badge extends React.Component {

    static defaultProps = {
        value: null,
        severity: null,
        size: null,
        style: null,
        className: null
    }


    render() {
        const badgeClassName = classNames('p-badge p-component', {
            'p-badge-no-gutter': this.props.value && String(this.props.value).length === 1,
            'p-badge-dot': !this.props.value,
            'p-badge-lg': this.props.size === 'large',
            'p-badge-xl': this.props.size === 'xlarge',
            'p-badge-info': this.props.severity === 'info',
            'p-badge-success': this.props.severity === 'success',
            'p-badge-warning': this.props.severity === 'warning',
            'p-badge-danger': this.props.severity === 'danger'
        } as any, this.props.className);

        return (
            <span className={badgeClassName} style={this.props.style}>
                {this.props.value}
            </span>
        );
    }
}