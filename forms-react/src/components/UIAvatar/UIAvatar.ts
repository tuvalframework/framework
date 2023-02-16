import { UIView } from "../UIView/UIView";
import { UIAvatarClass } from "./UIAvatarClass";

export function UIAvatar(...content: UIView[]): UIAvatarClass {
   
        return new UIAvatarClass().children(...content);
   
}