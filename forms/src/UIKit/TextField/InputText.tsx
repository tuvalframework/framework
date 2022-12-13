
import { classNames, is } from "@tuval/core";
import React, { createElement, Fragment } from "../../preact/compat";
import { Teact } from "../../windows/Forms/Components/Teact";
import { DomHandler as domhandler } from "../../windows/Forms/Components/DomHandler";
//import { KeyFilter } from "../../windows/Forms/Components/keyfilter/KeyFilter";
import { ObjectUtils } from "./utils/ObjectUtils";
import { Tooltip } from "../Components/tooltip/Tooltip";
import { KeyFilter } from "../Components/keyfilter/KeyFilter";
import DomHandler from "../Components/utils/DomHandler";
import { useFormContext } from "../../hook-form/useFormContext";


domhandler.addCssToDocument(require('../Components/tooltip/Tooltip.css'));
domhandler.addCssToDocument(require('../Components/tooltip/Theme.css'));

export interface InputTextProps {
    onComponentDidMount?: Function;
    onKeyPress?: Function;
    onInput?: Function;
    onChange?: Function;
    onPaste?: Function;
    keyfilter?: any;
    validateOnly?: boolean;
    value?: string;
    defaultValue?: string;
    tooltip?: string;
    disabled?: boolean;
    className?: string;
    tooltipOptions?: any;
    style?: any;
    placeholder?: string;
}
export const InputText:(props: any/* InputTextProps */) => any = React.memo(React.forwardRef((props: InputTextProps, ref) => {
    const elementRef = React.useRef(ref);

    const onKeyPress = (event) => {
        props.onKeyPress && props.onKeyPress(event);

        if (props.keyfilter) {
            KeyFilter.onKeyPress(event, props.keyfilter, props.validateOnly)
        }
    }

    const onInput = (event) => {
        let validatePattern = true;
        if (props.keyfilter && props.validateOnly) {
            validatePattern = KeyFilter.validate(event, props.keyfilter);
        }

        props.onInput && props.onInput(event, validatePattern);

        if (!props.onChange) {
            const target = event.target;
            ObjectUtils.isNotEmpty(target.value) ? DomHandler.addClass(target, 'p-filled') : DomHandler.removeClass(target, 'p-filled');
        }
    }

    const onPaste = (event) => {
        props.onPaste && props.onPaste(event);

        if (props.keyfilter) {
            KeyFilter.onPaste(event, props.keyfilter, props.validateOnly)
        }
    }

    const isFilled = React.useMemo(() => (
        ObjectUtils.isNotEmpty(props.value) || ObjectUtils.isNotEmpty(props.defaultValue) || (elementRef.current && ObjectUtils.isNotEmpty(elementRef.current.value))
    ), [props.value, props.defaultValue]);

    React.useEffect(() => {
        ObjectUtils.combinedRefs(elementRef, ref);
        if (is.function(props.onComponentDidMount)) {
            props.onComponentDidMount(elementRef.current);
        }
    }, [elementRef, ref]);

     //autofocus
     if ((props as any).autofocus) {
        React.useEffect(() => {
            if (elementRef.current) {
                elementRef.current.focus();
            }
        }, []);
    }

    const hasTooltip = ObjectUtils.isNotEmpty(props.tooltip);
    const otherProps = ObjectUtils.findDiffKeys(props, (InputText as any).defaultProps);
    const className = classNames('p-inputtext p-component', {
        'p-disabled': props.disabled,
        'p-filled': isFilled
    } as any, props.className);

    console.log(otherProps);
    
    return (
        <Fragment>
            <input ref={elementRef} {...otherProps} className={className} onInput={onInput} onKeyPress={onKeyPress} onPaste={onPaste} />
            {hasTooltip && <Tooltip target={elementRef} content={props.tooltip} {...props.tooltipOptions} />}
        </Fragment>
    )
}));

// InputText.displayName = 'InputText';
(InputText as any).defaultProps = {
    __TYPE: 'InputText',
    keyfilter: null,
    validateOnly: false,
    tooltip: null,
    tooltipOptions: null,
    onInput: null,
    onKeyPress: null,
    onPaste: null
}