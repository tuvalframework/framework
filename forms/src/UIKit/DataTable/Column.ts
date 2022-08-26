import { UIView } from './../UIView';

export class ColumnClass {
    _field: string;
    _header: string;
    _width: string;
    _body: UIView;


    public field(value: string): this {
        this._field = value;
        return this;
    }
    public header(value: string): this {
        this._header = value;
        return this;
    }
    public width(value: string): this {
        this._width = value;
        return this;
    }
    public body(value: UIView): this {
        this._body = value;
        return this;
    }
}

export function Column(): ColumnClass {
    return new ColumnClass();
}