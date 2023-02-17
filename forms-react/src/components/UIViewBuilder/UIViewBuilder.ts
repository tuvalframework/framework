import { UIView } from "../UIView/UIView";
import { UIViewBuilderClass } from "./UIViewBuilderClass";


export function UIViewBuilder(content: () => UIView): UIViewBuilderClass {
    return new UIViewBuilderClass()._content(content);
}