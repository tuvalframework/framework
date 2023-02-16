import React from "react";
import { UIView } from "../UIView/UIView";
import UIViewRenderer from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import ButtonRenderer from "./ButtonRenderer";



export type VariantType = 'contained' | 'text' | 'outlined';
export type ColorType = 'primary' | 'secondary' | 'danger' | 'success';

export interface IButtonProps {
    variant?: VariantType;
    color?: ColorType;
}

export class ButtonClass extends UIView {

   /** @internal */
   @ViewProperty() vp_Label: string;
   public label(value: string): this {
       this.vp_Label = value;
       return this;
   }

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

    /** @internal */
    @ViewProperty() vp_Children: UIView[];
    public children(...value: UIView[]): this {
        this.vp_Children = value;
        return this;
    }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={ButtonRenderer}></UIViewRenderer>)
    }
}
