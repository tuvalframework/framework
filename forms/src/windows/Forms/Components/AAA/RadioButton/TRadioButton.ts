import { Control } from '../Control';
import { TRadioButtonRenderer } from './TRadioButtonRenderer';
import { Guid } from '@tuval/core';
import { TFlexContainer } from '../Panel';
import { RadioButtonWrapperControl } from '../../radiobutton/RadioButtonWrapperControl';
import { TLabel } from '../TLabel';

export class TRadioButton extends TFlexContainer {

    private radioButtonWrapper: RadioButtonWrapperControl;
    private label: TLabel;

    /** @internal */
    Value: string = Guid.NewGuid().ToString();

    public get Checked(): boolean {
        return this.radioButtonWrapper.Checked;
    }
    public set Checked(value: boolean) {
        this.radioButtonWrapper.Checked = value;
    }

    public get Text(): string {
        return this.label.Text;
    }
    public set Text(value: string) {
        this.label.Text = value;
    }

    public constructor() {
        super();
        this.Appearance.AlignItems = 'center';

        this.radioButtonWrapper = new RadioButtonWrapperControl();
        this.radioButtonWrapper.InputId = this.Id + '_radioButton';
        this.radioButtonWrapper.Value = this.Value;
        this.radioButtonWrapper.Name = this.Id + '_radioButton';
        this.radioButtonWrapper.OnChange = (e) => {
            console.log(this.Value, e.value);
            this.Checked = (this.Value === e.value);
        }

        this.label = new TLabel();
        this.label.HtmlFor = this.Id + '_radioButton';
        this.label.Appearance.MarginLeft = '5px';

        this.Controls.Add(this.radioButtonWrapper);
        this.Controls.Add(this.label);
    }
}