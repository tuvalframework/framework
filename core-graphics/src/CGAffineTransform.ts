import { CGPoint } from './CGPoint';
import { float } from "@tuval/core";

export class CGAffineTransform {
  m: Array<number>;
  constructor(...m: number[]) {
    this.m = (m && m.slice()) || [1, 0, 0, 1, 0, 0];
  }

  public copy() {
    return new CGAffineTransform(...this.m);
  }
  public static MakeIdentity(): CGAffineTransform {
    return new CGAffineTransform(1, 0, 0, 1, 0, 0);
  }

  public static MakeRotation(angle: float): CGAffineTransform {
    return new CGAffineTransform(
      Math.cos(angle), Math.sin(angle),
      -Math.sin(angle), Math.cos(angle),
      0, 0);
  }

  public static MakeScale(sx: float, sy: float): CGAffineTransform {
    return new CGAffineTransform(sx, 0, 0, sy, 0, 0);
  }

  public static MakeTranslation(tx: float, ty: float): CGAffineTransform {
    return new CGAffineTransform(1, 0, 0, 1, tx, ty);
  }
  public static Multiply(a: CGAffineTransform, b: CGAffineTransform): CGAffineTransform {
    return a.multiply(b);
  }

  /* public static Multiply(a: CGAffineTransform, b: CGAffineTransform): CGAffineTransform {
      return new CGAffineTransform(a.xx * b.xx + a.yx * b.xy,
          a.xx * b.yx + a.yx * b.yy,
          a.xy * b.xx + a.yy * b.xy,
          a.xy * b.yx + a.yy * b.yy,
          a.x0 * b.xx + a.y0 * b.xy + b.x0,
          a.x0 * b.yx + a.y0 * b.yy + b.y0);
  } */
  public point(point: CGPoint): CGPoint {
    var m = this.m;
    return new CGPoint({
      x: m[0] * point.X + m[2] * point.Y + m[4],
      y: m[1] * point.X + m[3] * point.Y + m[5]
    });
  }

  public multiply(matrix: CGAffineTransform): CGAffineTransform {
    var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
    var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];

    var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
    var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];

    var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
    var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];

    this.m[0] = m11;
    this.m[1] = m12;
    this.m[2] = m21;
    this.m[3] = m22;
    this.m[4] = dx;
    this.m[5] = dy;

    return this.clone();
  }

  public invert(): CGAffineTransform {
    var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
    var m0 = this.m[3] * d;
    var m1 = -this.m[1] * d;
    var m2 = -this.m[2] * d;
    var m3 = this.m[0] * d;
    var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
    var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
    this.m[0] = m0;
    this.m[1] = m1;
    this.m[2] = m2;
    this.m[3] = m3;
    this.m[4] = m4;
    this.m[5] = m5;
    return this;
  }
  public scale(sx: float, sy: float): void {
    this.m[0] *= sx;
    this.m[1] *= sx;
    this.m[2] *= sy;
    this.m[3] *= sy;
  }

  public translate(x: float, y: float): void {
    this.m[4] += this.m[0] * x + this.m[2] * y;
    this.m[5] += this.m[1] * x + this.m[3] * y;
  }

  public rotate(rad: float): void {
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    var m11 = this.m[0] * c + this.m[2] * s;
    var m12 = this.m[1] * c + this.m[3] * s;
    var m21 = this.m[0] * -s + this.m[2] * c;
    var m22 = this.m[1] * -s + this.m[3] * c;
    this.m[0] = m11;
    this.m[1] = m12;
    this.m[2] = m21;
    this.m[3] = m22;
  }
  getTranslation() {
    return {
      x: this.m[4],
      y: this.m[5]
    };
  }
  getMatrix() {
    return this.m;
  }

  skew(sx, sy) {
    var m11 = this.m[0] + this.m[2] * sy;
    var m12 = this.m[1] + this.m[3] * sy;
    var m21 = this.m[2] + this.m[0] * sx;
    var m22 = this.m[3] + this.m[1] * sx;
    this.m[0] = m11;
    this.m[1] = m12;
    this.m[2] = m21;
    this.m[3] = m22;
    return this;
  }

  public setAbsolutePosition(x, y) {
    var m0 = this.m[0],
      m1 = this.m[1],
      m2 = this.m[2],
      m3 = this.m[3],
      m4 = this.m[4],
      m5 = this.m[5],
      yt = (m0 * (y - m5) - m1 * (x - m4)) / (m0 * m3 - m1 * m2),
      xt = (x - m4 - m2 * yt) / m0;

    return this.translate(xt, yt);
  }

  public get IsIdentity(): boolean {
    return this.m[0] === 1 && this.m[1] === 0 && this.m[2] === 0 && this.m[3] === 1 && this.m[4] === 0 && this.m[5] === 0;
  }
  public clone(): CGAffineTransform {
    return new CGAffineTransform(...this.m);
  }
  public /*override*/ toString(): string {
    const s: string = `xx:{0:##0.0#} yx:{1:##0.0#} xy:{2:##0.0#} yy:{3:##0.0#} x0:{4:##0.0#} y0:{5:##0.0#}`;//, xx, yx, xy, yy, x0, y0);
    return s;
  }

  /*   public static bool operator == (CGAffineTransform lhs, CGAffineTransform rhs)
    {
            return (lhs.xx == rhs.xx && lhs.xy == rhs.xy &&
                    lhs.yx == rhs.yx && lhs.yy == rhs.yy &&
                    lhs.x0 == rhs.x0 && lhs.y0 == rhs.y0 );
    } */



  public equals(o: CGAffineTransform): boolean {
    return this.m[0] === o.m[0] && this.m[1] === o.m[1] && this.m[2] === o.m[2] && this.m[3] === o.m[3] && this.m[4] === o.m[4] && this.m[5] === o.m[5];
  }

  public /*override*/ getHashCode(): number {
    return this.m[0] * this.m[1] * this.m[2] * this.m[3] * this.m[4] * this.m[5];
  }
}
