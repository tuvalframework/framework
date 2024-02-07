import { int, is } from "@tuval/core";
import React from "react";
import { UIView } from "../UIView/UIView";
import { UIViewRenderer } from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import PopupButtonRenderer from "./PopupButtonRenderer";
import { DialogPosition } from "../MenuButton/MenuButtonRenderer";

export interface IDialogOffset {
    main: int;
    secondary: int
}
export class PopupButtonClass extends UIView {

      /** @internal */
      @ViewProperty() vp_Open: boolean;

      /** @internal */
      public open(value: boolean) {
          this.vp_Open = value;
          return this;
      }

    /** @internal */
    @ViewProperty() vp_View: UIView;

    /** @internal */
    public view(value: UIView) {
        this.vp_View = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_DialogOffset: IDialogOffset;

    public dialogOffset(value: IDialogOffset) {
        this.vp_DialogOffset = value;
        return this;
    }


    /** @internal */
    @ViewProperty() vp_DialogPosition: DialogPosition;

    public dialogPosition(value: DialogPosition) {
        this.vp_DialogPosition = value;
        return this;
    }

     /** @internal */
     @ViewProperty() vp_HideHandle: (handle: Function)=> void;

     public hideHandle(value:  (handle: Function)=> void) {
         this.vp_HideHandle = value;
         return this;
     }

    /** @internal */
    @ViewProperty() vp_Children: UIView[];

    public children(value: UIView[]) {
        if (is.nullOrUndefined(value)) {
            this.vp_Children = [];
        } else {
            this.vp_Children = value;
        }
        return this;
    }

     /** @internal */
     @ViewProperty() vp_OnDidHide: Function;

     public onDidHide(value: Function) {
       this.vp_OnDidHide = value;
         return this;
     }
    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={PopupButtonRenderer}></UIViewRenderer>)
    }
}
