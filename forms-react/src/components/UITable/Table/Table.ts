import { UIView } from "../../UIView/UIView";
import { TableColumnClass } from "../TableColumn";
import { TableClass } from "./TableClass";

type FunctionTable = (...bodyViews: UIView[]) => TableClass;
export function UITable(...columns: TableColumnClass[]): TableClass {
        return new TableClass().setHeader(...columns);
}
