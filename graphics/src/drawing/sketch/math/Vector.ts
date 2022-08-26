import { float } from "@tuval/core";
import { constants } from "../core/Constanst";
import { SketchGraphics } from "../SketchGraphics";

export class Vector {
    private sketch: SketchGraphics = undefined as any;
    public x: float;
    public y: float;
    public z: float;
    public constructor(x?: number | SketchGraphics, y?: number | number[], z?: number) {
        let _x: number, _y: number, _z: number
        // This is how it comes in with createVector()
        if (arguments[0] instanceof SketchGraphics) {
            // save reference to p5 if passed in
            this.sketch = arguments[0];
            _x = arguments[1][0] || 0;
            _y = arguments[1][1] || 0;
            _z = arguments[1][2] || 0;
            // This is what we'll get with new p5.Vector()
        } else {
            _x = arguments[0] || 0;
            _y = arguments[1] || 0;
            _z = arguments[2] || 0;
        }
        /**
         * The x component of the vector
         * @property x {Number}
         */
        this.x = _x;
        /**
         * The y component of the vector
         * @property y {Number}
         */
        this.y = _y;
        /**
         * The z component of the vector
         * @property z {Number}
         */
        this.z = _z;
    }

    public toString() {
        return 'Vector Object : [' + this.x + ', ' + this.y + ', ' + this.z + ']';
    }

    public set(x?: number, y?: number, z?: number): Vector;
    public set(value: Vector | number[]): Vector;
    public set(x?: Vector | number[] | number, y?: number, z?: number): Vector {
        if (x instanceof Vector) {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
            return this;
        }
        if (x instanceof Array) {
            this.x = x[0] || 0;
            this.y = x[1] || 0;
            this.z = x[2] || 0;
            return this;
        }
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        return this;
    }
    public copy(): Vector {
        if (this.sketch) {
            return new Vector(this.sketch, [this.x, this.y, this.z]);
        } else {
            return new Vector(this.x, this.y, this.z);
        }
    }
    public add(x: number, y?: number, z?: number): Vector;
    public add(value: Vector | number[]): Vector;
    public add(x: number | Vector | number[], y?: number, z?: number): Vector {
        if (x instanceof Vector) {
            this.x += x.x || 0;
            this.y += x.y || 0;
            this.z += x.z || 0;
            return this;
        }
        if (x instanceof Array) {
            this.x += x[0] || 0;
            this.y += x[1] || 0;
            this.z += x[2] || 0;
            return this;
        }
        this.x += x || 0;
        this.y += y || 0;
        this.z += z || 0;
        return this;
    }

    public sub(x: number, y?: number, z?: number): Vector;
    public sub(value: Vector | number[]): Vector;
    public sub(x: number | Vector | number[], y?: number, z?: number): Vector {
        if (x instanceof Vector) {
            this.x -= x.x || 0;
            this.y -= x.y || 0;
            this.z -= x.z || 0;
            return this;
        }
        if (x instanceof Array) {
            this.x -= x[0] || 0;
            this.y -= x[1] || 0;
            this.z -= x[2] || 0;
            return this;
        }
        this.x -= x || 0;
        this.y -= y || 0;
        this.z -= z || 0;
        return this;
    }
    public mult(n: number): Vector {
        if (!(typeof n === 'number' && isFinite(n))) {
            console.warn(
                'Vector.prototype.mult:',
                'n is undefined or not a finite number'
            );
            return this;
        }
        this.x *= n;
        this.y *= n;
        this.z *= n;
        return this;
    }
    public div(n: number): Vector {
        if (!(typeof n === 'number' && isFinite(n))) {
            console.warn(
                'Vector.prototype.div:',
                'n is undefined or not a finite number'
            );
            return this;
        }
        if (n === 0) {
            console.warn('Vector.prototype.div:', 'divide by 0');
            return this;
        }
        this.x /= n;
        this.y /= n;
        this.z /= n;
        return this;
    }
    public mag(): number {
        return Math.sqrt(this.magSq());
    }
    public magSq(): number {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        return x * x + y * y + z * z;
    }

