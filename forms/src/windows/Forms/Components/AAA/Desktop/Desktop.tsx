import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { is, Delegate, Event, List, int, foreach, TString, EventBus, instance, Virtual, Router, Stack, BREAK } from '@tuval/core';
import { Control, TComponent } from "../Control";
import { DesktopIcon } from './DesktopIcon';
import { Taskbar } from "./Taskbar";
import { Toast } from '../../toast/Toast';
import { ContextMenuComponent } from "../../contextmenu/ContextMenu";
import { TuInputElement } from "../../inputtext/TuInputText";
import { ButtonComponent } from './../../button/TuButtonElement';
import { PanelComponent } from "../../panel/Panel";
import { TaskManager } from "../TaskManager";
import { AppView } from "./AppView";
import { ISystemMenu } from "../Menu/ISystemMenu";
import { ControlTypes } from '../../ControlTypes';
import { LoginForm } from "./LoginForm";
import { FileUploadComponent } from '../../fileupload/FileUpload';
import { LinkedIn } from '../../authentication/LinkedIn';
import { LinkedInPopUp } from '../../authentication/LinkedInPopUp';
import { Property, State } from "../Reflection/PropertyDecorator";
import { ControlCollection } from "../ControlCollection";
import { Dialog } from "../Dialog";
import { ApplicationModes, TApplication } from "../TApplication";
import { BrowserRouter } from "../../../../../router-dom";

declare var __Tuval_Config__;

class DesktopIconCollection extends List<DesktopIcon> {
    private m_Page: Desktop = null as any; _
    public constructor(page: Desktop) {
        super();
        this.m_Page = page;
    }
    public Add(item: DesktopIcon): int {
        const result = super.Add(item);
        item.Parent = this.m_Page;
        item.Index = this.Count - 1;
        this.m_Page.ForceUpdate();
        return result;
    }
}

class ApplicationCollection extends List<any> {
    private m_Page: Desktop = null as any; _
    public constructor(page: Desktop) {
        super();
        this.m_Page = page;
    }
    public Add(item: any): int {
        const result = super.Add(item);
        this.m_Page.ForceUpdate();
        return result;
    }
}

class ModalCollection extends List<Dialog> {
    public Remove(removedItem: Dialog): boolean {
        let found = null;
        foreach(this, ((item: Dialog) => {
            if (item.Handle === removedItem.Handle) {
                found = item;
                return BREAK;
            }
        }));
        if (found != null) {
            return super.Remove(found);
        } else {
            return false;
        }
    }
}
class ModalDialogContainer extends TComponent {
    @State()
    public ModalDialogs: ModalCollection;

    protected SetupControlDefaults() {
        this.ModalDialogs = new ModalCollection();
    }
    protected CreateElements<T>(param?: T) {

        return (
            <Fragment>
                {this.ModalDialogs.ToArray().map(dialog => dialog.CreateMainElement())}
            </Fragment>);

    }
}

export class Desktop extends Control<Desktop> {

    public static TopControl: Control<any> = null;
    public static ModalDialogContainer: ModalDialogContainer = new ModalDialogContainer();
    public static User: string = '';
    private m_Toast: Toast = null as any;
    fileUploadRef: any;
    taskbar: Taskbar;

    public get AppView(): boolean {
        return this.GetProperty('AppView');
    }

    public set AppView(value: boolean) {
        this.SetProperty('AppView', value);
    }

    public get Password(): boolean {
        return this.GetProperty('Password');
    }

    public set Password(value: boolean) {
        this.SetProperty('Password', value);
    }

    /*  public get Applications(): ApplicationCollection {
         return this.GetProperty('Applications');
     }

     public set Applications(value: ApplicationCollection) {
         this.SetProperty('Applications', value);
     } */

    public get Icons(): DesktopIconCollection {
        return this.GetProperty('Icons');
    }

    public set Icons(value: DesktopIconCollection) {
        this.SetProperty('Icons', value);
    }

    public get _Router(): Router {
        return this.GetProperty('_Router');
    }

    public set _Router(value: Router) {
        this.SetProperty('_Router', value);
    }

    public get ShowAuthemticationDialog(): boolean {
        return this.GetProperty('ShowAuthemticationDialog');
    }

    public set ShowAuthemticationDialog(value: boolean) {
        this.SetProperty('ShowAuthemticationDialog', value);
    }

    @Property()
    public SiteMode: boolean;

    /*  public constructor();
     public constructor(props);
     public constructor(...args: any[]) {
         super(args[0]);
         const props = args[0];
     } */

    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();

