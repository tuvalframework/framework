import { UIView } from "../../UIView/UIView";
import { TableColumnClass } from "./TableColumnClass";


export type FunctionHeader = (...views: UIView[]) => TableColumnClass;
export type FunctionRow = (rowFunction: (dataRow: any) => UIView) => TableColumnClass;

export function TableColumn(...views: UIView[]): FunctionRow;
export function TableColumn(...args: any[]): FunctionHeader | TableColumnClass | FunctionRow {

    return (rowFunction: (dataRow: any) => UIView) => {
        return new TableColumnClass().setHeaderView(args[0]).setRowFunction(rowFunction);
    }

}