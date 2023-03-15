import { css } from "@emotion/css";
import { is } from "@tuval/core";
import { DialogContentContainer, Icon, Menu, MenuButton, MenuDivider, MenuGridItem, MenuItem, MenuTitle } from "monday-ui-react-core";
import Bolt from "monday-ui-react-core/dist/icons/Bolt";

import React, { Fragment } from "react";
import { Icons } from "../Icon";
import { UIView } from "../UIView/UIView";
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

    let menuItems: any[] = [];
    if (is.array(control.vp_Model)) {
        menuItems = control.vp_Model.map(menuItem => {
            const IconWrapper = (props) => (
                <Fragment>
                    {props.icon.render()}
                </Fragment>
            )
            switch (menuItem.type) {
                case 'Divider':
                    return (
                        <MenuDivider />
                    )
                case 'Title':
                    return (
                        <MenuTitle caption={menuItem.title} />
                    )
                default:
                    return (
                        <MenuItem
                            icon={menuItem.icon instanceof UIView ? IconWrapper : menuItem.icon}
                            // iconType={"SVG" as any}
                            onClick={() => is.function(menuItem.onClick) ? menuItem.onClick() : void 0}
                            title={menuItem.title}
                        />
                    )

            }
        }
        )
    }

    return (
        <Fragment>

            <MenuButton closeDialogOnContentClick={true} componentPosition={'start'} dialogOffset={{ main: -25, secondary: 30 }}
                dialogPosition={"right-start"} component={control.vp_Icon} zIndex={10000} size={MenuButton.sizes.XS}>
                <Menu id="menu" size="medium" >

                    {
                        menuItems
                    }

                </Menu>
            </MenuButton>
        </Fragment>
    );

}

export default MenuButtonRenderer;