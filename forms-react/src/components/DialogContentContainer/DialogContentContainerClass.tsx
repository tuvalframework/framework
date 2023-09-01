import React from "react";
import { UIView } from "../UIView/UIView";
import { ViewProperty } from "../UIView/ViewProperty";
import { UIViewRenderer } from "../UIView/UIViewRenderer";
import { DefaultRenderer } from "./DefaultRenderer";
import { Fragment } from "../Fragment";



const RendererNotFound = () => {
    return (
        <div>Renderer Not Found</div>
    )
}
export class DialogContentContainerClass extends UIView /* implements IDialogContentContainerProperties */ {

    /** @internal */
    @ViewProperty() vp_DialogContent: () => UIView;

    public dialogContent(value: () => UIView) {
        this.vp_DialogContent = value;
        return this;
    }

    public constructor() {
        super();
        this.dialogContent(() => Fragment())
        this.renderer(DefaultRenderer);
    }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={this.vp_Renderer || RendererNotFound}></UIViewRenderer>)
    }
}
