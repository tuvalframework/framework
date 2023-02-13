import React from "react";
import { UIViewClass } from "../../components/UIView/UIViewClass";
import UIViewRenderer from "../../components/UIView/UIViewRenderer";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import CreateContextRenderer from "./CreateContextRenderer";

export class CreateContextClass extends UIViewClass {

    @ViewProperty() vp_Children:(create?: Function, isLoading?: boolean, isSuccess?: boolean) => UIViewClass;
    public children(value: (create?: Function, isLoading?: boolean, isSuccess?: boolean) => UIViewClass): this {
        this.vp_Children = value;
        return this;
    }

    @ViewProperty() vp_Resource:string;
    public resource(value: string): this {
        this.vp_Resource = value;
        return this;
    }


    @ViewProperty() vp_Filter:any;
    public filter(value: any): this {
        this.vp_Filter = value;
        return this;
    }

    @ViewProperty() vp_OnSuccess:Function;
    public onSuccess(value: Function): this {
        this.vp_OnSuccess = value;
        return this;
    }

    @ViewProperty() vp_OnError:Function;
    public onError(value: Function): this {
        this.vp_OnError = value;
        return this;
    }

    public constructor() {
        super();
    }

    public render() {
        return (<UIViewRenderer wrap={true}  control = {this} renderer={CreateContextRenderer}></UIViewRenderer>)
    }
}