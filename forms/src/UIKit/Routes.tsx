
import { TLabel } from "../windows/Forms/Components/AAA/TLabel/TLabel";
import { TLabelRenderer } from "../windows/Forms/Components/AAA/TLabel/TLabelRenderer";
import { UIView, ViewProperty } from "./UIView";
import { ILabel } from '../windows/Forms/Components/AAA/TLabel/ILabel';
import { int, foreach, StringBuilder, is } from "@tuval/core";
import { ControlHtmlRenderer } from "../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { currentController, UIController } from "./UIController";
import { getView, viewFunc } from "./getView";
import { Link, Route, Routes, useParams, Params, useNavigate, NavigateFunction, Outlet, HashRouter, useLocation, Navigate } from "../router-dom";
import { Teact } from "../windows/Forms/Components/Teact";
import { IRenderable } from "./IView";
import { useEffect, useState } from "../hooks";
import { BindingClass } from "./Binding";

let lastBindedLink = '';
let lastSubBindedLink1 = '';
let lastSubBindedLink2 = '';
let lastSubBindedLink3 = '';
let lastSubBindedLink4 = '';


export function $<T>(value: T): BindingClass<T> {
    return currentController.$$(value);
}

function createProxy<T>(thisarg) {
    return new Proxy(thisarg, {
        get: (target, property: string) => {

            return target[property];
        },
        set: (target, property: string, value, receiver) => {

            if (target[property] === value) {
                return true;
            }

            target[property] = value;


            // you have to return true to accept the changes
            return true;
        }
    });
}


class RoutesRenderer extends ControlHtmlRenderer<UIRoutesCLass> {
    /*  public get UseShadowDom(): boolean {
         return true;
     } */

    public GenerateElement(obj: UIRoutesCLass): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: UIRoutesCLass): void {

        this.WriteComponent(
            <Routes>
                {this.GetRoutes(obj)}
                {/*   <Route path="/" element={<div>Home</div>} />
                <Route path="/hello" element={<div>hello</div>} />
                <Route path="about" element={<div>about</div>} /> */}
            </Routes>
        );
    }
    protected GetRoutes(obj: UIRoutesCLass): any[] {

        const vNodes: any[] = [];
        foreach(obj.vp_Routes, (root: UIRouteClass) => {
            if (!is.nullOrEmpty(root.vp_RedirectTo)) {
                vNodes.push(<Route
                    path={root.vp_routePath}
                    element={<Navigate to={root.vp_RedirectTo} replace />}
                />);
            } else if (root.vp_IsIndex) {
                const controller = createProxy(new (root as any).vp_routeController());
                if (is.function(controller.initController)) {
                    controller.initController();
                }
                controller._location = useLocation();
                controller._params = useParams();
                controller.setTheme(obj.vp_Theme);
                vNodes.push(<Route index element={controller.CreateMainElement()}>
                    {this.getRouteChildRoutes(obj, root)}
                </Route>);
            } else {

                let controller = createProxy(new (root as any).vp_routeController());
                if (is.function(controller.initController)) {
                    controller.initController();
                }
                controller._location = useLocation();
                controller._params = useParams();
                controller.setTheme(obj.vp_Theme);
                vNodes.push(<Route path={root.vp_routePath} element={controller.CreateMainElement()}>
                    {this.getRouteChildRoutes(obj, root)}
                </Route>);
            }
        });
        return vNodes;
    }
    private getRouteChildRoutes(obj: UIRoutesCLass, route: UIRouteClass) {

        const vNodes = [];
        foreach(route.vp_ChildRoutes, root => {
            if (!is.nullOrEmpty(root.vp_RedirectTo)) {
                vNodes.push(<Route
                    path={root.vp_routePath}
                    element={<Navigate to={root.vp_RedirectTo} replace />}
                />);
            } else {

                let controller = createProxy(new (root as any).vp_routeController());
                if (is.function(controller.initController)) {
                    controller.initController();
                }
                controller._location = useLocation();
                controller._params = useParams();
                controller.setTheme(obj.vp_Theme);
                vNodes.push(<Route path={root.vp_routePath} element={controller.CreateMainElement()}>
                    {this.getRouteChildRoutes(obj, root)}
                </Route>);
            }
        })
        return vNodes;
    }

}
export class UIRoutesCLass extends UIView {
    @ViewProperty() vp_Routes: UIRouteClass[]

