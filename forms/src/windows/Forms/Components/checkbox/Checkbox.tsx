import React from '../../../../preact/compat';
import { Teact } from "../Teact";
import { DomHandler } from '../DomHandler';
import { classNames } from '@tuval/core';
import { tip } from '../tooltip/ToolTip';



const css = require('./Checkbox.css');
DomHandler.addCssToDocument(css);

export class CheckboxComponent extends React.Component {

    static defaultProps = {
        id: null,
        inputRef: null,
        inputId: null,
        value: null,
        name: null,
        checked: false,
        style: null,
        className: null,
        disabled: false,
        required: false,
        readOnly: false,
        tabIndex: null,
        tooltip: null,
        tooltipOptions: null,
        ariaLabelledBy: null,
        onChange: null,
        onMouseDown: null,
        onContextMenu: null
    };
    inputRef: any;
    tooltip: any;
    element: any;
    box: any;


    constructor(props) {
        super(props);
        this.state = {
            focused: false
        };

        this.onClick = this.onClick.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        this.inputRef = React.createRef(this.props.inputRef);
    }

    onClick(e) {
        if (!this.props.disabled && !this.props.readOnly && this.props.onChange) {
            this.props.onChange({
                originalEvent: e,
                value: this.props.value,
                checked: !this.props.checked,
                stopPropagation : () =>{},
                preventDefault : () =>{},
                target: {
                    type: 'checkbox',
                    name: this.props.name,
                    id: this.props.id,
                    value: this.props.value,
                    checked: !this.props.checked,
                }
            });

            this.inputRef.current.checked = !this.props.checked;
            this.inputRef.current.focus();

            e.preventDefault();
        }
    }

    updateInputRef() {
        let ref = this.props.inputRef;

        if (ref) {
            if (typeof ref === 'function') {
                ref(this.inputRef.current);
            }
            else {
                ref.current = this.inputRef.current;
            }
        }
    }

    componentDidMount() {
        this.updateInputRef();

        if (this.props.tooltip) {
            this.renderTooltip();
        }
    }

    componentWillUnmount() {
        if (this.tooltip) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
    }

    componentDidUpdate(prevProps) {
        this.inputRef.current.checked = this.props.checked;

        if (prevProps.tooltip !== this.props.tooltip || prevProps.tooltipOptions !== this.props.tooltipOptions) {
            if (this.tooltip)
                this.tooltip.update({ content: this.props.tooltip, ...(this.props.tooltipOptions || {}) });
            else
                this.renderTooltip();
        }
    }

    onFocus() {
        this.setState({ focused: true });
    }

    onBlur() {
        this.setState({ focused: false });
    }

    onKeyDown(event) {
        if (event.key === 'Enter') {
            this.onClick(event);
            event.preventDefault();
        }
    }

    renderTooltip() {
        this.tooltip = tip({
            target: this.element,
            content: this.props.tooltip,
            options: this.props.tooltipOptions
        });
    }

    render() {
        const containerClass = classNames('p-checkbox p-component', {
            'p-checkbox-checked': this.props.checked,
            'p-checkbox-disabled': this.props.disabled,
            'p-checkbox-focused': this.state.focused
        } as any, this.props.className);
        const boxClass = classNames('p-checkbox-box', {
            'p-highlight': this.props.checked,
            'p-disabled': this.props.disabled,
            'p-focus': this.state.focused
        } as any);
        const iconClass = classNames('p-checkbox-icon p-c', {
            'pi pi-check': this.props.checked
        } as any);

        return (
            <div ref={(el) => this.element = el} id={this.props.id} className={containerClass} style={this.props.style} onClick={this.onClick} onContextMenu={this.props.onContextMenu} onMouseDown={this.props.onMouseDown}>
                <div className="p-hidden-accessible">
                    <input ref={this.inputRef} type="checkbox" aria-labelledby={this.props.ariaLabelledBy} id={this.props.inputId} name={this.props.name} tabIndex={this.props.tabIndex} defaultChecked={this.props.checked}
                             onKeyDown={this.onKeyDown} onFocus={this.onFocus} onBlur={this.onBlur} disabled={this.props.disabled} readOnly={this.props.readOnly} required={this.props.required}/>
                </div>
                <div className={boxClass} ref={el => this.box = el} role="checkbox" aria-checked={this.props.checked}>
                    <span className={iconClass}></span>
                </div>
            </div>
        )
    }
}