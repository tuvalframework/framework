import React from "react";
import { UIView } from "../../UIView/UIView";
import UIViewRenderer from "../../UIView/UIViewRenderer";
import { ViewProperty } from "../../UIView/ViewProperty";
import TableColumnRenderer from "./TableColumnRenderer";




export class TableColumnClass extends UIView {
  
    /** @internal */
    @ViewProperty() vp_HeaderView: UIView;
    setHeaderView(value: UIView): this {
        this.vp_HeaderView = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_RowFunction: (dataRow: any) => UIView;
    setRowFunction(value: (dataRow: any) => UIView): this {
        this.vp_RowFunction = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_HeaderWidth: string;
    headerWidth(value: string): this {
        this.vp_HeaderWidth = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_TableHeaderHeight: string;
    headerHeight(value: string): this {
        this.vp_TableHeaderHeight = value;
        return this;
    }

     /** @internal */
     @ViewProperty() vp_Children: UIView[];
     public children(...value: UIView[]): this {
         this.vp_Children = value;
         return this;
     }
 
    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={TableColumnRenderer}></UIViewRenderer>)
    }
}
