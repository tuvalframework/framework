import { UIView } from "../UIView/UIView";
import { UIFileUploadClass } from "./UIFileUploadClass";

export function UIFileUpload(...content: UIView[]): UIFileUploadClass {
    return new UIFileUploadClass().children(...content);
}