export enum PaddingApplies {
    None = 0b0000,
    Top = 0b0001,
    Left = 0b0010,
    Right = 0b0100,
    Bottom = 0b1000,
    All = 0b1111,
}

export class Padding {
    private _all: boolean = false;
    private _top: number = 0;
    private _left: number = 0;
    private _right: number = 0;
    private _bottom: number = 0;

    public static readonly Empty: Padding = Padding.CreateEmpty();
    public Applies: PaddingApplies = PaddingApplies.None;
    public constructor(all: number);
    public constructor(left: number, top: number, right: number, bottom: number, applies?:PaddingApplies);
    public constructor(...args: any[]) {
        if (args.length === 1) {
            this._all = true;
            this._top = this._left = this._right = this._bottom = args[0];
        } else {
            this._left = args[0];
            this._top = args[1];
            this._right = args[2];
            this._bottom = args[3];
            this.Applies = args[4] || PaddingApplies.None;
        }
    }



        public get All(): number {
            return this._all ? this._top : -1;
        }
    public set All(value: number) {
        if (this._all !== true || this._top !== value) {
            this._all = true;
            this._top = this._left = this._right = this._bottom = value;
        }
    }

    public get Bottom(): number {
        if (this._all) {
            return this._top;
        }
        return this._bottom;
    }
    public set Bottom(value: number) {
        if (this._all || this._bottom !== value) {
            this._all = false;
            this._bottom = value;
        }
    }

    public get Left(): number {
        if (this._all) {
            return this._top;
        }
        return this._left;
    }
    public set Left(value: number) {
        if (this._all || this._left !== value) {
            this._all = false;
            this._left = value;
        }

    }

    public get Right(): number {
        if (this._all) {
            return this._top;
        }
        return this._right;
    }
    public set Right(value: number) {
        if (this._all || this._right !== value) {
            this._all = false;
            this._right = value;
        }
    }

    public get Top(): number {
        return this._top;
    }
    public set Top(value: number) {
        if (this._all || this._top !== value) {
            this._all = false;
            this._top = value;
        }
    }

    public get Horizontal(): number {
        return this.Left + this.Right;
    }

    public get Vertical(): number {
        return this.Top + this.Bottom;
    }

    public get Size(): { width: number, height: number } {
        return { width: this.Horizontal, height: this.Vertical };
    }

    public static Add(p1: Padding, p2: Padding): Padding {
        // added for FXCop rule: Provide a friendly-name version of the Addition operator
        return new Padding(p1.Left + p2.Left, p1.Top + p2.Top, p1.Right + p2.Right, p1.Bottom + p2.Bottom);
    }

    public static Subtract(p1: Padding, p2: Padding): Padding {
        // added for FXCop rule: Provide a friendly-name version of the Subtraction operator
        return new Padding(p1.Left - p2.Left, p1.Top - p2.Top, p1.Right - p2.Right, p1.Bottom - p2.Bottom);
    }

    public static CreateEmpty(): Padding {
        const padding = new Padding(0);
        padding.Applies = PaddingApplies.None;
        return padding;
    }
}