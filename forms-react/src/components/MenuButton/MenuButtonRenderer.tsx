import { css } from "@emotion/css";
import { is } from "@tuval/core";
import { DialogContentContainer, Icon, Menu, MenuButton, MenuDivider, MenuGridItem, MenuItem, MenuTitle } from "monday-ui-react-core";
import Bolt from "monday-ui-react-core/dist/icons/Bolt";

import React, { Fragment } from "react";
import { Icons } from "../Icon";
import { UIView } from "../UIView/UIView";
import { MenuButtonClass } from "./MenuButtonClass";

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


export  enum MenuButtonSize {
    XXS = "16",
    XS = "24",
    SMALL = "32",
    MEDIUM = "40",
    LARGE = "48"
}
export  enum MenuButtonComponentPosition {
    START = "start",
    END = "end"
}


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
                            onClick={
                                (e) => {
                                    is.function(menuItem.onClick) ? menuItem.onClick() : void 0;


                                }
                            }
                            title={menuItem.title}
                        />
                    )

            }
        }
        )
    }

    return (
        <Fragment>
            <MenuButton 
            
            closeDialogOnContentClick={true} 
           // componentPosition={MenuButtonComponentPosition.START}
                dialogOffset={{ main: 0, secondary: 0 }}
               dialogPosition={ control.vp_DialogPosition} 
                component={control.vp_Icon} 
                //zIndex={10000} 
                size={MenuButtonSize.XS}
            >
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