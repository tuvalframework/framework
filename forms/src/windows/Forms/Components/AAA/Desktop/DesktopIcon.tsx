import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { is, Delegate, Event, TString, int, ModuleLoader, Browser, Convert, foreach } from '@tuval/core';
import { Control, TComponent } from "../Control";
import { ButtonComponent } from "../../button/TuButtonElement";
import { DomHandler } from '../../DomHandler';
import { Desktop } from "./Desktop";
import { Ripple } from "../../ripple/Ripple";
import { DesktopIconTitle } from "./DesktopIconTitle";
import { TaskManager } from "../TaskManager";
import { instance as container, TLoader, FS } from '@tuval/core';
import { IDesktopService } from '../../../../../Services/Desktop/IDesktopService';
import { ControlTypes } from '../../ControlTypes';
import { Badge } from "../../badge/Badge";
import { ContextMenu } from "../Menu/ContextMenu";
import { ContextMenuComponent } from "../../contextmenu/ContextMenu";
import { ProgressSpinnerComponent } from '../../progressspinner/ProgressSpinner.';
import { State } from "../Reflection/PropertyDecorator";

declare var gaEvent;
const css = require('./DesktopIcon.css');
DomHandler.addCssToDocument(css);

DomHandler.addCssToDocument(require('./icons.css'));


class ClickEvent extends Delegate<() => void>{ }
export class DesktopIcon extends TComponent {

    private m_el: HTMLElement = null as any;
    public m_OnClick: Event<ClickEvent> = new Event();

    @State()
    public Loading: boolean;

    public get Text(): string {
        return this.GetProperty('Text');
    }
    public set Text(value: string) {
        this.SetProperty('Text', value);
    }

    public get Parent(): Desktop {
        return this.GetProperty('Parent');
    }
    public set Parent(value: Desktop) {
        this.SetProperty('Parent', value);
    }

    public get Index(): int {
        return this.GetProperty('Index');
    }
    public set Index(value: int) {
        this.SetProperty('Index', value);
    }

    public get AppInfo(): any {
        return this.GetProperty('AppInfo');
    }
    public set AppInfo(value: any) {
        this.SetProperty('AppInfo', value);
    }

    public get Icon(): string {
        return this.GetProperty('Icon');
    }
    public set Icon(value: string) {
        this.SetProperty('Icon', value);
    }

    public get ApplicationType(): any {
        return this.GetProperty('ApplicationType');
    }
    public set ApplicationType(value: any) {
        this.SetProperty('ApplicationType', value);
    }

    public get OnClick(): Event<ClickEvent> {
        return this.GetProperty('OnClick');
    }
    public set OnClick(value: Event<ClickEvent>) {
        this.SetProperty('OnClick', value);
    }

