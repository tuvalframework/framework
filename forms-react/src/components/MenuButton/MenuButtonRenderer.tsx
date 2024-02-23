import { css } from "@emotion/css";
import { is } from "@tuval/core";
import { DialogContentContainer, Icon, Menu, MenuButton, MenuDivider, MenuGridItem, MenuItem, MenuTitle } from "monday-ui-react-core";
import Bolt from "monday-ui-react-core/dist/icons/Bolt";

import React, { Fragment } from "react";
import { Icon as _Icon, Icons } from "../Icon";
import { UIView } from "../UIView/UIView";
import { MenuButtonClass } from "./MenuButtonClass";
import { Fragment as _Fragment } from "../Fragment/Fragment";
import { HStack } from "../../layout/HStack/HStack";
import { cLeading } from "../../Constants";
export enum BasePosition {
    START = "Start",
    CENTER = "Center",
    END = "End",
    STRETCH = "Stretch"
}
export enum DialogPosition {
    LEFT = "left",
    LEFT_START = "left-start",
    LEFT_END = "left-end",
    RIGHT = "right",
    RIGHT_START = "right-start",
    RIGHT_END = "right-end",
    TOP = "top",
    TOP_START = "top-start",
    TOP_END = "top-end",
    BOTTOM = "bottom",
    BOTTOM_START = "bottom-start",
    BOTTOM_END = "bottom-end"
}


export enum MenuButtonSize {
    XXS = "16",
    XS = "24",
    SMALL = "32",
    MEDIUM = "40",
    LARGE = "48"
}
export enum MenuButtonComponentPosition {
    START = "start",
    END = "end"
}


export interface IControlProperties {
    control: MenuButtonClass
}


const getMenuItem = (menuItem) => {
    const IconWrapper = (props) => (
        <Fragment>
            {menuItem.icon?.render()}
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
        case 'View':
            return (
                <MenuGridItem className={css`& { margin-bottom:5px;}`}>
                    <Fragment>
                        {
                            is.function(menuItem.view) ?
                                HStack({ alignment: cLeading, spacing: 5 })(
                                    _Icon(menuItem.icon),
                                    menuItem.view()
                                )
                                    .height()
                                    .padding('4px 8px')
                                    .background({ hover: 'rgb(215,218,233)' })
                                    .cornerRadius(5)
                                    .render()
                                :

                                _Fragment().render()
                        }
                    </Fragment>
                </MenuGridItem>


            )
        default:
            const className = css`
                & {
                    color: ${menuItem.color}
                }
                `
            return (
                <MenuItem
                    className={className}
                    icon={menuItem.icon instanceof UIView ? IconWrapper : menuItem.icon}
                    selected={menuItem.selected}
                    // iconType={"SVG" as any}
                    onClick={
                        (e) => {
                            is.function(menuItem.onClick) ? setTimeout(()=> menuItem.onClick(), 100) : void 0;


                        }
                    }
                    title={menuItem.title}>
                    {
                        is.array(menuItem.items) ?
                            <Menu
                                id="sub-menu"
                                tabIndex={0}>
                                {menuItem.items.map((item) => getMenuItem(item))}
                            </Menu>
                            : void 0
                    }

                </MenuItem>
            )

    }

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
        menuItems = control.vp_Model.map((menuItem: any) => getMenuItem(menuItem))
    }

    return (
        <Fragment>
            <MenuButton

                closeDialogOnContentClick={true}
                // componentPosition={MenuButtonComponentPosition.START}
                dialogOffset={{ main: 0, secondary: 0 }}
                dialogPosition={control.vp_DialogPosition}
                component={control.vp_View ? () => control.vp_View().render() : control.vp_Icon}
                //zIndex={10000}
                size={MenuButtonSize.XS}
                
            >
                <Menu id="menu" size="small" >

                    {
                        menuItems
                    }

                </Menu>
            </MenuButton>
        </Fragment>
    );

}

export default MenuButtonRenderer;