import { tip  } from "../tooltip/ToolTip";
import { classNames } from "@tuval/core";
import { DomHandler } from "../DomHandler";
import { Teact } from "../Teact";
import { ObjectUtils } from "../ObjectUtils";
import { Ripple } from "../ripple/Ripple";
import { TooltipOptions } from "../tooltip/ToolTipOptions";

import React, { createElement, createRef } from '../../../../preact/compat';

/* const css = require('./Button.css');

DomHandler.addCssToDocument(css); */

type MouseClickEventHandler = (evt: MouseEvent) => void;


export class ButtonComponent extends /* Control<ButtonProps, ButtonState> */React.Component {

    static defaultProps = {
        label: null,
        icon: null,
        iconPos: 'left',
        badge: null,
        badgeClassName: null,
        tooltip: null,
        tooltipOptions: null,
        forwardRef: null,
        disabled: false,
        loading: false,
        loadingIcon: 'pi pi-spinner pi-spin'
    }
    tooltip: any;
    elementRef: any;



    constructor(props) {
        super(props);

        this.elementRef = createRef(/* this.props.forwardRef */);
    }

    updateForwardRef() {
        let ref = this.props.forwardRef;

        if (ref) {
            if (typeof ref === 'function') {
                ref(this.elementRef.current);
            }
            else {
                ref.current = this.elementRef.current;
            }
        }
    }

    isDisabled() {
        return this.props.disabled || this.props.loading;
    }

    componentDidMount() {
        this.updateForwardRef();

        if (this.props.tooltip) {
            this.renderTooltip();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.tooltip !== this.props.tooltip || prevProps.tooltipOptions !== this.props.tooltipOptions) {
            if (this.tooltip)
                this.tooltip.update({ content: this.props.tooltip, ...(this.props.tooltipOptions || {}) });
            else
                this.renderTooltip();
        }
    }

    componentWillUnmount() {
        if (this.tooltip) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
    }

    renderTooltip() {
        this.tooltip = tip({
            target: this.elementRef.current,
            content: this.props.tooltip,
            options: this.props.tooltipOptions
        });
    }

    renderIcon() {
        let icon = this.props.loading ? this.props.loadingIcon : this.props.icon;
        let content = null;

        if (icon) {
            let iconType = typeof icon;
            let className = classNames('p-button-icon p-c', {
                'p-button-loading-icon': this.props.loading,
                [`${icon}`]: iconType === 'string',
                'p-button-icon-left': this.props.iconPos === 'left' && this.props.label,
                'p-button-icon-right': this.props.iconPos === 'right' && this.props.label,
                'p-button-icon-top': this.props.iconPos === 'top' && this.props.label,
                'p-button-icon-bottom': this.props.iconPos === 'bottom' && this.props.label,
            } as any);
            content = <span className={className}></span>;

            if (iconType !== 'string') {
                const defaultContentOptions = {
                    className,
                    element: content,
                    props: this.props
                };

                content = ObjectUtils.getJSXElement(icon, defaultContentOptions);
            }
        }

        return content;
    }

    renderLabel() {
        if (this.props.label) {
            return <span className="p-button-label p-c">{this.props.label}</span>;
        }

        return !this.props.children && !this.props.label && <span className="p-button-label p-c" dangerouslySetInnerHTML={{ __html: "&nbsp;" }}></span>
    }

    renderBadge() {
        if (this.props.badge) {
            const badgeClassName = classNames('p-badge', this.props.badgeClassName);

            return <span className={badgeClassName}>{this.props.badge}</span>
        }

        return null;
    }

    render() {
        let disabled = this.isDisabled();
        let className = classNames('p-button p-component', this.props.className, {
            'p-button-icon-only': (this.props.icon || (this.props.loading && this.props.loadingIcon)) && !this.props.label,
            'p-button-vertical': (this.props.iconPos === 'top' || this.props.iconPos === 'bottom') && this.props.label,
            'p-disabled': disabled,
            'p-button-loading': this.props.loading,
            'p-button-loading-label-only': this.props.loading && !this.props.icon && this.props.label,
            [`p-button-loading-${this.props.iconPos}`]: this.props.loading && this.props.loadingIcon && this.props.label
        } as any);
        let icon = this.renderIcon();
        let label = this.renderLabel();
        let badge = this.renderBadge();

        let buttonProps = ObjectUtils.findDiffKeys(this.props, ButtonComponent.defaultProps);

        return (
            <button ref={this.elementRef} {...buttonProps} className={className} disabled={disabled}>
                {icon}
                {label}
                {this.props.children}
                {badge}
                <Ripple />
            </button>
        );
    }
}