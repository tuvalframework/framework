import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { AvatarViewRenderer } from './AvatarViewRenderer';


export class AvatarViewClass extends UIView {



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