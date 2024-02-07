import React from "react";
import { UIView } from "../UIView/UIView";
import {UIViewRenderer} from "../UIView/UIViewRenderer";
import { ViewProperty } from "../UIView/ViewProperty";
import CheckBoxRenderer from "./DataTableRenderer";
import TextFieldRenderer from "./DataTableRenderer";
import { IDataTableProperties } from "./IDataTableProperties";
import DataTableRenderer from "./DataTableRenderer";
import { IDataTableColumn } from "./IDataTableCoumn";



export class DataTableClass extends UIView  implements IDataTableProperties{

     /** @internal */
     @ViewProperty() vp_EditMode:  "cell" | "row";

     public editMode(value: "cell" | "row") {
         this.vp_EditMode = value;
         return this;
     }

      /** @internal */
      @ViewProperty() vp_Columns: IDataTableColumn[];

      public columns(value: IDataTableColumn[]) {
          this.vp_Columns = value;
          return this;
      }

    /** @internal */
    @ViewProperty() vp_Model: object[];

    public model(value: object[]) {
        this.vp_Model = value;
        return this;
    }

     /** @internal */
     @ViewProperty() vp_ShowFilterRow: boolean;

     public showFilterRow(value: boolean) {
         this.vp_ShowFilterRow = value;
         return this;
     }

      /** @internal */
      @ViewProperty() vp_DataTablePT: any;

      public dataTablePT(value: any) {
          this.vp_DataTablePT = value;
          return this;
      }

      /** @internal */
      @ViewProperty() vp_ColumnPT: any;

      public columnPT(value: any) {
          this.vp_ColumnPT = value;
          return this;
      }

      /** @internal */
      @ViewProperty() vp_ColumnGroupPT: any;

      public columnGroupPT(value: any) {
          this.vp_ColumnGroupPT = value;
          return this;
      }

       /** @internal */
       @ViewProperty() vp_RowPT: any;

       public rowPT(value: any) {
           this.vp_RowPT = value;
           return this;
       }

    public constructor() {
        super();
        this.vp_Columns = [];
    }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={DataTableRenderer}></UIViewRenderer>)
    }
}
