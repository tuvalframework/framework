import { foreach } from "@tuval/core";
import { useForm } from "../hook-form/useForm";
import { FormProvider, useFormContext } from "../hook-form/useFormContext";
import { useMemo } from "../hooks";
import { ControlHtmlRenderer } from "../windows/Forms/Components/AAA/HTMLRenderer";
import { Teact } from "../windows/Forms/Components/Teact";
import { getView, viewFunc } from "./getView";
import { IRenderable } from "./IView";
import { UIController } from "./UIController";
import { UIView, ViewProperty } from "./UIView";


class UIFormRenderer extends ControlHtmlRenderer<UIFormClass> {



    public GenerateElement(obj: UIFormClass): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: UIFormClass): void {
        performance.mark('start');

        if (!obj.Visible) {
            return;
        }

        const defaultValues = {
            name: '',
            email: '',
            password: '',
            date: null,
            country: null,
            accept: false
        }

        const methods = useForm();



        const onSubmit = data => console.log(data);

        this.WriteComponent(
            <FormProvider {...methods} >
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                      {this.CreateControls(obj)}
                    <input type="submit" />
                </form>
            </FormProvider>
        );

        function NestedInput() {
            const { register } = useFormContext(); // retrieve all hook methods
            return <input {...register("name")} />;
        }



        performance.mark('end');
        performance.measure(obj.vp_Alias + '_Performance', 'start', 'end');
    }

    protected CreateControls(obj: UIFormClass): any[] {
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

}


export class UIFormClass extends UIView {

    /** @internal */
    @ViewProperty() vp_Spacing: string;

    /** @internal */
    @ViewProperty() vp_Alignment: string;

    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new UIFormRenderer({
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
}


export function UIFormView(...content: UIView[]): UIFormClass {
    return viewFunc(UIFormClass, (controller, propertyBag) => {
        return new UIFormClass().setController(controller).PropertyBag(propertyBag).setChilds(...content);
    });
}
