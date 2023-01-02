import { UIView } from './UIView';
import React, { createContext, createElement, Fragment } from "../preact/compat";
import { Control } from '../windows/Forms/Components/AAA/Control';
import { IRenderable } from './IView';
import { ControlHtmlRenderer } from '../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer';
import { IVirtualContainer, TContainerControlRenderer } from '../windows/Forms/Components/AAA/Panel';
import { State } from '../windows/Forms/Components/AAA/Reflection/PropertyDecorator';
import { ControlCollection, TApplication, useApplication } from '../windows/Forms/Components';
import { contextMap } from './contextMap';
import { getView } from './getView';
import { BindingClass } from './Binding';
import { useInRouterContext, useLocation, useParams, useNavigate, NavigateFunction } from '../router-dom';
import { lastEnteredPropertyName } from '../windows/Forms/Components/AAA/Control';
import { createTheme } from '../tuval-system/createTheme';
import { WebApiDataProvider, Teact } from '../tuval-forms';
import { clone, Convert, int, is, TArray } from '@tuval/core';
import { QueryClient } from '../query/core/queryClient';
import { QueryClientProvider } from '../query/tuval/QueryClientProvider';
import { DataProviderContext } from '../query/dataProvider/DataProviderContext';
import { query } from './DataContext/DataContextRenderer';

export const UIFormContext = createContext(null!);
export const UIControllerContext = createContext(null!);

export const bindFormController = (): UIFormController =>
    React.useContext(UIFormContext);

export const bindController = (): UIController =>
    React.useContext(UIControllerContext);

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
    /*   public get UseShadowDom(): boolean {
          return true;
      } */

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

    @State()
    public Error: string;

    @State()
    public Warning: string;

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
            p = new BindingClass(this, p);
            this.BeginUpdate();
            this.SetProperty(lastEnteredPropertyName, p);
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

    protected UseRouter() {
        return true;
    }

    @State()
    public _location: any;

    @State()
    public _params: any;

    @State()
    public Application: TApplication;

    @State()
    public navigotor: NavigateFunction;

    @State()
    public dataProvider: any;

    protected OnWired() {

    }
    protected OnComponentDidMount() {

        if (this._location && this._params && this.UseRouter()) {
            const location = this._location//useLocation()
            //if (lastSubBindedLink1 !== location.pathname) {
            const params: any = this._params//useParams();
            const state: any = location.state;

            this.BindRouterParams({ ...params, ...state });
        }

        this.OnWired();
    }

    protected OnUnWired() {

    }
    protected OnComponentWillUnmount() {
        this.OnUnWired();
        return true;
    }

    /* protected GetRenderer() {
        return UIControllerRenderer;
    } */

    protected GetDataProvider() {
        return null;
    }

    protected CreateElements(param: any) {
        if (useInRouterContext()) {
            currentController = this;
            this._location = useLocation()
            this._params = useParams();
            this.navigotor = useNavigate();
        }
        this.Application = useApplication();


        return (
            <UIControllerContext.Provider value={this}>
                {this._Renderer.render()}
            </UIControllerContext.Provider>
        )



    }

    //For as added subviews
    public Render() {
        return (
            this.CreateMainElement()
        )
    }
}


export abstract class ValidateRule {
    public Field: IField;
    public ErrorMessage: string;

    public constructor(errorMessage: string) {

        this.ErrorMessage = errorMessage;
    }

    public setField(field: IField) {
        this.Field = field;
    }

    abstract validate(): boolean;
}

export class RequiredRule extends ValidateRule {
    public validate(): boolean {
        if (is.nullOrEmpty(this.Field.value)) {
            return false;
        }

        return true;
    }
}

export class MaxLengthRule extends ValidateRule {

    private maxLength: int;

    public constructor(maxLength: int, errorMessage: string) {
        super(errorMessage);
        this.maxLength = maxLength;
    }
    public validate(): boolean {
        if (is.nullOrEmpty(this.Field.value)) {
            return true;
        } else {
            if (Convert.ToString(this.Field.value).length > this.maxLength) {
                return false;
            }
        }
        return true;
    }
}

