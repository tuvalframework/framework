import { int, is } from "@tuval/core";
import React from "react";
import { UIView } from "../../components/UIView/UIView";
import {UIViewRenderer} from "../../components/UIView/UIViewRenderer";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import { AlignmentType, cBottom, cBottomLeading, cBottomTrailing, cCenter, cLeading, cTop, cTopLeading, cTopTrailing, cTrailing } from "../../Constants";
import RecordContextRenderer from "./RecordContextRenderer";
import { RecordContextContentFunction } from "./UIRecordContext";

export class RecordContextClass<T> extends UIView {

    /** @internal */
    @ViewProperty() vp_Chidren: RecordContextContentFunction<T>;

    public children(value:RecordContextContentFunction<T>) {
       this.vp_Chidren = value;
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


    public constructor() {
        super();
    }

    public render() {
        return (<UIViewRenderer wrap={false}  control = {this} renderer={RecordContextRenderer}></UIViewRenderer>)
    }
}