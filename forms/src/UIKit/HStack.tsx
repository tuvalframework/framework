import { foreach, int, is, Event, StringBuilder } from '@tuval/core';
import { IVirtualContainer, TContainerControlRenderer, TFlexColumnContainer, TFlexRowContainer } from "../windows/Forms/Components/AAA/Panel";
import { Alignment, UIView, ViewProperty } from "./UIView";
import { UIController } from './UIController';
import { IControl } from "../windows/Forms/Components/AAA/IControl";
import { AlignmentType, cBottom, cBottomLeading, cBottomTrailing, cCenter, cLeading, cTop, cTopLeading, cTopTrailing, cTrailing } from './Constants';
import { Control } from '../windows/Forms/Components/AAA/Control';
import { getView, viewFunc } from './getView';
import { ControlHtmlRenderer } from '../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer';
import { IRenderable } from './IView';
import { ControlCollection } from '../windows/Forms/Components/AAA/ControlCollection';
import { Teact } from '../windows/Forms/Components/Teact';
import { ShadowRoot } from "../windows/Forms/Components/ShadowRoot/ShadowRoot";
import { useMemo } from '../hooks';
import { Tooltip } from './Components/tooltip/Tooltip';

// DomHandler.addCssToDocument('./HStack.css');

export class HStackRenderer extends ControlHtmlRenderer<HStackClass> {
    public ChildrenCreating: Event<any> = new Event();
    public get UseShadowDom(): boolean {
        return true;
    }
    public OnStyleCreating(obj: HStackClass, sb: StringBuilder): void {
        sb.AppendLine(`
        /* total width */
        :host::-webkit-scrollbar {
            display: block;
            background-color: rgb(255,255,255,0%);
            width: 10px;
        }

        :host(:hover)::-webkit-scrollbar {
            width: 10px;
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

        :host(:hover)::-webkit-scrollbar-thumb {
            background-color: #babac0;
        }

        /* set button(top and bottom of the scrollbar) */
        :host::-webkit-scrollbar-button {
            display:none;
        }


        `);

        if (obj.Tooltip) {
            sb.AppendLine(`


              .tooltiptext {
                visibility: hidden;
                width: 120px;
                background-color: black;
                color: #fff;
                text-align: center;
                border-radius: 6px;
                padding: 5px 0;
                position: absolute;
                z-index: 1;
                top: 130%;
                left: 50%;
                margin-left: -60px;
              }

              .tooltiptext::after {
                content: "";
                position: absolute;
                bottom: 100%;
                left: 50%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: transparent transparent black transparent;
              }

              :host(:hover) .tooltiptext {
                visibility: visible;
              }

               .tooltiptext {
                opacity: 0;
              }

              :host(:hover)  .tooltiptext {
                opacity: 1;
                transition: opacity  0s linear 1s;
              }

            `);
        }

        const beforeStyleObject = obj.BeforeAppearance.GetStyleObject();
        if (!!Object.keys(beforeStyleObject).length) {
            let css: string = `.before-element:before {
           ${obj.BeforeAppearance.ToString()}
        }`;
            sb.AppendLine(css);
        }
    }

