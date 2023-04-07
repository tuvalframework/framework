import React from "react";
import { ValidateRule } from "../../UIFormController";
import { UIView } from "../UIView/UIView";
import {UIViewRenderer} from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import { FieldSettingsModel } from "./FieldSettingsModel";
import PrimeRenderer from "./Renderers/PrimeRenderer";
import VibeRenderer from "./Renderers/VibeRenderer";

export class DropdownClass extends UIView {

     /** @internal */
     @ViewProperty() vp_Label: string;

     public label(value: string) {
         this.vp_Label = value;
         return this;
     }

     /** @internal */
     @ViewProperty() vp_Resource: string;

     public resource(value: string) {
         this.vp_Resource = value;
         return this;
     }

      /** @internal */
      @ViewProperty() vp_Filter: any;

      public filter(value: any) {
          this.vp_Filter = value;
          return this;
      }

     /** @internal */
     @ViewProperty() vp_FloatLabel: boolean;

     public floatlabel(value: boolean) {
         this.vp_FloatLabel = value;
         return this;
     }

      /** @internal */
      @ViewProperty() vp_PlaceHolder: string;

      public placeHolder(value: string) {
          this.vp_PlaceHolder = value;
          return this;
      }

       /** @internal */
       @ViewProperty() vp_AllowFiltering: boolean;

       public allowFiltering(value: boolean) {
           this.vp_AllowFiltering = value;
           return this;
       }


    @ViewProperty() vp_itemTemplate: (option: any) => UIView ;
    public itemTemplate(value: (option: any) => UIView ): this {
        this.vp_itemTemplate = value;
        return this;
    }

    @ViewProperty() vp_emptyTemplate: () => UIView ;
    public emptyTemplate(value: () => UIView ): this {
        this.vp_emptyTemplate = value;
        return this;
    }


    @ViewProperty() vp_selectedItemTemplate: (option: any) => UIView ;
    public selectedItemTemplate(value: (option: any) => UIView ): this {
        this.vp_selectedItemTemplate = value;
        return this;
    }

    @ViewProperty() vp_fields: FieldSettingsModel;
    public fields(value: FieldSettingsModel): this {
        this.vp_fields = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Value: string;

    public value(value: string) {
        this.vp_Value = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Model: object[];

    public model(value: object[]) {
        this.vp_Model = value;
        return this;
    }
    public dataSource(value: object[]) {
        return this.model(value);
    }

     /** @internal */
     @ViewProperty() vp_Placeholder: string;

     public placeholder(value: string) {
         this.vp_Placeholder = value;
         return this;
     }

      /** @internal */
    @ViewProperty() vp_FormField: { name: string, rules: ValidateRule[] };

    public formField(name: string, rules: ValidateRule[]): this {
        this.vp_FormField = {
            name: name,
            rules: rules
        };
        return this;
    }

     /** @internal */
     @ViewProperty() vp_OnChange: Function;

     public onChange(value: Function) {
         this.vp_OnChange = value;
         return this;
     }
    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={PrimeRenderer}></UIViewRenderer>)
    }
}
