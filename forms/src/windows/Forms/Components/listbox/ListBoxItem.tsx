
import { classNames } from '@tuval/core';
import React from '../../../../preact/compat';
import { DomHandler } from '../DomHandler';
import { ObjectUtils } from '../ObjectUtils';
import { Ripple } from '../ripple/Ripple';
import { Teact } from '../Teact';
export class ListBoxItem extends React.Component {

    static defaultProps = {
        option: null,
        label: null,
        selected: false,
        disabled: false,
        tabIndex: null,
        onClick: null,
        onTouchEnd: null,
        template: null,
    }

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onClick(event) {
        if(this.props.onClick) {
            this.props.onClick({
                originalEvent: event,
                option: this.props.option
            });
        }

        event.preventDefault();
    }

    onTouchEnd(event) {
        if(this.props.onTouchEnd) {
            this.props.onTouchEnd({
                originalEvent: event,
                option: this.props.option
            });
        }
    }

    onKeyDown(event) {
        let item = event.currentTarget;

        switch(event.which) {
            //down
            case 40:
                let nextItem = this.findNextItem(item);
                if(nextItem) {
                    nextItem.focus();
                }

                event.preventDefault();
            break;

            //up
            case 38:
                let prevItem = this.findPrevItem(item);
                if(prevItem) {
                    prevItem.focus();
                }

                event.preventDefault();
            break;

            //enter
            case 13:
                this.onClick(event);
                event.preventDefault();
            break;

            default:
            break;
        }
    }

    findNextItem(item) {
        let nextItem = item.nextElementSibling;

        if (nextItem)
            return DomHandler.hasClass(nextItem, 'p-disabled') || DomHandler.hasClass(nextItem, 'p-listbox-item-group') ? this.findNextItem(nextItem) : nextItem;
        else
            return null;
    }

    findPrevItem(item) {
        let prevItem = item.previousElementSibling;

        if (prevItem)
            return DomHandler.hasClass(prevItem, 'p-disabled') || DomHandler.hasClass(prevItem, 'p-listbox-item-group') ? this.findPrevItem(prevItem) : prevItem;
        else
            return null;
    }

    render() {
        let className = classNames('p-listbox-item', {
            'p-highlight': this.props.selected,
            'p-disabled': this.props.disabled
        } as any, this.props.option.className);
        let content = this.props.template ? ObjectUtils.getJSXElement(this.props.template, this.props.option) : this.props.label;

        return (
            <li className={className} onClick={this.onClick} onTouchEnd={this.onTouchEnd} onKeyDown={this.onKeyDown} tabIndex={this.props.tabIndex}
                aria-label={this.props.label} key={this.props.label} role="option" aria-selected={this.props.selected}>
                {content}
                <Ripple />
            </li>
        );
    }
}