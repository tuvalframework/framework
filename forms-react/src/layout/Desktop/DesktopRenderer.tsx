import React, { Fragment, useMemo, useState } from "react";
import { UIViewClass } from "../../components/UIView/UIViewClass";
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