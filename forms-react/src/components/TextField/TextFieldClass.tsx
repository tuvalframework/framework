import React from "react";
import { ValidateRule } from "../../UIFormController";
import { UIView } from "../UIView/UIView";
import UIViewRenderer from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import TextFieldRenderer from "./TextFieldRenderer";



export class TextFieldClass extends UIView {
    /** @internal */
    @ViewProperty() vp_Value: string;

    public value(value: string) {
        this.vp_Value = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Placeholder: string;

    public placeholder(value: string) {
        this.vp_Placeholder = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_FormField: { name: string, rules: ValidateRule[] };

    public formField(name: string, rules: ValidateRule[]): this {
        this.vp_FormField = {
            name: name,
            rules: rules
        };
        return this;
    }

     /** @internal */
     @ViewProperty() vp_Multiline: boolean;

     public multiline(value: boolean): this {
         this.vp_Multiline = value;
         return this;
     }

        /** @internal */
        @ViewProperty() vp_Autofocus: boolean;

        public autofocus(value: boolean): this {
            this.vp_Autofocus = value;
            return this;
        }

    /** @internal */
    @ViewProperty() vp_OnChange: Function;

    public onChange(value: Function) {
        this.vp_OnChange = value;
        return this;
    }
    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={TextFieldRenderer}></UIViewRenderer>)
    }
}
