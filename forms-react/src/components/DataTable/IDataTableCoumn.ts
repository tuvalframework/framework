import { CSSProperties } from "react";
import { UIView } from "../UIView/UIView";

export interface IDataTableColumn {
    field?: string;
    header?: ((data: any) => UIView) | string;
    body?: ((rowData: any) => UIView);
    editor?:((rowData: any) => UIView);
    align?: null | "center" | "left" | "right";
    alignFrozen?: "left" | "right";
    alignHeader?: null | "center" | "left" | "right";
    bodyClassName?: string | Function;
    bodyStyle?: CSSProperties;
    className?: string;
    colSpan?: number;
    columnKey?: string;
    dataType?: string;
    excludeGlobalFilter?: boolean;
    filter?:	boolean;
    filterApply?: Function;
    filterClear?: Function;
    filterElement?:Function;
    filterField?: string;
    sortable?:boolean;
    width?: string;
    rowEditor?:boolean;
}