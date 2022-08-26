
import { Control } from "../windows/Forms/Components/AAA/Control";
import { ControlHtmlRenderer } from "../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { viewFunc } from "./getView";
import { UIController } from "./UIController";
import { UIView } from "./UIView";

class DividerControlRenderer extends ControlHtmlRenderer<DividerClass> {
    public get UseShadowDom(): boolean {
        return true;
    }

    public GenerateElement(obj: DividerClass): boolean {
        this.WriteStartElement('div');
        return true;
    }
    public GenerateBody(obj: DividerClass): void {
        this.WriteStyleAttrVal('width', obj.Appearance.Width);
        this.WriteStyleAttrVal('height', obj.Appearance.Height);
        this.WriteStyleAttrVal('background', obj.Appearance.Background);
        this.WriteStyleAttrVal('backgroundImage', obj.Appearance.BackgroundImage);
    }
}

export class DividerClass extends UIView {

    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new DividerControlRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });
        return this;
    }
}

export function VDivider(): DividerClass {
    //return viewFunc(DividerClass, (controller, propertyBag) => {
        return new DividerClass().setController(null/* controller */).height('100%').width('1px')/* .PropertyBag(propertyBag) */;
    //});
}
export function HDivider(): DividerClass {
    //return viewFunc(DividerClass, (controller, propertyBag) => {
        return new DividerClass().setController(null/* controller */).width('100%').height('1px')/* .PropertyBag(propertyBag) */;
    //});
}