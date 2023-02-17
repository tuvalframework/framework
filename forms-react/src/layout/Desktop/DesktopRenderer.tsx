import React from "react";
import { DesktopController } from "../../DesktopController";
import { DesktopClass } from "./DesktopClass";



export interface IControlProperties {
    control: DesktopClass
}


function DesktopRenderer({ control }: IControlProperties) {
    return (
       <DesktopController/>
    );
}

export default DesktopRenderer;