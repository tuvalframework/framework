import { css } from "@emotion/css";
import { Menu, MenuButton, MenuGridItem, MenuItem, MenuTitle } from "monday-ui-react-core";

import React, { Fragment } from "react";
import { Icons } from "../Icon";
import { PopupButtonClass } from "./PopupButtonClass";

export interface IControlProperties {
    control: PopupButtonClass
}



function PopupButtonRenderer({ control }: IControlProperties) {

    const WrapperComponent = () => {
        return (
            <Fragment>
                {control.vp_View.render()}
            </Fragment>
        )
    }
    return (


        <MenuButton closeDialogOnContentClick={true} componentPosition={'start'}
            dialogOffset={control.vp_DialogOffset}
            dialogPosition={control.vp_DialogPosition}
            component={WrapperComponent} zIndex={10000}>
            <Menu
                id="menu"
                size="large"
            >
                <MenuGridItem>
                    <Fragment>
                        {
                            control.vp_Children.map(view => <Fragment>{view.render()}</Fragment>)
                        }
                    </Fragment>
                </MenuGridItem>
            </Menu>
        </MenuButton>
    );

}

export default PopupButtonRenderer;