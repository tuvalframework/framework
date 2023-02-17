import { List } from 'monday-ui-react-core';
import React from "react";
import { ListClass } from "./ListClass";

export interface IControlProperties {
    control: ListClass
}


function ListRenderer({ control }: IControlProperties) {

    return (
        //@ts-check
        <List component={"ul" as any} style={{width:'100%'}}>
            {
                control.vp_Children.map(child => child && child.render()) as any
            }
        </List>
    );

}

export default ListRenderer;