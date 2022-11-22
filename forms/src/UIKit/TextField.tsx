import { AppearanceObject } from '../windows/Forms/Components/AAA/AppearanceObject';
import { UIView, ViewProperty } from "./UIView";
import { ITextBox } from '../windows/Forms/Components/AAA/TextBox/ITextBox';
import { ControlHtmlRenderer } from "../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { StringBuilder, int, is, classNames } from "@tuval/core";
import { InputText } from './TextField/InputText';
import { Teact } from "../windows/Forms/Components/Teact";
import { UIController } from './UIController';
import { viewFunc } from './getView';
import { motion } from '../motion';
import { InputTextarea } from './Components/inputtextarea/InputTextarea';
import { Form_Control, Form_Controller, useFormContext } from '../hook-form';
import { Fragment } from '../preact';



export class TextFieldRenderer extends ControlHtmlRenderer<TextFieldClass> {
    private inputRef: HTMLElement;

    public get UseShadowDom(): boolean {
        return true;
    }

    public OnStyleCreating(obj: TextFieldClass, sb: StringBuilder): void {
        sb.AppendLine(`
        input:focus {
            outline: none;
          }

         textarea:focus {
            outline: none;
          }

          ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
            color: #C0C0C0;
            opacity: 1; /* Firefox */
            }

            :-ms-input-placeholder { /* Internet Explorer 10-11 */
            color: #C0C0C0;
            }

            ::-ms-input-placeholder { /* Microsoft Edge */
            color: #C0C0C0;
            }
        `);

        /*      obj.Appearance.Padding = '';
             obj.Appearance.PaddingLeft = '';
             obj.Appearance.PaddingRight = '';
             obj.Appearance.PaddingTop = '';
             obj.Appearance.PaddingBottom = ''; */
    }

    public GenerateElement(obj: TextFieldClass): boolean {
        this.WriteStartFragment();
        return true;
    }
    protected OnInputDidMount(obj: TextFieldClass, ref: HTMLElement): void {
        /*    if (obj.Autofocus) {
               this.Ref.elementRef.current.focus();
           } */

        //   ref.focus();
    }

    protected OnShadowDomDidMount(ref: any, obj: TextFieldClass): void {

    }

    public GenerateBody(obj: TextFieldClass): void {
        const style = {};
        style['width'] = '100%';
        if (obj.vp_Multiline) {
            style['height'] = obj.Appearance.Height;
        } else {
            style['height'] = '100%';
        }

        style['border'] = 'solid 0px';
        style['border-radius'] = obj.Appearance.BorderRadius;
        style['background'] = obj.Appearance.Background;
        style['background-color'] = obj.Appearance.BackgroundColor;
        style['color'] = obj.Appearance.Color;
        style['font-family'] = obj.Appearance.FontFamily;
        style['font-size'] = obj.Appearance.FontSize;
        style['font-weight'] = obj.Appearance.FontWeight;
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

        const tabIndex = obj.TabIndex;
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
                <InputTextarea style={style}
                    tabIndex={tabIndex}
                    {...attributes}
                    value={obj.Value}
                    placeholder={obj.Placeholder}
                    onComponentDidMount={(ref) => this.OnInputDidMount(obj, ref)}
                    onInput={(e) => obj.OnTextChange(e.target.value)}>
                </InputTextarea>
            );
        } else {

            const MyInputText = (params) => {
                if (useFormContext() == null) {
                    return (<InputText {...params}> </InputText>)

                } else {

                    const context = useFormContext(); // retrieve all hook methods
                    console.log(context.getFieldState('name'))

                    console.log(context)

                    return (
                        <span className="p-float-label">
                            <Form_Controller name="name" control={context.control} rules={{ required: 'Name is required.' }} render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} {...params} autoFocus className={classNames({ 'p-invalid': fieldState.invalid } as any)} />
                            )} />
                            <label htmlFor="name" className={classNames({ 'p-error': context.formState.errors.name } as any)}>Name*</label>
                        </span>




                    )


                }
            }
            debugger

            this.WriteComponent(
                <MyInputText
                    style={style}
                    tabIndex={tabIndex}
                    {...attributes}
                    value={obj.Value}
                    placeholder={obj.Placeholder}
                    onComponentDidMount={(ref) => this.OnInputDidMount(obj, ref)}
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
        this.Appearance.Overflow = 'hidden';

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