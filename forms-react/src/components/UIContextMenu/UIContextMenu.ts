import { UIView } from "../UIView/UIView";
import { UIContextMenuClass } from "./UIContextMenuClass";

type FunctionUIContextMenu = (...content: UIView[]) => UIContextMenuClass;
export function UIContextMenu(...items: UIView[]): FunctionUIContextMenu {
        return (...content: UIView[]) => {
                return new UIContextMenuClass().children(...content).setItems(...items);

        }
}