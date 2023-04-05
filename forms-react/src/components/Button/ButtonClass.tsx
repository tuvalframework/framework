import React from "react";
import { UIView } from "../UIView/UIView";
import {UIViewRenderer} from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import ButtonRenderer from "./ButtonRenderer";



export  enum ButtonType {
    PRIMARY = "primary",
    SECONDARY = "secondary",
    TERTIARY = "tertiary"
}

export  enum ButtonSize {
     SMALL= "small",
     MEDIUM= "medium",
     LARGE= "large",
     XXS= "xxs",
     XS= "xs"
}

export type ColorType = 'primary' | 'secondary' | 'danger' | 'success';



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
        return (<UIViewRenderer wrap={false} control={this} renderer={ButtonRenderer}></UIViewRenderer>)
    }
}
