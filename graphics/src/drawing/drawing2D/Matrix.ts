import { CGAffineTransform,CGRectangle,CGPoint } from "@tuval/cg";
import { IDisposable, float, ArgumentNullException, ArgumentException } from "@tuval/core";

export enum MatrixOrder {
    Prepend = 0,
    Append = 1
}
export class Matrix implements IDisposable {
    public transform: CGAffineTransform = undefined as any;

    public constructor();
    public constructor(transform: CGAffineTransform);
    public constructor(rect: CGRectangle, plgpts: CGPoint[]);
    public constructor(m11: float, m12: float, m21: float, m22: float, dx: float, dy: float);
    public constructor(param1?: float | CGAffineTransform | CGRectangle, param2?: float | CGPoint[], param3?: float, param4?: float, param5?: float, param6?: float) {
        if (arguments.length === 0) {
            this.transform = CGAffineTransform.MakeIdentity();
        } else if (arguments.length === 1 && param1 instanceof CGAffineTransform) {
            this.transform = param1;
        } else if (arguments.length === 2 && param1 instanceof CGRectangle && Array.isArray(param2)) {
            const rect: CGRectangle = param1;
            const plgpts: CGPoint[] = param2;
            if (param2 == null)
                throw new ArgumentNullException("plgpts");
            if (param2.length !== 3)
                throw new ArgumentException("plgpts");

            const p0: CGPoint = plgpts[0];
            const p1: CGPoint = plgpts[1];
            const p2: CGPoint = plgpts[2];

            const m11: float = (p1.X - p0.X) / rect.Width;
            const m12: float = (p1.Y - p0.Y) / rect.Width;
            const m21: float = (p2.X - p0.X) / rect.Height;
            const m22: float = (p2.Y - p0.Y) / rect.Height;

            this.transform = CGAffineTransform.MakeTranslation(-rect.X, -rect.Y);
            this.transform.multiply(new CGAffineTransform(m11, m12, m21, m22, p0.X, p0.Y));
        } else if (arguments.length === 6 && typeof param1 === 'number' && typeof param2 === 'number' && typeof param3 === 'number' && typeof param4 === 'number' && typeof param5 === 'number' && typeof param6 === 'number') {
            this.transform = new CGAffineTransform(param1, param2, param3, param4, param5, param6);
        }
    }

    public get Elements(): float[] {
        return [this.transform.m[0], this.transform.m[1], this.transform.m[2], this.transform.m[3], this.transform.m[4], this.transform.m[5]];
    }
    public get IsIdentity(): boolean {
        return this.transform.IsIdentity;
    }

    public get IsInvertible(): boolean {
        var inverted = this.transform.invert();
        if (inverted.m[0] === this.transform.m[0] &&
            inverted.m[2] === this.transform.m[2] &&
            inverted.m[1] === this.transform.m[1] &&
            inverted.m[3] === this.transform.m[3] &&
            inverted.m[4] === this.transform.m[4] &&
            inverted.m[5] === this.transform.m[5])
            return false;
        return true;
    }

    public get OffsetX(): float {
        return this.transform.m[4];
    }

    public get OffsetY(): float {
        return this.transform.m[5];
    }

    public get IsScaled(): boolean {
        return this.transform.m[0] !== 1 || this.transform.m[3] !== 1;
    }

    public clone(): Matrix {
        const copy: Matrix = new Matrix();
        copy.transform = this.transform;
        return copy;
    }
    public Dispose(): void {
    }

    public /*override*/ equals(m: Matrix): boolean {
        if (m != null) {
            var o = m.transform;
            var t = this.transform;
            return (o.m[4] === t.m[4] && o.m[5] === t.m[5] &&
                o.m[0] === t.m[0] && o.m[3] === t.m[3] &&
                o.m[2] === t.m[2] && o.m[1] == t.m[1]);
        } else
            return false;
    }
    public /*override*/ getHashCode(): number {
        return this.transform.getHashCode();
    }

    public invert(): void {
        this.transform = this.transform.invert();
    }

    public multiply(matrix: Matrix): void;
    public multiply(matrix: Matrix, order: MatrixOrder): void;
    public multiply(matrix: Matrix, order?: MatrixOrder): void {
        if (arguments.length === 1) {
            if (matrix == null)
                throw new ArgumentNullException("matrix");
            this.multiply(matrix, MatrixOrder.Prepend);
        } else if (arguments.length === 2) {
            if (matrix == null)
                throw new ArgumentNullException("matrix");

            if (order == MatrixOrder.Append)
                this.transform.multiply(matrix.transform);
            else {
                var mtrans = matrix.transform;
                mtrans.multiply(this.transform);
                this.transform = mtrans;
            }
        }
    }

    public reset(): void {
        this.transform = CGAffineTransform.MakeIdentity();
    }

