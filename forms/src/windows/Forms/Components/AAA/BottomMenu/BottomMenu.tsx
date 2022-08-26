import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { Event, is, Delegate, classNames } from '@tuval/core';
import { Control } from "../Control";
import { DomHandler } from "../../DomHandler";
import { BottomMenuItemCollection } from "./BottomMenuItemCollection";
import { BottomMenuItem } from "./BottomMenuItem";
import { MenuComponent } from '../../menu/Menu';

const css = require('./BottomMenu.css');
DomHandler.addCssToDocument(css);

export class BottomMenu extends Control<BottomMenu> {


    public get Items(): BottomMenuItemCollection {
        return this.GetProperty('Items');
    }

    public set Items(value: BottomMenuItemCollection) {
        this.SetProperty('Items', value);
    }

    public SetupControlDefaults() {
        super.SetupControlDefaults();
        this.Items = new BottomMenuItemCollection(this);
    }

    public renderMenuItem(item: BottomMenuItem): any {
        if (item.MenuModel != null) {
            return (
                <div onclick={(event) => (item as any).menu.toggle(event)} /* item.OnClick() */ class="button-item flex align-items-center justify-content-center h-3rem bg-blue-500 font-bold text-600 border-round cursor-pointer" >
                    <MenuComponent model={item.MenuModel} popup ref={el => (item as any).menu = el} id="popup_menu" />
                    <i className={item.Icon} style='font-size:16px' ></i>
                </div>
            );
        } else {
            const className = classNames('flex align-items-center justify-content-center h-3rem bg-blue-500 font-bold text-600 border-round cursor-pointer',
                { 'button-item-disabled': item.Disabled, 'button-item': !item.Disabled } as any);
            return (
                <div onclick={() => { if (!item.Disabled) item.OnClick() }} class={className} >
                    <i className={item.Icon} style='font-size:16px' ></i>
                </div>
            );
        }

    }
    private renderMenuItems(): any[] {
        return this.Items.ToArray().map(item => this.renderMenuItem(item));
    }
    public CreateElements(): any {
        return (
            <div class="tuval-bottom-menu">
                <div class="flex flex-row card-container blue-container border-1 border-300">
                    {this.renderMenuItems()}
                </div>
            </div>
        );
    }
}