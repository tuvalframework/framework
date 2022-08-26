import React, { createElement, Fragment } from "../../../../preact/compat";
import { CGColor, CGRectangle } from '@tuval/cg';
import { foreach, is, Virtual, int, Convert, Guid, Delegate, EventArgs, TString, List, EventBus, NotImplementedException, Stack, ICollection, IEnumerator, IList, Event, Type, Hashtable } from '@tuval/core';
import { Teact } from './../Teact';
import { Padding, PaddingApplies } from '../../Padding';
import { UniqueComponentId } from "../../../../UniqueComponentId";
import { Border, BorderApplies } from "../../Border";
import { BehaviorSubject, map, Observable, Subject, ReplaySubject, throttle, interval } from 'rxjs';
import { TForm } from "./TForm";
import { ControlTypes } from '../ControlTypes';
import { Property, State } from "./Reflection/PropertyDecorator";
import { Margin, MarginApplies } from "../../Margin";
import { DashStyle } from "@tuval/graphics";
import { ComponentCollection } from "./ControlCollection";
import { Message } from "./Message";
import { Msg } from "./Msg";
import { MouseEventArgs } from "../../MouseEventArgs";
import { AppearanceObject } from "./AppearanceObject";
import { IControl } from "./IControl";
import { IRenderable } from "../../../../UIKit/IView";
import { KeyFrameCollection } from '../../../../UIKit/KeyFrameCollection';



type Constructor<T = any> = new (props: any) => T;
export const RendererTable: Hashtable<Type, Constructor> = new Hashtable();

export let lastEnteredPropertyName = '';

function createProxy<T>(thisarg) {
    return new Proxy(thisarg, {
        get: (target, property: string) => {
            /* if (!is.function(target[property])) {
                lastEnteredPropertyName = property;
            } */
            return target[property];
        },
        set: (target, property: string, value, receiver) => {

            if (target[property] === value) {
                return true;
            }

            target[property] = value;
            if (!is.function(target[property])) {
                if (target.PropertyChanged) {
                    target.PropertyChanged(property);
                }
                if (target['my' + property + '$'] instanceof ReplaySubject || target['my' + property + '$'] instanceof Observable) {
                    target['my' + property + '$'].next(value);
                }
            }
            // you have to return true to accept the changes
            return true;
        }
    });
}

export function ConvertToInt$(source: Observable<int>): Observable<int> {
    return source.pipe(map(val => Convert.ToInt32(val)));
}

export function ConvertToFunc$(source: Observable<any>, func: (val: any) => void): Observable<any> {
    return source.pipe(map(val => func(val)));
}

export function throttle$(source: Observable<any>, interv: int): Observable<any> {
    return source.pipe(throttle(ev => interval(interv)));
}

export function Subscriber$(source: Observable<any>, func: Function): void {
    source.subscribe(e => func(e));
}

export interface IControlContainer {
    GetControls(): List<Control<any>>;
}

export enum Modes {
    Component = 0,
    Control = 1
}
//Lifecycle
//componentWillMount
//componentDidMount
//componentWillReceiveProps
//shouldComponentUpdate
//componentWillUpdate
//componentDidUpdate
export abstract class TComponent extends React.Component /* implements ICollection<TComponent> */ {

    Render() {
        return this.CreateMainElement();
    }

    private _RendererContructor: any;
    public GetType(): Type {
        return this.constructor['__type__'];
    }

    public PropertyChanged: Event<any> = new Event();
    public UpdateRequied: Event<any> = new Event();

    /* public GetLastEnteredPropertyName() {
        return lastEnteredPropertyName;
    } */
    @State()
    private myComponents: ComponentCollection;

    public get Components(): ComponentCollection {
        return this.myComponents;
    }

    @State()
    private myOwner: TComponent;

    public get Owner(): TComponent {
        return this.myOwner;
    }
    public set Owner(value: TComponent) {
        this.myOwner = value;
    }

    private TComponent() {
        this.myComponents = new ComponentCollection(this);
        console.log(this.constructor.name);
    }

    public __Mode__: Modes = Modes.Control;

    private __updating__: boolean = false;
    protected __m_PropertyBag__: any = {};
    protected __m_PipeBag__: any = {};
    protected __m_IsComponent__: boolean = false;
    protected __m_Component__: any = null as any;

