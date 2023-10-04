import { Loader } from 'monday-ui-react-core';
import { OverlayPanel } from 'primereact';
import React, { Fragment, useEffect, useRef } from "react";
import { LoaderClass } from './LoaderClass';



interface IControlProperties {
    control: LoaderClass
}



function LoaderRenderer({ control }: IControlProperties) {

    /* <Loader size={control.vp_Size} /> */
    return (
        <Loader size={control.vp_Size} />
    )
}

export default LoaderRenderer;