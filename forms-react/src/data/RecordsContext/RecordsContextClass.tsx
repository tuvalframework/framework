import { int, is } from "@tuval/core";
import React from "react";
import { UIView } from "../../components/UIView/UIView";
import UIViewRenderer from "../../components/UIView/UIViewRenderer";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import { AlignmentType, cBottom, cBottomLeading, cBottomTrailing, cCenter, cLeading, cTop, cTopLeading, cTopTrailing, cTrailing } from "../../Constants";
import RecordContextRenderer from "./RecordCsontextRenderer";
import { RecordsContextContentFunction } from "./UIRecordsContext";

export class RecordsContextClass<T> extends UIView {

     
    @ViewProperty() vp_Content:RecordsContextContentFunction;
    public _content(value: RecordsContextContentFunction): this {
        this.vp_Content = value;
        return this;
    }

    @ViewProperty() vp_Resource:string;
    public resource(value: string): this {
        this.vp_Resource = value;
        return this;
    }

    @ViewProperty() vp_Pagination:{ page: int, perPage: int };
    public pagination(value: { page: int, perPage: int }): this {
        this.vp_Pagination = value;
        return this;
    }

    @ViewProperty() vp_Sort:{ field: string, order: string };
    public sort(value: { field: string, order: string }): this {
        this.vp_Sort = value;
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