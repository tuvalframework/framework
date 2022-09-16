import { foreach, int, is, Event, StringBuilder } from "@tuval/core";
import { useMemo } from "../../hooks";
import { ControlCollection } from "../../windows/Forms/Components/AAA/ControlCollection";
import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { IControl } from "../../windows/Forms/Components/AAA/IControl";
import { getView, viewFunc } from "../getView";
import { IRenderable } from "../IView";
import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { TableColumnClass, TableColumn } from './TableColumn';
import { BodyClass, TBody } from './Body';
import { Teact } from "../../windows/Forms/Components/Teact";
import { AppearanceClass } from "../UIAppearance";



class TableRenderer extends ControlHtmlRenderer<TableClass> {
    public ChildrenCreating: Event<any> = new Event();
    /* public get UseShadowDom(): boolean {
        return true;
    } */

    public OnCustomAttributesCreating(obj: TableClass, attributeObject: any): void {

        attributeObject['alignment'] = obj.vp_Alignment;
        attributeObject['spacing'] = obj.vp_Spacing;

    }

    public OnStyleCreating(obj: TableClass, sb: StringBuilder): void {
        sb.AppendLine(`
        /* total width */
        :host::-webkit-scrollbar {
            display: block;
            background-color: rgb(255,255,255,0%);
            width: 7px;
            height: 7px;
        }

        :host::-webkit-scrollbar {
            width: 7px;
            height: 7px;
        }

        /* background of the scrollbar except button or resizer */
        :host::-webkit-scrollbar-track {
            background-color: rgb(255,255,255,0%);
        }

        /* scrollbar itself */
        :host::-webkit-scrollbar-thumb {
            border-radius: 16px;
            border: 0px solid #fff;
        }

        :host::-webkit-scrollbar-thumb {
            background-color: #768693;
        }

        /* set button(top and bottom of the scrollbar) */
        :host::-webkit-scrollbar-button {
            display:none;
        }


        `);
    }

    public GenerateElement(obj: TableClass): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: TableClass): void {
        const headerResult = [];
        const rowViewFunctions = [];
        foreach(obj.vp_Header, column => {
            const tableColumn: TableColumnClass = getView(obj instanceof UIController ? obj : (obj as any).controller, column) as any;
            if (tableColumn != null) {
                const headerView: UIView = getView(obj instanceof UIController ? obj : (obj as any).controller, tableColumn.vp_HeaderView) as any;
                if (headerView != null) {
                    let headerNode = headerView.Render();
                    const style = tableColumn.Appearance?.GetStyleObject();
                    if (tableColumn.vp_HeaderWidth) {
                        style['width'] = tableColumn.vp_HeaderWidth;
                    }
                    headerResult.push(<th style={style}> {headerNode}</th>);
                }
                rowViewFunctions.push(tableColumn.vp_RowFunction);
            }
        });

        const rowNodes = [];
        foreach(obj.vp_Value, rowData => {
            const row_columns = [];
            foreach(rowViewFunctions, func => {
                try {
                    const row_column = func(rowData);
                    const row_column_view = getView(obj instanceof UIController ? obj : (obj as any).controller, row_column);
                    row_columns.push(<td> {row_column_view.Render()}</td>);
                } catch {
                    row_columns.push(<td>{'Error'}</td>);
                }
            });
            const style = obj.vp_RowAppearance?.Appearance?.GetStyleObject();
            rowNodes.push(<tr style={style}>{row_columns}</tr>);
        });

        let headerStyle = {};
        if (obj.vp_HeaderAppearance != null) {
            headerStyle = obj.vp_HeaderAppearance.Appearance?.GetStyleObject();
        }
        this.WriteComponent(
            <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse' }}>
                <thead style={headerStyle}>
                    <tr> {headerResult}</tr>
                </thead>
                <tbody>
                    {rowNodes}
                </tbody>
            </table>
        );
    }
}


export class TableClass extends UIView {

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


    /** @internal */
    @ViewProperty() vp_HeaderAppearance: AppearanceClass;

    /** @internal */
    @ViewProperty() vp_RowAppearance: AppearanceClass;

    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new TableRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });
        return this;
    }

    public constructor() {
        super();
        this.Appearance.FlexDirection = 'column';

        this.Appearance.Display = 'flex';
        this.Appearance.Width = '100%';
        this.Appearance.Height = '100%';
        this.Appearance.AlignContent = 'center';
        this.Appearance.JustifyContent = 'center';

        this.Appearance.AlignItems = 'center';
        this.Appearance.JustifyItems = 'center';

    }

    Controls: ControlCollection<any, any>;
    public GetViews(): IRenderable[] {
        return this.SubViews.ToArray();
    }

    value(value: any[]): this {
        this.vp_Value = value;
        return this;
    }

    public headerAppearance(value: AppearanceClass): this {
        this.vp_HeaderAppearance = value;
        return this;
    }
    public rowAppearance(value: AppearanceClass): this {
        this.vp_RowAppearance = value;
        return this;
    }
}


type FunctionTable = (...bodyViews: UIView[]) => TableClass;
export function UITable(...columns: TableColumnClass[]): TableClass {
    return viewFunc(TableClass, (controller, propertyBag) => {
        return new TableClass().setController(controller).PropertyBag(propertyBag).setHeader(...columns);
    });
}