    public get m_PropertyBag(): any {
        return this.__m_PropertyBag__;
    }
    public set m_PropertyBag(value: any) {
        this.__m_PropertyBag__ = value;
    }

    public get m_PipeBag(): any {
        return this.__m_PipeBag__;
    }
    public set m_PipeBag(value: any) {
        this.__m_PipeBag__ = value;
    }

    public get m_IsComponent(): any {
        return this.__m_IsComponent__;
    }
    public set m_IsComponent(value: any) {
        this.__m_IsComponent__ = value;
    }

    public get m_Component(): any {
        return this.__m_Component__;
    }
    public set m_Component(value: any) {
        this.__m_Component__ = value;
    }

    public __Bounds__: CGRectangle = CGRectangle.Empty;
    public __Dash__: DashStyle = 5;//DashStyle.Custom;

    public BeginUpdate() {
        this.__updating__ = true;
    }
    public EndUpdate() {
        this.__updating__ = false;
    }

    public UnLoad() {
        if (this.__m_Component__ != null && this.__m_Component__._vnode != null) {
            React.unmountComponentAtNode(this.__m_Component__._vnode);
        }
    }

    public GetPipe<P>(propertyName: string): ReplaySubject<P> {
        const renderer = this._RendererContructor;
        if (renderer == null) {
            let propertyBag: any = null;
            if (this.__Mode__ === Modes.Control && this.__m_Component__ != null) {
                propertyBag = this.__m_Component__.m_PropertyBag;
            } else {
                propertyBag = this.__m_PropertyBag__;
            }
            if (propertyBag['my' + propertyName + '$'] == null) {
                propertyBag['my' + propertyName + '$'] = new ReplaySubject<boolean>(1);
            }
            return propertyBag['my' + propertyName + '$']/* .pipe(startWith(this.Visible)) */;
        } else {
            if (this['my' + propertyName + '$'] == null) {
                this['my' + propertyName + '$'] = new ReplaySubject<boolean>(1);
            }
            return this['my' + propertyName + '$']
        }
    }


    protected SetPipe<P>(propertyName: any, value: Observable<P>): void {
        const renderer = this._RendererContructor;
        if (renderer == null) {
            let propertyBag: any = null;
            if (this.__Mode__ === Modes.Control && this.__m_Component__ != null) {
                propertyBag = this.__m_Component__.m_PropertyBag;
            } else {
                propertyBag = this.__m_PropertyBag__;
            }

            if (propertyBag['my' + propertyName + 'Subscription'] != null) {
                propertyBag['my' + propertyName + 'Subscription'].unsubscribe();
            }
            propertyBag['my' + propertyName + 'Subscription'] = value
                .subscribe((v: P) => {
                    if (this.GetProperty(propertyName) !== v) {
                        this.SetProperty(propertyName, v);
                    }
                });
        } else {
            if (this['my' + propertyName + 'Subscription'] != null) {
                this['my' + propertyName + 'Subscription'].unsubscribe();
            }
            this['my' + propertyName + 'Subscription'] = value
                .subscribe((v: P) => {
                    if (this[propertyName] !== v) {
                        this[propertyName] = v;
                        this.ForceUpdate();
                    }
                });
        }
    }

    protected SetPropertyInSlient(name: string, value: any): void {
        if (!this.__m_IsComponent__) {
            if (this.__m_Component__ != null) {
                this.__m_Component__.SetPropertyInSlient(name, value);
            } else {
                this.__m_PropertyBag__[name] = value;
            }
        } else {
            this.__m_PropertyBag__[name] = value;
        }
    }
    protected GetPropertyInSlient(name: string): any {
        if (!this.__m_IsComponent__) { // Kendisi Componet değilse, bir componente sahip
            if (this.__m_Component__ != null) { // Component oluşturulduktan sonra mı atama yapılıyor önce mi?
                return this.__m_Component__.GetPropertyInSlient(name);
            } else { // önce ise bir değişkende tutuyoruz, component oluşturulurken props a geçeceğiz.
                return this.__m_PropertyBag__[name];
            }
        }
        return this.__m_PropertyBag__[name];

    }

