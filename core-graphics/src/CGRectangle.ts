import { CoreGraphicTypes } from './types';
import { is, IEquatable, ArgumentException } from '@tuval/core';
import { float } from '@tuval/core';
import { CGPoint } from './CGPoint';
import { CGSize } from './CGSize';
import { ClassInfo } from '@tuval/core';
import { int } from '@tuval/core';
import { Matrix } from './Matrix';

export interface IRectangleF {
    x: float;
    y: float;
    width: float;
    height: float;
}

export function Rect(X1: number, Y1: number, X2: number, Y2: number): CGRectangle {
    return new CGRectangle(X1, Y1, X2 - X1, Y2 - Y1);
}
@ClassInfo({
    fullName: CoreGraphicTypes.CGRectangle,
    instanceof: [
        CoreGraphicTypes.CGRectangle
    ]
})
export class CGRectangle implements IEquatable<CGRectangle> {
    x(x: any, y: any, width: any, height: any): any {
        throw new Error("Method not implemented.");
    }
    y(x: any, y: any, width: any, height: any): any {
        throw new Error("Method not implemented.");
    }
    width(x: any, y: any, width: any, height: any): any {
        throw new Error("Method not implemented.");
    }
    height(x: any, y: any, width: any, height: any): any {
        throw new Error("Method not implemented.");
    }
    public static get Empty(): CGRectangle {
        return new CGRectangle(0, 0, 0, 0);
    }

    private myX: float = 0;
    private myY: float = 0;
    private myWidth: float = 0;
    private myHeight: float = 0;
    private myRotation: float = 0;

    public get X(): float {
        return this.myX;
    }

    public set X(value: float) {
        this.myX = value;
    }

    public get Y(): float {
        return this.myY;
    }

    public set Y(value: float) {
        this.myY = value;
    }

    public get X1(): float {
        return this.myX;
    }

    public get Y1(): float {
        return this.myY;
    }

    public get X2(): float {
        return this.myX + this.myWidth;
    }

    public get Y2(): float {
        return this.myY + this.myHeight;
    }

    public get Width(): float {
        return this.myWidth;
    }
    public set Width(value: float) {
        this.myWidth = value;
    }

    public get Height(): float {
        return this.myHeight;
    }
    public set Height(value: float) {
        this.myHeight = value;
    }

    public get Rotation(): float {
        return this.myRotation;
    }

    public set Rotation(value: float) {
        this.myRotation = value;
    }

    public get Location(): CGPoint {
        return new CGPoint(this.X, this.Y);
    }

    public set Location(value: CGPoint) {
        this.X = value.X;
        this.Y = value.Y;
    }

    public get Size(): CGSize {
        return new CGSize(this.Width, this.Height);
    }

    public set Size(value: CGSize) {
        this.Width = value.Width;
        this.Height = value.Height;
    }

    public get Left(): float {
        return this.X;
    }

    public get Top(): float {
        return this.Y;
    }

    public get Right(): float {
        return this.X + this.Width;
    }

    public get Bottom(): float {
        return this.Y + this.Height;
    }

    public get IsEmpty(): boolean {
        return this.Width <= 0 || this.Height <= 0;
    }

    public constructor(rectObj?: IRectangleF);
    public constructor(location?: CGPoint, size?: CGSize);
    public constructor(x?: float, y?: float, width?: float, height?: float);
    public constructor(param1?: float | CGPoint | IRectangleF, param2?: float | CGSize, param3?: float, param4?: float) {
        if (param1 instanceof CGPoint && param2 instanceof CGSize) {
            this.myX = param1.X;
            this.myY = param1.Y;
            this.myWidth = param2.Width;
            this.myHeight = param2.Height;
        }

        if (typeof param1 === 'number' && typeof param2 === 'number' && typeof param3 === 'number' && typeof param4 === 'number') {
            this.myX = param1;
            this.myY = param2;
            this.myWidth = param3;
            this.myHeight = param4;
        }

        function isRectangle(val: any): val is IRectangleF {
            if (val) {
                return val.x !== undefined && val.y !== undefined && val.width !== undefined && val.height !== undefined;
            } else {
                return false;
            }
        }

        if (isRectangle(param1)) {
            this.myX = param1.x;
            this.myY = param1.y;
            this.myWidth = param1.width;
            this.myHeight = param1.height;
        }
    }

    public static FromLTRB = (left: float, top: float, right: float, bottom: float): CGRectangle =>
        new CGRectangle(left, top, right - left, bottom - top);
    public /*override*/ Equals = (rect: CGRectangle): boolean =>
        this.X === rect.X && this.Y === rect.Y && this.Width === rect.Width && this.Height === rect.Height;

