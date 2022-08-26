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
import { Password } from './Components/password/Password';



export class SecureFieldRenderer extends ControlHtmlRenderer<SecureFieldClass> {
    private inputRef: HTMLElement;

    public get UseShadowDom(): boolean {
        return true;
    }
    public OnStyleCreating(obj: SecureFieldClass, sb: StringBuilder): void {
        sb.AppendLine(require('./Components/password/Password.css'));
        sb.AppendLine(`
         input {
            width: 100%;
            border: none;
            font-size:${obj.Appearance.FontSize}
        }

        input:focus {
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
    }

    public GenerateElement(obj: SecureFieldClass): boolean {
        this.WriteStartFragment();
        return true;
    }
    protected OnInputDidMount(obj: SecureFieldClass, ref: HTMLElement): void {
        /*    if (obj.Autofocus) {
               this.Ref.elementRef.current.focus();
           } */

        //   ref.focus();
    }

    protected OnShadowDomDidMount(ref: any, obj: SecureFieldClass): void {

    }

    public GenerateBody(obj: SecureFieldClass): void {
        const style = {};
        style['width'] = '100%';
        style['height'] = '100%';
        style['border'] = 'solid 0px';
        style['border-radius'] = obj.Appearance.BorderRadius;
        style['background-color'] = obj.Appearance.BackgroundColor;
        style['font-family'] = obj.Appearance.FontFamily;
        style['font-size'] = obj.Appearance.FontSize;
        style['font-weight'] = obj.Appearance.FontWeight;
     /*    style['padding'] = obj.InputAppearance.Padding;
        style['padding-left'] = obj.InputAppearance.PaddingLeft; */

        const button = {
            rest: { scale: 1 },
            hover: { scale: 1.1 },
            pressed: { scale: 0.95 }
        };

        const tabIndex = obj.TabIndex;
        // we dont want to put container element
        obj.TabIndex = null;

        this.WriteComponent(
            <Password style={style} tabIndex={tabIndex}
                value={obj.Value}
                placeholder={obj.Placeholder}
                onComponentDidMount={(ref) => this.OnInputDidMount(obj, ref)}
                onInput={(e) => obj.OnTextChange(e.target.value)}>
            </Password>
        );
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



export class SecureFieldClass extends UIView {
    @ViewProperty()
    public Value: string;

    @ViewProperty()
    public Placeholder: string;

    @ViewProperty()
    public Autofocus: boolean;

    @ViewProperty()
    public LeftIcon: string;

    @ViewProperty()
    public InputAppearance: AppearanceObject;

    @ViewProperty()
    public OnTextChange: Function;

    public setController(controller: UIController): this {
        super.setController(controller);
        // Default renderer
        this.Renderer = new SecureFieldRenderer({
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
}


export function SecureField(): SecureFieldClass {
    return viewFunc(SecureFieldClass, (controller, propertyBag) => {
        return new SecureFieldClass().setController(controller).PropertyBag(propertyBag);
    });
}