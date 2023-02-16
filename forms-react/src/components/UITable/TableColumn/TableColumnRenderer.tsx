import { css } from "@emotion/css";
import { is } from "@tuval/core";
import { Mention } from 'primereact';
import React, { Fragment } from "react";
import { TableColumnClass } from "./TableColumnClass";

export interface IControlProperties {
    control: TableColumnClass
}


function TableColumnRenderer({ control }: IControlProperties) {

    return (
        <Fragment>
            {
                control.vp_Children.map(item => item &&
                (
                    <th style ={{width: control.vp_HeaderWidth, height:control.vp_TableHeaderHeight}}>
                        {item.render()}
                    </th>)
                )
            }
        </Fragment>

    )

}

export default TableColumnRenderer;