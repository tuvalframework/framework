import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { int } from '@tuval/core';
import { UISidebarRenderer } from "./UISidebarRenderer";



export class UISidebarClass extends UIView {

    @ViewProperty() vp_SiodebarPosition: string;
    public siodebarPosition(value:string): this {
        this.vp_SiodebarPosition = value;
        return this;
    }

    @ViewProperty() vp_Visible: boolean;
    public visible(value:boolean): this {
        this.vp_Visible = value;
        return this;
    }

    @ViewProperty() vp_OnHide: Function;
    public onHide(value:Function): this {
        this.vp_OnHide = value;
        return this;
    }


    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new UISidebarRenderer({
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