import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { RecordContextRenderer } from "./RecordContextRenderer";


export class RecordContextClass extends UIView {
    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new RecordContextRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }

    public constructor() {
        super();
    }

    @ViewProperty() vp_Content:Function;
    public _content(value: Function): this {
        this.vp_Content = value;
        return this;
    }

    @ViewProperty() vp_Resource:string;
    public resource(value: string): this {
        this.vp_Resource = value;
        return this;
    }


    @ViewProperty() vp_Filter:any;
    public filter(value: any): this {
        this.vp_Filter = value;
        return this;
    }

   /*  @ViewProperty() vp_Record:any;
    public record(value: any): this {
        this.vp_Record = value;
        return this;
    } */
}