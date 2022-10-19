import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { int } from '@tuval/core';
import { UIDesktopRenderer } from "./UIDesktopRenderer";
import { Desktop } from "../../tuval-forms";




export class UIDesktopClass extends UIView {

    @ViewProperty() vp_Desktop: Desktop;
    


    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new UIDesktopRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }

    public constructor() {
        super();
        this.vp_Desktop = new Desktop();
    }

}