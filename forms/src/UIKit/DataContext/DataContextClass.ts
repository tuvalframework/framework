import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { DataContextRenderer } from "./DataContextRenderer";


export class DataContextClass extends UIView {
    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new DataContextRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }

    public constructor() {
        super();
    }

    @ViewProperty() vp_DataProvider:any;
    public dataProvider(value: any): this {
        this.vp_DataProvider = value;
        return this;
    }

    @ViewProperty() vp_QueryClient:any;
    public queryClient(value: any): this {
        this.vp_QueryClient = value;
        return this;
    }

    
}