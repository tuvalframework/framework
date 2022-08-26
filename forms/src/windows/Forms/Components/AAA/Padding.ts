/* import { int } from '@tuval/core';
import { CGSize } from '@tuval/cg';
export class Padding {
    private _all: boolean = false;
    private _top: int = 0;
    private _left: int = 0;
    private _right: int = 0;
    private _bottom: int = 0;
    public static readonly Empty: Padding = new Padding(0);
    public get All(): int {
        return this._all ? this._top : -1;
    }
    public set All(value: int) {
        if (this._all != true || this._top !== value) {
            this._all = true;
            this._top = this._left = this._right = this._bottom = value;
        }
    }
    public constructor(all: int) {
        this._all = true;
        this._top = this._left = this._right = this._bottom = all;
    }
    public get Bottom(): int {
        if (this._all) {
            return this._top;
        }
        return this._bottom;
    }
    public set Bottom(value: int) {
        if (this._all || this._bottom !== value) {
            this._all = false;
            this._bottom = value;
        }
    }
    public get Left(): int {
        if (this._all) {
            return this._top;
        }
        return this._left;
    }
    public set Left(value: int) {
        if (this._all || this._left !== value) {
            this._all = false;
            this._left = value;
        }
    }

    public get Right(): int {
        if (this._all) {
            return this._top;
        }
        return this._right;
    }
    public set Right(value: int) {
        if (this._all || this._right !== value) {
            this._all = false;
            this._right = value;
        }
    }
    public get Top(): int {
        return this._top;
    }
    public set Top(value: int) {
        if (this._all || this._top !== value) {
            this._all = false;
            this._top = value;
        }
    }
    public get Horizontal(): int {
        return this.Left + this.Right;
    }
    public get Vertical(): int {
        return this.Top + this.Bottom;
    }
    public get Size(): CGSize {
        return new CGSize(this.Horizontal, this.Vertical);
    }
} */