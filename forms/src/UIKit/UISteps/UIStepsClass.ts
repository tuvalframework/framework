import { UIController } from "../UIController";
import { UIView } from "../UIView";
import { UIStepsRenderer } from "./UIStepsRenderer";

export class UIStepsClass extends UIView {
    public setController(controller: UIController): this {
       super.setController(controller);
       this.Renderer = new UIStepsRenderer({
          control: this,
          doNotBind: true,
          renderId: false
       });

       return this;
    }
    public constructor() {
       super();
       // Default renderer

       this.Appearance.Width = '100%';


    }

    /* public setItems(...items: UIView[]): this {
       this.items = items;
       return this;
    } */
 }