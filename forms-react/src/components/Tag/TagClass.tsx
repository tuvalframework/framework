import React from "react";
import { UIView } from "../UIView/UIView";
import { UIViewRenderer } from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import TagRenderer from "./TagRenderer";


export enum TagSeverity {
    Success = "success",
    Warning = "warning",
    Info = "info",
    Danger = "danger"
}



export class TagClass extends UIView {

    /** @internal */
    @ViewProperty() vp_Rounded: boolean;

    public rounded(value: boolean) {
        this.vp_Rounded = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Severity: TagSeverity;

    public severity(value: TagSeverity) {
        this.vp_Severity = value;
        return this;
    }


    /** @internal */
    @ViewProperty() vp_Value: string;

    public value(value: string) {
        this.vp_Value = value;
        return this;
    }



    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={TagRenderer}></UIViewRenderer>)
    }
}