    public GenerateElement(obj: HStackClass): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: HStackClass): void {
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


        const beforeStyleObject = obj.BeforeAppearance.GetStyleObject();
        if (!!Object.keys(beforeStyleObject).length) {
            const style = {};
            style['position'] = 'absolute';
            style['width'] = '100%';
            style['height'] = '100%';
            style['zIndex'] = '-1000';

            this.WriteComponent(<i class={'before-element'} style={style}></i>)
        }



        performance.mark('end');
        performance.measure(obj.vp_Alias + '_Performance', 'start', 'end');

    }

    protected CreateControls(obj: HStackClass): any[] {
        const vNodes: any[] = [];

        if (obj.Tooltip) {
            vNodes.push(<span class="tooltiptext">{obj.Tooltip}</span>)
        }

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
                if (view != null && index !== viewCount - 1 && obj.Spacing != null) {
                    view.Appearance.MarginRight = obj.Spacing;
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

export class HStackClass extends UIView {

    /** @internal */
    @ViewProperty() Spacing: string;

    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new HStackRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });
        return this;
    }

    public constructor() {
        super();
        this.Appearance.FlexDirection = 'row';

        this.Appearance.Display = 'flex';
        this.Appearance.Width = '100%';
        this.Appearance.Height = '100%';
        this.Appearance.AlignContent = 'center';
        this.Appearance.JustifyContent = 'center';

        this.Appearance.AlignItems = 'center';
        this.Appearance.JustifyItems = 'center';
        this.Appearance.Transition = '200ms cubic-bezier(0, 0, 0.2, 1) 0ms';
    }

    Controls: ControlCollection<any, any>;
    public GetViews(): IRenderable[] {
        return this.SubViews.ToArray();
    }

    /** @internal */
    spacing(value: int): this;
    /** @internal */
    spacing(value: string): this;
    /** @internal */
    spacing(...args: any[]): this {
        if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Spacing = value;
            return this;
        } else if (args.length === 1 && is.int(args[0])) {
            const value: int = args[0];
            this.Spacing = `${value}px`;
            return this;
        }

        return this;
        /*   setTimeout(()=> {throw 'ArgumentOutOfRange Exception in HStack::spacing'}, 100) */

    }

    /** @internal */
    alignment(value: AlignmentType) {
        if (value == null) {
            return this;
        }

        if (value === cTopLeading) {
            this.Appearance.JustifyContent = 'start';
            this.Appearance.AlignContent = 'start';

            this.Appearance.JustifyItems = 'start';
            this.Appearance.AlignItems = 'start';



        } else if (value === cTop) {
            this.Appearance.JustifyContent = 'center';
            this.Appearance.AlignContent = 'start';

            this.Appearance.JustifyItems = 'center';
            this.Appearance.AlignItems = 'start';


        } else if (value === cTopTrailing) {
            this.Appearance.JustifyContent = 'end';
            this.Appearance.AlignContent = 'start';

            this.Appearance.JustifyItems = 'end';
            this.Appearance.AlignItems = 'start';



        } else if (value === cLeading) {
            this.Appearance.JustifyContent = 'start';
            this.Appearance.AlignContent = 'center';

            this.Appearance.JustifyItems = 'start';
            this.Appearance.AlignItems = 'center';

        } else if (value === cCenter) {
            this.Appearance.JustifyContent = 'center';
            this.Appearance.AlignContent = 'center';

            this.Appearance.JustifyItems = 'center';
            this.Appearance.AlignItems = 'center';


        } else if (value === cTrailing) {
            this.Appearance.JustifyContent = 'end';
            this.Appearance.AlignContent = 'center';

            this.Appearance.JustifyItems = 'end';
            this.Appearance.AlignItems = 'center';

        } else if (value === cBottomLeading) {
            this.Appearance.JustifyContent = 'start';
            this.Appearance.AlignContent = 'end';

            this.Appearance.JustifyItems = 'start';
            this.Appearance.AlignItems = 'end';

        } else if (value === cBottom) {
            this.Appearance.JustifyContent = 'center';
            this.Appearance.AlignContent = 'end';

            this.Appearance.JustifyItems = 'center';
            this.Appearance.AlignItems = 'end';

        } else if (value === cBottomTrailing) {
            this.Appearance.JustifyContent = 'end';
            this.Appearance.AlignContent = 'end';

            this.Appearance.JustifyItems = 'end';
            this.Appearance.AlignItems = 'end';

        }
        return this;
    }
}



interface HStackParams {
    alignment?: AlignmentType;
    spacing?: int;
}
type FunctionVStack = (...views: UIView[]) => HStackClass;


export function HStack(): HStackClass | FunctionVStack;
export function HStack(...views: (UIView | IControl | UIController)[]): HStackClass;
export function HStack(value: HStackParams): FunctionVStack;
export function HStack(...args: any[]): FunctionVStack | HStackClass {
    if (args.length === 0) {
        return viewFunc(HStackClass, (controller, propertyBag) => {
            return new HStackClass().setController(controller).PropertyBag(propertyBag);
        });
    } else if (args.length === 1 && typeof args[0] === 'object' && args[0].constructor === Object && !(args[0] instanceof UIView || args[0] instanceof UIController || args[0] instanceof Control)) {
        const params: HStackParams = args[0];
        return (...views: UIView[]) => {
            return viewFunc(HStackClass, (controller, propertyBag) => {
                return new HStackClass().setController(controller).PropertyBag(propertyBag).setChilds(...views).alignment(params.alignment).spacing(params.spacing);
            });
        }
    } else {
        return viewFunc(HStackClass, (controller, propertyBag) => {
            return new HStackClass().setController(controller).PropertyBag(propertyBag).setChilds(...args);
        });
    }
}

/* export function _HStack(...subViews: (UIView | IControl | UIController)[]): HStackClass {
    return new HStackClass().setChilds(...subViews);
} */


export class FHStackClass extends UIView {

    /** @internal */
    @ViewProperty() Spacing: string;

    public constructor() {
        super();
        this.Appearance.FlexDirection = 'row';

        this.Appearance.Display = 'flex';
        this.Appearance.Width = '100%';
        this.Appearance.Height = '100%';
        this.Appearance.AlignContent = 'center';
        this.Appearance.JustifyContent = 'center';

        this.Appearance.AlignItems = 'center';
        this.Appearance.JustifyItems = 'center';
    }

