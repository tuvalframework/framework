import { classNames } from '@tuval/core';
import React, { createElement, createRef } from '../../../../preact/compat';
import { UniqueComponentId } from '../../../../UniqueComponentId';
import { ObjectUtils } from '../ObjectUtils';
import { Teact } from "../Teact";

export class AvatarGroup extends React.Component {

    static defaultProps = {
        style: null,
        className: null
    }


    render() {
        const containerClassName = classNames('p-avatar-group p-component', this.props.className);

        return (
            <div className={containerClassName} style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
}