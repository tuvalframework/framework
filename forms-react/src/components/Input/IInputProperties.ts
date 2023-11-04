import { AppearanceObject } from "../UIView/AppearanceObject";
import { UIView } from "../UIView/UIView";


export interface IInputProperties {
    vp_Prefix: UIView;
    Appearance: AppearanceObject;
    vp_AutoFocus: boolean;
    vp_Placeholder: string;
    vp_Value: string;
    vp_OnChange: (value)=> void;
}