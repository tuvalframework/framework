import { TForm } from './TForm';
import React, { createContext, createElement, Fragment } from "../../../../preact/compat";
import { Teact } from './../Teact';
import { List, EventBus, foreach, Umay } from '@tuval/core';
import { Control } from './Control';
import { TaskManager } from './TaskManager';
import { UIController } from '../../../../UIKit/UIController';

/* export class TApplication {
    public MainForm: TForm = null as any;
    public Forms: List<TForm> = new List();
    public Start(): void {
        this.MainForm.InitComponents();
        if (this.MainForm['InitDesktop']) {
            (this.MainForm as any).InitDesktop();
        }
        //burasi aranacak
        React.render(this.MainForm.CreateMainElement(), window.document.body);
        this.MainForm.Show();
    }
} */

export enum ApplicationModes {
    Desktop = 1,
    Portal = 2,
    Mobile = 3
}
export class TApplication extends Control<TApplication> {
    public static ApplicationMode : ApplicationModes = ApplicationModes.Desktop;
    public static get IsDesktop(): boolean {
        return TApplication.ApplicationMode === ApplicationModes.Desktop;
    }
    public static get IsPortal(): boolean {
        return TApplication.ApplicationMode === ApplicationModes.Portal;
    }
    public static get IsMobile(): boolean {
        return TApplication.ApplicationMode === ApplicationModes.Mobile;
    }
    public get StartResolve(): any {
        return this.GetProperty('StartResolve');
    }
    public set StartResolve(value: any) {
        this.SetProperty('StartResolve', value);
    }

    public get Icon(): string {
        return this.GetProperty('Icon');
    }
    public set Icon(value: string) {
        this.SetProperty('Icon', value);
    }

    public get Disposed(): boolean {
        return this.GetProperty('Disposed');
    }
    public set Disposed(value: boolean) {
        this.SetProperty('Disposed', value);
    }

    public get Name(): string {
        return this.GetProperty('Name');
    }
    public set Name(value: string) {
        this.SetProperty('Name', value);
    }

    public get Forms(): List<TForm> {
        return this.GetProperty('Forms');
    }
    public set Forms(value: List<TForm>) {
        this.SetProperty('Forms', value);
    }

    protected get Controller(): UIController {
        return this.GetProperty('Controller');
    }
    protected set Controller(value: UIController) {
        this.SetProperty('Controller', value);
    }

    protected get MainForm(): TForm {
        return this.GetProperty('MainForm');
    }
    protected set MainForm(value: TForm) {
        this.SetProperty('MainForm', value);
    }

    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.Disabled = false;
        this.Forms = new List();
        this.OnFormCreate = this.OnFormCreate.bind(this);
        this.OnFormClosed = this.OnFormClosed.bind(this);
        EventBus.Default.on('tuval.desktop.formCreated', this.OnFormCreate);
        EventBus.Default.on('tuval.desktop.formClosed', this.OnFormClosed);
    }
    protected SetupComponentDefaults() {
        super.SetupComponentDefaults();
    }

    private OnFormCreate(event: any): void {
        if ((event.form as any).ApplicationName === (this as any).constructor.name) {
            event.form.Application = this;
            this.Forms.Add(event.form);
            this.ForceUpdate();
        } else if (this.MainForm && event.form === (this.MainForm as any).m_Component) {
            event.form.Application = this;
        }
    }
    private OnFormClosed(event: any): void {
        if (event.form === (this.MainForm as any).m_Component) {
            EventBus.Default.off('tuval.desktop.formCreated', this.OnFormCreate);
            EventBus.Default.off('tuval.desktop.formClosed', this.OnFormClosed);
            this.Forms.Clear();
            TaskManager.Quit(this);
            this.Disposed = true;
            //EventBus.Default.fire('tuval.desktop.applicationquit', { application: this });
            //this.ForceUpdate();
            //React.unmountComponentAtNode(event.form._vnode);
            //React.unmountComponentAtNode(this.m_Component._vnode);
        } else {
            this.Forms.Remove(event.form);
            //React.unmountComponentAtNode(event.form._vnode);
            this.ForceUpdate();
        }
    }

    public SetMainForm(mainform: TForm) {
        this.MainForm = mainform;
        this.MainForm.Application = this;
        //this.MainForm.InitComponents();
    }

    public SetMainController(mainform: UIController) {
        this.Controller = mainform;
        // this.MainForm.Application = this;
        //this.MainForm.InitComponents();
    }

    private GetMainForm(): any {
        const vNodes: any[] = [];
        if (this.Controller != null) {
            vNodes.push((this.Controller as any).CreateMainElement());
        } else {
            vNodes.push((this.MainForm as any).CreateMainElement());
        }
        return vNodes;
    }

    private GetForms(): any {
        const vNodes: any[] = [];
        foreach(this.Forms, (form) => {
            vNodes.push((form as any).CreateMainElement());
        });

        return vNodes;
    }

    protected GetTheme(): any {
        return null;
    }
    public CreateElements(): any {
        const themeContext = createContext(this.GetTheme());

        if (!this.Disposed) {
            return (
                <div id={this.Name}>
                    {this.GetMainForm()}
                    {this.GetForms()}
                </div>
            );
        } else {
            /* this.m_PropertyBag = undefined as any;
            this.state = undefined as any;
            React.unmountComponentAtNode(this._vnode); */
            this.props.controlParent.Dispose();

        }
    }

    public Dispose() {
        React.unmountComponentAtNode(this.__m_Component__._vnode);
        for (let key in this.__m_Component__._vnode) {
            delete this.__m_Component__._vnode[key];
        }

        this.__m_Component__.m_PropertyBag = undefined;
        this.__m_Component__.state = undefined;
        this.__m_Component__ = undefined as any;
        this.__m_PropertyBag__ = undefined as any;
        this.state = undefined as any;

    }

    public Start() {
        if (this.StartResolve) {
            if (this.Controller != null) {

            } else {
                this.MainForm.Show();
            }
            EventBus.Default.fire('tuval.desktop.render', {});
            this.StartResolve(this);
        }
    }

}