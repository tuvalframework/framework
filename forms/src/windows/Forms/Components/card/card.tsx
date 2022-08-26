import React from '../../../../preact/compat';
import { Teact } from "../Teact";
import { ObjectUtils } from '../ObjectUtils';
import { classNames } from '@tuval/core';

export class CardComponent extends React.Component {

    static defaultProps = {
        id: null,
        header: null,
        footer: null,
        title: null,
        subTitle: null,
        style: null,
        className: null
    };

    renderHeader() {
        if (this.props.header) {
            return <div className="p-card-header">{ObjectUtils.getJSXElement(this.props.header, this.props)}</div>;
        }

        return null;
    }

    renderBody() {
        const title = this.props.title && <div className="p-card-title">{ObjectUtils.getJSXElement(this.props.title, this.props)}</div>
        const subTitle = this.props.subTitle && <div className="p-card-subtitle">{ObjectUtils.getJSXElement(this.props.subTitle, this.props)}</div>
        const children = this.props.children && <div className="p-card-content">{this.props.children}</div>
        const footer = this.props.footer && <div className="p-card-footer">{ObjectUtils.getJSXElement(this.props.footer, this.props)}</div>;

        return (
            <div className="p-card-body">
                {title}
                {subTitle}
                {children}
                {footer}
            </div>
        );
    }

    render() {
        const header = this.renderHeader();
        const body = this.renderBody();
        let className = classNames('p-card p-component', this.props.className);

        return (
            <div className={className} style={this.props.style} id={this.props.id}>
                {header}
                {body}
            </div>
        );
    }
}