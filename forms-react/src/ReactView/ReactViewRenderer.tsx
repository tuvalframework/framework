import React, { Fragment, useState } from "react";
import { ReactViewClass } from "./ReactViewClass";


export interface IControlProperties {
    control: ReactViewClass
}


function ReactViewRenderer({ control }: IControlProperties) {
    return (
        <Fragment>
            {control.vp_ReactNode}
        </Fragment>
    );

}

export default ReactViewRenderer;