import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { int, List } from '@tuval/core';
import { ICellFormatter, IDataGridColumn } from './IGridDataColumn';
import { NumberFormatOptions, DateFormatOptions } from '@tuval/components/core';

export enum ColumnClipModes {
    /** Truncates the cell content when it overflows its area. */
    Clip = 'Clip',
    /** Displays ellipsis when the cell content overflows its area. */
    Ellipsis = 'Ellipsis',
    /** Displays ellipsis when the cell content overflows its area also it will display tooltip while hover on ellipsis applied cell. */
    EllipsisWithTooltip = 'EllipsisWithTooltip'
}

export enum TextAlign {
    /**  Defines Left alignment */
    Left = 'Left',
    /**  Defines Right alignment */
    Right = 'Right',
    /**  Defines Center alignment */
    Center = 'Center',
    /**  Defines Justify alignment */
    Justify = 'Justify'
}
export class GridColumn implements IDataGridColumn {
    allowEditing: boolean = true;
    allowFiltering: boolean = true;
    allowGrouping: boolean = true;
    allowReordering: boolean = true;
    allowResizing: boolean = true;
    allowSearching: boolean = true;
    allowSorting: boolean = true;
    autoFit: boolean = false;
    clipMode: ColumnClipModes = ColumnClipModes.EllipsisWithTooltip;
    columns: List<IDataGridColumn>;
    commands: any[];
    customAttributes: Object = {};
    dataSource: Object[];
    defaultValue: string;
    disableHtmlEncode: boolean = false;
    displayAsCheckBox: boolean = false;
    edit: any;
    editTemplate: string;
    editType: string;
    enableGroupByFormat: boolean;
    field: string;
    filter: any;
    filterBarTemplate: any;
    filterTemplate: string;
    foreignKeyField: string;
    foreignKeyValue: string;
    format: string | NumberFormatOptions | DateFormatOptions;
    formatter: Object | ICellFormatter | Function;
    headerTemplate: string;
    headerText: string;
    headerTextAlign: TextAlign;
    headerValueAccessor: string;
    hideAtMedia: string;
    index: number;
    isFrozen: boolean;
    isIdentity: boolean;
    isPrimaryKey: boolean;
    lockColumn: boolean;
    maxWidth: string | number;
    minWidth: string | number;
    showColumnMenu: boolean;
    showInColumnChooser: boolean;
    sortComparer: string;
    template: string;
    textAlign: TextAlign;
    type: string;
    uid: string;
    validationRules: Object;
    valueAccessor: string;
    visible: boolean;
    width: string | number;

    public constructor(header: string);
    public constructor(field: string, header: string);
    public constructor(...args: any[]) {
        if (args.length === 1) {
            this.headerText = args[0];
        } else if (args.length === 2) {
            this.field = args[0];
            this.headerText = args[1];
        }
    }

    public GetBodyTemplate(rowData) {
        return (<span>{rowData[this.field]}</span>);
    }

}