import React from "react";
import { UIView } from "../UIView/UIView";
import { UIViewRenderer } from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import { useConfig } from "../../data";
import { ISelectProperties } from "./ISelectProperties";
import { SelectProtocol } from "./Select";



const RendererNotFound = () => {
    return (
        <div>Renderer Not Found</div>
    )
}

const RendererProxy = (control: UIView) => {
    const config = useConfig();

    if (control.vp_Renderer) {
        return control.vp_Renderer;
    } else if (config && config.rendererEngine) {
        const renderer: Function = config.rendererEngine[SelectProtocol];
        if (renderer) {
            return renderer;
        }
    }

    return RendererNotFound;

}

export class SelectShell extends UIView implements ISelectProperties {

    /** @internal */
    @ViewProperty() vp_Placeholder: string;

    public placeholder(value: string) {
        this.vp_Placeholder = value;
        return this;
    }

     /** @internal */
     @ViewProperty() vp_Value: any;

     public value(value: any) {
         this.vp_Value = value;
         return this;
     }

    /** @internal */
    @ViewProperty() vp_Options: any[];

    public options(value: any[]) {
        this.vp_Options = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_OnChange: (value: any, option: any) => void;

    public onChange(value: (value: any, option: any) => void) {
        this.vp_OnChange = value;
        return this;
    }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={RendererProxy(this) as any}></UIViewRenderer>)
    }
}
