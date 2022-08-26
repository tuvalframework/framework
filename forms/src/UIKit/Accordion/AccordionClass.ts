import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { AccordionRenderer } from "./AccordionRenderer";
import { int } from '@tuval/core';


export class AccordionClass extends UIView {

    @ViewProperty() vp_headerTemplate: (option: any) => UIView | Function;
    @ViewProperty() vp_contentTemplate: (option: any) => UIView | Function;
    @ViewProperty() vp_items: any[];
    @ViewProperty() vp_ActiveIndex: int;

    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new AccordionRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }
    public constructor() {
        super();

        this.Appearance.Width = '100%';
        this.Appearance.Height = '100%';
    }

    public headerTemplate(value: (option: any) => UIView | Function): this {
        this.vp_headerTemplate = value;
        return this;
    }
    public contentTemplate(value: (option: any) => UIView | Function): this {
        this.vp_contentTemplate = value;
        return this;
    }

    public items(value: any[]): this {
        this.vp_items = value;
        return this;
    }


}