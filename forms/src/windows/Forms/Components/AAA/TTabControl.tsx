import { Control, IControlContainer } from './Control';
import { List, foreach, int, ClassInfo, Event } from '@tuval/core';
import { TabPanel, TabView } from "../tabview/TabView";
import { Teact } from '../Teact';
import { ControlCollection } from "./ControlCollection";
import { ButtonComponent } from "../button/TuButtonElement";
import React, { createElement, Fragment } from "../../../../preact/compat";
import { Observable } from "rxjs-compat/Observable";
import { DomHandler } from '../DomHandler';
import { ControlTypes } from "../ControlTypes";
import { TTabControlRenderer } from './TTabControlRenderer';

const css = require('./TabControl.css');
DomHandler.addCssToDocument(css);



export class TabPageCollection<T extends TTabPage> extends ControlCollection<TTabControl, T>{
    public Add(item: T): int {
        const result = super.Add(item);
        this.Parent.TabPageAdded(item);
        return result;
    }
    /*  public RemoveAt(index: int): void {
         super.RemoveAt(index);
         this.m_Parent.ForceUpdate();
     } */
}

export class TTabPage extends Control<TTabPage> {


    // <i className="pi pi-times"></i>
    public get Closable(): boolean {
        return this.GetProperty('Closable');
    }
    public set Closable(value: boolean) {
        this.SetProperty('Closable', value);
    }

    public get Controls(): ControlCollection {
        return this.GetProperty('Controls');
    }
    public set Controls(value: ControlCollection) {
        this.SetProperty('Controls', value);
    }


    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.Controls = new ControlCollection(this);
        this.Closable = false;
    }

    public OnActivate(): void { }

    public AddControl(control: any): void {
        this.Controls.Add(control);
        this.forceUpdate();
    }
    public CreateControls(): any {
        const vNodes: any[] = [];
        foreach(this.Controls, (control: Control<any>) => {
            vNodes.push((control as any).CreateMainElement());
        });
        return vNodes;
    }
    public CreateElements(): any {
        return (
            /*   <TabPanel header={this.Text}>
                 {
                     this.CreateControls()
                 }
             </TabPanel>  */
            <ButtonComponent label='test'></ButtonComponent>
        );
    }
    public OnFormResized(width: int, height: int) {
        foreach(this.Controls, (control: Control<any>) => {
            control.OnFormResized(width, height);
        });
    }
}

@ClassInfo({
    fullName: ControlTypes.TabControl,
    instanceof: [
        ControlTypes.TabControl,
        ControlTypes.IControlContainer,
    ]
})
export class TTabControl<T extends TTabPage = TTabPage> extends Control<TTabControl<T>> implements IControlContainer {

    public SelectedIndexChanged: Event<any>;

    /* public get Closable(): boolean {
        return this.GetProperty('Closable');
    }
    public set Closable(value: boolean) {
        this.SetProperty('Closable', value);
    } */

    public TabPages: TabPageCollection<T>;

    public ShowHeader: boolean;

    public Closable: boolean;

    public ActiveIndex: int;
    public TabPageAdded: Event<any>;
    public TabPageRemoved: Event<any>;

    public get ActiveIndex$(): Observable<int> {
        return this.GetPipe('ActiveIndex');
    }
    public set ActiveIndex$(value: Observable<int>) {
        this.SetPipe('ActiveIndex', value);
    }

    public get ActiveTabPage(): TTabPage {
        const tab = this.TabPages.Get(this.ActiveIndex);
        if (tab != null) {
            return tab;
        }
        return null;
    }
    public set ActiveTabPage(value: TTabPage) {
        const index = this.TabPages.FindIndex((e: TTabPage) => e === value);
        if (index > -1) {
            this.ActiveIndex = index;
            value.OnActivate();
        }
    }


    public constructor() {
        super();
        this.TabPageAdded = new Event();
        this.TabPageRemoved = new Event();
        this.TabPages = new TabPageCollection(this);
        this.ShowHeader = true;
        this.ActiveIndex = 0;
        this.Closable = false;
        this.SelectedIndexChanged = new Event();
    }

    public AddTabPage(tabPage: T): void {
        tabPage.Parent = this;
        this.TabPages.Add(tabPage);
        //this.ActiveIndex = this.TabPages.Count - 1;
        this.forceUpdate();
    }

    protected GetRenderer() {
        return TTabControlRenderer;
    }
    /*  private CreateTabPages(): any {

         return this.TabPages.ToArray().map((tab: TTabPage) => {
             return <TabPanel header={tab.Text} closable={tab.Closable}>
                 {tab.CreateControls()}
             </TabPanel>
         });

     }

     public CreateElements(): any {
         return (
             <div class='tvl-tabcontrol' style={this.GetStyleObject()}>
                 <TabView
                     closable={this.Closable}
                     onCloseClick={e => { this.ActiveIndex = e - 1; this.TabPages.RemoveAt(e); }}
                     activeIndex={this.ActiveIndex}
                     onTabChange={(e) => {
                         this.ActiveIndex = e.index;
                         this.SelectedIndexChanged(e.index);
                         const activeTab:TTabPage = this.TabPages.Get(e.index);
                         if (activeTab != null) {
                             activeTab.OnActivate();
                         }
                     }}
                     renderActiveOnly={false}
                     showHeader={this.ShowHeader}
                     contentStyle={{ height: this.Height + 'px' }}>
                     {this.CreateTabPages()}
                 </TabView>
             </div>
         );
     }
  */
    public GetControls(): List<Control<any>> {
        const controls = new List<Control<any>>();
        foreach(this.TabPages, (tabpage: TTabPage) => {
            foreach(tabpage.Controls, (control: Control<any>) => {
                controls.Add(control);
            });
        });
        return controls;
    }
    public OnFormResized(width: int, height: int) {
        const controls = new List<Control<any>>();
        foreach(this.TabPages, (tabpage: TTabPage) => {
            tabpage.OnFormResized(width, height);
        });
    }

    public ForceUpdate(): void {
        this.UpdateRequied();
    }

}