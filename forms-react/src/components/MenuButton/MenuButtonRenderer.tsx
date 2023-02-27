import { css } from "@emotion/css";
import { DialogContentContainer, Icon, Menu, MenuButton, MenuGridItem, MenuItem, MenuTitle } from "monday-ui-react-core";
import Bolt from "monday-ui-react-core/dist/icons/Bolt";

import React, { Fragment } from "react";
import { Icons } from "../Icon";
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

            <MenuButton closeDialogOnContentClick={true} componentPosition={'start'}  dialogOffset={{main: -35, secondary: 30}}
            dialogPosition={"left-start"} component={Icons.Menu} zIndex={10000}>
                <Menu
                    id="menu"
                    size="medium"
                >
                    <MenuTitle
                        caption="Look up, you might see"
                        captionPosition={"top" as any}
                    />

                   {/*  <MenuGridItem>
                        <h1>sdhfjhskdfhksd</h1>
                    </MenuGridItem> */}
                    <MenuItem
                        icon={Icons.Edit}
                        // iconType={"SVG" as any}
                        onClick={function noRefCheck() { }}
                        title="Edit"
                    />
                    <MenuItem
                        icon={Icons.Delete}
                        onClick={function noRefCheck() { }}
                        title="Delete"
                    />
                   
                </Menu>
            </MenuButton>
        </Fragment>
    );

}

export default MenuButtonRenderer;