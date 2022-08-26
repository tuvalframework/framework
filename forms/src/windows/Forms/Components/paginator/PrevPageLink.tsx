import { Teact } from "../Teact";
import React  from '../../../../preact/compat';
import { classNames } from '@tuval/core';
import { Ripple } from "../ripple/Ripple";
import { ObjectUtils } from "../ObjectUtils";

export class PrevPageLink extends React.Component {

    static defaultProps = {
        disabled: false,
        onClick: null,
        template: null
    }



    render() {
        const className = classNames('p-paginator-prev p-paginator-element p-link', { 'p-disabled': this.props.disabled } as any);
        const iconClassName = 'p-paginator-icon pi pi-angle-left';
        const element = (
            <button type="button" className={className} onClick={this.props.onClick} disabled={this.props.disabled}>
                <span className={iconClassName}></span>
                <Ripple />
            </button>
        );

        if (this.props.template) {
            const defaultOptions = {
                onClick: this.props.onClick,
                className,
                iconClassName,
                disabled: this.props.disabled,
                element,
                props: this.props
            };

            return ObjectUtils.getJSXElement(this.props.template, defaultOptions);
        }

        return element;
    }
}
