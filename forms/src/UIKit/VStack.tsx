import { foreach, int, is, Event, StringBuilder } from "@tuval/core";
import { TContainerControlRenderer, TFlexColumnContainer, IVirtualContainer } from '../windows/Forms/Components/AAA/Panel';
import { UIView, Alignment, ViewProperty } from './UIView';
import { UIController } from './UIController';
import { Control, ControlCollection, ControlHtmlRenderer } from "../windows/Forms/Components";
import { IRenderable } from "./IView";
import { IControl } from "../windows/Forms/Components/AAA/IControl";
import { AlignmentType, cTopLeading, cTop, cTopTrailing, cLeading, cCenter, cTrailing, cBottomTrailing, cBottom, cBottomLeading } from './Constants';
import { getView, viewFunc } from "./getView";
import { Teact } from "../windows/Forms/Components/Teact";
import { Message } from '../windows/Forms/Components/AAA/Message';
import { Msg } from "../windows/Forms/Components/AAA/Msg";
import { ShadowRoot } from "../windows/Forms/Components/ShadowRoot/ShadowRoot";
import { motion } from "../motion";
import React, { createElement, Fragment } from "../preact/compat";
import { useMemo } from "../hooks";



export type DividerTyype = (view: UIView) => void;
export class VStackDividerTypes {
    public static Divide0 = (view: UIView) => { view.Appearance.BorderTopWidth = '0px'; view.Appearance.BorderBottomWidth = '0px' }
    public static Divide = (view: UIView) => { view.Appearance.BorderTopWidth = '0px'; view.Appearance.BorderBottomWidth = '1px' }
    public static Divide2 = (view: UIView) => { view.Appearance.BorderTopWidth = '0px'; view.Appearance.BorderBottomWidth = '2px' }
    public static Divide4 = (view: UIView) => { view.Appearance.BorderTopWidth = '0px'; view.Appearance.BorderBottomWidth = '4px' }
    public static Divide8 = (view: UIView) => { view.Appearance.BorderTopWidth = '0px'; view.Appearance.BorderBottomWidth = '8px' }
}



class VStackRenderer extends ControlHtmlRenderer<VStackClass> {
    public ChildrenCreating: Event<any> = new Event();
   /*  public get UseShadowDom(): boolean {
        return true;
    } */

    public OnCustomAttributesCreating(obj: VStackClass, attributeObject: any): void {

        attributeObject['alignment'] = obj.vp_Alignment;
        attributeObject['spacing'] = obj.vp_Spacing;

    }

    public OnStyleCreating(obj: VStackClass, sb: StringBuilder): void {
        sb.AppendLine(`
        /* total width */
        :host::-webkit-scrollbar {
            display: block;
            background-color: rgb(255,255,255,0%);
            width: 7px;
            height: 7px;
        }

        :host::-webkit-scrollbar {
            width: 7px;
            height: 7px;
        }

        /* background of the scrollbar except button or resizer */
        :host::-webkit-scrollbar-track {
            background-color: rgb(255,255,255,0%);
        }

        /* scrollbar itself */
        :host::-webkit-scrollbar-thumb {
            border-radius: 16px;
            border: 0px solid #fff;
        }

        :host::-webkit-scrollbar-thumb {
            background-color: #768693;
        }

        /* set button(top and bottom of the scrollbar) */
        :host::-webkit-scrollbar-button {
            display:none;
        }


        `);
    }

    public GenerateElement(obj: VStackClass): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: VStackClass): void {
        performance.mark('start');

        if (!obj.Visible) {
            return;
        }

        if (obj.vp_UseCache) {
            const child = useMemo(() => {
                console.log(obj.vp_Alias);
                return this.CreateControls(obj);
            }, [])
            this.WriteComponent(child);
        } else {
            this.WriteComponent(this.CreateControls(obj));
        }


        performance.mark('end');
        performance.measure(obj.vp_Alias + '_Performance', 'start', 'end');
    }

    protected CreateControls(obj: VStackClass): any[] {
        const vNodes: any[] = [];
        if (obj.Controls != null) {
            foreach(obj.Controls, (control) => {
                vNodes.push(control.CreateMainElement());
            });
        }
        if (obj.GetViews != null) {
            let viewCount = obj.GetViews().length;
            let index = 0;
            foreach(obj.GetViews(), (root: IRenderable) => {
                const view = getView(obj instanceof UIController ? obj : (obj as any).controller, root);
                if (view != null && index !== viewCount - 1 && obj.vp_Spacing != null) {
                    view.Appearance.MarginBottom = obj.vp_Spacing;
                }

                if (view != null) {
                    vNodes.push(view.Render());
                }
                index++;
            });
        }

        this.ChildrenCreating(vNodes);
        return vNodes;
    }

}