export interface IFieldState {
    errors?: string[];
    invalid?: boolean;
    isDirty?: boolean;
    isTouched?: boolean;
}
export interface IFieldOptions {
    rules: ValidateRule/* { new(): ValidateRule } */[];
}

export interface IField {
    value: any;
    state: IFieldState;
    options: IFieldOptions;
}

const defaultField: IField = {
    value: null,
    options: {
        rules: []
    },
    state: {
        errors: [],
        invalid: false,
        isDirty: false,
        isTouched: false
    }
}

const queryClient = new QueryClient();
export class UIFormController extends UIController {
    @State()
    private formData: { [key: string]: IField };

    @State()
    private isValid: boolean;

    @State()
    public IsLoaded: boolean;

    public InvalidateQueries() {
        query.invalidateQueries();
    }

    public validateForm(): any {

        //this.BeginUpdate();
        // let errors = [];
        let errorCount = 0;

        for (let key in this.formData) {
            const field: IField = this.formData[key];
            const errors = field.state.errors = [];
            for (let i = 0; i < field.options.rules.length; i++) {
                const rule = field.options.rules[i];
                rule.setField(field);
                const validate = rule.validate();
                if (!validate) {
                    errorCount++;
                    errors.push(rule.ErrorMessage);
                }
            }
        }

        if (errorCount === 0) {
            this.formData = { ...this.formData }

            const data = {};
            for (let key in this.formData) {
                data[key] = this.formData[key].value;
            }

            return [true, data];
            //this.OnSubmit(data);
        } else {
            for (let key in this.formData) {
                const field = this.formData[key];
                field.state.invalid = true;
            }

            this.isValid = false;
        }

        return [false, null]
        //this.EndUpdate();
    }
    protected OnSubmit(data) { }

    public Submit() {
        const [isValid, data] = this.validateForm();
        if (isValid) {
            this.OnSubmit(data);
        }
    }

    public ResetForm() { }

    public ClearErrors() { }

    public SetValue(name: string, value: any, silent: boolean = false, isDirty: boolean = false) {
        if (name != null) {
            const fieldName = name;

            if (this.formData[fieldName] == null) {
                this.formData[fieldName] = clone(defaultField);
            }
            const fieldInfo = this.formData[fieldName];
            fieldInfo.value = value;

            if (!silent) {
                this.formData = { ...this.formData };
            }
        }
    }

    public GetValue(name: string) {
        if (name != null) {
            const fieldName = name;

            if (this.formData[fieldName] == null) {
                this.formData[fieldName] = clone(defaultField);
            }
            const fieldInfo = this.formData[fieldName];
            return fieldInfo.value;
        }
    }

    public GetFieldState(name: string): IFieldState {
        if (name != null) {
            const fieldName = name;

            if (this.formData[fieldName] == null) {
                this.formData[fieldName] = clone(defaultField);
            }

            const fieldInfo = this.formData[fieldName];

            return fieldInfo.state;
        }
    }

    public SetFieldState(name: string, state: IFieldState): void {
        if (name != null) {
            const fieldName = name;

            if (this.formData[fieldName] == null) {
                this.formData[fieldName] = clone(defaultField);
            }

            const fieldInfo = this.formData[fieldName];

            fieldInfo.state = Object.assign(fieldInfo.state, state);
        }
    }

    public SetFieldTouch(name: string, isTouched: boolean): IFieldState {
        if (name != null) {
            const fieldName = name;

            if (this.formData[fieldName] == null) {
                return null;
            }
            const fieldInfo = this.formData[fieldName];

            fieldInfo.state.isTouched = isTouched;

            this.formData = { ...this.formData };
        }
    }

    public register(name: string, rules: ValidateRule[]) {
        if (name != null) {
            const fieldName = name;

            if (this.formData[fieldName] == null) {
                this.formData[fieldName] = clone(defaultField);
            }
            const fieldInfo = this.formData[fieldName];
            fieldInfo.options.rules = rules;

        }
    }

    protected SetupControlDefaults() {
        super.SetupControlDefaults();
        this.formData = {};

    }

    protected CreateElements(param: any) {

        return (
            <UIFormContext.Provider value={this}>
                {super.CreateElements(null)}
            </UIFormContext.Provider>
        )
    }
}
