import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { UIView } from "../UIView";
import { foreach } from '@tuval/core';
import { getView, viewFunc } from "../getView";
import { IRenderable } from "../IView";
import { UIController } from "../UIController";
import { IControl } from "../../windows/Forms/Components/AAA/IControl";
import { Control } from "../../windows/Forms/Components/AAA/Control";
import { Teact } from "../../windows/Forms/Components/Teact";



class BodyRenderer extends ControlHtmlRenderer<BodyClass> {

    public OnCustomAttributesCreating(obj: BodyClass, attributeObject: any): void {

    }

    public GenerateElement(obj: BodyClass): boolean {
        this.WriteStartElement('tbody');

        return true;
    }
    public GenerateBody(obj: BodyClass): void {
        this.WriteStartElement('tr');

        const nodes = this.CreateControls(obj);
        foreach(nodes, node => {
            this.WriteComponent(
                <td>
                    {node}
                </td>
            )
        });

        this.WriteEndElement();
    }

    protected CreateControls(obj: BodyClass): any[] {
        const vNodes: any[] = [];
        if (obj.Controls != null) {
            foreach(obj.Controls, (control) => {
                vNodes.push((control as any).CreateMainElement());
            });
        }
        if (obj.GetViews != null) {
            let viewCount = obj.GetViews().length;
            let index = 0;
            foreach(obj.GetViews(), (root: IRenderable) => {
                const view = getView(obj instanceof UIController ? obj : (obj as any).controller, root);
                if (view != null) {
                    vNodes.push(view.Render());
                }
                index++;
            });
        }
        return vNodes;
    }

}

export class BodyClass extends UIView {
    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new BodyRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });
        return this;
    }
}


export interface BodyParams {

}

export type FunctionBody = (...views: UIView[]) => BodyClass;

export function TBody(): BodyClass;
export function TBody(...views: (UIView | IControl | UIController)[]): BodyClass;
export function TBody(value: BodyParams): FunctionBody;
export function TBody(...args: any[]): FunctionBody | BodyClass {
    if (args.length === 0) {
        return viewFunc(BodyClass, (controller, propertyBag) => {
            return new BodyClass().setController(controller).PropertyBag(propertyBag);
        });
    } else if (args.length === 1 && typeof args[0] === 'object' && args[0].constructor === Object && !(args[0] instanceof UIView || args[0] instanceof UIController || args[0] instanceof Control)) {
        const params: BodyParams = args[0];

        return (...views: UIView[]) => {
            return viewFunc(BodyClass, (controller, propertyBag) => {
                return new BodyClass().setController(controller).PropertyBag(propertyBag).setChilds(...views);
            });
        }
    } else {
        return viewFunc(BodyClass, (controller, propertyBag) => {
            return new BodyClass().setController(controller).PropertyBag(propertyBag).setChilds(...args);
        });
    }
}