    Controls: ControlCollection<any, any>;
    public GetViews(): IRenderable[] {
        return this.SubViews.ToArray();
    }

    /** @internal */
    spacing(value: int): this;
    /** @internal */
    spacing(value: string): this;
    /** @internal */
    spacing(...args: any[]): this {
        if (args.length === 1 && is.string(args[0])) {
            const value: string = args[0];
            this.Spacing = value;
            return this;
        } else if (args.length === 1 && is.int(args[0])) {
            const value: int = args[0];
            this.Spacing = `${value}px`;
            return this;
        }

        return this;
        /*   setTimeout(()=> {throw 'ArgumentOutOfRange Exception in HStack::spacing'}, 100) */

    }

    /** @internal */
    alignment(value: AlignmentType) {
        if (value == null) {
            return this;
        }

        if (value === cTopLeading) {
            this.Appearance.JustifyContent = 'start';
            this.Appearance.AlignContent = 'start';

            this.Appearance.JustifyItems = 'start';
            this.Appearance.AlignItems = 'start';



        } else if (value === cTop) {
            this.Appearance.JustifyContent = 'center';
            this.Appearance.AlignContent = 'start';

            this.Appearance.JustifyItems = 'center';
            this.Appearance.AlignItems = 'start';


        } else if (value === cTopTrailing) {
            this.Appearance.JustifyContent = 'end';
            this.Appearance.AlignContent = 'start';

            this.Appearance.JustifyItems = 'end';
            this.Appearance.AlignItems = 'start';



        } else if (value === cLeading) {
            this.Appearance.JustifyContent = 'start';
            this.Appearance.AlignContent = 'center';

            this.Appearance.JustifyItems = 'start';
            this.Appearance.AlignItems = 'center';

        } else if (value === cCenter) {
            this.Appearance.JustifyContent = 'center';
            this.Appearance.AlignContent = 'center';

            this.Appearance.JustifyItems = 'center';
            this.Appearance.AlignItems = 'center';


        } else if (value === cTrailing) {
            this.Appearance.JustifyContent = 'end';
            this.Appearance.AlignContent = 'center';

            this.Appearance.JustifyItems = 'end';
            this.Appearance.AlignItems = 'center';

        } else if (value === cBottomLeading) {
            this.Appearance.JustifyContent = 'start';
            this.Appearance.AlignContent = 'end';

            this.Appearance.JustifyItems = 'start';
            this.Appearance.AlignItems = 'end';

        } else if (value === cBottom) {
            this.Appearance.JustifyContent = 'center';
            this.Appearance.AlignContent = 'end';

            this.Appearance.JustifyItems = 'center';
            this.Appearance.AlignItems = 'end';

        } else if (value === cBottomTrailing) {
            this.Appearance.JustifyContent = 'end';
            this.Appearance.AlignContent = 'end';

            this.Appearance.JustifyItems = 'end';
            this.Appearance.AlignItems = 'end';

        }
        return this;
    }

    protected CreateControls(obj: FHStackClass): any[] {
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
                if (view != null && index !== viewCount - 1 && obj.Spacing != null) {
                    view.Appearance.MarginRight = obj.Spacing;
                }

                if (view != null) {
                    vNodes.push(view.Render());
                }
                index++;
            });
        }

        return vNodes;
    }

    public Render() {
        return (
            Teact.createElement('tuval-view-fhstack', { style: this.Appearance.StylePropertyBag }, this.CreateControls(this))
        )
    }
}


export function FHStack(): FHStackClass | FunctionVStack;
export function FHStack(...views: (UIView | IControl | UIController)[]): FHStackClass;
export function FHStack(value: HStackParams): FunctionVStack;
export function FHStack(...args: any[]): FunctionVStack | FHStackClass {
    if (args.length === 0) {
        //return viewFunc(_HStackClass, (controller, propertyBag) => {
        return new FHStackClass()/* .setController(controller).PropertyBag(propertyBag) */;
        //});
    } else if (args.length === 1 && typeof args[0] === 'object' && args[0].constructor === Object && !(args[0] instanceof UIView || args[0] instanceof UIController || args[0] instanceof Control)) {
        const params: HStackParams = args[0];
        return (...views: UIView[]) => {
            //return viewFunc(_HStackClass, (controller, propertyBag) => {
            return new FHStackClass()/* .setController(controller).PropertyBag(propertyBag) */.setChilds(...views).alignment(params.alignment).spacing(params.spacing);
            //});
        }
    } else {
        return viewFunc(FHStackClass, (controller, propertyBag) => {
            return new FHStackClass()/* .setController(controller).PropertyBag(propertyBag) */.setChilds(...args);
        });
    }
}