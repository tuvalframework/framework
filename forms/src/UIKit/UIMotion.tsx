import { ControlHtmlRenderer } from "../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { UIView, ViewProperty } from "./UIView";
import { foreach, StringBuilder } from '@tuval/core';
import { Teact } from "../windows/Forms/Components/Teact";
import { TeactCSSTransition } from '../windows/Forms/Components/csstransition/TeactCSSTransition';
import { IRenderable } from "./IView";
import { IControl } from "../windows/Forms/Components/AAA/IControl";
import { UIController } from "./UIController";
import { viewFunc, getView } from './getView';
import { motion } from "../motion";

export class UIMotionRenderer extends ControlHtmlRenderer<UIMotionClass> {

    public get UseShadowDom(): boolean {
        return true;
    }

    public GenerateElement(obj: UIMotionClass): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: UIMotionClass): void {
        if (!obj.Visible) {
            return;
        }

        const button = {
            rest: { scale: 1 },
            hover: { scale: 1.1 },
            pressed: { scale: 0.95 }
        };

        /* variants={button} initial="rest" whileHover="hover" whileTap="pressed" */

        this.WriteComponent(
            <motion.div animate={obj._animate}
                whileHover={obj._whileHover}
                whileTap={obj._whileTap}
                whileDrag={obj._whileDrag}
                whileFocus={obj._whileFocus}
            >
                {this.CreateControls(obj)}
            </motion.div>
        );

    }
    protected CreateControls(obj: UIMotionClass): any[] {
        const vNodes: any[] = [];
        if (obj.GetViews != null) {
            foreach(obj.GetViews(), (view: IRenderable) => {
                const rootView = getView(obj.controller, view);
                if (rootView != null) {
                    vNodes.push(rootView.Render());
                }
            });
        }
        return vNodes;
    }

}
export class UIMotionClass extends UIView {

    @ViewProperty() _animate: any;
    @ViewProperty() _whileHover: any;
    @ViewProperty() _whileTap: any;
    @ViewProperty() _whileDrag: any;
    @ViewProperty() _whileFocus: any;
    @ViewProperty() _whileInView: any;
    @ViewProperty() _exit: any;

    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new UIMotionRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });
        return this;
    }
    public constructor() {
        super();

        this._animate = {};
        this._whileHover = {};
        this._whileTap = {};
        this._whileDrag = {};
        this._whileFocus = {};
    }
    public animate(value: any): this {
        this._animate = value;
        return this;
    }
    public hover(value: any): this {
        this._whileHover = value;
        return this;
    }

    public tap(value: any): this {
        this._whileHover = value;
        return this;
    }
    public drag(value: any): this {
        this._whileDrag = value;
        return this;
    }
    public focus(value: any): this {
        this._whileFocus = value;
        return this;
    }
}

export function UIMotion(...subViews: (UIView | IControl | UIController)[]): UIMotionClass {
    return viewFunc(UIMotionClass, (controller, propertyBag) => {
        return new UIMotionClass().setController(controller).PropertyBag(propertyBag).setChilds(...subViews);
    });
}