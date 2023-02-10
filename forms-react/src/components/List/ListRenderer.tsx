import React, { useState } from "react";
import { List, TextField } from 'monday-ui-react-core';
import { ListBox } from "primereact";
import { is } from "@tuval/core";
import { ListClass } from "./ListClass";
import { ListWrapperComponentType } from "monday-ui-react-core/dist/types/components/List/ListConstants";

export interface IControlProperties {
    control: ListClass
}


function ListRenderer({ control }: IControlProperties) {

    return (
        //@ts-check
        <List component={"ul" as any} style={{width:'100%'}}>
            {
                control.vp_Children.map(child => child.render()) as any
            }
        </List>
    );

}

export default ListRenderer;