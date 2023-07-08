import { Loader } from 'monday-ui-react-core';
import { OverlayPanel } from 'primereact';
import React, { Fragment, useEffect, useRef } from "react";
import { UISpinnerClass } from './UISpinnerClass';



export interface IControlProperties {
    control: UISpinnerClass
}



function UISpinnerRenderer({ control }: IControlProperties) {

    /* <Loader size={control.vp_Size} /> */
    return (
        <div className="dot-elastic-small"></div>
    )
}

export default UISpinnerRenderer;