export class VStackClass extends UIView {

    /** @internal */
    @ViewProperty() vp_Spacing: string;

    /** @internal */
    @ViewProperty() vp_Alignment: string;

    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new VStackRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });
        return this;
    }

    public constructor() {
        super();
        this.Appearance.FlexDirection = 'column';

        this.Appearance.Display = 'flex';
        this.Appearance.Width = '100%';
        this.Appearance.Height = '100%';
        this.Appearance.AlignContent = 'center';
        this.Appearance.JustifyContent = 'center';

        this.Appearance.AlignItems = 'center';
        this.Appearance.JustifyItems = 'center';
       // this.Appearance.Transition = '200ms cubic-bezier(0, 0, 0.2, 1) 0ms';
    }

    Controls: ControlCollection<any, any>;
    public GetViews(): IRenderable[] {
        return this.SubViews.ToArray();
    }

    public divider(value: DividerTyype): this {
        value(this);
        return this;
    }


    /** @internal */
    spacing(value: int): this;
    /** @internal */
    spacing(value: string): this;
    /** @internal */
    spacing(...args: any[]): this {
        if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.vp_Spacing = value;
            /*  let lastView = null;
             if (this.SubViews.Count > 0)
                 lastView = this.SubViews[this.SubViews.Count - 1];

             foreach(this.SubViews, (view) => {
                 if (view.Appearance != null && view !== lastView) {
                     view.Appearance.MarginBottom = value;
                 }
             }); */
            return this;
        } else if (args.length === 1 && is.int(args[0])) {
            const value: int = args[0];
            this.vp_Spacing = `${value}px`;
            /*  let lastView = null;
             if (this.SubViews.Count > 0)
                 lastView = this.SubViews[this.SubViews.Count - 1];

             foreach(this.SubViews, (view) => {
                 if (view.Appearance != null && view !== lastView) {
                     view.Appearance.MarginBottom = `${value}px`;
                 }
             }); */
            return this;
        }
        return this;
        /*  throw 'ArgumentOutOfRange Exception in VStack::spacing' */
    }

    /** @internal */
    alignment(value: AlignmentType) {
        if (value == null) {
            return this;
        }

        this.vp_Alignment = value;

        if (value === cTopLeading) {
            this.Appearance.JustifyContent = 'start';
            this.Appearance.AlignContent = 'start';

            this.Appearance.JustifyItems = 'start';
            this.Appearance.AlignItems = 'start';

        } else if (value === cTop) {
            this.Appearance.JustifyContent = 'start';
            this.Appearance.AlignContent = 'center';

            this.Appearance.JustifyItems = 'start';
            this.Appearance.AlignItems = 'center';
        } else if (value === cTopTrailing) {
            this.Appearance.JustifyContent = 'end';
            this.Appearance.AlignContent = 'start';

            this.Appearance.AlignItems = 'end';
            this.Appearance.JustifyItems = 'start';


        } else if (value === cLeading) {
            this.Appearance.JustifyContent = 'center';
            this.Appearance.AlignContent = 'center';

            this.Appearance.AlignItems = 'start';
            this.Appearance.JustifyItems = 'start';
        } else if (value === cCenter) {
            this.Appearance.JustifyContent = 'center';
            this.Appearance.AlignContent = 'center';

            this.Appearance.AlignItems = 'center';
            this.Appearance.JustifyItems = 'center';

        } else if (value === cTrailing) {
            this.Appearance.JustifyContent = 'end';
            this.Appearance.AlignContent = 'center';

            this.Appearance.AlignItems = 'end';
            this.Appearance.JustifyItems = 'center';
        } else if (value === cBottomLeading) {
            this.Appearance.JustifyContent = 'start';
            this.Appearance.AlignContent = 'end';

            this.Appearance.AlignItems = 'start';
            this.Appearance.JustifyItems = 'end';
        } else if (value === cBottom) {
            this.Appearance.JustifyContent = 'center';
            this.Appearance.AlignContent = 'end';

            this.Appearance.AlignItems = 'center';
            this.Appearance.JustifyItems = 'end';
        } else if (value === cBottomTrailing) {
            this.Appearance.JustifyContent = 'end';
            this.Appearance.AlignContent = 'end';

            this.Appearance.AlignItems = 'end';
            this.Appearance.JustifyItems = 'end';
        }
        return this;
    }

    protected CreateControls(obj: VStackClass): any[] {
        const vNodes: any[] = [];
        if (obj.Controls != null) {
            foreach(obj.Controls, (control) => {
                vNodes.push(control.CreateMainElement());
            });
        }
        if (obj.GetViews != null) {
            let viewCount = obj.GetViews().length;
            let index = 0;
            foreach(obj.GetViews(), (root: IRenderable) => {
                const view = getView(obj instanceof UIController ? obj : (obj as any).controller, root);
                if (view != null && index !== viewCount - 1 && obj.vp_Spacing != null) {
                    view.Appearance.MarginBottom = obj.vp_Spacing;
                }

                if (view != null) {
                    vNodes.push(view.Render());
                }
                index++;
            });
        }

        return vNodes;
    }

    /*  public Render() {
         const elementProperties = {};
         if (this.TabIndex != null) {
             elementProperties['tabindex'] = this.TabIndex;
         }

         if (this.renderAsAnimated) {
             elementProperties['animated'] = true;

             if (this._initial != null) {
                 elementProperties['initial'] = this._initial;
             }
             if (this._animate != null) {
                 elementProperties['animate'] = this._animate;
             }
             if (this._transition != null) {
                 elementProperties['transition'] = this._transition;
             }

             if (this._whileHover != null) {
                 elementProperties['whileHover'] = this._whileHover;
             }
             if (this._whileTap != null) {
                 elementProperties['whileTap'] = this._whileTap;
             }
             if (this._whileDrag != null) {
                 elementProperties['whileDrag'] = this._whileDrag;
             }
             if (this._whileFocus != null) {
                 elementProperties['whileFocus'] = this._whileFocus;
             }
             if (this._whileInView != null) {
                 elementProperties['whileInView'] = this._whileInView;
             }
             if (this._exit != null) {
                 elementProperties['exit'] = this._exit;
             }
         }


         elementProperties['alignment'] = this.vp_Alignment;
         elementProperties['spacing'] = this.vp_Alignment;

         elementProperties['ref'] = (e) => this.Ref = e;
         elementProperties['onclick'] = (e) => this.WndProc(Message.Create(Msg.WM_CLICK, e, e));
         elementProperties['ondblclick'] = (e) => this.WndProc(Message.Create(Msg.WM_DBCLICK, e, e));


         const sr = (
             <ShadowRoot>
                 <style>{this.createStyles()}</style>
                 {this.CreateControls(this)}
             </ShadowRoot>
         );

         if (this.renderAsAnimated) {
             return Teact.createElement(motion[`tuval-view-vstack`], elementProperties, sr);
         } else {
             return Teact.createElement(`tuval-view-vstack`, elementProperties, sr);
         }
     } */
}


