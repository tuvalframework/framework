import { AppearanceObject } from '../windows/Forms/Components/AAA/AppearanceObject';
import { UIView, ViewProperty } from "./UIView";
import { ITextBox } from '../windows/Forms/Components/AAA/TextBox/ITextBox';
import { ControlHtmlRenderer } from "../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { StringBuilder, int, is, classNames } from "@tuval/core";
import { InputText } from './TextField/InputText';
import { Teact } from "../windows/Forms/Components/Teact";
import { bindFormController, UIController, UIFormController, ValidateRule } from './UIController';
import { viewFunc } from './getView';
import { motion } from '../motion';
import { InputTextarea } from './Components/inputtextarea/InputTextarea';
import { Form_Control, Form_Controller, useFormContext } from '../hook-form';

import { useQueryClient } from '../query/tuval/QueryClientProvider';
import React, { createElement, Fragment } from "../preact/compat";
import { jss } from '../jss/jss';

class TextFieldProxy extends React.Component {

    get jssStyle(): any {
        return this.state.jssStyle;
    }

    set jssStyle(value: any) {
        this.setState({
            'jssStyle': value
        });
    }

    protected componentWillMount() {
        const className = `textfield-view`;

        /*   Appearance: AppearanceObject;
          HoverAppearance: AppearanceObject;
          ActiveAppearance: AppearanceObject;
          DisabledAppearance:AppearanceObject;
          FocusAppearance: AppearanceObject;
          BeforeAppearance:AppearanceObject; */

        const Appearance = this.props.control.Appearance.GetStyleObject();
        for (const [key, value] of Object.entries(Appearance)) {
            Appearance[key] = `${value} !important`
        }

        const HoverAppearance = this.props.control.HoverAppearance.GetStyleObject();
        for (const [key, value] of Object.entries(HoverAppearance)) {
            HoverAppearance[key] = `${value} !important`
        }

        const FocusAppearance = this.props.control.FocusAppearance.GetStyleObject();
        for (const [key, value] of Object.entries(FocusAppearance)) {
            FocusAppearance[key] = `${value} !important`
        }

        const styles = {
            [className]: control => ({
                ...Appearance,
                '&:hover': { ...HoverAppearance },
                '&:focus': { ...FocusAppearance }
            }),

        }

        const jssStyle = jss.createStyleSheet(styles, { link: true }).attach();
        //  this.props.elementProps['className'] = jssStyle.classes[className];
        this.jssStyle = jssStyle;
    }

    protected componentWillUnmount(obj: TextFieldClass) {
        this.jssStyle.detach();
        jss.removeStyleSheet(this.jssStyle);
    }

    public render() {
        const _className = `textfield-view`;
        this.jssStyle?.update(this.props.control);

        const children = this.props.children;

        let className = this.props.className;

        if (this.jssStyle) {
            className = this.jssStyle.classes[_className] + ' ' + this.props.className;
        }

        delete this.props['className'];
        delete this.props['control'];
        delete this.props['children'];

        return (
            <InputText {...this.props} className={className}></InputText>
        )
    }
}

const MyInputText = (params) => {

    const controller: UIFormController = bindFormController();
    // console.log(controller);


    if (params.obj.vp_FormField == null || controller == null) {
        return (<TextFieldProxy  control={params.obj} {...params}> </TextFieldProxy>)

    } else {

        controller.register(params.obj.vp_FormField.name, params.obj.vp_FormField.rules);

        // const context = useFormContext(); // retrieve all hook methods
        // console.log(context.getFieldState('name'))

        // console.log(context)

        params['value'] = controller.GetValue(params.obj.vp_FormField.name);

        params['onInput'] = (e) => controller.SetValue(params.obj.vp_FormField.name, e.target.value)

        const fieldState = controller.GetFieldState(params.obj.vp_FormField.name);
        if (fieldState.errors.length > 0) {
            delete params['height']; // we do not want 100% height
        }
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <TextFieldProxy  control={params.obj} {...params} />
                {fieldState.errors.map(error => (
                    <small className="p-error">{error}</small>
                ))}

            </div>
        )
    }
}
export class TextFieldRenderer extends ControlHtmlRenderer<TextFieldClass> {
    private inputRef: HTMLElement;

     public get UseFrameStyles(): boolean {
        return false;
    }

    public GenerateElement(obj: TextFieldClass): boolean {
        this.WriteStartFragment();
        return true;
    }
   

