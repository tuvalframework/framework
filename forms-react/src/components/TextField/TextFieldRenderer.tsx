import { css } from "@emotion/css";
import { is } from "@tuval/core";
import { InputText, InputTextarea, InputNumber } from 'primereact';
import { useRecordContext } from "ra-core";
import React, { Fragment } from "react";
import { UIFormController, useFormController } from "../../UIFormController";
import { UIView } from "../UIView/UIView";
import { MaskTypes, TextFieldClass } from "./TextFieldClass";

export interface IControlProperties {
    control: TextFieldClass
}


function TextFieldProxy(_props) {
    const props = { ..._props };



    const _className = `textfield-view`;

    const children = props.children;

    // let className = props.className;


    const isMultiline = props.control.vp_Multiline;
    const maskType = props.control.vp_MaskType;
    const appearance = props.control.Appearance;

    const className = css`
        ${appearance?.ToString()}
        &:focus {
            ${props.control.FocusAppearance?.ToString()}
        }
    `;

    delete props['className'];
    delete props['control'];
    delete props['children'];

    


    if (isMultiline) {
        return (
            <InputTextarea autoResize {...props} pt={{
                root: { className: className }
            }} ></InputTextarea>
        )
    } else {

        switch (maskType) {
            case MaskTypes.Number:
                props['onValueChange'] = props['onChange'];
                return (
                    <InputNumber {...props} style={{ width: '100%' }} pt={{
                        root: { className: className }
                    }}></InputNumber>
                )
            default:
                return (
                    <InputText {...props} pt={{
                        root: { className: className }
                    }}></InputText>
                )
        }

    }
}

const MyInputText = (_params) => {


    const params = { ..._params };
    const getLabel = () => {
        if (is.function(params.obj.vp_LabelTemplate)) {
            const view: UIView = params.obj.vp_LabelTemplate(params.obj.vp_Label);
            if (view != null) {
                return view.render()
            }
        } else if (!is.nullOrEmpty(params.obj.vp_Label)) {
            return (
                <label className="font-bold block mb-2">{params.obj.vp_Label}</label>
            )
        }
    }


    const controller: UIFormController = useFormController();
    // console.log(controller);


    if (params.obj.vp_FormField == null || controller == null) {
        if (is.nullOrUndefined(params.value)) {
            //params.value = '';
        }
        return (
            <Fragment>
                {getLabel()}
                <TextFieldProxy control={params.obj} {...params}> </TextFieldProxy>
            </Fragment>
        )

    } else {

        controller.register(params.obj.vp_FormField.name, params.obj.vp_FormField.rules, params.defaultValue);
        const formState = controller.GetFieldState(params.obj.vp_FormField.name);

        const record = useRecordContext();

        if (record && !formState?.isTouched) {
            if (params.defaultValue != null) {
                controller.SetValue(params.obj.vp_FormField.name, params.defaultValue, true);
            }
            params['value'] = record[params.obj.vp_FormField.name] || params.defaultValue;
        } else {
            if (params.defaultValue != null) {
                controller.SetValue(params.obj.vp_FormField.name, params.defaultValue, true);
            }
            params['value'] = controller.GetValue(params.obj.vp_FormField.name) || '' /* || params.defaultValue */;
        }


        //params['value'] = controller.GetValue(params.obj.vp_FormField.name);

        params['onChange'] = (e) => {
            controller.SetFieldState(params.obj.vp_FormField.name, { isTouched: true });

            controller.SetValue(params.obj.vp_FormField.name, e.target.value);
        }



        const fieldState = controller.GetFieldState(params.obj.vp_FormField.name);
        if (fieldState != null && fieldState.errors.length > 0) {
            delete params['height']; // we do not want 100% height
        }
        return (
            <Fragment>
                {getLabel()}
                <TextFieldProxy control={params.obj} {...params} />
                {fieldState?.errors.map(error => (
                    <small className="p-error">{error}</small>
                ))}

            </Fragment>
        )
    }
}


function TextFieldRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    ${control.DisabledAppearance.IsEmpty ? '' : '&:disabled { ' + control.DisabledAppearance.ToString() + ' }'}
    `;

    const attributes = {}
    if (control.vp_Autofocus) {
        attributes['autofocus'] = true;
    }

    const events = control.GetEventsObject();

    /*
    if (control.vp_myLostFocus) {
        attributes['onfocusout'] = (e) => (obj.vp_myLostFocus(e));
    } */

    return (
        <MyInputText
            className={className}
            obj={control}
            renderer={this}
            disabled={control.vp_Disabled}
            defaultValue={control.vp_DefaultValue}
            tabIndex={control.vp_TabIndex}
            {...attributes}
            {...events}
            value={control.vp_Value}
            placeholder={control.vp_Placeholder}
            onInput={control.vp_OnInput}
            onFocus={control.vp_OnFocus}
            onSelectionChange={control.vp_OnSelectionchange}
            onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e.value == null ? e.target?.value : e.value) : void 0}
        >
        </MyInputText>
    );

}

export default TextFieldRenderer;