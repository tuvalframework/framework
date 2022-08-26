import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { AutoCompleteRenderer } from './AutoCompleteRenderer';

export class AutoCompleteClass extends UIView {
    @ViewProperty() vp_model: any[];
    @ViewProperty() vp_itemTemplate: (option: any) => UIView | Function;
    @ViewProperty() vp_onSelected: Function;
    @ViewProperty() vp_items: any[];
    @ViewProperty() vp_PlaceHolder: string;
    @ViewProperty() vp_SearchMethod: Function;
    @ViewProperty() vp_Field: string;
    @ViewProperty() vp_Value: any;
    @ViewProperty() vp_OnChange: Function;

    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new AutoCompleteRenderer({
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

    public model(value: any[]): this {
        this.vp_model = value;
        return this;
    }
    public onSelected(value: Function): this {
        this.vp_onSelected = value;
        return this;
    }

    public items(value: any[]): this {
        this.vp_items = value;
        return this;
    }
    public placeholder(value: string): this {
        this.vp_PlaceHolder = value;
        return this;
    }
    public searchMethod(value: Function): this {
        this.vp_SearchMethod = value;
        return this;
    }
    public field(value: string): this {
        this.vp_Field = value;
        return this;
    }
    public value(value: any): this {
        this.vp_Value = value;
        return this;
    }
    public onChange(value: Function): this {
        this.vp_OnChange = value;
        return this;
    }
}