    protected SetProperty(name: string, value: any): void {

        if (!this.__m_IsComponent__) {
            if (this.__m_Component__ != null) {
                this.__m_Component__.SetProperty(name, value);
            } else {
                this.__m_PropertyBag__[name] = value;
            }
        } else {

            this.__m_PropertyBag__[name] = value;
            if (!this.__updating__) {
                const stateObject = {};
                stateObject[name] = value;

                /* if ((this as any).__Control__ != null && (this as any).__Control__.m_PropertyBag != null) {
                    (this as any).__Control__.m_PropertyBag[name] = value;
                } */
                this.setState(stateObject);
            }
        }

        if (this.__m_PropertyBag__['my' + name + '$'] instanceof ReplaySubject || this.__m_PropertyBag__['my' + name + '$'] instanceof Observable) {
            this.__m_PropertyBag__['my' + name + '$'].next(value);
        }

        lastEnteredPropertyName = name;
    }

    protected GetProperty(name: string): any {
        if (this.__m_PropertyBag__ == null) {
            console.error(this.constructor.name + ' is not a component.');
        }
        if (!this.__m_IsComponent__) { // Kendisi Componet değilse, bir componente sahip
            if (this.__m_Component__ != null) { // Component oluşturulduktan sonra mı atama yapılıyor önce mi?
                return this.__m_Component__.GetProperty(name);
            } else { // önce ise bir değişkende tutuyoruz, component oluşturulurken props a geçeceğiz.
                return this.__m_PropertyBag__[name];
            }
        }

        lastEnteredPropertyName = name;
        return this.__m_PropertyBag__[name]; //this.state[name];
    }

    public constructor();
    public constructor(props);
    public constructor(...args: any[]) {
        super(args[0] || {});

        this._RendererContructor = this.GetRenderer();

        const props = args[0];

        if (props == null) {
            this.__Mode__ = Modes.Control
        } else {
            this.__Mode__ = Modes.Component;
        }

        if (props != null) {
            this.__m_IsComponent__ = true;
            if (is.function(props.OnComponentSet)) {
                props.OnComponentSet(this);
            }

            this.state = {};
            Object.assign(this.state, props.propertyBag);
        }

        if (this.__Mode__ === Modes.Control) {
            if (super['SetupControlDefaults']) {
                super['SetupControlDefaults']();
            }
            if (this.constructor['__' + this.constructor.name + '__default_values__']) {
                for (let key in this.constructor['__' + this.constructor.name + '__default_values__']) {
                    if (this.GetProperty(key) === undefined && is.function(this.constructor['__' + this.constructor.name + '__default_values__'][key])) {
                        this.SetProperty(key, this.constructor['__' + this.constructor.name + '__default_values__'][key]());
                    }
                }
            }

            this.SetupControlDefaults();
            this.InitComponents();
            this.InitializeComponent();

            if (is.function(this[this.constructor.name])) {
                let parentClass = Object.getPrototypeOf(this);
                const consStack = new Stack();

                while (parentClass != null) {
                    if (Object.getPrototypeOf(parentClass) != null && Object.getPrototypeOf(parentClass).constructor != null) {
                        const parentConNames = Object.getPrototypeOf(parentClass).constructor.name;
                        consStack.Push(parentConNames);
                    }
                    parentClass = Object.getPrototypeOf(parentClass)
                }
                let _conName = null;
                while (consStack.Count > 0) {
                    _conName = consStack.Pop();
                    if (is.function(this[_conName])) {
                        this[_conName]();
                    }
                }

                this[this.constructor.name]();



            }
            if (this._RendererContructor != null) {
                return createProxy(this);
            }
        }
        if (this.__Mode__ === Modes.Component) {
            //Object.assign(this.m_PropertyBag, this.props); // pipeları kontrolden componente alıyoruz.
            /*       const prototype = (this as any).constructor.prototype;
                  const parent_proto = (this as any).__Control__.constructor.prototype;
                  for (let key in Object.getOwnPropertyNames(prototype)) {
                      if (is.function(prototype[key])) {
                          prototype[key] = (...args: any[]) => {
                              return parent_proto[key](...args);
                          }
                      }
                  } */

            this.__m_PropertyBag__ = this.props.propertyBag;
            this.SetupComponentDefaults();
            //return createProxy(this);
        }
    }

    /*    public SendResizeRequest(): void {
           EventBus.Default.fire('tuval.desktop.requestResize', {});
       } */

