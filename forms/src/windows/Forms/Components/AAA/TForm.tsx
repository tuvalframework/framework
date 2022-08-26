import React, { createElement, Fragment } from "../../../../preact/compat";
import { Dialog } from '../form/Dialog';
import { foreach, is, Virtual, EventBus, Event, Browser, int, ClassInfo, Delegate, Convert } from '@tuval/core';
import { Teact } from './../Teact';
import { ControlCollection } from './ControlCollection';
import { Control, Modes } from './Control';
import { TApplication } from "./TApplication";
import { MainMenu } from "./MainMenu";
import { RibbonMenu } from "./RibbonMenu";
import { TaskManager } from "./TaskManager";
import { UniqueComponentId } from "../../../../UniqueComponentId";
import { DomHandler } from "../DomHandler";
import { EventHandler } from '../Delegates/EventHandler';
import { BehaviorSubject } from 'rxjs-compat/BehaviorSubject';
import { Observable } from 'rxjs-compat/Observable';
import { ReplaySubject } from 'rxjs';
import { ControlTypes } from "../ControlTypes";
import { Property } from "./Reflection/PropertyDecorator";
import { ApplicationModes } from "..";
import { useInRouterContext, useNavigate } from "../../../../router-dom";

export class TopMaximizeChangeHandler extends Delegate<(topMaximized: boolean) => void> { }
@ClassInfo({
    fullName: ControlTypes.Form,
    instanceof: [
        ControlTypes.Form,
    ]
})
export class TForm<TController = any> extends Control<TForm, TController> {
    public static ActiveForm: TForm;
    public m_Dialog: Dialog = null as any;

    public get OnResizeInternal(): Function {
        return this.GetProperty('OnResizeInternal');
    }

    public set OnResizeInternal(value: Function) {
        this.SetProperty('OnResizeInternal', value);
    }


    public get ResizeEnd(): Event<EventHandler> {
        return this.GetProperty('ResizeEnd');
    }

    public set ResizeEnd(value: Event<EventHandler>) {
        this.SetProperty('ResizeEnd', value);
    }

    public get ZIndex(): int {
        return this.GetProperty('ZIndex');
    }

    public set ZIndex(value: int) {
        this.SetProperty('ZIndex', value);
    }

    public get Maximizable(): boolean {
        return this.GetProperty('Maximizable');
    }

    public set Maximizable(value: boolean) {
        this.SetProperty('Maximizable', value);
    }

    public get TopMaximizable(): boolean {
        return this.GetProperty('TopMaximizable');
    }

    public set TopMaximizable(value: boolean) {
        this.SetProperty('TopMaximizable', value);
    }
    public get IsActive(): boolean {
        return this.GetProperty('IsActive');
    }

    public set IsActive(value: boolean) {
        this.SetProperty('IsActive', value);
    }

    public get Minimizable(): boolean {
        return this.GetProperty('Minimizable');
    }

    public set Minimizable(value: boolean) {
        this.SetProperty('Minimizable', value);
    }

    @Property()
    public TopMaximized: boolean;

    @Property()
    public TopMaximizeChanged: Event<TopMaximizeChangeHandler>;

    @Property()
    public DefaultUrl: string;

    public get Maximized() {
        return this.GetProperty('Maximized');
    }

    public set Maximized(value: boolean) {
        this.SetProperty('Maximized', value);
    }

    public get Minimized(): boolean {
        return this.GetProperty('Minimized');
    }

    public set Minimized(value: boolean) {
        this.SetProperty('Minimized', value);
    }


    public get Resizable(): boolean {
        return this.GetProperty('Resizable');
    }

    public set Resizable(value: boolean) {
        this.SetProperty('Resizable', value);
    }

    /*  public get Id(): string {
         return this.GetProperty('Id');
     }

     public set Id(value: string) {
         this.SetProperty('Id', value);
     } */

    public get Name(): string {
        return this.GetProperty('Name');
    }

