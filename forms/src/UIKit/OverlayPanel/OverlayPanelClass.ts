import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { OverlayPanelRenderer } from "./OverlayPanelRenderer";


export class OverlayPanelClass extends UIView {

    @ViewProperty() _show:boolean;

    @ViewProperty() vp_HeaderTemplate:UIView;

    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new OverlayPanelRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }

    public constructor() {
        super();
    }

    public show(value: boolean): this {
        this._show = value;
        return this;
    }

    public headerTemplate(value: UIView): this {
        this.vp_HeaderTemplate = value;
        return this;
    }
}