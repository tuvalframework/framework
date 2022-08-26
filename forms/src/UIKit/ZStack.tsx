import { ClassInfo, foreach, StringBuilder } from '@tuval/core';
import { ControlHtmlRenderer } from "../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { IControl } from '../windows/Forms/Components/AAA/IControl';
import { TContainerControlRenderer } from '../windows/Forms/Components/AAA/Panel';
import { ControlTypes } from '../windows/Forms/Components/ControlTypes';
import { Teact } from '../windows/Forms/Components/Teact';
import { viewFunc, getView } from './getView';
import { IRenderable } from './IView';
import { UIController } from "./UIController";
import { UIView } from "./UIView";


export class ZStackRenderer extends ControlHtmlRenderer<ZStackClass> {
    public get UseShadowDom(): boolean {
        return true;
    }

    public GenerateElement(obj: ZStackClass): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: ZStackClass): void {
        if (!obj.Visible) {
            return;
        }

        this.WriteComponent(this.CreateControls(obj));
    }
    protected CreateControls(obj: ZStackClass): any[] {
        const vNodes: any[] = [];
        let index = 0;
        if (obj.GetViews != null) {
            foreach(obj.GetViews(), (root: IRenderable) => {
                const view = getView(obj instanceof UIController ? obj : (obj as any).controller, root);

                view.Appearance.Position = 'absolute';
                view.Appearance.ZIndex = index.toString();
                //const zStackItem = (<div style={{ zIndex: index, position: 'absolute', width:'100%', height:'100%' }}>{view.Render()}</div>);
                vNodes.push(view.Render());
                index++;
            });
        }


        return vNodes;
    }
}

@ClassInfo({
    fullName: ControlTypes.UIKit.ZStack,
    instanceof: [
        ControlTypes.UIKit.ZStack
    ]
})
export class ZStackClass extends UIView {

    public setController(controller: UIController): this {
        super.setController(controller);

        this.Renderer = new ZStackRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }
    public constructor() {
        super();

        this.Appearance.Display = 'flex';
        this.Appearance.Width = '100%';
        this.Appearance.Height = '100%';
    }


    public setChilds(...args: (UIView | IControl | UIController)[]) {
        super.setChilds(...args);

        // Z-Stack full view in childs
        foreach(this.SubViews as any, (view: UIView) => {
            /*  view.Appearance.Width = '100%';
             view.Appearance.Height = '100%'; */
        })
        return this;
    }
}

export function ZStack(...subViews: (UIView | IControl | UIController)[]): ZStackClass {
    return viewFunc(ZStackClass, (controller, propertyBag) => {
        return new ZStackClass().setController(controller).PropertyBag(propertyBag).setChilds(...subViews);
    });
}
