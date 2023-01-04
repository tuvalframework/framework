import { int } from "@tuval/core";
import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { RecordsContextRenderer } from "./RecordsContextRenderer";
import { RecordsContextContentFunction } from "./types";


export class RecordsContextClass extends UIView {
    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new RecordsContextRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }

    public constructor() {
        super();
    }

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

   /*  @ViewProperty() vp_Record:any;
    public record(value: any): this {
        this.vp_Record = value;
        return this;
    } */
}