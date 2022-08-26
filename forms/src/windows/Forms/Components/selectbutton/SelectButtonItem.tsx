
import { Teact } from "../Teact";
import React, { Fragment } from '../../../../preact/compat';
import { DomHandler } from '../DomHandler';
import { classNames } from '@tuval/core';
import { ObjectUtils } from '../ObjectUtils';
import { tip } from '../tooltip/ToolTip';
import { Ripple } from '../ripple/Ripple';

export class SelectButtonItem extends React.Component {

    static defaultProps = {
        option: null,
        label: null,
        className: null,
        selected: null,
        tabIndex: null,
        ariaLabelledBy: null,
        template: null,
        onClick: null
    };

    constructor(props) {
        super(props);

        this.state = {
            focused: false
        };

        this.onClick = this.onClick.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onClick(event) {
        if (this.props.onClick) {
            this.props.onClick({
                originalEvent: event,
                option: this.props.option
            });
        }
    }

    onFocus() {
        this.setState({ focused: true });
    }

    onBlur() {
        this.setState({ focused: false });
    }

    onKeyDown(event) {
        const keyCode = event.which;
        if (keyCode === 32 || keyCode === 13) { //space and enter
            this.onClick(event);
            event.preventDefault();
        }
    }

    renderContent() {
        if (this.props.template) {
            return this.props.template(this.props.option);
        }
        else {
            return (
                <span className="p-button-label p-c">{this.props.label}</span>
            );
        }
    }

    render() {
        const className = classNames('p-button p-component', {
            'p-highlight': this.props.selected,
            'p-disabled': this.props.disabled,
            'p-focus': this.state.focused
        } as any, this.props.className);
        const content = this.renderContent();

        return (
            <div className={className} role="button" aria-label={this.props.label} aria-pressed={this.props.selected} aria-labelledby={this.props.ariaLabelledBy}
                onClick={this.onClick} onKeyDown={this.onKeyDown} tabIndex={this.props.tabIndex} onFocus={this.onFocus} onBlur={this.onBlur}>
                {content}
                { !this.props.disabled && <Ripple /> }
            </div>
        );
    }
}