    @ViewProperty() vp_Theme: any;

    public setController(controller: UIController): this {
        super.setController(controller);

        this.Renderer = new RoutesRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }
    public constructor() {
        super();
        this.vp_Routes = [];
        this.Appearance.Display = 'flex';
        this.Appearance.Width = '100%';
        this.Appearance.Height = '100%';
    }

    public setRoutes(...routes: UIRouteClass[]): this {
        this.vp_Routes = routes;
        return this;
    }
    public setTheme(theme: any): this {
        this.vp_Theme = theme;
        return this;
    }
}

export function UIRoutes(...routes: UIRouteClass[]): UIRoutesCLass {
    return viewFunc(UIRoutesCLass, (controller, propertyBag) => {
        return new UIRoutesCLass().setController(controller).PropertyBag(propertyBag).setRoutes(...routes);
    });
}

class RouteRenderer extends ControlHtmlRenderer<UIRouteClass> {
    /*  public get UseShadowDom(): boolean {
         return true;
     }
  */
    public GenerateElement(obj: UIRouteClass): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: UIRouteClass): void {
        debugger;
        /*   const root = obj.vp_routeController.LoadView();
          const view = getView(obj.vp_routeController, root); */
        /* const params: any = useParams();
        (obj as any).vp_routeController.BindRouterParams(...params);
        this.WriteComponent(
            <Route path={obj.vp_routePath} element={obj.vp_routeController.CreateMainElement()} />
        ); */
    }
}

export type ControllerConstructor = new () => UIController;

export class UIRouteClass extends UIView {

    @ViewProperty() vp_routePath: string;
    @ViewProperty() vp_IsIndex: boolean;
    @ViewProperty() vp_routeController: ControllerConstructor;
    @ViewProperty() vp_ChildRoutes: UIRouteClass[];
    @ViewProperty() vp_RedirectTo: string;

    public setController(controller: UIController): this {
        super.setController(controller);

        this.Renderer = new RouteRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }
    public constructor() {
        super();
    }

    public setRoutePath(path: string): this {
        this.vp_routePath = path;
        return this;
    }
    public setRouteController(controller: ControllerConstructor) {
        this.vp_routeController = controller;
        return this;
    }
    public setChildRoutes(...value: UIRouteClass[]) {
        this.vp_ChildRoutes = value;
        return this;
    }

    public index(value: boolean) {
        this.vp_IsIndex = value;
        return this;
    }

    public redirectTo(value: string): this {
        this.vp_RedirectTo = value;
        return this;
    }

}

type UIRouteFunction = (path: string, routeController: ControllerConstructor) => UIRouteClass;

export function UIRoute(path: string, routeController: ControllerConstructor): UIRouteClass;
export function UIRoute(...childRoutes: UIRouteClass[]): UIRouteFunction;
export function UIRoute(...args: any[]): UIRouteClass | UIRouteFunction {
    if (args.length > 0 && args[0] instanceof UIRouteClass) {
        const childRoutes = args;
        return (path: string, routeController: ControllerConstructor) => {
            return new UIRouteClass().setRoutePath(path).setRouteController(routeController).setChildRoutes(...childRoutes);
        }
    } else if (args.length === 2) {
        const path: string = args[0];
        const routeController: ControllerConstructor = args[1];
        return new UIRouteClass().setRoutePath(path).setRouteController(routeController);
    }

}



//---------------------------------

class LinkRenderer extends ControlHtmlRenderer<UIRouteLinkCLass> {
    /*  public get UseShadowDom(): boolean {
         return true;
     } */

    public OnStyleCreating(obj: UIRouteLinkCLass, sb: StringBuilder): void {
        sb.AppendLine(`
            a, a:hover, a:focus, a:active {
                text-decoration: none;
                color: inherit;
            }
        `);
    }

