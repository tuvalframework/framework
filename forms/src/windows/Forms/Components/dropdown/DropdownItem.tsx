import { classNames } from "@tuval/core";
import { Teact } from "../Teact";
import React from '../../../../preact/compat';
import { ObjectUtils } from '../ObjectUtils';
import { Ripple } from "../ripple/Ripple";
export class DropdownItem extends React.Component {

    static defaultProps = {
        option: null,
        label: null,
        template: null,
        selected: false,
        disabled: false,
        onClick: null
    };


    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        if(this.props.onClick) {
            this.props.onClick({
                originalEvent: event,
                option: this.props.option
            })
        }
    }

    render() {
        let className = classNames('p-dropdown-item', {
            'p-highlight': this.props.selected,
            'p-disabled': this.props.disabled,
            'p-dropdown-item-empty': (!this.props.label || this.props.label.length === 0)
        } as any, this.props.option.className);
        let content = this.props.template ? ObjectUtils.getJSXElement(this.props.template, this.props.option) : this.props.label;

        return (
            <li className={className} onClick={this.onClick} aria-label={this.props.label} key={this.props.label} role="option" aria-selected={this.props.selected}>
                {content}
                <Ripple />
            </li>
        );
    }
}