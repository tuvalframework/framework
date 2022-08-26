import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { ClassInfo, is } from '@tuval/core';
import { Control } from "../Control";
import { MenuItemCollection } from './MenuItemCollection';
import { ContextMenuComponent } from "../../contextmenu/ContextMenu";


export class ContextMenu extends Control<ContextMenu> {

    public get MenuItems(): MenuItemCollection {
        return this.GetProperty('MenuItems');
    }
    public set MenuItems(value: MenuItemCollection) {
        this.SetProperty('MenuItems', value);
    }

    public SetupControlDefaults() {
        super.SetupControlDefaults();
        this.MenuItems = new MenuItemCollection(this);
    }
    public CreateElements(): any {
        return (<ContextMenuComponent model={this.MenuItems.Serialize()} ></ContextMenuComponent>);
    }
}