    /*  public constructor();
     public constructor(props);
     public constructor(...args: any[]) {
         super(args[0]);
         const props = args[0];

     } */

    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.OnClick = new Event();
        this.Loading = false;
    }


    public SetManifest(appInfo: any, applicationType?: any) {
        this.AppInfo = appInfo;
        this.Icon = appInfo.icon;
        if (appInfo.text) {
            this.Text = appInfo.text;
        } else {
            this.Text = appInfo.name;
        }
        if (applicationType != null) {
            this.ApplicationType = applicationType;
        }
    }
    public componentDidMount() {
        DomHandler.addClass(this.m_el, 'p-button-desktop-icon');
        DomHandler.addClass(this.m_el, 'p-mb-2');

        this.OnClick.add(() => {
            //this.Parent.Applications.Get(this.Index).Show();
            this.OnRequestStartApplication();
        });
    }


    protected OnRequestStartApplication() {
        debugger;
        if (!this.Loading) {
            this.Loading = true;
            if (this.ApplicationType != null) {
                setTimeout(() =>
                    TaskManager.Start(this.ApplicationType).then(app => {
                        this.Loading = false;
                        gaEvent('Application', 'Start', this.AppInfo.text);
                        (window as any).ga('send', 'pageview', this.AppInfo.text);
                    }), 10);
            } else {
                const deskService = container.resolve<IDesktopService>(ControlTypes.IDesktopService);
                deskService.LoadApp(this.AppInfo.name).then(appType => {
                    if (appType.application) {
                        setTimeout(() =>
                            TaskManager.Start(appType.application).then(app => {
                                this.Loading = false;

                                //doing cache
                                const caching = false;
                                if (caching) {
                                    this.ApplicationType = appType.application;
                                } else {
                                    delete (ModuleLoader as any).librariesHeaders[this.AppInfo.name];
                                    delete (ModuleLoader as any).librariesUrls[this.AppInfo.name];
                                }

                                gaEvent('Application', 'Start', this.AppInfo.text);
                                (window as any).ga('send', 'pageview', this.AppInfo.text);
                            }), 10);

                    } else {
                        setTimeout(() =>
                            TaskManager.Start(appType).then(app => {
                                this.Loading = false;

                                //doing cache
                                const caching = false;
                                if (caching) {
                                    this.ApplicationType = appType;
                                } else {
                                    delete (ModuleLoader as any).librariesHeaders[this.AppInfo.name];
                                    delete (ModuleLoader as any).librariesUrls[this.AppInfo.name];
                                }

                                gaEvent('Application', 'Start', this.AppInfo.text);
                                (window as any).ga('send', 'pageview', this.AppInfo.text);
                            }), 10);
                    }
                });
            }
        }
    }

    private wordWrap(str, maxWidth) {
        if (str == null)
            return str;

        var newLineStr = "<br>";
        let done: boolean = false;
        let res: string = '';
        let found: boolean = false;
        while (str.length > maxWidth) {
            found = false;
            // Inserts new line at first whitespace of the line
            for (let i: int = maxWidth - 1; i >= 0; i--) {
                if (this.testWhite(str.charAt(i))) {
                    res = res + [str.slice(0, i), newLineStr].join('');
                    str = str.slice(i + 1);
                    found = true;
                    break;
                }
            }
            // Inserts new line at maxWidth position, the word is too long to wrap
            if (!found) {
                res += [str.slice(0, maxWidth), newLineStr].join('');
                str = str.slice(maxWidth);
            }

        }

        return res + str;
    }

    private testWhite(x) {
        var white = new RegExp(/^\s$/);
        return white.test(x.charAt(0));
    }
    public CreateElements(): any {
        let style: any = {};
        const rowCount = Convert.ToInt32(Browser.WindowHeight / 116);
        if (this.Index > rowCount - 1) {
            const a = Convert.ToInt32(this.Index % rowCount);
            const col = Convert.ToInt32(this.Index / rowCount);
            style["top"] = TString.Format('{0}px', 116 * a);
            style["left"] = TString.Format('{0}px', 116 * col);

        } else {
            style["top"] = TString.Format('{0}px', 116 * this.Index);
        }
        /* if (116 * this.Index > Browser.WindowHeight) {
            const row = Convert.ToInt32(Browser.WindowHeight - (116 * this.Index));
            style["top"] = TString.Format('{0}px', 116 * row);
        } */


        const badge = this.Text === 'Package Center' ? (<div class="tuval-badge"><span>5</span></div>) : null;
        const spinner = this.Loading ? (<div class='loading'></div>) : null;
        const desktopIcon = new DesktopIconTitle();
        desktopIcon.Text = this.Text;
        return (
            <Fragment>

                <li className='launch-icon' style={style} onContextMenu={(e) => Desktop.DesktopContextMenu.show(e)}>
                    {spinner}
                    <img class='image' onClick={() => this.OnClick()} src={this.Icon}>
                        {/*   <TuButtonElement label={this.Text} style={style} ondblclick={() => this.OnClick()}></TuButtonElement> */}
                    </img>
                    <div class="text">
                        {desktopIcon.CreateMainElement()}
                    </div>
                    {badge}
                </li>
            </Fragment>
            /*  <div ref={(el) => this.m_el = el} {...this.props}>
                 <TuButtonElement label={this.Text} style={style} ondblclick={() => this.OnClick()}></TuButtonElement>
                 <div class="text">Paket Merkezi</div>
             </div> */
        );
    }
}