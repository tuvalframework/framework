import { css } from "@emotion/css";
import { is } from '@tuval/core';
import { DataTable, Column } from 'primereact';
import React from "react";
import { DataTableClass } from "./DataTableClass";
import { IDataTableProperties } from "./IDataTableProperties";
import { UIView } from "../UIView/UIView";
import { IDataTableColumn } from "./IDataTableCoumn";




function DataTableRenderer({ control }: { control: DataTableClass }) {
    const view: DataTableClass = control as any;

    const headerRenderer = (column: IDataTableColumn) => {
        if (is.function(column.header)) {
            return (data) => {
                const view = (column as any).header(column);
                if (view instanceof UIView) {
                    return view.render()
                }
            }
        } else {
            return column.header;
        }
    }

    const bodyRenderer = (column: IDataTableColumn) => {
        if (is.function(column.body)) {
            return (rowData) => {
                const view = column.body(rowData);
                if (view instanceof UIView) {
                    return view.render()
                }
            }
        }
    }

    const editorRenderer = (column: IDataTableColumn) => {
        if (is.function(column.editor)) {
            return (rowData) => {
                const view = column.editor(rowData);
                if (view instanceof UIView) {
                    return view.render()
                }
            }
        }
    }



    return (
        <DataTable value={control.vp_Model} filterDisplay="row"
            tableClassName={view.GetClassName()} tableStyle={{ minWidth: '50rem' }} scrollable scrollHeight="flex"
            editMode={control.vp_EditMode}
            paginator rows={20} rowsPerPageOptions={[20, 50, 100]}>
            {
                control.vp_Columns.map(column =>
                    <Column
                        align={column.align}
                        field={column.field}
                        header={headerRenderer(column)}
                        body={bodyRenderer(column)}
                        editor={editorRenderer(column)}
                        style={{ width: column.width, minWidth: column.width, maxWidth: column.width }}
                        sortable={column.sortable}
                        filterField={column.field}
                        filter={column.filter}
                        filterPlaceholder="Search"
                        rowEditor={column.rowEditor}
                    >

                    </Column>

                )
            }

        </DataTable>
    )


}

export default DataTableRenderer;