    public rotate(angle: float): void;
    public rotate(angle: float, order: MatrixOrder): void;
    public rotate(angle: float, order?: MatrixOrder): void {
        if (arguments.length === 1) {
            this.rotate(angle, MatrixOrder.Prepend);
        } else if (arguments.length === 2) {
            angle *= (Math.PI / 180.0);  // degrees to radians
            var affine = CGAffineTransform.MakeRotation(angle);
            if (order === MatrixOrder.Append)
                this.transform.multiply(affine);
            else {
                affine.multiply(this.transform);
                this.transform = affine;
            }
        }
    }
    public rotateAt(angle: float, point: CGPoint): void;
    public rotateAt(angle: float, point: CGPoint, order: MatrixOrder): void;
    public rotateAt(angle: float, point: CGPoint, order?: MatrixOrder): void {
        if (arguments.length === 2) {
            this.rotateAt(angle, point, MatrixOrder.Prepend);
        } else if (arguments.length === 3 && order != null) {
            if ((order < MatrixOrder.Prepend) || (order > MatrixOrder.Append))
                throw new ArgumentException("order");

            angle *= (Math.PI / 180.0);  // degrees to radians
            const cos: float = Math.cos(angle);
            const sin: float = Math.sin(angle);
            const e4: float = -point.X * cos + point.Y * sin + point.X;
            const e5: float = -point.X * sin - point.Y * cos + point.Y;
            const m: float[] = this.Elements;

            if (order == MatrixOrder.Prepend) {
                this.transform = new CGAffineTransform(cos * m[0] + sin * m[2],
                    cos * m[1] + sin * m[3],
                    -sin * m[0] + cos * m[2],
                    -sin * m[1] + cos * m[3],
                    e4 * m[0] + e5 * m[2] + m[4],
                    e4 * m[1] + e5 * m[3] + m[5]);
            }
            else {
                this.transform = new CGAffineTransform(m[0] * cos + m[1] * -sin,
                    m[0] * sin + m[1] * cos,
                    m[2] * cos + m[3] * -sin,
                    m[2] * sin + m[3] * cos,
                    m[4] * cos + m[5] * -sin + e4,
                    m[4] * sin + m[5] * cos + e5);
            }
        }
    }

    public scale(scaleX: float, scaleY: float): void;
    public scale(scaleX: float, scaleY: float, order: MatrixOrder): void;
    public scale(scaleX: float, scaleY: float, order?: MatrixOrder): void {
        if (arguments.length === 2) {
            this.scale(scaleX, scaleY, MatrixOrder.Prepend);
        } else if (arguments.length === 3) {
            var affine = CGAffineTransform.MakeScale(scaleX, scaleY);
            if (order === MatrixOrder.Append)
                this.transform.multiply(affine);
            else {
                affine.multiply(this.transform);
                this.transform = affine;
            }
        }
    }

    public shear(shearX: float, shearY: float): void;
    public shear(shearX: float, shearY: float, order: MatrixOrder): void;
    public shear(shearX: float, shearY: float, order?: MatrixOrder): void {

        if (arguments.length === 2) {
            this.shear(shearX, shearY, MatrixOrder.Prepend);
        } else if (arguments.length === 3) {
            var affine = new CGAffineTransform(1, shearY, shearX, 1, 0, 0);
            if (order == MatrixOrder.Append)
                this.transform.multiply(affine);
            else {
                affine.multiply(this.transform);
                this.transform = affine;
            }
        }

    }

    public transformPoints(pts: CGPoint[]): void {
        if (pts == null)
            throw new ArgumentNullException("pts");

        for (let i = 0; i < pts.length; i++) {
            var point = pts[i];
            pts[i] = new CGPoint((this.transform.m[0] * point.X + this.transform.m[2] * point.Y + this.transform.m[4]), (this.transform.m[1] * point.X + this.transform.m[3] * point.Y + this.transform.m[5]));
        }
    }

    public transformVectors(pts: CGPoint[]): void {
        if (pts == null)
            throw new ArgumentNullException("pts");

        for (let i = 0; i < pts.length; i++) {
            var point = pts[i];
            pts[i] = new CGPoint((this.transform.m[0] * point.X + this.transform.m[2] * point.Y),
                (this.transform.m[1] * point.X + this.transform.m[3] * point.Y));
        }
    }

    public translate(offsetX: float, offsetY: float): void;
    public translate(offsetX: float, offsetY: float, order: MatrixOrder): void;
    public translate(offsetX: float, offsetY: float, order?: MatrixOrder): void {
        if (arguments.length === 2) {
            this.translate(offsetX, offsetY, MatrixOrder.Prepend);
        } else if (arguments.length === 3) {
            var affine = CGAffineTransform.MakeTranslation(offsetX, offsetY);
            if (order === MatrixOrder.Append)
                this.transform.multiply(affine);
            else {
                affine.multiply(this.transform);
                this.transform = affine;
            }
        }

    }

    public vectorTransformPoints(pts: CGPoint[]): void {
        this.transformVectors(pts);
    }

}