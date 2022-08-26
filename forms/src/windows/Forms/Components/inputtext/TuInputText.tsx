import { DomHandler } from "../DomHandler";
import { tip } from "../tooltip/ToolTip";
import { TooltipOptions } from "../tooltip/ToolTipOptions";
import { KeyFilter } from "./KeyFilter";
import { classNames } from '@tuval/core';
import { ObjectUtils } from "../ObjectUtils";
import { Teact } from "../Teact";

import React, { createElement } from '../../../../preact/compat';

const css = require('./InputText.css');
DomHandler.addCssToDocument(css);


export class InputText extends React.Component {
    public static defaultProps = {
        keyfilter: null,
        validateOnly: false,
        tooltip: null,
        tooltipOptions: null,
        onInput: null,
        onKeyPress: null,
        forwardRef: null
    };
    elementRef: any;
    tooltip: any;
    constructor(props) {
        super(props);
        this.onInput = this.onInput.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);

        this.elementRef =React.createRef(/* this.props.forwardRef */);
    }

    isFilled() {
        return (this.props.value != null && this.props.value.toString().length > 0) ||
            (this.props.defaultValue != null && this.props.defaultValue.toString().length > 0) ||
            (this.elementRef && this.elementRef.current && this.elementRef.current.value != null && this.elementRef.current.value.toString().length > 0);
    }

    onKeyPress(event) {
        if (this.props.onKeyPress) {
            this.props.onKeyPress(event);
        }

        if (this.props.keyfilter) {
            KeyFilter.onKeyPress(event, this.props.keyfilter, this.props.validateOnly)
        }
    }

    onInput(event) {
        let validatePattern = true;
        if (this.props.keyfilter && this.props.validateOnly) {
            validatePattern = KeyFilter.validate(event, this.props.keyfilter);
        }

        if (this.props.onInput) {
            this.props.onInput(event, validatePattern);
        }

        if (!this.props.onChange) {
            if (event.target.value.length > 0)
                DomHandler.addClass(event.target, 'p-filled');
            else
                DomHandler.removeClass(event.target, 'p-filled');
        }
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

    render() {
        const className = classNames('p-inputtext p-component', {
            'p-disabled': this.props.disabled,
            'p-filled': this.isFilled()
        } as any, this.props.className);

        let inputProps: any = ObjectUtils.findDiffKeys(this.props, InputText.defaultProps);

        return  <input ref={this.elementRef} {...inputProps} className={className} onInput={this.onInput} onKeyPress={this.onKeyPress} />

    }
}

export const TuInputElement: any = React.forwardRef((props, ref) => <InputText forwardRef={ref} {...props} />);
