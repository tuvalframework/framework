import React from "react";
import { UIView } from "../UIView/UIView";
import { UIViewRenderer } from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import { useConfig } from "../../data";
import { RangePickerProtocol } from "./RangePicker";
import { IRangePickerProperties, RangeValue } from "./IRangePickerProperties";




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
        const renderer: Function = config.rendererEngine[RangePickerProtocol];
        if (renderer) {
            return renderer;
        }
    }

    return RendererNotFound;

}

export class RangePickerShell extends UIView implements IRangePickerProperties {

    /** @internal */
    @ViewProperty() vp_OnChange: (values: RangeValue, formatString: [string, string]) => void;

    public onChange(value: (values: RangeValue, formatString: [string, string]) => void) {
        this.vp_OnChange = value;
        return this;
    }
  

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={RendererProxy(this) as any}></UIViewRenderer>)
    }
}
