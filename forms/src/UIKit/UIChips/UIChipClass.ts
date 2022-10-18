import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { int } from '@tuval/core';
import { UIChipsRenderer } from "./UIChipsRenderer";


export class UIChipClass extends UIView {

    @ViewProperty() vp_PlaceHolder: string;
    public placeholder(value:string): this {
        this.vp_PlaceHolder = value;
        return this;
    }

    @ViewProperty() vp_Value: string[];
    public value(value:string[]): this {
        this.vp_Value = value;
        return this;
    }

    @ViewProperty() vp_OnChange: Function;
    public onChange(value:Function): this {
        this.vp_OnChange = value;
        return this;
    }


    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new UIChipsRenderer({
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