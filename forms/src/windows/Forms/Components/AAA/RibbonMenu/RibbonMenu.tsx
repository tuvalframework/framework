import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { ClassInfo, int, foreach } from '@tuval/core';
import { Control } from '../Control';
import { ControlTypes } from "../../ControlTypes";
import { RibbonMenuComponent } from "../../ribbonmenu/RibbonMenu";
import { RibbonTabsHolder } from '../../ribbonmenu/RibbonTabsHolder';
import { RibbonContentHolder } from "../../ribbonmenu/RibbonContentHolder";
import { RibbonContentPanel } from "../../ribbonmenu/RibbonContentPanel";
import { RibbonContentPanelGroup } from '../../ribbonmenu/RibbonContentPanelGroup';
import { RibbonButton } from "../../ribbonmenu/RibbonButton";
import { RibbonGroupDivider } from '../../ribbonmenu/RibbonGroupDivider';
import { RibbonIconButton } from "../../ribbonmenu/RibbonIconButton";
import { RibbonToolButton } from '../../ribbonmenu/RibbonToolButton';
import { RibbonSplitButton } from '../../ribbonmenu/RibbonSplitButton';
import { RibbonFlexLayout } from '../../ribbonmenu/RibbonFlexLayout';
import { RibbonTabCollection } from "./RibbonTabCollection";
import { RibbonTab } from "./RibbonTab";
import { RibbonTabComponent } from '../../ribbonmenu/RibbonTab';
import { model } from './model';

@ClassInfo({
    fullName: ControlTypes.RibbonMenu,
    instanceof: [
        ControlTypes.RibbonMenu,
    ]
})
export class RibbonMenu extends Control<RibbonMenu> {

    public get Tabs(): RibbonTabCollection {
        return this.GetProperty('Tabs');
    }

    public set Tabs(value: RibbonTabCollection) {
        this.SetProperty('Tabs', value);
    }

    /*  public get Data(): any {
         return this.GetProperty('Data');
     }

     public set Data(value: any) {
         this.SetProperty('Data', value);
     } */

    public get ActiveTabIndex(): int {
        return this.GetProperty('ActiveTabIndex');
    }
    public set ActiveTabIndex(value: int) {
        this.SetProperty('ActiveTabIndex', value);
    }

    public SetupControlDefaults() {
        super.SetupControlDefaults();
        this.Tabs = new RibbonTabCollection(this);
    }
    public CreateTabs(data: any): any[] {
        const vNodes: any[] = [];
        foreach(data, (tab: any) => {
            vNodes.push(/* (control as any).CreateMainElement() */
                <RibbonTabComponent text={tab.tab} static={tab.static}></RibbonTabComponent>
            );
        });
        return vNodes;
    }

    private CreateItems(items: any[]): any[] {
        return items.map(item => {
            if (item.type === 'RibbonButton') {
                return (
                    <RibbonButton text={item.text} icon={item.icon} onClick={(event) => item.onClick ? item.onClick() : void 0}></RibbonButton>
                );
            } else if (item.type === 'RibbonGroupDivider') {
                return (
                    <RibbonGroupDivider></RibbonGroupDivider>
                );
            } else if (item.type === 'RibbonIconButton') {
                return (
                    <RibbonIconButton text={item.text} icon={item.icon}></RibbonIconButton>
                );
            } else if (item.type === 'RibbonSplitButton') {
                return (
                    <RibbonSplitButton text={item.text} icon={item.icon}></RibbonSplitButton>
                );
            } else if (item.type === 'RibbonToolButton') {
                return (
                    <RibbonToolButton icon={item.icon}></RibbonToolButton>
                );
            } else if (item.type === 'RibbonFlexLayout') {
                return (
                    <RibbonFlexLayout>
                        {this.CreateItems(item.items)}
                    </RibbonFlexLayout>
                );
            }
        });
    }

    private CreateContentPanelGroups(groups: any[]): any[] {
        return groups.map(group => {
            return (
                <RibbonContentPanelGroup text={group.label}>
                    {this.CreateItems(group.items)}
                </RibbonContentPanelGroup>
            );
        });
    }
    public CreateContentPanels(data: any): any[] {
        const vNodes: any[] = [];
        foreach(data, (tab: any) => {
            vNodes.push(/* (control as any).CreateMainElement() */
                <RibbonContentPanel >
                    {this.CreateContentPanelGroups(tab.groups)}
                </RibbonContentPanel>
            );
        });
        return vNodes;
    }

    public CreateElements(): any {
        const data = this.Tabs.ToModel();
        if (this.Visible) {
            return (
                <Fragment>
                    <RibbonMenuComponent>
                        <RibbonTabsHolder activeIndex={this.ActiveTabIndex} onClick={e => this.ActiveTabIndex = e}>
                            {/*   <RibbonTabComponent text='File'></RibbonTabComponent>
                    <RibbonTabComponent text='Two' ></RibbonTabComponent>
                    <RibbonTabComponent disabled text='Disabled'></RibbonTabComponent>
                    <RibbonTabComponent text='Three' ></RibbonTabComponent> */}
                            {this.CreateTabs(data)}
                        </RibbonTabsHolder>
                        <RibbonContentHolder activeIndex={this.ActiveTabIndex}>
                            {this.CreateContentPanels(data)}
                        </RibbonContentHolder>
                    </RibbonMenuComponent>
                    <div class='tuval-ribbonmenu-border'></div>
                </Fragment>
            );
        }
    }
}