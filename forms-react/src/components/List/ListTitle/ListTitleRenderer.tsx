import { ListTitle } from 'monday-ui-react-core';
import React from "react";
import { ListTitleClass } from "./ListTitleClass";

export interface IControlProperties {
    control: ListTitleClass
}


function ListTitleRenderer({ control }: IControlProperties) {

    return (
        <ListTitle>{control.vp_Title}</ListTitle>
    );

}

export default ListTitleRenderer;