    /**
    * Extends the rectangle's bounds to include the described point or rectangle.
    * @param {Number} x X position of the point or rectangle.
    * @param {Number} y Y position of the point or rectangle.
    * @param {Number} [width=0] The width of the rectangle.
    * @param {Number} [height=0] The height of the rectangle.
    * @return {easeljs.Rectangle} This instance. Useful for chaining method calls.
    * @chainable
   */
    public extend(x: float, y: float, width: float = 0, height: float = 0) {
        if (x + width > this.X + this.Width) { this.Width = x + width - this.X; }
        if (y + height > this.Y + this.Height) { this.Height = y + height - this.Y; }
        if (x < this.X) { this.Width += this.X - x; this.X = x; }
        if (y < this.Y) { this.Height += this.Y - y; this.Y = y; }
        return this;
    }

    public contains(point: CGPoint): boolean;
    public contains(rect: CGRectangle): boolean;
    public contains(x: float, y: float): boolean;
    public contains(param1: float | CGRectangle | CGPoint, param2?: float): boolean {
        if (is.typeof<CGRectangle>(param1, CoreGraphicTypes.CGRectangle)) {
            return (
                this.X <= param1.X &&
                param1.X + param1.Width <= this.X + this.Width &&
                this.Y <= param1.Y &&
                param1.Y + param1.Height <= this.Y + this.Height
            );
        } else if (is.typeof<CGPoint>(param1, CoreGraphicTypes.CGPoint)) {
            return this.contains(param1.X, param1.Y);
        } else {
            return this.X <= param1 && param1 < this.X + this.Width && this.Y <= (param2 as any) && (param2 as any) < this.Y + this.Height;
        }
    }

    public inflate(size: CGSize): CGRectangle;
    public inflate(x: float, y: float): CGRectangle;
    public inflate(param1: float | CGSize, param2?: float): CGRectangle {
        if (param1 instanceof CGSize) {
            return this.inflate(param1.Width, param1.Height);
        } else {
            return new CGRectangle(this.X - param1, this.Y - (param2 as any), this.Width + 2 * param1, this.Height + 2 * (param2 as any));
        }
        throw new ArgumentException('inflate');
    }

    public static Inflate(rect: CGRectangle, x: float, y: float): CGRectangle {
        const r: CGRectangle = rect;
        r.inflate(x, y);
        return r;
    }

    public intersect(rect: CGRectangle): void {
        const result: CGRectangle = CGRectangle.Intersect(rect, this);
        this.X = result.X;
        this.Y = result.Y;
        this.Width = result.Width;
        this.Height = result.Height;
    }

    public static Intersect(a: CGRectangle, b: CGRectangle): CGRectangle {
        const x1: float = Math.max(a.X, b.X);
        const x2: float = Math.min(a.X + a.Width, b.X + b.Width);
        const y1: float = Math.max(a.Y, b.Y);
        const y2: float = Math.min(a.Y + a.Height, b.Y + b.Height);

        if (x2 >= x1 && y2 >= y1) {
            return new CGRectangle(x1, y1, x2 - x1, y2 - y1);
        }

        return CGRectangle.Empty;
    }

    public intersectsWith = (rect: CGRectangle): boolean =>
        rect.X < this.X + this.Width && this.X < rect.X + rect.Width && rect.Y < this.Y + this.Height && this.Y < rect.Y + rect.Height;

    public static Union(a: CGRectangle, b: CGRectangle): CGRectangle {
        const x1: float = Math.min(a.X, b.X);
        const x2: float = Math.max(a.X + a.Width, b.X + b.Width);
        const y1: float = Math.min(a.Y, b.Y);
        const y2: float = Math.max(a.Y + a.Height, b.Y + b.Height);

        return new CGRectangle(x1, y1, x2 - x1, y2 - y1);
    }

    public offset(pos: CGPoint): void;
    public offset(x: float, y: float): void;
    public offset(param1: float | CGPoint, param2?: float): void {
        if (param1 instanceof CGPoint) {
            this.offset(param1.X, param1.Y);
        } else {
            this.X += param1;
            this.Y += param2 as any;
        }
    }

    /**
 * Sets the specified values on this instance.
 * @param {Number} [x=0] X position.
 * @param {Number} [y=0] Y position.
 * @param {Number} [width=0] The width of the Rectangle.
 * @param {Number} [height=0] The height of the Rectangle.
 * @return {easeljs.Rectangle} This instance. Useful for chaining method calls.
 * @chainable
*/
    public setValues(x: float = 0, y: float = 0, width: float = 0, height: float = 0) {
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
        return this;
    }

