import React, { Fragment as ReactFragment } from "react";
import { ErrorBoundary } from "../../ErrorBoundary";
import { ErrorBoundaryClass } from "./ErrorBoundaryClass";
import { Fragment } from "../../components/Fragment";
import { is } from "@tuval/core";


export interface IControlProperties {
    control: ErrorBoundaryClass
}

const ErrorBaundaryProxy = ({ control }: IControlProperties) => {
    let view = null;
    return (
        <ReactFragment>
            {!is.function(control.vp_ContentFunc) ? Fragment().render() : (view = control.vp_ContentFunc()) == null ? Fragment().render() : view.render()}
        </ReactFragment>
    )
}
function ErrorBoundaryRenderer({ control }: IControlProperties) {

    return (
        <ErrorBoundary>
            <ErrorBaundaryProxy control={control}></ErrorBaundaryProxy>
        </ErrorBoundary>
    )

}

export default ErrorBoundaryRenderer;