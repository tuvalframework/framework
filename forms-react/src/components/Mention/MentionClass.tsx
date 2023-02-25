import React from "react";
import { UIView } from "../UIView/UIView";
import {UIViewRenderer} from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import MentionRenderer from "./MentionRenderer";


export class MentionClass extends UIView {
    /** @internal */
    @ViewProperty() vp_Value: string;

    public value(value: string) {
        this.vp_Value = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Suggestions: object[];

    public suggestions(value: object[]) {
        this.vp_Suggestions = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Field: string;

    public field(value: string) {
        this.vp_Field = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Placeholder: string;

    public placeholder(value: string) {
        this.vp_Placeholder = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_OnChange: Function;

    public onChange(value: Function) {
        this.vp_OnChange = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_OnSearch: Function;

    public onSearch(value: Function) {
        this.vp_OnSearch = value;
        return this;
    }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={MentionRenderer}></UIViewRenderer>)
    }
}
