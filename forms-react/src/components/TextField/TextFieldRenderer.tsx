import React, { Fragment, useState } from "react";
import { InputText, InputTextarea } from 'primereact';
import { TextFieldClass } from "./TextFieldClass";
import { css } from "@emotion/css";
import { useRecordContext } from "ra-core";
import { UIFormController, useFormController } from "../../UIFormController";
import { is } from "@tuval/core";
import { UIView } from "../UIView/UIView";

export interface IControlProperties {
    control: TextFieldClass
}


function TextFieldProxy(props) {
    const _className = `textfield-view`;

    const children = this.props.children;

    let className = this.props.className;


    const isMultiline = this.props.control.vp_Multiline;

    delete this.props['className'];
    delete this.props['control'];
    delete this.props['children'];

    if (isMultiline) {
        return (
            <InputTextarea {...this.props} className={className}></InputTextarea>
        )
    } else {
        return (
            <InputText {...this.props} className={className}></InputText>
        )
    }
}

const MyInputText = (params) => {

    const getLabel = () => {
        if (is.function(params.obj.vp_LabelTemplate)) {
            const view: UIView = params.obj.vp_LabelTemplate(params.obj.vp_Label);
            if (view != null) {
                return view.render()
            }
        } else {
            return (
                <label className="block">{params.obj.vp_Label}</label>
            )
        }
    }
    debugger;

    const controller: UIFormController = useFormController();
    // console.log(controller);


    if (params.obj.vp_FormField == null || controller == null) {
        if (is.nullOrUndefined(params.value)) {
            params.value = '';
        }
        return (
            <Fragment>
                {getLabel()}
                <TextFieldProxy control={params.obj} {...params}> </TextFieldProxy>
            </Fragment>
        )

    } else {

        controller.register(params.obj.vp_FormField.name, params.obj.vp_FormField.rules);
        const formState = controller.GetFieldState(params.obj.vp_FormField.name);

        const record = useRecordContext();

        if (record && !formState.isTouched) {
            /*  if (controller != null) {
                 controller.SetValue(params.view.vp_FormField.name,record[params.view.vp_FormField.name], true);
             } */
            params['value'] = record[params.obj.vp_FormField.name];
        } else {
            params['value'] = controller.GetValue(params.obj.vp_FormField.name);
        }


        //params['value'] = controller.GetValue(params.obj.vp_FormField.name);

        params['onInput'] = (e) => params.renderer.delayedEvent(e, (e) => {

            controller.SetFieldState(params.obj.vp_FormField.name, { isTouched: true });
            controller.SetValue(params.obj.vp_FormField.name, e.target.value);

        }, 'onInput')



        const fieldState = controller.GetFieldState(params.obj.vp_FormField.name);
        if (fieldState.errors.length > 0) {
            delete params['height']; // we do not want 100% height
        }
        return (
            <div style={{ width: '100%' }}>
                {getLabel()}
                <TextFieldProxy control={params.obj} {...params} />
                {fieldState.errors.map(error => (
                    <small className="p-error">{error}</small>
                ))}

            </div>
        )
    }
}


function TextFieldRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    const attributes = {}
     if (control.vp_Autofocus) {
        attributes['autofocus'] = true;
    }

    /*
    if (control.vp_myLostFocus) {
        attributes['onfocusout'] = (e) => (obj.vp_myLostFocus(e));
    } */

    return (
        <MyInputText
            obj={control}
            renderer={this}
            tabIndex={control.vp_TabIndex}
            {...attributes}
            value={control.vp_Value}
            placeholder={control.vp_Placeholder}
            onChange={(e) => is.function(control.onChange) ? control.onChange(e.target.value) : void 0}>
        </MyInputText>
    );

}

export default TextFieldRenderer;