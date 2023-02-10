import React from "react";
import { UIViewClass } from "../../UIView/UIViewClass";
import UIViewRenderer from "../../UIView/UIViewRenderer";
import { ViewProperty } from "../../UIView/ViewProperty";
import ListItemRenderer from "./ListItemRenderer";

export class ListItemClass extends UIViewClass {

    /** @internal */
    @ViewProperty() vp_Text: string;

    public text(value: string) {
        this.vp_Text = value;
        return this;
    }

      /** @internal */
      @ViewProperty() vp_OnClick: Function;

      public onClick(value: Function) {
          this.vp_OnClick = value;
          return this;
      }


    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={ListItemRenderer}></UIViewRenderer>)
    }
}
