import { float, IEquatable } from "@tuval/core";
import { CGSize } from "./CGSize";
import { ClassInfo, int } from "@tuval/core";
import { CoreGraphicTypes } from "./types";


export interface IPointF {
    x: float;
    y: float;
}

@ClassInfo({
    fullName: CoreGraphicTypes.CGPoint,
    instanceof: [
        CoreGraphicTypes.CGPoint
    ]
})
export class CGPoint implements IEquatable<CGPoint> {

    public static get Empty(): CGPoint {
        return new CGPoint();
    }

    private x: float = 0;
    private y: float = 0;

    public get IsEmpty(): boolean {
        return this.x === 0 && this.y === 0;
    }

    public get X(): float {
        return this.x;
    }

    public set X(value: float) {
        this.x = value;
    }

    public get Y(): float {
        return this.y;
    }

    public set Y(value: float) {
        this.y = value;
    }

    public constructor();
    public constructor(x: IPointF);
    public constructor(x: float, y: float);
    public constructor(x?: float | IPointF, y?: float) {
        function isPoint(val: any): val is IPointF {
            if (val) {
                return val.x !== undefined && val.y !== undefined;
            } else {
                return false;
            }
        }
        if (typeof x === 'number' && typeof y === 'number') {
            this.x = x;
            this.y = y;
        } else if (isPoint(x)) {
            this.x = x.x;
            this.y = x.y;
        }
    }

    public Offset(dx: int, dy: int): void {
        const x: CGPoint = this;
        x.X = x.X + dx;
        const y: CGPoint = this;
        y.Y = y.Y + dy;
    }

    public add = (sz: CGSize): CGPoint => CGPoint.Add(this, sz);
    public subtract = (sz: CGSize): CGPoint => CGPoint.Subtract(this, sz);

    public static Add(pt: CGPoint, sz: CGSize): CGPoint {
        return new CGPoint(pt.X + sz.Width, pt.Y + sz.Height)
    };
    public static Subtract(pt: CGPoint, sz: CGSize): CGPoint {
        return new CGPoint(pt.X - sz.Width, pt.Y - sz.Height);
    }

    public clone(): CGPoint {
        return new CGPoint(this.X, this.Y);
    }

    public Equals = (pt: CGPoint): boolean => this.x === pt.x && this.y === pt.y;
    public notEquals = (pt: CGPoint): boolean => this.x !== pt.x || this.y !== pt.y;

    public sub = (p: CGPoint): CGPoint => new CGPoint(this.X - p.X, this.Y - p.Y);
    public _add = (p: CGPoint): CGPoint => new CGPoint(this.X + p.X, this.Y + p.Y);

}

