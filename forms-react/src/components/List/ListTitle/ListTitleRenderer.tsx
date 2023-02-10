import React, { useState } from "react";
import { List, ListTitle, TextField } from 'monday-ui-react-core';
import { ListBox } from "primereact";
import { is } from "@tuval/core";
import {  ListTitleClass } from "./ListTitleClass";

export interface IControlProperties {
    control: ListTitleClass
}


function ListTitleRenderer({ control }: IControlProperties) {

    return (
        <ListTitle>{control.vp_Title}</ListTitle>
    );

}

export default ListTitleRenderer;