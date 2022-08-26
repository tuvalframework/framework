import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { DropDownRenderer } from './DropDownRenderer';

export class DropDownClass extends UIView {


    @ViewProperty() vp_model: any[];
    @ViewProperty() vp_itemTemplate: (option: any) => UIView | Function;
    @ViewProperty() vp_selectedItemTemplate: (option: any) => UIView | Function;
    @ViewProperty() vp_onSelected: Function;
    @ViewProperty() vp_value: any;
    @ViewProperty() vp_optionValue: string;
    @ViewProperty() vp_optionLabel: string;
    @ViewProperty() vp_PlaceHolder: string;

    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new DropDownRenderer({
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

    public itemTemplate(value: (option: any) => UIView | Function): this {
        this.vp_itemTemplate = value;
        return this;
    }
    public selectedItemTemplate(value: (option: any) => UIView | Function): this {
        this.vp_selectedItemTemplate = value;
        return this;
    }
    public model(value: any[]): this {
        this.vp_model = value;
        return this;
    }
    public onSelected(value: Function): this {
        this.vp_onSelected = value;
        return this;
    }

    public value(value: any): this {
        this.vp_value = value;
        return this;
    }
    public optionValue(value: string): this {
        if (this.vp_optionLabel == null) {
            this.vp_optionLabel = value;
        }
        this.vp_optionValue = value;
        return this;
    }
    public optionLabel(value: string): this {
        this.vp_optionLabel = value;
        return this;
    }
    public placeholder(value: string): this {
        this.vp_PlaceHolder = value;
        return this;
    }
}