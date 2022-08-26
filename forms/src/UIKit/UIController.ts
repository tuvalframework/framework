import { UIView } from './UIView';
import React, { createElement, Fragment } from "../preact/compat";
import { Control } from '../windows/Forms/Components/AAA/Control';
import { IRenderable } from './IView';
import { ControlHtmlRenderer } from '../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer';
import { IVirtualContainer, TContainerControlRenderer } from '../windows/Forms/Components/AAA/Panel';
import { State } from '../windows/Forms/Components/AAA/Reflection/PropertyDecorator';
import { ControlCollection } from '../windows/Forms/Components';
import { contextMap } from './contextMap';
import { getView } from './getView';
import { BindingClass } from './Binding';
import { useInRouterContext, useLocation, useParams, useNavigate, NavigateFunction } from '../react-router-dom';
import { lastEnteredPropertyName } from '../windows/Forms/Components/AAA/Control';
import { createTheme } from '../tuval-system/createTheme';


export let currentController = null;

export function Context() {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        // console.log(target.constructor.name + ' ----- ' + key);
        if (!contextMap.has(target.constructor.name)) {
            contextMap.set(target.constructor.name, {});
        }
        const context = contextMap.get(target.constructor.name);
        context[key] = descriptor.value;
    }
}

class UIControllerRenderer extends ControlHtmlRenderer<UIController> {
    public get UseShadowDom(): boolean {
        return true;
    }

    public GenerateElement(obj: UIController): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: UIController): void {
        if (!obj.Visible) {
            return;
        }

        const root = obj.LoadView();
        const view = getView(obj, root);
        this.WriteComponent(view.Render());
    }
}
export class UIController<T = any> extends Control implements IRenderable, IVirtualContainer {

    @State()
    private m_ContextBag = {};

    @State()
    public IsModelBind: boolean;

    @State()
    public Theme: any;

    public setTheme(theme: any) {
        this.Theme = theme;
    }

    Controls: ControlCollection<any, any>;

    public GetViews(): IRenderable[] {
        return [this.LoadView()];
    }

    @State()
    private _Renderer: TContainerControlRenderer;
    /*  public constructor() {
         super();
         this.InitController();
     } */

    public ParentController: UIController;


    protected SetupControlDefaults() {
        super.SetupControlDefaults();
        this.CreateFrameElement = false;

        this.Appearance.Display = 'flex';
        this.Appearance.Width = '100%';
        this.Appearance.Height = '100%';
        this.InitController();

        this._Renderer = new TContainerControlRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });


    }

    protected InitController() { }

    public $<T>(value: T): BindingClass<T> {
        return new BindingClass(this, value);
    }
    public $$<T>(value: T): BindingClass<T> {
        let p = this.GetProperty(lastEnteredPropertyName);
        if (p instanceof BindingClass) {
            return p;
        } else {
            p = new BindingClass(this,p);
            this.BeginUpdate();
            this.SetProperty(lastEnteredPropertyName,p);
            this.EndUpdate();
            return p;
        }
    }

    public LoadView(): UIView {
        throw 'Not Implemented Exception : UIController->LoadView';
    }

    public Bind(model: T): this {
        this.OnBindModel(model);
        this.BeginUpdate();
        this.IsModelBind = true;
        this.EndUpdate();
        return this;
    }
    public OnBindModel(model: T) { }


    protected BindRouterParams(params?: any) {

    }

    @State()
    public _location: any;

    @State()
    public _params: any;

    @State()
    public navigotor: NavigateFunction;

    protected OnComponentDidMount() {

        if (this._location && this._params) {
            const location = this._location//useLocation()
            //if (lastSubBindedLink1 !== location.pathname) {
            const params: any = this._params//useParams();
            const state: any = location.state;

            this.BindRouterParams({ ...params, ...state });
        }

    }

    /* protected GetRenderer() {
        return UIControllerRenderer;
    } */

    protected CreateElements(param: any) {
        if (useInRouterContext()) {
            currentController = this;
            this._location = useLocation()
            this._params = useParams();
            this.navigotor = useNavigate();
        }
        return this._Renderer.render();
    }

    //For as added subviews
    public Render() {
        return this.CreateMainElement();
    }
}

