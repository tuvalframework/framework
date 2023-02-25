import { css } from "@emotion/css";
import { DialogContentContainer, Icon, Menu, MenuButton, MenuGridItem, MenuItem, MenuTitle } from "monday-ui-react-core";
import Bolt from "monday-ui-react-core/dist/icons/Bolt";

import React, { Fragment } from "react";
import { MenuButtonClass } from "./MenuButtonClass";

export interface IControlProperties {
    control: MenuButtonClass
}

function MenuButtonRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (
        <Fragment>

            <MenuButton closeDialogOnContentClick={true} componentPosition={'start'} dialogPosition={"bottom-start"} component={Bolt}>
                <Menu
                    id="menu"
                    size="medium"
                >
                    <MenuTitle
                        caption="Look up, you might see"
                        captionPosition={"top" as any}
                    />
                    <MenuGridItem>
                      <h1>sdhfjhskdfhksd</h1>
                    </MenuGridItem>

                </Menu>
            </MenuButton>
        </Fragment>
    );

}

export default MenuButtonRenderer;