interface VStackParams {
    alignment?: AlignmentType;
    spacing?: int;
}

type FunctionVStack = (...views: UIView[]) => VStackClass;


/* export function VStack(value: string): FunctionVStack; */
export function VStack(): VStackClass;
export function VStack(...views: (UIView | IControl | UIController)[]): VStackClass;
export function VStack(value: VStackParams): FunctionVStack;
export function VStack(...args: any[]): FunctionVStack | VStackClass {
    if (args.length === 0) {
        return viewFunc(VStackClass, (controller, propertyBag) => {
            return new VStackClass().setController(controller).PropertyBag(propertyBag);
        });
    } else if (args.length === 1 && typeof args[0] === 'object' && args[0].constructor === Object && !(args[0] instanceof UIView || args[0] instanceof UIController || args[0] instanceof Control)) {
        const params: VStackParams = args[0];
        /*  let alignment: Alignment = null;
         switch (params.alignment) {
             case cTopLeading:
                 alignment = Alignment.topLeading;
                 break;
             case cTop:
                 alignment = Alignment.top;
                 break;
             case cTopTrailing:
                 alignment = Alignment.topTrailing;
                 break;
             case cLeading:
                 alignment = Alignment.leading;
                 break;
             case cCenter:
                 alignment = Alignment.center;
                 break;
             case cTrailing:
                 alignment = Alignment.trailing;
                 break;
             case cBottomTrailing:
                 alignment = Alignment.bottomTrailing;
                 break;
             case cBottom:
                 alignment = Alignment.bottom;
                 break;
             case cBottomLeading:
                 alignment = Alignment.bottomLeading;
                 break;
         } */

        return (...views: UIView[]) => {
            return viewFunc(VStackClass, (controller, propertyBag) => {
                return new VStackClass().setController(controller).PropertyBag(propertyBag).setChilds(...views).alignment(params.alignment).spacing(params.spacing)
            });
        }
    } else {
        return viewFunc(VStackClass, (controller, propertyBag) => {
            return new VStackClass().setController(controller).PropertyBag(propertyBag).setChilds(...args);
        });
    }
}

