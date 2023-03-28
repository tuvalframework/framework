import { css } from "@emotion/css";
import { Menu, MenuButton, MenuGridItem, MenuItem, MenuTitle } from "monday-ui-react-core";

import React, { Fragment } from "react";
import { Icons } from "../Icon";
import { PopupButtonClass } from "./PopupButtonClass";

export interface IControlProperties {
    control: PopupButtonClass
}



function PopupButtonRenderer({ control }: IControlProperties) {



    const className = css`
    & .menu-button--wrapper--open {
        background-color: transparent;
    }
    & .menu-button--wrapper:hover {
        background-color: transparent;
    }
    & .menu-button--wrapper:focus {
        background-color: transparent;
    }
`;

    const WrapperComponent = () => {
        return (
            <Fragment>
                {control.vp_View.render()}
            </Fragment>
        )
    }
    return (

        <div className={className}>
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
        </div>
    );

}

export default PopupButtonRenderer;