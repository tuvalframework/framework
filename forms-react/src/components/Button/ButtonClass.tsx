import React from "react";
import { UIView } from "../UIView/UIView";
import {UIViewRenderer} from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import ButtonRenderer from "./ButtonRenderer";
import { ButtonSize, ButtonType, ColorType, IButtonProperties } from "./IButtonProperties";

export class ButtonClass extends UIView implements IButtonProperties {

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
    @ViewProperty() vp_Kind: ButtonType;
    public kind(value: ButtonType): this {
        this.vp_Kind = value;
        return this;
    }

     /** @internal */
     @ViewProperty() vp_Size: ButtonSize;
     public size(value: ButtonSize): this {
         this.vp_Size = value;
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

    public constructor() {
        super();
        this.kind(ButtonType.PRIMARY);
        this.size(ButtonSize.MEDIUM);
    }
    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={this.vp_Renderer || ButtonRenderer}></UIViewRenderer>)
    }
}
