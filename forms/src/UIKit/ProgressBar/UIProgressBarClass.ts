import { ILabel } from "../../windows/Forms/ILabel";
import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { UIProgressBarRenderer } from "./UIProgressBarRenderer";
import { int } from '@tuval/core';

export class UIProgressBarClass extends UIView implements ILabel {

    /** @internal */
    @ViewProperty() vp_value: int;
    public value(value: int): this {
        this.vp_value = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_LabelOffset: int;
    public labelOffset(value: int): this {
        this.vp_LabelOffset = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_ValueTemplate: (option: any) => UIView | Function;
    public valueTemplate(value: (option: any) => UIView | Function): this {
        this.vp_ValueTemplate = value;
        return this;
    }

    public setController(controller: UIController): this {
        super.setController(controller);

        this.Renderer = new UIProgressBarRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }
    public constructor() {
        super();

        this.Appearance.Width = '100%';
        this.Appearance.Height = '20px';
    }

}
