import React from "react";
import { UIView } from "../../components/UIView/UIView";
import {UIViewRenderer} from "../../components/UIView/UIViewRenderer";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import UpdateContextRenderer from "./UpdateContextRenderer";
import CreateContextRenderer from "./UpdateContextRenderer";

export class UpdateContextClass extends UIView {

    @ViewProperty() vp_Children:(update?: Function,data?: any, isLoading?: boolean, isSuccess?: boolean) => UIView;
    public children(value: (update?: Function,data?: any, isLoading?: boolean, isSuccess?: boolean) => UIView): this {
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
        return (<UIViewRenderer wrap={false}  control = {this} renderer={UpdateContextRenderer}></UIViewRenderer>)
    }
}