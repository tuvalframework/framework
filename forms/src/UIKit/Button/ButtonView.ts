import { ILabel } from "../../windows/Forms/ILabel";
import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { int } from '@tuval/core';
import { ButtonViewRenderer } from "./ButtonViewRenderer";



export type VariantType = 'contained' | 'text' | 'outlined';
export type ColorType = 'primary' | 'secondary' | 'danger' | 'success';

export interface IButtonProps {
    variant?: VariantType;
    color?: ColorType;
}

export class ButtonView extends UIView implements ILabel {

    /** @internal */
    @ViewProperty() vp_jssStyle: any;

    /** @internal */
    @ViewProperty() vp_Loading: boolean;
    public loading(value: boolean): this {
        this.vp_Loading = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Variant: VariantType;
    public variant(value: VariantType): this {
        this.vp_Variant = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Color: ColorType;
    public color(value: ColorType): this {
        this.vp_Color = value;
        return this;
    }

    public setController(controller: UIController): this {
        super.setController(controller);

        this.Renderer = new ButtonViewRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        this.width('fit-content');
    
        return this;
    }
    public constructor() {
        super();
    }

}