    public set Name(value: string) {
        this.SetProperty('Name', value);
    }

    public get MainMenu(): Control<MainMenu | RibbonMenu> {
        return this.GetProperty('MainMenu');
    }

    public set MainMenu(value: Control<MainMenu | RibbonMenu>) {
        this.SetProperty('MainMenu', value);
    }

    public get Application(): TApplication {
        return this.GetProperty('Application');
    }

    public set Application(value: TApplication) {
        this.SetProperty('Application', value);
    }

    public get Icon(): string {
        return this.GetProperty('Icon');
    }

    public set Icon(value: string) {
        this.SetProperty('Icon', value);
    }

    public get Controls(): ControlCollection {
        return this.GetProperty('Controls');
    }

    public set Controls(value: ControlCollection) {
        this.SetProperty('Controls', value);
    }

    public get FooterControls(): ControlCollection {
        return this.GetProperty('FooterControls');
    }

    public set FooterControls(value: ControlCollection) {
        this.SetProperty('FooterControls', value);
    }
    public get ShowHeader(): boolean {
        return this.GetProperty('ShowHeader');
    }

    public set ShowHeader(value: boolean) {
        this.SetProperty('ShowHeader', value);
    }

    public get HeaderTitleColor(): string {
        return this.GetProperty('HeaderTitleColor');
    }

    public set HeaderTitleColor(value: string) {
        this.SetProperty('HeaderTitleColor', value);
    }
    public get HeaderTitleAlign(): string {
        return this.GetProperty('HeaderTitleAlign');
    }

    public set HeaderTitleAlign(value: string) {
        this.SetProperty('HeaderTitleAlign', value);
    }

    public get HeaderTitleFontSize(): string {
        return this.GetProperty('HeaderTitleFontSize');
    }

    public set HeaderTitleFontSize(value: string) {
        this.SetProperty('HeaderTitleFontSize', value);
    }

    public get Modal(): boolean {
        return this.GetProperty('Modal');
    }

    public set Modal(value: boolean) {
        this.SetProperty('Modal', value);
    }

    public get IsMdiContainer(): boolean {
        return this.GetProperty('IsMdiContainer');
    }

    public set IsMdiContainer(value: boolean) {
        this.SetProperty('IsMdiContainer', value);
    }

    public get MdiParent(): TForm {
        return this.GetProperty('MdiParent');
    }

    public set MdiParent(value: TForm) {
        this.SetProperty('MdiParent', value);
    }


    private get MdiChild(): TForm {
        return this.GetProperty('MdiChild');
    }

    /**
    * WndProc set sediyor
    */
    private set MdiChild(value: TForm) {
        this.Controls.Clear()
        foreach(value.Controls, (control) => {
            this.Controls.Add(control);
        });
        this.SetProperty('MdiChild', value);
    }

    public get HeaderHeight(): string {
        return this.GetProperty('HeaderHeight');
    }

    public set HeaderHeight(value: string) {
        this.SetProperty('HeaderHeight', value);
    }

    public get HeaderPadding(): string {
        return this.GetProperty('HeaderPadding');
    }

    public set HeaderPadding(value: string) {
        this.SetProperty('HeaderPadding', value);
    }

    public get HeaderSubStyle(): string {
        return this.GetProperty('HeaderSubStyle');
    }

    public set HeaderSubStyle(value: string) {
        this.SetProperty('HeaderSubStyle', value);
    }

    public get HeaderColor(): string {
        return this.GetProperty('HeaderColor');
    }

    public set HeaderColor(value: string) {
        this.SetProperty('HeaderColor', value);
    }

    public get ContentHeight(): int {
        return this.GetProperty('ContentHeight');
    }

    public set ContentHeight(value: int) {
        this.SetProperty('ContentHeight', value);
    }

    public get ContentHeight$(): ReplaySubject<int> {
        return this.GetPipe('ContentHeight');
    }
    public set ContentHeight$(value: ReplaySubject<int>) {
        this.SetPipe('ContentHeight', value);
    }

