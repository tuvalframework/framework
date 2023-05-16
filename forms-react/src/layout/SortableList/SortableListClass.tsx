import React from "react";
import { UIView } from "../../components/UIView/UIView";
import { UIViewRenderer } from "../../components/UIView/UIViewRenderer";
import SortableListRenderer from "./SortableListRenderer";
import { ViewProperty } from "../../components/UIView/ViewProperty";

export class SortableListClass extends UIView {

     /** @internal */
     @ViewProperty() vp_Items: any[];

     public items(value: any[]) {
         this.vp_Items = value;
         return this;
     }
     /** @internal */
     @ViewProperty() vp_RenderItem: (item: any)=> UIView;

     public renderItem(value: (item: any)=> UIView) {
         this.vp_RenderItem = value;
         return this;
     }

      /** @internal */
      @ViewProperty() vp_OnChange: Function;

      public onChange(value: Function) {
          this.vp_OnChange = value;
          return this;
      }

    public constructor() {
        super();
        this.Appearance.FlexGrow = '1';
    }
    public render() {
         return (<UIViewRenderer wrap={true}  control = {this} renderer={SortableListRenderer}></UIViewRenderer>)
    }
}