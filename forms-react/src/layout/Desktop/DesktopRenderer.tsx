import React, { Fragment, useMemo, useState } from "react";
import { UIView } from "../../components/UIView/UIView";
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