    public get ContentPadding(): string {
        return this.GetProperty('ContentPadding');
    }
    public set ContentPadding(value: string) {
        this.SetProperty('ContentPadding', value);
    }

    @Property()
    public HScroll: boolean;

    @Property()
    public VScroll: boolean;

    public constructor();
    public constructor(props);
    public constructor(...args: any[]) {
        super(args[0]);
        const props = args[0];
        /*  if (props == null) {
             this.SetupDefaults();
         } */
    }

    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();

        this.ResizeEnd = new Event();
        this.Controls = new ControlCollection(this);
        this.FooterControls = new ControlCollection(this);
        EventBus.Default.fire('tuval.desktop.formCreated', { form: this });
        this.Width = 200;
        this.Height = 300;
        this.Modal = false;
        this.ShowHeader = true;
        this.Maximizable = true;
        this.Minimizable = true;
        this.TopMaximizable = true;
        this.Resizable = true;
        this.TopMaximized = false;
        this.TopMaximizeChanged = new Event();
        this.Maximized = false;
        this.Minimized = false;
        //this.ZIndex = DomHandler.generateZIndex();
        this.IsActive = false;
        this.HScroll = false;
        this.VScroll = false;

        this.ContentHeight$.next(this.Height);


        this.OnResizeInternal = (e) => {
            this.OnResize(e);
        };
    }

    protected SetupComponentDefaults() {
        super.SetupComponentDefaults();
        this.onResize = this.onResize.bind(this);
    }

    public componentDidMount() {
        super.componentDidMount();
        EventBus.Default.on('tuval.desktop.requestResize', this.resizeRequest.bind(this));
    }
    public componentWillUnmount() {
        super.componentWillUnmount();
        EventBus.Default.off('tuval.desktop.requestResize', this.resizeRequest.bind(this));
    }

    private resizeRequest() {
        this.SendResizedEvent(this.Width, this.ContentHeight);
    }



    @Virtual
    public InitComponents(): void { }

    /* public WndProc(message: string, param: any): void {
        switch (message) {
            case 'WM_SHOWMDICHILD':
                if (this.IsMdiContainer) {
                    this.MdiChild = param;
                }
                break;
        }
    } */

    public CreateFooterControls(): any[] {
        if (this.FooterControls.Count > 0) {
            const footerControls = this.FooterControls.ToArray().map(control => {
                return (
                    control.CreateMainElement()
                );
            });

            return (<div> {footerControls} </div>);
        }
        return [];
    }

    public get ZOrder(): int {
        if (this.__Mode__ === Modes.Control && this.__m_Component__ != null && this.__m_Component__.m_Dialog) {
            return this.__m_Component__.m_Dialog.mask.style.zIndex;
        } else if (this.m_Dialog != null && this.m_Dialog.mask != null) {
            return this.m_Dialog.mask.style.zIndex;
        }
    }

    public set ZOrder(value: int) {
        if (this.__Mode__ === Modes.Control && this.__m_Component__ != null && this.__m_Component__.m_Dialog) {
            this.__m_Component__.m_Dialog.mask.style.zIndex = value;
        } else if (this.m_Dialog != null && this.m_Dialog.mask != null) {
            this.m_Dialog.mask.style.zIndex = value;
        }
    }

    public CreateElements(): any {

        if (!this.Visible) {
            return;
        }

        // formun mdi parenti varsa kendisi render etmiyor, mdi parent render edecek.
        if (this.MdiParent) {
            return [];
        }

        /* if (this.MdiChild == null && !this.IsMdiContainer) {
            const vNodes: any[] = [];
            foreach(this.Controls, (control) => {
                vNodes.push(control.CreateMainElement());
            });

            const contentStyle: any = {};
            contentStyle['overflow'] = 'hidden';
            if (!this.BackColor.IsEmpty) {
                contentStyle['backgroundColor'] = this.BackColor.toString('#rrggbb');
            }

            return (
                <Dialog header={this.Text} visible={this.Visible} maximizable={true} modal={this.Modal} onHide={() => { this.Hide(); }}
                    style={{ width: this.Width + 'px', height: this.Height + 'px' }} contentStyle={contentStyle} titleIcon={this.Icon} footer={this.CreateFooterControls()}>
                    {this.MainMenu ? (this.MainMenu as any).CreateMainElement() : []}
                    {vNodes}
                </Dialog>
            );
        } else { */
        const vNodes: any[] = [];
        /*   if (this.MdiChild != null) { */

        foreach(this.Controls, (control) => {
            vNodes.push(control.CreateMainElement());
        });
        //}

        const contentStyle: any = {};
        contentStyle['overflow'] = 'hidden';



        if (this.VScroll) {
            contentStyle['overflow-y'] = 'auto';
        }
        if (this.HScroll) {
            contentStyle['overflow-x'] = 'auto';
        }

        contentStyle['padding'] = '0px !important';
        if (!is.nullOrEmpty(this.BackgroundColor)) {
            contentStyle['backgroundColor'] = this.BackgroundColor;
        }

        if (!is.nullOrEmpty(this.ContentPadding)) {
            contentStyle['padding'] = this.ContentPadding + ' !important';
        }

        let footer = {};
        if (this.FooterControls.Count > 0) {
            footer['footer'] = this.CreateFooterControls();
        }

        let style = {};

        style['width'] = this.Width + 'px';
        style['height'] = this.Height + 'px';
        if (this.Maximizable) {
            if (this.Maximized) {
                style['width'] = Browser.WindowWidth + 'px';
                style['height'] = (Browser.WindowHeight - 40) + 'px';
                style['position'] = 'fixed';
                style['left'] = '0px';
                style['top'] = '0px';
            } else {
                style['position'] = 'fixed';
                /*   style['left'] = `calc(50% - ${Convert.ToInt32(this.Width / 2)}px)`;
                  style['top'] = `calc(50% - ${Convert.ToInt32(this.Height / 2)}px)`; */
            }
        }

        if (this.Minimizable) {
            if (this.Minimized) {
                let index = 0;

                const app = TaskManager.GetApplications().forEach((e: TApplication) => {
                    if (e.Handle === this.Application.Handle) {
                        style['left'] = 120 + (64 * index) + 'px';
                        return;
                    }
                    index++;
                });

            }
        }


        return (
            <Dialog id={this.Id}
                ref={e => this.m_Dialog = e}
                minY={40}
                minimized={this.Minimized}
                isActive={this.IsActive}
                onMinimize={e => this.Minimized = e.minimized}
                maximized={this.Maximized}
                onMaximize={e => this.Maximized = e.maximized}
                topMaximized={this.TopMaximized}
                onTopMaximize={this.handleTopMaximized.bind(this)}
                header={this.Text}
                showHeader={this.ShowHeader && TApplication.ApplicationMode === ApplicationModes.Desktop}
                headerSubStyle={this.HeaderSubStyle}
                headerPadding={this.HeaderPadding}
                headerColor={this.HeaderColor}
                headerHeight={this.HeaderHeight}
                headerTitleColor={this.HeaderTitleColor}
                headerTitleAlign={this.HeaderTitleAlign}
                headerTitleFontSize={this.HeaderTitleFontSize}
                visible={this.Visible}
                resizable={this.Resizable}
                minimizable={this.Minimizable}
                maximizable={this.Maximizable}
                topMaximizable={this.TopMaximizable}
                modal={this.Modal}
                onHide={() => { this.Hide(); }}
                style={style}
                contentStyle={contentStyle}
                titleIcon={this.Icon}
                icons={this.renderSettingsIcon.bind(this)}
                closeOnEscape={false}
                onContentResize={this.onResize} {...footer} /* maskStyle={{ zIndex: this.ZIndex }} */ onClick={this.onDialogClick.bind(this)}>
                {this.MainMenu ? (this.MainMenu as any).CreateMainElement() : []}
                {/*  <PanelComponent id={UniqueComponentId()} style={{ boxShadow: '1px 1px 3px #555 inset' }}> */}
                {vNodes}
                {/* </PanelComponent> */}
            </Dialog>
        )


        //}
    }

    private handleTopMaximized(e) {
        this.TopMaximized = e.topMaximized;
        this.TopMaximizeChanged(e.topMaximized);
    }
    private renderSettingsIcon() {
        return (
            <div className='pi pi-cog x-tool-settings'></div>
        );
    }

    private onDialogClick(event) {
        if (TForm.ActiveForm != null && TForm.ActiveForm !== this && !this.Modal) {
            const most = TForm.ActiveForm.ZOrder;
            TForm.ActiveForm.ZOrder = this.ZOrder;
            this.ZOrder = most;
            TForm.ActiveForm.IsActive = false;
            TForm.ActiveForm = this;
            this.IsActive = true;
            //this.ZIndex = DomHandler.generateZIndex();

           /*  const context = useInRouterContext();
            if (context) {
                let navigate = useNavigate();
                if (is.nullOrEmpty(this.DefaultUrl)) {
                    navigate(this.DefaultUrl, { replace: true });
                }

            } */

        }
    }

    public StartFormDrag(event: any) {
        if (this.__Mode__ === Modes.Control && this.__m_Component__ != null && this.__m_Component__.m_Dialog) {
            return this.__m_Component__.m_Dialog.onDragStart(event);
        } else if (this.m_Dialog != null && this.m_Dialog.mask != null) {
            return this.m_Dialog.onDragStart(event);
        }
    }

    public Maximize(): void {
        if (!this.__m_IsComponent__) {
            this.__m_Component__.m_Dialog.toggleMaximize();
        }
    }
    public TopMaximize(): void {
        if (!this.__m_IsComponent__) {
            this.__m_Component__.m_Dialog.toggleTopMaximize();
        }
    }

    public OnShown(): void { }
    public Show(): void {
        if (this.MdiParent != null) {
            throw 'MdiParent';
            // this.MdiParent.WndProc('WM_SHOWMDICHILD', this);
        } else {
            this.Modal = false;
            this.Visible = true;
        }

        if (TForm.ActiveForm) {
            TForm.ActiveForm.IsActive = false;
        }
        TForm.ActiveForm = this;
        this.IsActive = true;

        this.SendResizedEvent(this.Width, this.Height);
        this.OnShown();
    }
    public ShowDialog(): void {
        //this.ZIndex = DomHandler.generateZIndex();
        this.Modal = true;
        this.Visible = true;
        this.IsActive = true;
    }
    public Hide(): void {
        this.Visible = false;
        EventBus.Default.fire('tuval.desktop.formClosed', { form: this });
        // React.unmountComponentAtNode(this._vnode);
    }

    private onResize(newWidth, newHeight) {
        //this.Height = newHeight;

        if (this.Height$ instanceof BehaviorSubject || this.Height$ instanceof Observable) {
            (this.Height$ as any).next(newHeight);
        }


        this.ContentHeight = newHeight;

        EventBus.Default.fireAsync('tuval.desktop.onresize', {
            name: this.Name,
            height: newHeight
        });
        //console.log(newHeight);
        this.OnResizeInternal({ width: newWidth, height: newHeight });
        this.SendResizedEvent(newWidth, newHeight);

    }

    private SendResizedEvent(w: int, h: int) {
        foreach(this.Controls, (control: Control<any>) => {
            if (is.function(control.OnFormResized)) {
                control.OnFormResized(w, h);
            }
        });
    }

    protected OnResize(e: any): void {
        this.ResizeEnd(e);
    }

}