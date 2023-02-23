import React from "react";
import { DesktopController } from "../../DesktopController";
import { DesktopClass } from "./DesktopClass";



export interface IControlProperties {
    control: DesktopClass
}


function DesktopRenderer({ control }: IControlProperties) {
    return (
       <DesktopController baseUrl={control.vp_BaseUrl}/>
    );
}

export default DesktopRenderer;