import { css } from "@emotion/css";
import { Editor, InputText } from 'primereact';

import React, { Fragment } from "react";
import { is } from '@tuval/core';
import { InputGroupClass } from "./InputGroupClass";


export interface IControlProperties {
    control: InputGroupClass;
}

function InputGroupRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (
        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
            </span>
            <InputText placeholder="Username" />
        </div>
    );

}

export default InputGroupRenderer;