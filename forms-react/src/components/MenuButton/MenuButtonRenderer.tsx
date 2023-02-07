import { css } from "@emotion/css";
import { Icon, Menu,  MenuButton,  MenuItem, MenuTitle } from "monday-ui-react-core";
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
            <Icon iconType={Icon.type.SVG} icon={Bolt} iconLabel="my bolt svg icon" iconSize={16} />
            <MenuButton closeDialogOnContentClick={true} startingEdge={"top"} dialogPosition={"right-end"} component={Bolt}>
                <Menu
                    id="menu"
                    size="medium"
                >
                    <h1>Test</h1>
                    <MenuTitle
                        caption="Look up, you might see"
                        captionPosition={"top" as any}
                    />
                    <MenuItem>
                        <h1>hfghgfhfg</h1>
                    </MenuItem>
                    <MenuItem
                        icon={Bolt}
                        // iconType={"SVG" as any}
                        onClick={function noRefCheck() { }}
                        title="The sun"
                    />
                    <MenuItem
                        icon={""}
                        iconType={"SVG" as any}
                        onClick={function noRefCheck() { }}
                        title="The moon"
                    />
                    <MenuItem
                        icon={""}
                        iconType={"SVG" as any}
                        onClick={function noRefCheck() { }}
                        title="And the stars"
                    />
                </Menu>
            </MenuButton>
        </Fragment>
    );

}

export default MenuButtonRenderer;