        this.Controls = new ControlCollection(this);
        this.SiteMode = false;
        this.Icons = new DesktopIconCollection(this);
        //this.Applications = new ApplicationCollection(this);
        this.Password = false;
        this.AppView = false;
        this.ShowAuthemticationDialog = false;
        /*  this._Router = new Router('/');
         this._Router.on('linkedin', (e) => {
             alert('dcfs');
             this.ShowAuthemticationDialog = true;
         });
         this._Router.resolve(); */


    }

    protected SetupComponentDefaults(): void {
        super.SetupComponentDefaults();
        EventBus.Default.on('tuval.desktop.toast', (event) => {
            const { severity, summary, detail, life } = event;
            if (!this.__m_IsComponent__ && this.__m_Component__ != null) {
                this.__m_Component__.m_Toast.show({ severity, summary, detail, life });
            } else {
                this.m_Toast.show({ severity, summary, detail, life });
            }
        });

        EventBus.Default.on('tuval.desktop.render', this.ForceUpdate.bind(this));
    }

    /*   private ApplicationQuitEvent(event: any) {
          this.Applications.Remove(event.application);
      } */

    protected InitComponents() { }



    public InitDesktop() { }

    private CreateIcons(): any[] {
        const vNodes: any[] = [];
        foreach(this.Icons, (control: any) => {
            vNodes.push(control.CreateMainElement());
        });
        return vNodes;
    }

    private CreateApplications(): any {
        const apps = TaskManager.GetApplications();
        return apps.map(app => {
            return (app as any).CreateMainElement();
        });
        //return (<div>test</div>);
    }

    private getSystemMenuItems() {
        const menu: any[] = [{
            label: 'Open',
            icon: 'pi pi-fw pi-file',
            /*  items: [
                 {
                     label: 'New',
                     icon: 'pi pi-fw pi-plus',
                     items: [
                         {
                             label: 'Bookmark',
                             icon: 'pi pi-fw pi-bookmark'
                         },
                         {
                             label: 'Video',
                             icon: 'pi pi-fw pi-video'
                         },

                     ]
                 }] */
        },
        {
            label: 'Uninstall',
            icon: 'pi pi-fw pi-file'
        }];
        try {
            const a = instance.resolveAll<ISystemMenu>(ControlTypes.ISystemMenu);
            foreach(a, (systemMenu: ISystemMenu) => {
                foreach(systemMenu.GetMenuItems(), (mi) => {
                    menu.push(mi.Serialize());
                });
            });
        } catch {

        }
        return menu;
    }


    public static DesktopContextMenu;

    private emptyTemplate() {
        return (
            <div className="p-d-flex p-ai-center p-dir-col">
                {/*  <i className="pi pi-image p-mt-3 p-p-5" style={{ 'fontSize': '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i> */}
                <span style={{ 'fontSize': '1.2em', color: 'var(--text-color-secondary)' }} className="p-my-5"></span>
            </div>
        )
    }
    private uploadHandler(event) {
        this.fileUploadRef.clear();
        // console.log(event);

        var reader = new FileReader();
        reader.onload = function () {

            var arrayBuffer: any = this.result,
                array = new Uint8Array(arrayBuffer);
            //binaryString = String.fromCharCode.apply(null, array);

            //console.log(arrayBuffer);


        }
        reader.readAsArrayBuffer(event.files[0]);
    }

    public get ProfilePicture(): string {
        return this.GetProperty('ProfilePicture');
    }
    public set ProfilePicture(value: string) {
        this.SetProperty('ProfilePicture', value);
    }

    @Property()
    public Controls: ControlCollection;

    private renderControls(): any[] {

        return this.Controls.ToArray().map(control => {
            return (control as any).CreateMainElement();
        });

    }
    private renderTopControl(): any {
        return Desktop.TopControl.CreateMainElement();
    }
    public CreateElements(): any {

        const footer = (
            <div>
                <ButtonComponent label="OK" icon="pi pi-check" onClick={() => this.Password = false} />
            </div>
        );
        const myIcon = (
            <button className="p-dialog-titlebar-icon p-link">
                <span className="pi pi-search"></span>
            </button>
        );


        const createLoginDialog = () => {
            const login = new LoginForm();
            login._OnClick.add(() => this.Password = false);
            return (login as any).CreateMainElement();
        }

        if (Desktop.TopControl != null) {
            return this.renderTopControl();
        } else if (this.SiteMode) {
            return (
                this.renderControls()
            );
        } else if (this.Password) {
            if (this.ShowAuthemticationDialog) {
                return (<LinkedInPopUp></LinkedInPopUp>);
            } else {
                const params = new URLSearchParams(window.location.search);
                if (window.location.search.length > 10) {
                    return (<LinkedInPopUp></LinkedInPopUp>);
                } else {
                    return (
                        <div class='login-dialog' style={{ height: 'auto', left: '620px', top: '188.55px' }}>
                            <LoginForm title='' Visible={true} OnClick={() => this.Password = false} OnLogin={(e) => {
                                this.ProfilePicture = e.pictureUrl;
                                Desktop.User = e.email;
                            }
                            }></LoginForm>
                        </div >
                        /*  <Dialog header={'User Access'} footer={footer} closable={false} visible={true} maximizable={false} modal={true} style={{ width: '300px', height: '300px' }}>
                             <PanelComponent>
                                 <div className="p-fluid">
                                     <div className="p-field">
                                         <label htmlFor="firstname1">User Name</label>
                                         <TuInputElement id="firstname1" type="text" />
                                     </div>
                                     <div className="p-field">
                                         <label htmlFor="lastname1">Password</label>
                                         <TuInputElement id="lastname1" type="text" />
                                     </div>
                                 </div>
                             </PanelComponent>
                         </Dialog> */
                    );
                }
            }
        } else {
            const appView = this.AppView ? (<AppView></AppView>) : null;
            const style = {};
            if (this.AppView) {
                style['zIndex'] = 0;
            }

            const taskBar = new Taskbar();
            taskBar.Visible = true;
            taskBar.ProfilePicture = this.ProfilePicture;
            if (__Tuval_Config__.startup.app == null) {
                return (
                    <div>
                        <AppView show={this.AppView}></AppView>
                        <div style={style}>
                            {taskBar.CreateMainElement()}

                            <div className='tuval-desktop'>
                                <FileUploadComponent ref={(el) => this.fileUploadRef = el} style={{ position: 'absolute', height: '930px', width: '1920px' }} customUpload emptyTemplate={this.emptyTemplate} auto={true} headerTemplate={[]} uploadHandler={this.uploadHandler.bind(this)}></FileUploadComponent>
                                <ul tabindex="0" role="menu" aria-label="Masaüstü" class="tuval-desktop-shortcut">
                                    {this.CreateIcons()}

                                </ul>
                                {this.CreateApplications()}
                            </div>
                            <Toast ref={(el) => this.m_Toast = el} />
                            <ContextMenuComponent model={this.getSystemMenuItems()} ref={el => Desktop.DesktopContextMenu = el}></ContextMenuComponent>
                            {/* <ContextMenuComponent global model={this.getSystemMenuItems()}  onBeforeShow={''}  /> */}
                            <div class="tuval-text">Powered By Tuval Framework</div>
                        </div>
                        {this.renderControls()}
                        {Desktop.ModalDialogContainer}
                    </div>
                );
            } else {
                return (
                    <div>
                        <div style={style}>
                            <div className='tuval-desktop'>
                                {this.CreateApplications()}
                            </div>
                            <Toast ref={(el) => this.m_Toast = el} />
                            <ContextMenuComponent model={this.getSystemMenuItems()} ref={el => Desktop.DesktopContextMenu = el}></ContextMenuComponent>
                            {/* <ContextMenuComponent global model={this.getSystemMenuItems()}  onBeforeShow={''}  /> */}
                            <div class="tuval-text">Powered By Tuval Framework</div>
                        </div>
                        {this.renderControls()}
                        {Desktop.ModalDialogContainer}
                    </div>
                );
            }
        }
    }

    protected componentDidMount() {
        window.addEventListener('resize', this.resize.bind(this));
        EventBus.Default.on('tuval.desktop.appview', this.ShowAppView.bind(this));
        // PrimeReact.appendTo = 'self';
    }
    private resize() {
        this.ForceUpdate();
    }
    private ShowAppView(event): void {
        this.AppView = !!event.show;
    }
    protected componentWillUnmount(): void {
        EventBus.Default.off('tuval.desktop.render', this.ForceUpdate.bind(this));
        window.removeEventListener('resize', this.resize.bind(this));
        EventBus.Default.off('tuval.desktop.appview', this.ShowAppView.bind(this));
        // PrimeReact.appendTo = null as any;
    }
    public Start(): void {
        this.InitDesktop();
        //burasi aranacak
        React.render(<BrowserRouter>{this.CreateMainElement()}</BrowserRouter>, window.document.body);
    }
}