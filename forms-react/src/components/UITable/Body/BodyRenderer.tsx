import { css } from "@emotion/css";
import { is } from "@tuval/core";
import { Mention } from 'primereact';
import React, { Fragment } from "react";
import { BodyClass } from "./BodyClass";

export interface IControlProperties {
    control: BodyClass
}


function BodyRenderer({ control }: IControlProperties) {

    return (
        <Fragment>
            {
                control.vp_Children.map(item => item &&
                (
                    <td>
                        {item.render()}
                    </td>)
                )
            }
        </Fragment>

    )

}

export default BodyRenderer;