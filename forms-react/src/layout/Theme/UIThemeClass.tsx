import React from "react";
import { UIView } from "../../components/UIView/UIView";
import { UIViewRenderer } from "../../components/UIView/UIViewRenderer";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import { Theme } from "../../thema-system";
import { BiosThemeRenderer, UIThemeRenderer } from "./UIThemeRenderer";


export class UIThemeClass extends UIView {

     /** @internal */
     @ViewProperty() vp_Theme: Theme;

     public theme(value: Theme) {
         this.vp_Theme = value;
         return this;
     }

     /** @internal */
     @ViewProperty() vp_Chidren: UIView[];

     public children(...value: UIView[]) {
         this.vp_Chidren = value;
         return this;
     }
     
    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={UIThemeRenderer}></UIViewRenderer>)
    }
}

export class BiosThemeClass extends UIView {

    /** @internal */
    @ViewProperty() vp_Theme: Theme;

    public theme(value: Theme) {
        this.vp_Theme = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_ContentFunc: () => UIView;

    public contentFunc(value: () => UIView) {
        this.vp_ContentFunc = value;
        return this;
    }
    
   public render() {
       return (<UIViewRenderer wrap={false} control={this} renderer={BiosThemeRenderer}></UIViewRenderer>)
   }
}
