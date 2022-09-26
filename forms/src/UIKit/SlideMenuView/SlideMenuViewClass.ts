import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { SlideMenuViewRenderer } from "./SlideMenuViewRenderer";
import { int } from '@tuval/core';


export class SlideMenuViewClass extends UIView {

    @ViewProperty() vp_ViewportHeight: int;
    public viewportHeight(value:int): this {
        this.vp_ViewportHeight = value;
        return this;
    }


    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new SlideMenuViewRenderer({
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