import { ILabel } from "../../windows/Forms/ILabel";
import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { TypographyRenderer } from "./TypographyRenderer";

export class TypographyClass extends UIView implements ILabel {

    /** @internal */
    @ViewProperty() vp_text: string;
    public text(value: string): this {
        this.vp_text = value;
        return this;
    }

    public setController(controller: UIController): this {
        super.setController(controller);

        this.Renderer = new TypographyRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }
    public constructor() {
        super();

        // Sola yaslanmıyor
        this.Appearance.Display = 'flex';
        this.Appearance.AlignItems = 'inherit';
        this.Appearance.JustifyContent = 'inherit';
    }

}