export function Cache(useCache: boolean, builder: () => UIView): UIView {
    let child = null;
    if (useCache) {
        child = useMemo(() => {
            return builder();
        }, [])
    } else {
        child = builder();
    }
    return child;
}

/* export function _VStack(...subViews: (UIView | IControl | UIController)[]): VStackClass {
    return new VStackClass().setChilds(...subViews);
} */

export function AnimationStack(...subViews: (UIView | IControl | UIController)[]): VStackClass {
    return viewFunc(VStackClass, (controller, propertyBag) => {
        return new VStackClass().setController(controller).PropertyBag(propertyBag).setChilds(...subViews);
    });
}


export class FVStackClass extends VStackClass {

    public Render() {
        // if (this.HoverAppearance.IsEmpty && this.FocusAppearance.IsEmpty && this.ActiveAppearance.IsEmpty) {
        return (
            Teact.createElement('tuval-view-fvstack', { style: this.Appearance.StylePropertyBag }, this.CreateControls(this))
        )
        /*  } else {
             return (
                 Teact.createElement('tuval-view-vstack', {},
                     <ShadowRoot>
                         <style>{this.createStyles()}</style>
                         {this.CreateControls(this)}
                     </ShadowRoot>
                 )
             )
         } */
    }
}

export function FVStack(): FVStackClass;
export function FVStack(...views: (UIView | IControl | UIController)[]): FVStackClass;
export function FVStack(value: VStackParams): FunctionVStack;
export function FVStack(...args: any[]): FunctionVStack | FVStackClass {
    if (args.length === 0) {
        // return viewFunc(_VStackClass, (controller, propertyBag) => {
        return new FVStackClass()/* .setController(controller).PropertyBag(propertyBag) */;
        // });
    } else if (args.length === 1 && typeof args[0] === 'object' && args[0].constructor === Object && !(args[0] instanceof UIView || args[0] instanceof UIController || args[0] instanceof Control)) {
        const params: VStackParams = args[0];
        /*  let alignment: Alignment = null;
         switch (params.alignment) {
             case cTopLeading:
                 alignment = Alignment.topLeading;
                 break;
             case cTop:
                 alignment = Alignment.top;
                 break;
             case cTopTrailing:
                 alignment = Alignment.topTrailing;
                 break;
             case cLeading:
                 alignment = Alignment.leading;
                 break;
             case cCenter:
                 alignment = Alignment.center;
                 break;
             case cTrailing:
                 alignment = Alignment.trailing;
                 break;
             case cBottomTrailing:
                 alignment = Alignment.bottomTrailing;
                 break;
             case cBottom:
                 alignment = Alignment.bottom;
                 break;
             case cBottomLeading:
                 alignment = Alignment.bottomLeading;
                 break;
         } */

        return (...views: UIView[]) => {
            //return viewFunc(_VStackClass, (controller, propertyBag) => {
            return new FVStackClass()/* .setController(controller).PropertyBag(propertyBag) */.setChilds(...views).alignment(params.alignment).spacing(params.spacing)
            //});
        }
    } else {
        //return viewFunc(_VStackClass, (controller, propertyBag) => {
        return new FVStackClass()/* .setController(controller).PropertyBag(propertyBag) */.setChilds(...args);
        //});
    }
}
