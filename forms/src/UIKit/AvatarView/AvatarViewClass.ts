import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { AvatarViewRenderer } from './AvatarViewRenderer';


export class AvatarViewClass extends UIView {

    @ViewProperty() vp_Image: string;
    public image(value: string): this {
        this.vp_Image = value;
        return this;
    }

    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new AvatarViewRenderer({
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