import { ButtonComponent } from "../button/TuButtonElement";
import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { is, Delegate, Event, List, int, foreach } from '@tuval/core';
import { Control } from "./Control";

class PageControlCollection extends List<Control<any>> {
    private m_Page: Page = null as any; _
    public constructor(page: Page) {
        super();
        this.m_Page = page;
    }
    public Add(item: any): int {
        const result = super.Add(item);
        this.m_Page.forceUpdate();
        return result;
    }
}
export class Page extends Control<Page> {

    public get SideBarControls(): PageControlCollection {
        return this.GetProperty('SideBarControls');
    }

    public set SideBarControls(value: PageControlCollection) {
        this.SetProperty('SideBarControls', value);
    }

    public get ContentControls(): PageControlCollection {
        return this.GetProperty('ContentControls');
    }

    public set ContentControls(value: PageControlCollection) {
        this.SetProperty('ContentControls', value);
    }


    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.SideBarControls = new PageControlCollection(this);
        this.ContentControls = new PageControlCollection(this);
    }

    public InitComponents() {

    }

    private CreateSideBarControls(): any[] {
        const vNodes: any[] = [];
        foreach(this.SideBarControls, (control) => {
            vNodes.push(control.CreateMainElement());
        });
        return vNodes;
    }
    private CreateContentControls(): any[] {
        const vNodes: any[] = [];
        foreach(this.ContentControls, (control) => {
            vNodes.push(control.CreateMainElement());
        });
        return vNodes;
    }
    public CreateElements(): any {
        return (
            {/* <div class='layout-wrapper'>
                <div class='layout-topbar'></div>
                <div class='layout-sidebar'> {this.CreateSideBarControls()}</div>
                <div class='layout-content'> {this.CreateContentControls()}</div>
            </div> */}

        );
    }
}