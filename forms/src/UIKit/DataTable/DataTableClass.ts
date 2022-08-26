import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { Column, ColumnClass } from "./Column";
import { DataTableRenderer } from './DataTableRenderer';

export class DataTableClass extends UIView {

    @ViewProperty()
    _value: any[];

    @ViewProperty()
    _columns: ColumnClass[];

    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new DataTableRenderer({
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

    public value(value: any): this {
        this._value = value;
        return this;
    }
    public columns(...value: ColumnClass[]): this {
        this._columns = value;
        return this;
    }
}