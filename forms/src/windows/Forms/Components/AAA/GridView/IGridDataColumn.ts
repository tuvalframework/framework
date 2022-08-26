import { int, List } from "@tuval/core";
import { ColumnClipModes } from "./Column";
import { NumberFormatOptions, DateFormatOptions } from '@tuval/components/core';

export interface ICellFormatter {
    getValue(column: IDataGridColumn, data: Object): Object;
}

export interface IDataGridColumn {
    allowEditing: boolean;
    allowFiltering: boolean;
    allowGrouping: boolean;
    allowReordering: boolean;
    allowResizing: boolean;
    allowSearching: boolean;
    allowSorting: boolean;
    autoFit: boolean;
    clipMode: ColumnClipModes;
    columns: List<IDataGridColumn>;
    commands: any[];
    customAttributes: Object;
    dataSource: any;
    defaultValue: string;
    disableHtmlEncode: boolean;
    displayAsCheckBox: boolean;
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
    headerTextAlign: string;
    headerValueAccessor: string;
    hideAtMedia: string;
    index: int;
    isFrozen: boolean;
    isIdentity: boolean;
    isPrimaryKey: boolean;
    lockColumn: boolean;
    maxWidth: string | int;
    minWidth: string | int;
    showColumnMenu: boolean;
    showInColumnChooser: boolean;
    sortComparer: string;
    template: string;
    textAlign: string;
    type: string;
    uid: string;
    validationRules: Object;
    valueAccessor: string;
    visible: boolean;
    width: string | int;
}