    public GenerateElement(obj: UIRouteLinkCLass): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: UIRouteLinkCLass): void {

        /*   const root = obj.vp_routeController.LoadView();
          const view = getView(obj.vp_routeController, root); */

        this.WriteComponent(
            <Link to={obj.vp_link} state={obj.vp_State}>
                {this.CreateControls(obj)}
            </Link>
        );
    }
    protected CreateControls(obj: UIRouteLinkCLass): any[] {
        const vNodes: any[] = [];

        let viewCount = obj.GetViews().length;
        let index = 0;
        foreach(obj.GetViews(), (root: IRenderable) => {
            const view = getView(obj instanceof UIController ? obj : (obj as any).controller, root);
            if (view != null) {
                vNodes.push(view.Render());
            }
            index++;
        });

        return vNodes;
    }
}
export class UIRouteLinkCLass extends UIView {

    @ViewProperty() vp_link: string;

    @ViewProperty() vp_State: any;



    public setController(controller: UIController): this {
        super.setController(controller);

        this.Renderer = new LinkRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }
    public constructor() {
        super();
    }

    public link(path: string): this {
        this.vp_link = path;
        return this;
    }

    public state(value: any): this {
        this.vp_State = value;
        return this;
    }



}




type FunctionUIRouteLink = (...views: UIView[]) => UIRouteLinkCLass;

export function UIRouteLink(path: string, state?: any): FunctionUIRouteLink {
    return (...views: UIView[]) => {
        return viewFunc(UIRouteLinkCLass, (controller, propertyBag) => {
            //console.log(views);
            const a: any = new UIRouteLinkCLass().setController(controller).PropertyBag(propertyBag).setChilds(...views).link(path).state(state);
            /*  console.log('Views');
             console.log(a.SubViews); */
            return a;
        });
    }
}


//---Outlet


class OutletRenderer extends ControlHtmlRenderer<UIRouteOutletClass> {
    /*   public get UseShadowDom(): boolean {
          return true;
      } */

    public OnStyleCreating(obj: UIRouteOutletClass, sb: StringBuilder): void {

    }

    public GenerateElement(obj: UIRouteOutletClass): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: UIRouteOutletClass): void {

        /*   const root = obj.vp_routeController.LoadView();
          const view = getView(obj.vp_routeController, root); */

        this.WriteComponent(
            <Outlet />
        );
    }

}
export class UIRouteOutletClass extends UIView {

    public setController(controller: UIController): this {
        super.setController(controller);

        this.Renderer = new OutletRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }
    public constructor() {
        super();
    }
}

export function UIRouteOutlet(): UIRouteOutletClass {
    return viewFunc(UIRouteOutletClass, (controller, propertyBag) => {
        return new UIRouteOutletClass().setController(controller).PropertyBag(propertyBag);
    });
}



//-----
// Navigate


class UINavigateRenderer extends ControlHtmlRenderer<UINavigateClass> {
    /*  public get UseShadowDom(): boolean {
         return true;
     } */

    public OnStyleCreating(obj: UINavigateClass, sb: StringBuilder): void {

    }

    public GenerateElement(obj: UINavigateClass): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: UINavigateClass): void {

        /*   const root = obj.vp_routeController.LoadView();
          const view = getView(obj.vp_routeController, root); */

        this.WriteComponent(
            <Navigate to={obj.vp_To} replace={true} />
        )
    }

}
export class UINavigateClass extends UIView {

    @ViewProperty() vp_To: string;

    public setController(controller: UIController): this {
        super.setController(controller);

        this.Renderer = new UINavigateRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }
    public constructor() {
        super();
    }

    public to(value: string): this {
        this.vp_To = value;
        return this;
    }
}

export function UINavigate(): UINavigateClass {
    return viewFunc(UINavigateClass, (controller, propertyBag) => {
        return new UINavigateClass().setController(controller).PropertyBag(propertyBag);
    });
}


//-----
export function getRouterParams<
    ParamsOrKey extends string | Record<string, string | undefined> = string
>(): Readonly<
    [ParamsOrKey] extends [string] ? Params<ParamsOrKey> : Partial<ParamsOrKey>
> {
    return useParams();
}

export function bindNavigate(): NavigateFunction {
    return useNavigate();
}