import React, { createElement } from '../../../../preact/compat';
import { Teact } from "../Teact";

import { Ripple } from '../ripple/Ripple';
import { classNames } from '@tuval/core';
import { ObjectUtils } from '../ObjectUtils';

export class MultiSelectItem extends React.Component {

    static defaultProps = {
        option: null,
        label: null,
        selected: false,
        disabled: false,
        tabIndex: null,
        template: null,
        onClick: null,
        onKeyDown: null,
    };



    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onClick(event) {
        if (this.props.onClick) {
            this.props.onClick({
                originalEvent: event,
                option: this.props.option
            });
        }

        event.preventDefault();
    }

    onKeyDown(event) {
        if (this.props.onKeyDown) {
            this.props.onKeyDown({
                originalEvent: event,
                option: this.props.option
            });
        }
    }

    render() {
        const className = classNames('p-multiselect-item', { 'p-highlight': this.props.selected, 'p-disabled': this.props.disabled } as any, this.props.option.className);
        const checkboxClassName = classNames('p-checkbox-box', { 'p-highlight': this.props.selected } as any);
        const checkboxIcon = classNames('p-checkbox-icon p-c', { 'pi pi-check': this.props.selected } as any);
        const content = this.props.template ? ObjectUtils.getJSXElement(this.props.template, this.props.option) : this.props.label;
        const tabIndex = this.props.disabled ? null : this.props.tabIndex || 0;

        return (
            <li className={className} onClick={this.onClick} tabIndex={tabIndex} onKeyDown={this.onKeyDown} role="option" aria-selected={this.props.selected}>
                <div className="p-checkbox p-component">
                    <div className={checkboxClassName}>
                        <span className={checkboxIcon}></span>
                    </div>
                </div>
                <span>{content}</span>
                <Ripple />
            </li>
        );
    }

}