    @Virtual
    protected SetupControlDefaults(): void { }
    @Virtual
    protected SetupComponentDefaults(): void { }

    @Virtual
    protected InitComponents(): void { }

    public ForceUpdate(): void {
        this.UpdateRequied();
        if (!this.__m_IsComponent__ && this.__m_Component__ != null) {
            this.__m_Component__.forceUpdate();
        } else {
            this.forceUpdate();
        }
    }
    protected OnComponentSet(form: any) {
        this.__m_Component__ = form;
        (form as any).__Control__ = this;
    }
    public OnFormResized(width: int, height: int) { }

    protected abstract CreateElements<T>(param?: T): any;
    protected CreateElementsInternal(): any {

        this.BeginUpdate();
        const result = this.CreateElements(this.props.__param__);
        this.EndUpdate();
        return result;
    }

    public OnAdoption(parent: Control<any>) {

    }



    public CreateMainElement(param?: any): any {
        const renderer = this._RendererContructor;
        if (renderer != null) {
            return createElement(renderer, {
                control: this,
                __param__: param
            }, []);
        } else {
            return createElement(this.constructor, {
                Text: '',
                controlParent: this,
                OnComponentSet: this.OnComponentSet.bind(this),
                propertyBag: this.__m_PropertyBag__,
                __param__: param
            }, []);
        }
    }
    public render(): any {
        //if (this.Visible) {
        return (
            <Fragment>
                {
                    this.CreateElementsInternal()
                }
            </Fragment>
        );
        //  }
    }

    //Lifecycle methods
    protected componentWillMount(): void {
        this.OnComponentWillMount();
    }
    protected componentDidMount(): void {
        this.OnComponentDidMount();
    }
    public componentWillReceiveProps(): void {
        this.OnComponentWillReceiveProps();
    }
    public shouldComponentUpdate(nextProps: any, nextState: any): boolean {
        return this.OnShouldComponentUpdate();
    }
    public componentWillUpdate(): void {
        this.OnComponentWillUpdate();
    }
    public componentDidUpdate(prevProps, prevState): void {
        this.OnComponentDidUpdate();
    }
    protected componentWillUnmount(): void {
        this.OnComponentWillUnmount();
    }

    @Virtual protected OnComponentWillMount() { }
    @Virtual protected OnComponentDidMount() { }
    @Virtual protected OnComponentWillReceiveProps() { }
    @Virtual protected OnShouldComponentUpdate() { return true; }
    @Virtual protected OnComponentWillUpdate() { return true; }
    @Virtual protected OnComponentDidUpdate() { return true; }
    @Virtual protected OnComponentWillUnmount() { return true; }

    /*   public ToArray(): TComponent[] {
          return this.myComponents.ToArray();
      } */
    //ICollection implements

    /* public get Count(): number {
        return this.myComponents.Count;
    }
    public get IsReadOnly(): boolean {
        return false;
    }
    public Add(item: TComponent): void {
        this.myComponents.Add(item);
        item.Owner = this;
    }
    public Clear(): void {
        this.myComponents.Clear();
    }
    public Contains(item: TComponent): boolean {
        return this.myComponents.Contains(item);
    }
    public CopyTo(array: TComponent[], arrayIndex: number): void {
        this.myComponents.CopyTo(array, arrayIndex);
    }
    public Remove(item: TComponent): boolean {
        return this.myComponents.Remove(item);
    }
    public GetEnumerator(): IEnumerator<TComponent> {
        return this.myComponents.GetEnumerator();
    }
    public get IsEndless(): boolean {
        return false;
    } */

    protected InitializeComponent(): void { }

    protected GetRenderer(): any {
        const type = this.GetType();
        if (type != null) {
            return RendererTable.Get(type);
        }
        return null;
    }
}
export abstract class Control<T extends Control = any, TController = any> extends TComponent implements IControl, IRenderable {

    @State()
    public KeyFrameCollection: KeyFrameCollection[];

    @State()
    public Tooltip: string;

    @State()
    public TabIndex: int;


    protected SendMessageToController(message: string, ...args: any[]) {
        if ((this as any).__controller__ != null) {
            (this as any).__controller__.ProcessMessage(message, ...args);
        }
    }

    @State()
    public Appearance: AppearanceObject;

    @State()
    public HoverAppearance: AppearanceObject;

    @State()
    public FocusAppearance: AppearanceObject;

