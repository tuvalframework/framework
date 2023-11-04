import { css } from "@emotion/css";
import { is } from "@tuval/core";
import React, { Fragment as ReactFragment, useRef } from "react";
import { UIView } from "../../components/UIView/UIView";
import { motion } from "framer-motion"
import { Tooltip } from "monday-ui-react-core";
import { ErrorBoundary } from "../../ErrorBoundary";
import { Text, TextClass } from "../../components";
import { Fragment } from "../../components/Fragment/Fragment";
import { useDimensions } from "../../hooks/hooks";
import { GeometryClass } from "./GeometryClass";


export interface IControlProperties {
    control: GeometryClass
}


function GeometryRenderer({ control }: IControlProperties) {

    // const ref = useRef(null);
    const [ref, params] = useDimensions() as any;

    return (
        <div ref={ref} style={{ position: 'relative', width: '100%', height: '100%' }}>
            {
                control.vp_Chidren?.(params)?.render()
            }
        </div>
    )
}

export default GeometryRenderer;