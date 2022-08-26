import { StringBuilder } from '@tuval/core';
import { RadioButtonComponent } from '../../radiobutton/RadioButton';
import { Teact } from '../../Teact';
import { ControlHtmlRenderer } from '../HtmlRenderer/ControlHtmlRenderer';
import { TRadioButton } from './TRadioButton';
import { RadioButtonWrapperControl } from '../../radiobutton/RadioButtonWrapperControl';
import { TLabel } from '../TLabel';

export class TRadioButtonRenderer extends ControlHtmlRenderer<TRadioButton> {
    private radioButtonWrapper: RadioButtonWrapperControl;
    private label:TLabel;

    public get UseShadowDom(): boolean {
        return true;
    }
    public GenerateElement(obj: TRadioButton): boolean {
        this.WriteStartFragment();
        return true;
    }

    public GenerateAttributes(obj: TRadioButton): void {
        this.radioButtonWrapper = new RadioButtonWrapperControl();
    }


    public GenerateBody(obj: TRadioButton): void {
        const radioButtonComponent = (
            <RadioButtonComponent inputId={obj.Id + '_radioButton'} value={obj.Value} name={obj.Id + '_radioButton'} onChange={(e) => obj.Checked = (obj.Value === e.value)} checked={obj.Checked}></RadioButtonComponent>
        );
        this.WriteComponent(radioButtonComponent);

        this.WriteStartElement('label');
        this.WriteAttrVal('htmlFor', obj.Id + '_radioButton');
        this.WriteTextBody(obj.Text);
        this.WriteEndElement();
    }

}