import { FunctionComponent } from "react";


export interface TimePickerProperties {
    vp_Value: Date;
    vp_OnChange: Function;
    vp_Renderer: FunctionComponent<any>;
}