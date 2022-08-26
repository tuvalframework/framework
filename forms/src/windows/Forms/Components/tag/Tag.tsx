import { Teact } from "../Teact";
import React from '../../../../preact/compat';
import { DomHandler } from '../DomHandler';
import { classNames } from '@tuval/core';

const css = require('./Tag.css');
DomHandler.addCssToDocument(css);


export class TagComponent extends React.Component {

    static defaultProps = {
        value: null,
        severity: null,
        rounded: false,
        icon: null,
        style: null,
        className: null
    }



    render() {
        const tagClassName = classNames('p-tag p-component', {
            'p-tag-info': this.props.severity === 'info',
            'p-tag-success': this.props.severity === 'success',
            'p-tag-warning': this.props.severity === 'warning',
            'p-tag-danger': this.props.severity === 'danger',
            'p-tag-rounded': this.props.rounded
        } as any, this.props.className);

        const iconClass = classNames('p-tag-icon', this.props.icon);

        return (
            <span className={tagClassName} style={this.props.style}>
                {this.props.icon && <span className={iconClass}></span>}
                <span className="p-tag-value">{this.props.value}</span>
                <span>{this.props.children}</span>
            </span>
        );
    }
}