    public copy(rect: CGRectangle): CGRectangle {
        return this.setValues(rect.X, rect.Y, rect.Width, rect.Height);
    }

    public /*override*/ toString = (): string =>
        '{X=' + this.X.toString() + ',Y=' + this.Y.toString() + ',Width=' + this.Width.toString() + ',Height=' + this.Height.toString() + '}';

    public transform(matrix: Matrix): CGRectangle {
        const rectangle: CGRectangle = this;
        var transform = matrix.transform;
        var x = rectangle.X;
        var y = rectangle.Y;

        rectangle.X = transform.m[0] * x + transform.m[2] * y + transform.m[4];
        rectangle.Y = transform.m[1] * x + transform.m[3] * y + transform.m[5];

        x = rectangle.Width;
        y = rectangle.Height;

        rectangle.Width = transform.m[0] * x + transform.m[2] * y + transform.m[4];
        rectangle.Height = transform.m[1] * x + transform.m[3] * y + transform.m[5];

        return new CGRectangle(rectangle.Location, rectangle.Size);
    }

    public scale(factor: float): CGRectangle {
        return new CGRectangle(this.X, this.Y, this.Width * factor, this.Height * factor);
    }

    public isEqual(rect: CGRectangle): boolean {
        return (this === rect) ||
            (this.X === rect.X && this.Y === rect.Y &&
                this.Width === rect.Width && this.Height === rect.Height)
    }

    public clone(): CGRectangle {
        return new CGRectangle(this.X, this.Y, this.Width, this.Height);
    }

    public pos(): CGPoint {
        return new CGPoint(this.X, this.Y);
    }
    public size(): CGSize {
        return new CGSize(this.X2 - this.X1, this.Y2 - this.Y1);
    }

    public translate(offsetX: number, offsetY: number): CGRectangle {
        return new CGRectangle(this.X1 + offsetX, this.Y1 + offsetY, this.Width, this.Height);
    }
    //Rect translate(Point const & offset) const { return Rect(X1 + offset.X, Y1 + offset.Y, X2 + offset.X, Y2 + offset.Y); }
    //Rect move(Point const & position) const { return Rect(position.X, position.Y, position.X + width() - 1, position.Y + height() - 1); }
    public move(x: int, y: int): CGRectangle {
        return new CGRectangle(x, y, this.Width, this.Height);
    }
    public shrink(value: int): CGRectangle {
        return new CGRectangle(this.X1 + value, this.Y1 + value, (this.X2 - value) - (this.X1 + value), (this.Y2 - value) - (this.Y1 + value));
    }
    public hShrink(value: int): CGRectangle {
        return new CGRectangle(this.X1 + value, this.Y1, this.X2 - value, this.Y2);
    }
    public vShrink(value: int): CGRectangle {
        return new CGRectangle(this.X1, this.Y1 + value, this.X2, this.Y2 - value);
    }
    public resize(width: int, height: int): CGRectangle {
        return new CGRectangle(this.X1, this.Y1, width, height);
    }
    //Rect resize(Size size) const { return Rect(X1, Y1, X1 + size.width - 1, Y1 + size.height - 1); }
    public intersection(rect: CGRectangle): CGRectangle {
        return new CGRectangle(Math.max(this.X1, rect.X1), Math.max(this.Y1, rect.Y1), Math.min(this.X2, rect.X2) - Math.max(this.X1, rect.X1), Math.min(this.Y2, rect.Y2) - Math.max(this.Y1, rect.Y1));
    }
    public intersects(rect: CGRectangle): boolean {
        return this.X1 <= rect.X2 && this.X2 >= rect.X1 && this.Y1 <= rect.Y2 && this.Y2 >= rect.Y1;
    }
    public intersectsNotEqual(rect: CGRectangle): boolean {
        return this.X1 < rect.X2 && this.X2 > rect.X1 && this.Y1 < rect.Y2 && this.Y2 > rect.Y1;
    }
    /* bool contains(Rect const & rect) const { return (rect.X1 >= X1) && (rect.Y1 >= Y1) && (rect.X2 <= X2) && (rect.Y2 <= Y2); }
bool contains(Point const & point) const { return point.X >= X1 && point.Y >= Y1 && point.X <= X2 && point.Y <= Y2; }
bool contains(int x, int y) const { return x >= X1 && y >= Y1 && x <= X2 && y <= Y2; } */
}
