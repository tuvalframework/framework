import { is } from "@tuval/core";
import { ListItem, ListItemIcon } from 'monday-ui-react-core';
import React, { Fragment } from "react";
import { ListItemClass } from "./ListItemClass";

import Send from 'monday-ui-react-core/dist/icons/Send';

export interface IControlProperties {
    control: ListItemClass
}


function ListItemRenderer({ control }: IControlProperties) {

    return (
        //@ts-check
        <ListItem onClick={(e)=> is.function(control.vp_OnClick) ? control.vp_OnClick() : void 0}>
            <Fragment>
                <ListItemIcon icon={Send} />
                {control.vp_Text}
            </Fragment>
        </ListItem>
    );

}

export default ListItemRenderer;