import { Teact } from "../Teact";
import React from '../../../../preact/compat';
import { classNames } from '@tuval/core';

export class RowCheckbox extends React.Component {

    static defaultProps = {
        rowData: null,
        onClick: null,
        disabled: false
    }

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
        if (!this.props.disabled) {
            this.setState({ focused: true });

            if (this.props.onClick) {
                this.props.onClick({
                    originalEvent: event,
                    data: this.props.rowData,
                    checked: this.props.selected
                });
            }
        }
    }

    onFocus() {
        this.setState({ focused: true });
    }

    onBlur() {
        this.setState({ focused: false });
    }

    onKeyDown(event) {
        if (event.code === 'Space') {
            this.onClick(event);
            event.preventDefault();
        }
    }

    render() {
        const className = classNames('p-checkbox-box p-component p-clickable', { 'p-highlight': this.props.selected, 'p-disabled': this.props.disabled, 'p-focus': this.state.focused } as any);
        const iconClassName = classNames('p-checkbox-icon p-clickable', { 'pi pi-check': this.props.selected } as any);
        const tabIndex = this.props.disabled ? null : '0';

        return (
            <div className="p-checkbox p-component" onClick={this.onClick}>
                <div className={className} role="checkbox" aria-checked={this.props.selected} tabIndex={tabIndex}
                    onKeyDown={this.onKeyDown} onFocus={this.onFocus} onBlur={this.onBlur}>
                    <span className={iconClassName}></span>
                </div>
            </div>
        );
    }
}
