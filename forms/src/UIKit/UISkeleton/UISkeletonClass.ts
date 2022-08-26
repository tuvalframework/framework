import { UIController } from "../UIController";
import { UIView } from "../UIView";
import { UISkeletonRenderer } from "./UISkeletonRenderer";

export class UISkeletonClass extends UIView {
    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new UISkeletonRenderer({
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

}