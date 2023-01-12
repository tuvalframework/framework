import { AppearanceObject } from '../windows/Forms/Components/AAA/AppearanceObject';
import { UIView, ViewProperty } from "./UIView";
import { ITextBox } from '../windows/Forms/Components/AAA/TextBox/ITextBox';
import { ControlHtmlRenderer } from "../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { StringBuilder, int, is, Guid } from "@tuval/core";
import { InputText } from './TextField/InputText';
import { Teact } from "../windows/Forms/Components/Teact";
import { bindFormController, UIController, UIFormController, ValidateRule } from './UIController';
import { getView, viewFunc } from './getView';
import { motion } from '../motion';
import { InputSwitch } from './Components/inputswitch/InputSwitch';
import { DomHandler } from '../windows/Forms/Components/DomHandler';
import { Checkbox } from './Components/checkbox/Checkbox';
import React, { createElement, Fragment } from "../preact/compat";
import { useRecordContext } from '../query/record/useRecordContext';


class CheckBoxFieldProxy extends React.Component {



    public render() {

        return (
            <Checkbox {...this.props} ></Checkbox>
        )

    }
}


const MyCheckBox = (params) => {

 

    const controller: UIFormController = bindFormController();
    // console.log(controller);


    if (params.obj.vp_FormField == null || controller == null) {
        if (is.nullOrUndefined(params.value)) {
            params.value = '';
        }
        return (
            <Fragment>
                <CheckBoxFieldProxy control={params.obj} {...params}> </CheckBoxFieldProxy>
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
            params['checked'] = record[params.obj.vp_FormField.name];
        } else {
            params['checked'] = controller.GetValue(params.obj.vp_FormField.name);
        }


        //params['value'] = controller.GetValue(params.obj.vp_FormField.name);

        params['onChange'] = (e) => {

            controller.SetFieldState(params.obj.vp_FormField.name, { isTouched: true });
            controller.SetValue(params.obj.vp_FormField.name, e.checked);

        }



        const fieldState = controller.GetFieldState(params.obj.vp_FormField.name);
        if (fieldState.errors.length > 0) {
            delete params['height']; // we do not want 100% height
        }
        return (
            <div style={{ width: '100%' }}>
                <CheckBoxFieldProxy control={params.obj} {...params} />
                {fieldState.errors.map(error => (
                    <small className="p-error">{error}</small>
                ))}

            </div>
        )
    }
}

export class CheckBoxRenderer extends ControlHtmlRenderer<CheckBoxClass> {

   

    public GenerateElement(obj: CheckBoxClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public GenerateBody(obj: CheckBoxClass): void {
        this.WriteComponent(
            <div class={'field-checkbox'}>
                <MyCheckBox
                    obj={obj}
                    renderer={this}
                    inputId={obj.vp_Id} checked={obj.vp_Value} onChange={(e) => { obj.vp_onChange(e.checked) }} >
                </MyCheckBox >
                <label htmlFor={obj.vp_Id} className="p-checkbox-label">{obj.vp_Label}</label>
            </div>

        );
    }
}

export class CheckBoxClass extends UIView {

    @ViewProperty() vp_Id: string;

    @ViewProperty()
    public vp_FormField: { name: string, rules: ValidateRule[] };

    public formField(name: string, rules: ValidateRule[]): this {
        this.vp_FormField = {
            name: name,
            rules: rules
        };
        return this;
    }

    @ViewProperty()
    public vp_Label: string;

    public label(value: string): this {
       this.vp_Label = value;
        return this;
    }


    @ViewProperty() vp_Value: boolean;
    @ViewProperty() vp_onChange: Function;

    public setController(controller: UIController): this {
        super.setController(controller);
        // Default renderer
        this.Renderer = new CheckBoxRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });
        return this;
    }

    public constructor() {
        super();

        this.vp_onChange = () => { };
        this.vp_Id = Guid.NewGuid().ToString();
    }

    public OnAppearanceChanged(name: string): void {

    }

    public onChange(value: (value: boolean) => void): this {
        this.vp_onChange = value;
        return this;
    }

    public value(value: boolean): this {
        this.vp_Value = value;
        return this;
    }
}


export function UICheckBox(): CheckBoxClass {
    return viewFunc(CheckBoxClass, (controller, propertyBag) => {
        return new CheckBoxClass().setController(controller).PropertyBag(propertyBag);
    });
}