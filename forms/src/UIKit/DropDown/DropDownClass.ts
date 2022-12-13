import { UIController, ValidateRule } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { DropDownRenderer } from './DropDownRenderer';

export class DropDownClass extends UIView {


    @ViewProperty() vp_model: any[];
    @ViewProperty() vp_fields: {text: string, value: string};
    @ViewProperty() vp_itemTemplate: (option: any) => UIView | Function;
    @ViewProperty() vp_emptyTemplate: () => UIView | Function;
    @ViewProperty() vp_selectedItemTemplate: (option: any) => UIView | Function;
    @ViewProperty() vp_onSelected: Function;
    @ViewProperty() vp_value: any;
    //@ViewProperty() vp_optionValue: string;
    //@ViewProperty() vp_optionLabel: string;
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
       // this.Appearance.Height = '100%';
    }

    public itemTemplate(value: (option: any) => UIView | Function): this {
        this.vp_itemTemplate = value;
        return this;
    }
    public emptyTemplate(value: () => UIView | Function): this {
        this.vp_emptyTemplate = value;
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
    public fields(value: {text: string, value: string}): this {
        this.vp_fields = value;
        return this;
    }
   
    public placeholder(value: string): this {
        this.vp_PlaceHolder = value;
        return this;
    }

    @ViewProperty()
    public vp_FormField: { name: string, rules: ValidateRule[] };
    public formField(name: string, rules: ValidateRule[]): this {
        this.vp_FormField = {
            name: name,
            rules: rules
        };
        return this;
    }

    @ViewProperty()
    public vp_Label: string;
    public label(value: string): this {
        this.vp_Label = value;
        return this;
    }

    @ViewProperty()
    public vp_LabelTemplate: (label: string) => UIView;
    public labelTemplate(value: (label: string) => UIView): this {
        this.vp_LabelTemplate = value;
        return this;
    }
}