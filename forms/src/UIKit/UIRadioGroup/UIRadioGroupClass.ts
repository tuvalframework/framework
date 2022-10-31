import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { RadioGroupRenderer } from "./UIRadioGroupRenderer";

export interface IRadioButton {
    value: string;
    label: string;
}
export class RadioGroupClass extends UIView {

    @ViewProperty() vp_RadioButtons: IRadioButton[];
    public radioButtons(value:IRadioButton[]): this {
        this.vp_RadioButtons = value;
        return this;
    }

   

    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new RadioGroupRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }

    public constructor() {
        super();
    }

}