    public dot(x: number, y?: number, z?: number): number;
    public dot(value: Vector): number;
    public dot(x: number | Vector, y?: number, z?: number): number {
        if (x instanceof Vector) {
            return this.dot(x.x, x.y, x.z);
        }
        return this.x * (x || 0) + this.y * (y || 0) + this.z * (z || 0);
    }
    public cross(v: Vector): Vector {
        var x = this.y * v.z - this.z * v.y;
        var y = this.z * v.x - this.x * v.z;
        var z = this.x * v.y - this.y * v.x;
        if (this.sketch) {
            return new Vector(this.sketch, [x, y, z]);
        } else {
            return new Vector(x, y, z);
        }
    }
    public dist(v: Vector): number {
        return v
            .copy()
            .sub(this)
            .mag();
    }
    public normalize(): Vector {
        const len = this.mag();
        // here we multiply by the reciprocal instead of calling 'div()'
        // since div duplicates this zero check.
        if (len !== 0) this.mult(1 / len);
        return this;
    }
    public limit(max: number): Vector {
        const mSq = this.magSq();
        if (mSq > max * max) {
            this.div(Math.sqrt(mSq)) //normalize it
                .mult(max);
        }
        return this;
    }
    public setMag(len: number): Vector {
        return this.normalize().mult(len);
    }
    public heading(): number {
        var h = Math.atan2(this.y, this.x);
        if (this.sketch) return (this.sketch as any)._fromRadians(h);
        return h;
    }
    public rotate(angle: number): Vector {
        let newHeading = this.heading() + angle;
        if (this.sketch) {
            newHeading = (this.sketch as any)._toRadians(newHeading);
        }
        const mag = this.mag();
        this.x = Math.cos(newHeading) * mag;
        this.y = Math.sin(newHeading) * mag;
        return this;
    }
    public angleBetween(v: Vector): number {
        var dotmagmag = this.dot(v) / (this.mag() * v.mag());
        // Mathematically speaking: the dotmagmag variable will be between -1 and 1
        // inclusive. Practically though it could be slightly outside this range due
        // to floating-point rounding issues. This can make Math.acos return NaN.
        //
        // Solution: we'll clamp the value to the -1,1 range
        var angle = Math.acos(Math.min(1, Math.max(-1, dotmagmag)));
        if (this.sketch) return (this.sketch as any)._fromRadians(angle);
        return angle;
    }
    public lerp(v: Vector, amt: number): Vector;
    public lerp(x: number, y: number, z: number, amt?: number): Vector;
    public lerp(x: number | Vector, y?: number, z?: number, amt?: number): Vector {
        if (x instanceof Vector) {
            return this.lerp(x.x, x.y, x.z, y);
        }
        if (amt) {
            this.x += (x - this.x) * amt || 0;
            this.y += ((y as any) - this.y) * amt || 0;
            this.z += ((z as any) - this.z) * amt || 0;
        }
        return this;
    }
    public array(): number[] {
        return [this.x || 0, this.y || 0, this.z || 0];
    }
    public equals(x: number, y?: number, z?: number): boolean;
    public equals(value: Vector | any[]): boolean;
    public equals(x: number | Vector | any[], y?: number, z?: number) {
        var a, b, c;
        if (x instanceof Vector) {
            a = x.x || 0;
            b = x.y || 0;
            c = x.z || 0;
        } else if (x instanceof Array) {
            a = x[0] || 0;
            b = x[1] || 0;
            c = x[2] || 0;
        } else {
            a = x || 0;
            b = y || 0;
            c = z || 0;
        }
        return this.x === a && this.y === b && this.z === c;
    }
    public static fromAngle(angle: number, length?: number): Vector {
        if (typeof length === 'undefined') {
            length = 1;
        }
        return new Vector(length * Math.cos(angle), length * Math.sin(angle), 0);
    }
    public static fromAngles(theta: number, phi: number, length?: number): Vector {
        if (typeof length === 'undefined') {
            length = 1;
        }
        var cosPhi = Math.cos(phi);
        var sinPhi = Math.sin(phi);
        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);

        return new Vector(
            length * sinTheta * sinPhi,
            -length * cosTheta,
            length * sinTheta * cosPhi
        );
    }
    public static random2D(): Vector {
        return this.fromAngle(Math.random() * constants.TWO_PI);
    }
    public static random3D(): Vector {
        var angle = Math.random() * constants.TWO_PI;
        var vz = Math.random() * 2 - 1;
        var vzBase = Math.sqrt(1 - vz * vz);
        var vx = vzBase * Math.cos(angle);
        var vy = vzBase * Math.sin(angle);
        return new Vector(vx, vy, vz);
    }

    public static add(v1: Vector, v2: Vector, target: Vector): void;
    public static add(v1: Vector, v2: Vector): Vector;
    public static add(v1: Vector, v2: Vector, target?: Vector) {
        if (!target) {
            target = v1.copy();
        } else {
            target.set(v1);
        }
        target.add(v2);
        return target;
    }
    public static sub(v1: Vector, v2: Vector, target: Vector): void;
    public static sub(v1: Vector, v2: Vector): Vector;
    public static sub(v1: Vector, v2: Vector, target?: Vector) {
        if (!target) {
            target = v1.copy();
        } else {
            target.set(v1);
        }
        target.sub(v2);
        return target;
    }
    public static mult(v: Vector, n: number, target: Vector): void;
    public static mult(v: Vector, n: number): Vector;
    public static mult(v: Vector, n: number, target?: Vector): Vector | void {
        if (!target) {
            target = v.copy();
        } else {
            target.set(v);
        }
        target.mult(n);
        return target;
    }

    public static div(v: Vector, n: number, target: Vector): void;
    public static div(v: Vector, n: number): Vector;
    public static div(v: Vector, n: number, target?: Vector): Vector | void {
        if (!target) {
            target = v.copy();
        } else {
            target.set(v);
        }
        target.div(n);
        return target;
    }

    public static dot(v1: Vector, v2: Vector): number {
        return v1.dot(v2);
    }
    public static cross(v1: Vector, v2: Vector): Vector {
        return v1.cross(v2);
    }
    public static dist(v1: Vector, v2: Vector): number {
        return v1.dist(v2);
    }

    public static lerp(v1: Vector, v2: Vector, amt: number, target: Vector): void;
    public static lerp(v1: Vector, v2: Vector, amt: number): number;
    public static lerp(v1: Vector, v2: Vector, amt: number, target?: Vector): Vector | number {
        if (!target) {
            target = v1.copy();
        } else {
            target.set(v1);
        }
        target.lerp(v2, amt);
        return target;
    }
    public static mag(vecT: Vector): number {
        var x = vecT.x,
            y = vecT.y,
            z = vecT.z;
        var magSq = x * x + y * y + z * z;
        return Math.sqrt(magSq);
    }
}