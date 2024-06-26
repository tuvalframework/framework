import React from "react";

import ButtonRenderer from "./WidgetRenderer";
import { UIView } from "../../components/UIView/UIView";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import { UIViewRenderer } from "../../components/UIView/UIViewRenderer";
import WidgetRenderer from "./WidgetRenderer";



export class WidgetClass extends UIView {

     /** @internal */
   @ViewProperty() vp_AlwaysNew: boolean;
   public alwaysNew(value: boolean): this {
       this.vp_AlwaysNew = value;
       return this;
   }
   /** @internal */
   @ViewProperty() vp_Config: any;
   public config(value: any): this {
       this.vp_Config = value;
       return this;
   }



    /** @internal */
    @ViewProperty() vp_Loading: boolean;
    public loading(value: boolean): this {
        this.vp_Loading = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Data: any;
    public data(value: any): this {
        this.vp_Data = value;
        return this;
    }

     /** @internal */
     @ViewProperty() vp_qn: string;
     public qn(value: any): this {
         this.vp_qn = value;
         return this;
     }

     /** @internal */
     @ViewProperty() vp_type: string;
     public type(value: string): this {
         this.vp_type = value;
         return this;
     }


     

    public constructor() {
        super();
      
    }
    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={WidgetRenderer}></UIViewRenderer>)
    }
}