    @State()
    public ActiveAppearance: AppearanceObject;

    @State()
    public DisabledAppearance: AppearanceObject;

    @State()
    public BeforeAppearance: AppearanceObject;

    public Loaded: Event<any> = new Event();
    public UnLoaded: Event<any> = new Event();

    public OnLoaded(): void { }
    public OnUnLoaded(): void { }

    public MouseHover: Event<any> = new Event();
    public MouseMove: Event<any> = new Event();
    public Clicked: Event<any> = new Event();
    /*  protected m_ElementRef: any;
     protected m_PropertyBag: any = {};
     protected m_PipeBag: any = {};
     protected m_IsComponent: boolean = false;
     protected m_Component: T = null as any;
     protected m_VNode: any; */


    @Property()
    protected CreateFrameElement: boolean;

    @Property()
    private myRenderer: any;

    private get Renderer(): any {
        return this.myRenderer;
    }

    private set Renderer(value: any) {
        this.myRenderer = value;
    }

    @State()
    public Handle: string;

    @State()
    public Id: string;


    @State()
    public Tag: any;

    @State()
    protected myParent: Control<any>;

    public get Parent(): Control<any> {
        return this.myParent;
    }
    public set Parent(value: Control<any>) {
        this.myParent = value;
    }

    public get Parent$(): ReplaySubject<any> {
        return this.GetPipe('Parent');
    }
    public set Parent$(value: ReplaySubject<any>) {
        this.SetPipe('Parent', value);
    }

    @State()
    private myBackgroundColor: string;
    public get BackgroundColor(): string {
        return this.myBackgroundColor;
    }
    public set BackgroundColor(value: string) {
        this.myBackgroundColor = value;
    }

    public get ForeColor(): string {
        return this.Appearance.Color;
    }
    public set ForeColor(value: string) {
        this.Appearance.Color = value;
    }

    @State()
    public Visible: boolean;

    public get Visible$(): ReplaySubject<boolean> {
        return this.GetPipe('Visible');
    }
    public set Visible$(value: ReplaySubject<boolean>) {
        this.SetPipe('Visible', value);
    }

    @State()
    public Disabled: boolean;



    @State()
    private myText: string;

    public get Text(): string {
        return this.myText;
    }

    public set Text(value: string) {
        this.myText = value;
    }


    @State()
    public Width: int;

    @State()
    public Height: int;

    public get Height$(): ReplaySubject<int> {
        return this.GetPipe('Height');
    }
    public set Height$(value: ReplaySubject<int>) {
        this.SetPipe('Height', value);
    }

    @State()
    public Padding: Padding;

    @State()
    public Border: Border;

    @State()
    public Margin: Margin;

    @State()
    public Loading: boolean;

    public Left?: string;
    public Top?: string;
    public Bottom?: string;
    public Right?: string;
    public _Width?: string;
    public _Height?: string;
    public BackColor: CGColor = CGColor.Empty;
    public PaddingAll?: string;
    public PaddingLeft?: string;
    public PaddingRight?: string;
    public PaddingTop?: string;
    public PaddingBottom?: string;

    public GetForm(): TForm {
        let index = 0;
        let control: Control<any> = this;
        while (control.Parent != null && index < 100) {
            if (is.typeof<TForm>(control.Parent, ControlTypes.Form)) {
                return control.Parent;
            } else {
                control = control.Parent;
            }
            index++;
        }
        return null;
    }


    public SendResizeRequest(): void {
        EventBus.Default.fire('tuval.desktop.requestResize', {});
    }

    @Virtual
    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.CreateFrameElement = true;
        this.Visible = true;
        this.Loading = false;
        this.Disabled = false;
        this.Padding = Padding.Empty;
        this.Border = Border.Empty;
        this.Margin = Margin.Empty;
        this.Handle = Guid.NewGuid().ToString();
        this.Id = UniqueComponentId();
        this.Visible$.next(this.Visible);
        this.Height$.next(this.Height);
        this.TabIndex = null;

        this.Appearance = new AppearanceObject(this);
        this.HoverAppearance = new AppearanceObject(this);
        this.FocusAppearance = new AppearanceObject(this);
        this.ActiveAppearance = new AppearanceObject(this);
        this.DisabledAppearance = new AppearanceObject(this);
        this.BeforeAppearance = new AppearanceObject(this);
        //this.CurrentStyleObject = this.Appearance.GetStyleObject();

