import { ReactNode } from "react";
import { UIView } from "../UIView/UIView";
import { ViewProperty } from "../UIView/ViewProperty";
import { UIViewRenderer } from "../UIView/UIViewRenderer";
import React from "react";
import { ISegmentedProperties, SizeType } from "./ISegmentedProperties";

const RendererNotFound = () => {
    return (
        <div>Renderer Not Found</div>
    )
}
export class SegmentedClass extends UIView implements ISegmentedProperties {

    /** @internal */
    @ViewProperty() vp_DefaultValue: string | number;
    public defaultValue(value: string | number) {
        this.vp_DefaultValue = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Value: string | number;
    public value(value: string | number) {
        this.vp_Value = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Size: SizeType;
    public size(value: SizeType) {
        this.vp_Size = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Options: string[] | number[] | Array<{ label: (()=> UIView) | string, value: string, icon?: (()=>UIView) | string, disabled?: boolean, className?: string }>;

    public options(value: string[] | number[] | Array<{ label: (()=> UIView) | string, value: string, icon?: (()=>UIView) | string, disabled?: boolean, className?: string }>) {
        this.vp_Options = value;
        return this;
    }

      /** @internal */
      @ViewProperty() vp_OnChange:  (value: string | number) => void;
  
      public onChange(value:  (value: string | number) => void) {
          this.vp_OnChange = value;
          return this;
      }


    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={this.vp_Renderer || RendererNotFound}></UIViewRenderer>)
    }
}
