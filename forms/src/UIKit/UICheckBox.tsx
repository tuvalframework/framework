import { AppearanceObject } from '../windows/Forms/Components/AAA/AppearanceObject';
import { UIView, ViewProperty } from "./UIView";
import { ITextBox } from '../windows/Forms/Components/AAA/TextBox/ITextBox';
import { ControlHtmlRenderer } from "../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { StringBuilder, int, is } from "@tuval/core";
import { InputText } from './TextField/InputText';
import { Teact } from "../windows/Forms/Components/Teact";
import { UIController } from './UIController';
import { viewFunc } from './getView';
import { motion } from '../motion';
import { InputSwitch } from './Components/inputswitch/InputSwitch';
import { DomHandler } from '../windows/Forms/Components/DomHandler';
import { Checkbox } from './Components/checkbox/Checkbox';


export class CheckBoxRenderer extends ControlHtmlRenderer<CheckBoxClass> {

    public GenerateElement(obj: CheckBoxClass): boolean {
        this.WriteStartFragment();
        return true;
    }
   
    public GenerateBody(obj: CheckBoxClass): void {
        this.WriteComponent(
            <Checkbox checked={obj.vp_Value} onChange={(e) => { obj.vp_onChange(e.checked) }} >
            </Checkbox >
        );
    }
}

export class CheckBoxClass extends UIView {

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