        this.KeyFrameCollection =[];

    }

    public OnAdoption(parent: Control<any>) {

    }

    protected /* virtual */ CreateElements(param: any): any {
        throw new NotImplementedException(this.constructor.name + ' is not implement CreateElements method.');
    }

    protected CreateElementsInternal(): any {
        this.BeginUpdate();
        let result;

        if (this.CreateFrameElement) {
            result = React.createElement(`tvl-control-${this.constructor.name}`, {}, this.CreateElements(this.props.__param__));
        } else {
            result = this.CreateElements(this.props.__param__);
        }
        this.EndUpdate();

        return result;
    }


    protected GetStyleObject(): any {
        const style = {};
        if (this.Width) {
            style['width'] = this.Width + 'px';
        }
        if (this.Height) {
            style['height'] = this.Height + 'px';
        }

        if (this.BackgroundColor) {
            style['background'] = this.BackgroundColor;
        }

        if (this.Padding !== Padding.Empty) {
            if (this.Padding.Applies & PaddingApplies.Left) {
                style['paddingLeft'] = this.Padding.Left + 'px';
            }
            if (this.Padding.Applies & PaddingApplies.Right) {
                style['paddingRight'] = this.Padding.Right + 'px';
            }
            if (this.Padding.Applies & PaddingApplies.Top) {
                style['paddingTop'] = this.Padding.Top + 'px';
            }
            if (this.Padding.Applies & PaddingApplies.Bottom) {
                style['paddingBottom'] = this.Padding.Bottom + 'px';
            }
        }
        if (this.Border !== Border.Empty) {
            if (this.Border.Applies & BorderApplies.Left) {
                style['borderLeft'] = TString.Format('solid {0}px {1}', 1, this.Border.LeftBorderColor);
            }
            if (this.Border.Applies & BorderApplies.Right) {
                style['borderRight'] = TString.Format('solid {0}px {1}', 1, this.Border.RightBorderColor);
            }
            if (this.Border.Applies & BorderApplies.Top) {
                style['borderTop'] = TString.Format('solid {0}px {1}', 1, this.Border.TopBorderColor);
            }
            if (this.Border.Applies & BorderApplies.Bottom) {
                style['borderBottom'] = TString.Format('solid {0}px {1}', 1, this.Border.BottomBorderColor);
            }
        }

        if (this.Margin !== Margin.Empty) {
            if (this.Margin.Applies & MarginApplies.Left) {
                style['marginLeft'] = this.Margin.Left + 'px';
            }
            if (this.Margin.Applies & MarginApplies.Right) {
                style['marginRight'] = this.Margin.Right + 'px';
            }
            if (this.Margin.Applies & MarginApplies.Top) {
                style['marginTop'] = this.Margin.Top + 'px';
            }
            if (this.Margin.Applies & MarginApplies.Bottom) {
                style['marginBottom'] = this.Margin.Bottom + 'px';
            }
        }

        return style;
    }


    public OnFormResized(width: int, height: int) { }
    public OnParentSet(parent: Control<any>) { }

    protected InitComponents(): void { }

    public /* virtual */  WndProc(m: Message): void {
        switch (m.Msg) {
            case Msg.WM_DESTROY: {
                this.wmDestroy(m);
                return;
            }
            case Msg.WM_CLICK: {
                this.WmClick(m);
                return;
            }
            case Msg.WM_MOUSEMOVE: {
                this.WmMouseMove(m);
                return;
            }
            case Msg.WM_MOUSEHOVER: {
                this.WmMouseHover(m);
                return;
            }
        }
    }


    protected wmDestroy(m: Message): void {
    }
    private WmClick(m: Message): void {
        this.OnClick(EventArgs.Empty);
    }
    private WmMouseHover(m: Message): void {
        this.OnMouseHover(EventArgs.Empty);
    }
    private WmMouseMove(m: Message): void {
        this.OnMouseMove(null);
    }

    protected OnMouseMove(e: MouseEventArgs): void {
        this.MouseMove(this, e);
    }
    protected OnMouseHover(e: EventArgs): void {
        this.MouseHover(e);
    }
    protected OnClick(e: EventArgs): void {
        this.Clicked(e);
    }

}


