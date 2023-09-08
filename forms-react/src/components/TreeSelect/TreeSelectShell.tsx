import React from "react";
import { UIView } from "../UIView/UIView";
import { UIViewRenderer } from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import { ITreeSelectProperies } from "./ITreeSelectProperies";
import { useConfig } from "../../data";
import { TreeSelectProtocol } from "./TreeSelect";


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
        const renderer: Function = config.rendererEngine[TreeSelectProtocol];
        if (renderer) {
            return renderer;
        }
    }

    return RendererNotFound;

}

export class TreeSelectShell extends UIView implements ITreeSelectProperies {

    /** @internal */
    @ViewProperty() vp_TreeData: any[];

    public treeData(value: any[]) {
        this.vp_TreeData = value;
        return this;
    }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={RendererProxy(this) as any}></UIViewRenderer>)
    }
}
