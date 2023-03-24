import React from "react";
import { AppearanceClass } from "../../../UIAppearance";
import { UIView } from "../../UIView/UIView";
import {UIViewRenderer} from "../../UIView/UIViewRenderer";
import { ViewProperty } from "../../UIView/ViewProperty";
import { BodyClass } from "../Body";
import { TableColumnClass } from "../TableColumn";
import TableRenderer from "./TableRenderer";




export class TableClass extends UIView {
  
      /** @internal */
      @ViewProperty() vp_ShowHeader: boolean;
    
      showHeader(value: boolean): this {
          this.vp_ShowHeader = value;
          return this;
      }
    
    /** @internal */
    @ViewProperty() vp_Spacing: string;

    /** @internal */
    @ViewProperty() vp_Alignment: string;

    /** @internal */
    @ViewProperty() vp_Header: TableColumnClass[];
    /** @internal */
    setHeader(...columns: TableColumnClass[]): this {
        console.log(columns);
        this.vp_Header = columns;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Body: BodyClass;
    /** @internal */
    setBody(body: BodyClass): this {
        this.vp_Body = body;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_Value: any[];
    public value(value: any[]): this {
        this.vp_Value = value;
        return this;
    }


    /** @internal */
    @ViewProperty() vp_HeaderAppearance: AppearanceClass;
    public headerAppearance(value: AppearanceClass): this {
        this.vp_HeaderAppearance = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_RowAppearance: AppearanceClass;
    public rowAppearance(value: AppearanceClass): this {
        this.vp_RowAppearance = value;
        return this;
    }

    public constructor() {
        super();
        this.Appearance.Width ='100%';
        this.Appearance.Height ='100%';
        this.vp_ShowHeader = true;

    }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={TableRenderer}></UIViewRenderer>)
    }
}
