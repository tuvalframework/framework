import { FontIconRenderer } from './FontIconRenderer';
import { CGColor } from "@tuval/cg";
import { UIView, ViewProperty } from "../../../../../UIKit/UIView";
import { IFontIcon } from "./IFontIcon";
import { int, is } from '@tuval/core';
import { UIController } from '../../../../../UIKit/UIController';
import { viewFunc } from '../../../../../UIKit/getView';
import { IconType } from './IconLibrary';




export class UIIconClass extends UIView implements IFontIcon {

    /** @internal */
    @ViewProperty() FontFamily: string;


    /** @internal */
    @ViewProperty() Size: number;

    /** @internal */
    @ViewProperty() Color: CGColor = CGColor.Empty;

    public setController(controller: UIController): this {
        super.setController(controller);

        this.Renderer = new FontIconRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }
    public constructor() {
        super();
        this.FontFamily = 'TuvalProcetraIcons';
        this.Size = 12;
        this.Color = CGColor.Empty;

        this.Appearance.Display = 'flex';
        this.Appearance.AlignItems = 'center';
        this.Appearance.JustifyContent = 'center';
    }

    public size(size: int) {
        this.Appearance.FontSize = `${size}px`;
        return this;
    }

    public Render() {
        return this.Renderer.render();
    }
}

export function Icon(icon: IconType): UIIconClass;
export function Icon(content: string): UIIconClass;
export function Icon(...args: any[]): UIIconClass {
    if (args.length === 1 && is.string(args[0])) {
        const content: string = args[0];
        //return viewFunc(UIIconClass, (controller, propertyBag) => {
        return new UIIconClass().setController(null)/* .PropertyBag(propertyBag) */.content(content);
        //});
    } else if (args.length === 1 && args[0] instanceof IconType) {
        const iconType = args[0];
        return new UIIconClass().setController(null)/* .PropertyBag(propertyBag) */.content(iconType.GetCode());
    }

}