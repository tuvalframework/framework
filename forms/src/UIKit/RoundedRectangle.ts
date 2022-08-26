import { UIController } from './UIController';
import { ControlHtmlRenderer } from "../tuval-forms";
import { UIView } from "./UIView";
import { viewFunc } from "./getView";

class RoundedRectangleRenderer extends ControlHtmlRenderer<RoundedRectangleClass> {
    public get UseShadowDom(): boolean {
        return true;
    }
    public GenerateElement(obj: RoundedRectangleClass): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: RoundedRectangleClass): void {

    }
}
export class RoundedRectangleClass extends UIView {

    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new RoundedRectangleRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });
        return this;
    }


    public constructor() {
        super();

        this.Appearance.Display = 'flex';
        this.Appearance.Width = '100%'
        this.Appearance.Height = '100%'
    }
}

export function RoundedRectangle(): RoundedRectangleClass {
    return viewFunc(RoundedRectangleClass, (controller, propertyBag) => {
        return new RoundedRectangleClass().setController(controller).PropertyBag(propertyBag);
    });
}

