import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { DynamicViewRenderer } from "./DynamicViewRenderer";


export class DynamicViewClass extends UIView {

    @ViewProperty() vp_Node: any;
    public node(value:any): this {
        this.vp_Node = value;
        return this;
    }


    public setController(controller: UIController): this {
       super.setController(controller);
       this.Renderer = new DynamicViewRenderer({
          control: this,
          doNotBind: true,
          renderId: false
       });

       return this;
    }
    public constructor() {
       super();
       // Default renderer

       this.Appearance.Display = 'flex';


    }

    /* public setItems(...items: UIView[]): this {
       this.items = items;
       return this;
    } */
 }