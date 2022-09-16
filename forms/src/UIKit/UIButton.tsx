import { Button, ButtonColors } from '../windows/Forms/Components/AAA/Button/Button';
import { UIView, ViewProperty } from './UIView';
import { Control, ControlCollection, ControlHtmlRenderer, IVirtualContainer, TContainerControlRenderer, TTextBox } from '../windows/Forms/Components';
import { Teact } from '../windows/Forms/Components/Teact';
import { ButtonHtmlRenderer } from '../windows/Forms/Components/AAA/Button/ButtonHtmlRenderer';
import { IButton } from '../windows/Forms/Components/AAA/Button/IButton';
import { Event, StringBuilder, foreach } from '@tuval/core';
import { Border } from '../windows/Forms/Border';
import { AppearanceObject } from '../windows/Forms/Components/AAA/AppearanceObject';
import { Message } from '../windows/Forms/Components/AAA/Message';
import { Margin } from '../windows/Forms/Margin';
import { Padding } from '../windows/Forms/Padding';
import { IRenderable } from './IView';
import { UIController } from './UIController';
import { IControl } from '../windows/Forms/Components/AAA/IControl';
import { getView, viewFunc } from './getView';


class ButtonRenderer extends ControlHtmlRenderer<UIButtonClass> {
    public ChildrenCreating: Event<any> = new Event();
  /*   public get UseShadowDom(): boolean {
        return true;
    } */

    public OnCustomAttributesCreating(obj: UIButtonClass, attributeObject: any): void {

        /*   attributeObject['alignment'] = obj.vp_Alignment;
          attributeObject['spacing'] = obj.vp_Spacing; */

        if (obj.vp_Disabled) {
            attributeObject['disabled'] = 'true';
        }

    }

    public OnStyleCreating(obj: UIButtonClass, sb: StringBuilder): void {
        const beforeStyleObject = obj.BeforeAppearance.GetStyleObject();
        if (beforeStyleObject != null) {
            let css: string = `.before-element:before {
           ${obj.BeforeAppearance.ToString()}
        }`;
            sb.AppendLine(css);
        }
    }

    public GenerateElement(obj: UIButtonClass): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: UIButtonClass): void {
        performance.mark('start');

        if (!obj.Visible) {
            return;
        }

        const beforeStyleObject = obj.BeforeAppearance.GetStyleObject();
        if (beforeStyleObject != null) {
            const style = {};
            style['position'] = 'absolute';
            style['width'] = '100%';
            style['height'] = '100%';

            this.WriteComponent(<i class={'before-element'} style={style}></i>)
        }


        this.WriteComponent(
            this.CreateControls(obj));



        performance.mark('end');
        performance.measure(obj.vp_Alias + '_Performance', 'start', 'end');
    }

    protected CreateControls(obj: UIButtonClass): any[] {
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

export class UIButtonClass extends UIView implements IVirtualContainer {

    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new ButtonRenderer/* TContainerControlRenderer */({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }

    public constructor() {
        super();


        this.Appearance.Cursor = 'pointer';
        this.Appearance.Display = 'flex';
        this.Appearance.AlignItems = 'center';
        this.Appearance.JustifyContent = 'center';
    }

    @ViewProperty()
    Controls: ControlCollection<any, any>;

    public GetViews(): IRenderable[] {
        return this.SubViews.ToArray();
    }

    public action(actionFunc: Function) {
        this.onClick(actionFunc);
        return this;
    }
}


/* export function UIButton(text?: string): UIButtonClass {
    return new UIButtonClass().text(text);
} */
export function UIButton(...subViews: (UIView | IControl | UIController)[]): UIButtonClass {
    //return viewFunc(UIButtonClass, (controller, propertyBag) => {
    return new UIButtonClass().setController(null)/* .PropertyBag(propertyBag) */.setChilds(...subViews);
    //});
}
export class UITextFieldClass extends UIView {
    private textEdit: TTextBox;

    public setController(controller: UIController): this {
        super.setController(controller);
        return this;
    }
    public constructor() {
        super();
        this.textEdit = new TTextBox();
    }
    public text(value: string) {
        this.textEdit.Text = value;
        return this;
    }
    public GetControl(): Control {
        return this.textEdit;
    }
}

export function UITextField(): UITextFieldClass {
    return viewFunc(UITextFieldClass, (controller, propertyBag) => {
        return new UITextFieldClass().setController(controller).PropertyBag(propertyBag);
    });
}