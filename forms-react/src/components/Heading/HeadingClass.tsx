import React from "react";
import { UIView } from "../UIView/UIView";
import { UIViewRenderer } from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import HeadingRenderer from "./HeadingRenderer";
import { int } from "@tuval/core";


export enum HeadingTypes {
    h1 = "h1",
    h2 = "h2",
    h3 = "h3",
    h4 = "h4",
    h5 = "h5",
    h6 = "h6"
}

export  enum HeadingSizes {
     SMALL = "small",
     MEDIUM = "medium",
     LARGE = "large",
     XXS = "xxs",
     XS = "xs"
};

export class HeadingClass extends UIView {
    /** @internal */
    @ViewProperty() vp_Value: string;

    public value(value: string) {
        this.vp_Value = value;
        return this;
    }

     /** @internal */
     @ViewProperty() vp_Ellipsis: boolean;

     public ellipsis(value: boolean) {
         this.vp_Ellipsis = value;
         return this;
     }

      /** @internal */
      @ViewProperty() vp_EllipsisMaxLines: int;

      public ellipsisMaxLines(value: int) {
          this.vp_EllipsisMaxLines = value;
          return this;
      }

    /** @internal */
    @ViewProperty() vp_Type: HeadingTypes;

    public type(value: HeadingTypes) {
        this.vp_Type = value;
        return this;
    }

    public h1() {
        this.vp_Type = HeadingTypes.h1;
        return this;
    }
    public h2() {
        this.vp_Type = HeadingTypes.h2;
        return this;
    }
    public h3() {
        this.vp_Type = HeadingTypes.h3;
        return this;
    }
    public h4() {
        this.vp_Type = HeadingTypes.h4;
        return this;
    }
    public h5() {
        this.vp_Type = HeadingTypes.h5;
        return this;
    }
    public h6() {
        this.vp_Type = HeadingTypes.h6;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Size: HeadingSizes;

    public size(value: HeadingSizes) {
        this.vp_Size = value;
        return this;
    }

    public xxsmall() {
        this.vp_Size = HeadingSizes.XXS;
        return this;
    }


    public xsmall() {
        this.vp_Size = HeadingSizes.XS;
        return this;
    }

    public small() {
        this.vp_Size = HeadingSizes.SMALL;
        return this;
    }

    public medium() {
        this.vp_Size = HeadingSizes.MEDIUM;
        return this;
    }

    public large() {
        this.vp_Size = HeadingSizes.LARGE;
        return this;
    }
    
    public constructor() {
        super();
        this.Appearance.WebkitFontSmoothing = 'antialiased';
       // this.Appearance.LineHeight = '1';
       // this.Appearance.Display = 'flex';
       // this.Appearance.AlignItems = 'center';

    }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={HeadingRenderer}></UIViewRenderer>)
    }
}
