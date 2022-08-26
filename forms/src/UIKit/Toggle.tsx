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



export class ToggleRenderer extends ControlHtmlRenderer<ToggleClass> {
    private inputRef: HTMLElement;

    public get UseShadowDom(): boolean {
        return true;
    }

    public OnStyleCreating(obj: ToggleClass, sb: StringBuilder): void {
        sb.AppendLine(require('./Components/inputswitch/InputSwitch.css'));
        //sb.AppendLine(require('./Components/inputswitch/Theme.css'));
        sb.AppendLine(`
        .p-inputswitch {
            width: 3rem;
            height: 1.75rem;
        }

        .p-inputswitch .p-inputswitch-slider {
            background: #ced4da;
            transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
            border-radius: 30px;
        }

        .p-inputswitch .p-inputswitch-slider:before {
            background: #ffffff;
            width: 1.25rem;
            height: 1.25rem;
            left: 0.25rem;
            margin-top: -0.625rem;
            border-radius: 50%;
            transition-duration: 0.2s;
        }

        .p-inputswitch.p-inputswitch-checked .p-inputswitch-slider:before {
            transform: translateX(1.25rem);
        }

        .p-inputswitch.p-focus .p-inputswitch-slider {
            outline: 0 none;
            outline-offset: 0;
            box-shadow: 0 0 0 0.2rem #C7D2FE;
        }

        .p-inputswitch:not(.p-disabled):hover .p-inputswitch-slider {
            background: #b6bfc8;
        }

        .p-inputswitch.p-inputswitch-checked .p-inputswitch-slider {
            background: ${obj.Appearance.Background};
        }

        .p-inputswitch.p-inputswitch-checked .p-inputswitch-slider:before {
            background: #ffffff;
        }

        .p-inputswitch.p-inputswitch-checked:not(.p-disabled):hover .p-inputswitch-slider {
            background: ${obj.Appearance.Background};
        }

        .p-inputswitch.p-invalid {
            border-color: #e24c4c;
        }
        `);

        obj.Appearance.Background = '';
    }

    public GenerateElement(obj: ToggleClass): boolean {
        this.WriteStartFragment();
        return true;
    }
    protected OnInputDidMount(obj: ToggleClass, ref: HTMLElement): void {
        /*    if (obj.Autofocus) {
               this.Ref.elementRef.current.focus();
           } */

        //   ref.focus();
    }

    protected OnShadowDomDidMount(ref: any, obj: ToggleClass): void {

    }

    public GenerateBody(obj: ToggleClass): void {
        /*  const style = {};
         style['width'] = '100%';
         style['height'] = '100%';
         style['border'] = 'solid 0px';
         style['border-radius'] = obj.Appearance.BorderRadius;
         style['background-color'] = obj.Appearance.BackgroundColor;
         style['font-family'] = obj.Appearance.FontFamily;
         style['font-size'] = obj.Appearance.FontSize;
         style['font-weight'] = obj.Appearance.FontWeight;
         style['padding'] = obj.InputAppearance.Padding;
         style['padding-left'] = obj.InputAppearance.PaddingLeft;

         const button = {
             rest: { scale: 1 },
             hover: { scale: 1.1 },
             pressed: { scale: 0.95 }
         };

         const tabIndex = obj.TabIndex; */
        // we dont want to put container element
        //obj.TabIndex = null;

        this.WriteComponent(
            <InputSwitch checked={obj.vp_checked} onChange={(e) => { obj.vp_onChange(e.value) }} >
            </InputSwitch >
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

export class ToggleClass extends UIView {

    @ViewProperty() vp_checked: boolean;
    @ViewProperty() vp_onChange: Function;

    public setController(controller: UIController): this {
        super.setController(controller);
        // Default renderer
        this.Renderer = new ToggleRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });
        return this;
    }

    public constructor() {
        super();

        // this.Appearance.Width = '100%';
        // this.Appearance.Height = 'fit-content';
        //this.Appearance.Border = 'solid 1px gray';
        this.Appearance.Overflow = 'hidden';
        this.Appearance.Padding = '4px';



        this.vp_onChange = () => { };
    }

    public OnAppearanceChanged(name: string): void {

    }

    public onToggleChange(value: (value: boolean) => void): this {
        this.vp_onChange = value;
        return this;
    }

    public checked(value: boolean): this {
        this.vp_checked = value;
        return this;
    }
}


export function Toggle(): ToggleClass {
    return viewFunc(ToggleClass, (controller, propertyBag) => {
        return new ToggleClass().setController(controller).PropertyBag(propertyBag);
    });
}