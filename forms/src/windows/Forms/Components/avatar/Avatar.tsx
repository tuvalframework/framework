import { classNames } from '@tuval/core';
import React, { createElement, createRef } from '../../../../preact/compat';
import { UniqueComponentId } from '../../../../UniqueComponentId';
import { ObjectUtils } from '../ObjectUtils';
import { Teact } from "../Teact";

export class Avatar extends React.Component {

    static defaultProps = {
        label: null,
        icon: null,
        image: null,
        size: 'normal',
        shape: 'square',
        style: null,
        className: null,
        template: null,
        imageAlt: 'avatar',
        onImageError: null,
        onClick: null
    }

    renderContent() {
        if (this.props.label) {
            return <span className="p-avatar-text">{this.props.label}</span>;
        }
        else if (this.props.icon) {
            const iconClassName = classNames('p-avatar-icon', this.props.icon);
            return <span className={iconClassName}></span>;
        }
        else if (this.props.image) {
            const onError = (e) => {
                if (this.props.onImageError) {
                    this.props.onImageError(e);
                }
            };

            return <img src={this.props.image} alt={this.props.imageAlt} onError={onError}></img>
        }

        return null;
    }

    render() {
        const containerClassName = classNames('p-avatar p-component', {
            'p-avatar-image': this.props.image != null,
            'p-avatar-circle': this.props.shape === 'circle',
            'p-avatar-lg': this.props.size === 'large',
            'p-avatar-xl': this.props.size === 'xlarge',
            'p-avatar-clickable': !!this.props.onClick
        } as any, this.props.className);

        const content = this.props.template ? ObjectUtils.getJSXElement(this.props.template, this.props) : this.renderContent();

        return (
            <div className={containerClassName} style={this.props.style} onClick={this.props.onClick}>
                {content}
                {this.props.children}
            </div>
        );
    }
}