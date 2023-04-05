import React from "react";
import { ValidateRule } from "../../UIFormController";
import { UIView } from "../UIView/UIView";
import {UIViewRenderer} from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import Search from "./SearchRenderer";
import SearchRenderer from "./SearchRenderer";


export class SearchClass extends UIView {
    /** @internal */
    @ViewProperty() vp_Value: string;

    public value(value: string) {
        this.vp_Value = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_OnChange: Function;

    public onChange(value: Function) {
        this.vp_OnChange = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Placeholder: string;

    public placeholder(value: string) {
        this.vp_Placeholder = value;
        return this;
    }

    
    public constructor() {
        super();

        this.Appearance.Width = '100%';
        this.Appearance.Height = 'fit-content';
        //this.Appearance.Border = 'solid 1px gray';
        this.Appearance.Overflow = 'hidden';


    }


    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={SearchRenderer}></UIViewRenderer>)
    }
}