    public GenerateBody(obj: TextFieldClass): void {
      /*   const style = {};
        style['width'] = '100%';
        if (obj.vp_Multiline) {
            style['height'] = obj.Appearance.Height;
        } else {
           
        } */

        // style['border'] = 'solid 0px';
        // style['border-radius'] = obj.Appearance.BorderRadius;
        // style['background'] = obj.Appearance.Background;
        // style['background-color'] = obj.Appearance.BackgroundColor;
        // style['color'] = obj.Appearance.Color;
        // style['font-family'] = obj.Appearance.FontFamily;
        // style['font-size'] = obj.Appearance.FontSize;
        // style['font-weight'] = obj.Appearance.FontWeight;


        /*      style['padding'] = obj.InputAppearance.Padding;
             style['padding-left'] = obj.InputAppearance.PaddingLeft;
             style['padding-right'] = obj.InputAppearance.PaddingRight;
             style['padding-top'] = obj.InputAppearance.PaddingTop;
             style['padding-bottom'] = obj.InputAppearance.PaddingBottom; */

        const button = {
            rest: { scale: 1 },
            hover: { scale: 1.1 },
            pressed: { scale: 0.95 }
        };

        const tabIndex = 0; //obj.TabIndex;
        // we dont want to put container element
        obj.TabIndex = null;

        const attributes = {}
        if (obj.vp_Autofocus) {
            attributes['autofocus'] = true;
        }

        if (obj.vp_myLostFocus) {
            attributes['onfocusout'] = (e) => (obj.vp_myLostFocus(e));
        }


        if (obj.vp_Multiline) {
            this.WriteComponent(
                <InputTextarea 
                    tabIndex={tabIndex}
                    {...attributes}
                    value={obj.Value}
                    placeholder={obj.Placeholder}
                    onInput={(e) => obj.OnTextChange(e.target.value)}>
                </InputTextarea>
            );
        } else {

            this.WriteComponent(
                <MyInputText
                    obj={obj}
                    tabIndex={tabIndex}
                    {...attributes}
                    value={obj.Value}
                    placeholder={obj.Placeholder}
                    onInput={(e) => obj.OnTextChange(e.target.value)}>
                </MyInputText>


            );

        }
        /*  this.WriteAttrVal('id', 'test');
         this.WriteAttrVal('value', obj.Value);
         this.WriteAttrVal('placeholder', obj.Placeholder);
         this.WriteAttrVal('disabled', obj.Placeholder);
         this.WriteAttrVal('onInput', (e) => {
             if (is.function(obj.OnTextChange)) {
                 obj.OnTextChange(e.target.value)
             }
         });
         this.WriteAttrVal('onKeyPress', (e) => console.log(e));

         this.WriteStyleAttrVal('width', '100%');
         this.WriteStyleAttrVal('height', '100%');
         this.WriteStyleAttrVal('border', 'solid 0px');
         this.WriteStyleAttrVal('border-radius', obj.Appearance.BorderRadius);

         this.WriteStyleAttrVal('font-family', obj.Appearance.FontFamily);
         this.WriteStyleAttrVal('font-size', obj.Appearance.FontSize);
         this.WriteStyleAttrVal('font-weight', obj.Appearance.FontWeight);

         this.WriteStyleAttrVal('padding', obj.InputAppearance.Padding);
         this.WriteStyleAttrVal('padding-left', obj.InputAppearance.PaddingLeft);

         this.WriteAttrVal('ref', (e)=> {this.inputRef = e; e.focus();}); */
    }
}



export class TextFieldClass extends UIView {

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
    public vp_FormControl: Form_Control;

    public formControl(value: Form_Control): this {
        this.vp_FormControl = value;
        return this;
    }


    @ViewProperty()
    public Value: string;

    @ViewProperty()
    public Placeholder: string;

    @ViewProperty()
    public vp_Autofocus: boolean;

    @ViewProperty()
    public LeftIcon: string;

    @ViewProperty()
    public InputAppearance: AppearanceObject;

    @ViewProperty()
    public OnTextChange: Function;

    @ViewProperty() vp_Multiline: boolean;

    @ViewProperty() vp_myLostFocus: Function;

    public setController(controller: UIController): this {
        super.setController(controller);
        // Default renderer
        this.Renderer = new TextFieldRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });
        return this;
    }

    public constructor() {
        super();

        this.Appearance.Width = '100%';
        this.Appearance.Height = 'fit-content';
        //this.Appearance.Border = 'solid 1px gray';
        //this.Appearance.Overflow = 'hidden';

        this.InputAppearance = new AppearanceObject(this);

        this.vp_Autofocus = false;

        this.OnTextChange = () => { };
    }

    public OnAppearanceChanged(name: string): void {
        if (name === 'Padding') {
            this.InputAppearance.Padding = this.Appearance.Padding;
            this.Appearance.Padding = '';
        }
        if (name === 'PaddingLeft') {
            this.InputAppearance.PaddingLeft = this.Appearance.PaddingLeft;
        }
        if (name === 'PaddingRight') {
            this.InputAppearance.PaddingRight = this.Appearance.PaddingRight;
        }
    }

    public onTextChange(value: (text: string) => void): this {
        this.OnTextChange = value;
        return this;
    }

    public placeholder(value: string): this {
        this.Placeholder = value;
        return this;
    }
    public value(value: string): this {
        this.Value = value;
        return this;
    }
    public autofocus(value: boolean): this {
        this.vp_Autofocus = value;
        return this;
    }

    public multiline(value: boolean): this {
        this.vp_Multiline = value;
        return this;
    }

    public override onLostFocus(func: Function): this {
        this.vp_myLostFocus = func;
        return this;
    }


}


export function TextField(): TextFieldClass {
    return viewFunc(TextFieldClass, (controller, propertyBag) => {
        return new TextFieldClass().setController(controller).PropertyBag(propertyBag);
    });
}