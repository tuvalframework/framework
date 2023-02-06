import { forEach } from "@tuval/core";
import React, { useState } from "react";
import { UIViewClass } from "./UIView/UIViewClass";
import { FormClass } from "./FormClass";

export interface IControlProperties {
    control: FormClass
}

function FormRenderer({ control }: IControlProperties) {
    const nodes = [];
    forEach(control.sv_Controls, control => {
        nodes.push(control.render())
    })
    return (<div>{nodes}</div>);

}

export default FormRenderer;