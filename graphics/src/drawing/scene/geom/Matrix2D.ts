import { CGPoint } from '@tuval/cg';
import { float } from "@tuval/core";

/**
 * Represents an affine transformation matrix, and provides tools for constructing and concatenating matrices.
 *
 * <pre>
 * This matrix can be visualized as:
 *
 * 	[ a  c  tx
 * 	 b  d  ty
 * 	0  0  1  ]
 *
 * Note the locations of b and c.
 * </pre>
 *
 * @param {Number} [a] Specifies the a property for the new matrix.
 * @param {Number} [b] Specifies the b property for the new matrix.
 * @param {Number} [c] Specifies the c property for the new matrix.
 * @param {Number} [d] Specifies the d property for the new matrix.
 * @param {Number} [tx] Specifies the tx property for the new matrix.
 * @param {Number} [ty] Specifies the ty property for the new matrix.
 */
export class Matrix2D {
    public a: number = 0;
    public b: number = 0;
    public c: number = 0;
    public d: number = 0;
    public tx: number = 0;
    public ty: number = 0;
    /**
     * Multiplier for converting degrees to radians. Used internally by Matrix2D.
     * @static
     * @type {Number}
     * @readonly
     */
    public static DEG_TO_RAD = Math.PI / 180;

    /**
     * An identity matrix, representing a null transformation.
     * @static
     * @type {Matrix2D}
     * @readonly
     */
    public static identity: Matrix2D = new Matrix2D();

    constructor(a: float = 1, b: float = 0, c: float = 0, d: float = 1, tx: float = 0, ty: float = 0) {

        this.setValues(a, b, c, d, tx, ty);

        // assigned in the setValues method.
		/**
		 * Position (0, 0) in a 3x3 affine transformation matrix.
		 * @property a
		 * @type {Number}
		 */

		/**
		 * Position (0, 1) in a 3x3 affine transformation matrix.
		 * @property b
		 * @type {Number}
		 */

		/**
		 * Position (1, 0) in a 3x3 affine transformation matrix.
		 * @property c
		 * @type {Number}
		 */

		/**
		 * Position (1, 1) in a 3x3 affine transformation matrix.
		 * @property d
		 * @type {Number}
		 */

		/**
		 * Position (2, 0) in a 3x3 affine transformation matrix.
		 * @property tx
		 * @type {Number}
		 */

		/**
		 * Position (2, 1) in a 3x3 affine transformation matrix.
		 * @property ty
		 * @type {Number}
		 */
    }

	/**
	 * Sets the specified values on this instance.
	 * @param {Number} [a=1] Specifies the a property for the new matrix.
	 * @param {Number} [b=0] Specifies the b property for the new matrix.
	 * @param {Number} [c=0] Specifies the c property for the new matrix.
	 * @param {Number} [d=1] Specifies the d property for the new matrix.
	 * @param {Number} [tx=0] Specifies the tx property for the new matrix.
	 * @param {Number} [ty=0] Specifies the ty property for the new matrix.
	 * @return {Matrix2D} This instance. Useful for chaining method calls.
	 * @chainable
	*/
    public setValues(a: float, b: float, c: float, d: float, tx: float, ty: float) {
        // don't forget to update docs in the constructor if these change:
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
        return this;
    }

	/**
	 * Appends the specified matrix properties to this matrix. All parameters are required.
	 * This is the equivalent of multiplying `(this matrix) * (specified matrix)`.
	 * @param {Number} a
	 * @param {Number} b
	 * @param {Number} c
	 * @param {Number} d
	 * @param {Number} tx
	 * @param {Number} ty
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 * @chainable
	 */
    public append(a: float, b: float, c: float, d: float, tx: float, ty: float) {
        let a1 = this.a;
        let b1 = this.b;
        let c1 = this.c;
        let d1 = this.d;
        if (a !== 1 || b !== 0 || c !== 0 || d !== 1) {
            this.a = a1 * a + c1 * b;
            this.b = b1 * a + d1 * b;
            this.c = a1 * c + c1 * d;
            this.d = b1 * c + d1 * d;
        }
        this.tx = a1 * tx + c1 * ty + this.tx;
        this.ty = b1 * tx + d1 * ty + this.ty;
        return this;
    };

	/**
	 * Prepends the specified matrix properties to this matrix.
	 * This is the equivalent of multiplying `(specified matrix) * (this matrix)`.
	 * @param {Number} a
	 * @param {Number} b
	 * @param {Number} c
	 * @param {Number} d
	 * @param {Number} tx
	 * @param {Number} ty
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 * @chainable
	 */
    public prepend(a: float, b: float, c: float, d: float, tx: float, ty: float) {
        let a1 = this.a;
        let c1 = this.c;
        let tx1 = this.tx;

        this.a = a * a1 + c * this.b;
        this.b = b * a1 + d * this.b;
        this.c = a * c1 + c * this.d;
        this.d = b * c1 + d * this.d;
        this.tx = a * tx1 + c * this.ty + tx;
        this.ty = b * tx1 + d * this.ty + ty;
        return this;
    }

	/**
	 * Appends the specified matrix to this matrix.
	 * This is the equivalent of multiplying `(this matrix) * (specified matrix)`.
	 * @param {Matrix2D} matrix
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 * @chainable
	 */
    public appendMatrix(matrix: Matrix2D): Matrix2D {
        return this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    }

	/**
	 * Prepends the specified matrix to this matrix.
	 * This is the equivalent of multiplying `(specified matrix) * (this matrix)`.
	 *
	 * @example <caption>Calculate the combined transformation for a child object</caption>
	 * let o = displayObject;
	 * let mtx = o.getMatrix();
	 * while (o = o.parent) {
	 * 	 // prepend each parent's transformation in turn:
	 * 	 o.prependMatrix(o.getMatrix());
	 * }
	 *
	 * @param {Matrix2D} matrix
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 * @chainable
	 */
    public prependMatrix(matrix: Matrix2D): Matrix2D {
        return this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    }

	/**
	 * Generates matrix properties from the specified display object transform properties, and appends them to this matrix.
	 *
	 * @example <caption>Generate a matrix representing the transformations of a display object</caption>
	 * let mtx = new Matrix2D();
	 * mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
	 *
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} scaleX
	 * @param {Number} scaleY
	 * @param {Number} rotation
	 * @param {Number} skewX
	 * @param {Number} skewY
	 * @param {Number} [regX]
	 * @param {Number} [regY]
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 * @chainable
	 */
    public appendTransform(x: float, y: float, scaleX: float, scaleY: float, rotation: float, skewX: float, skewY: float, regX: float, regY: float): Matrix2D {
        let r: float, cos: float, sin: float;
        if (rotation % 360) {
            r = rotation * Matrix2D.DEG_TO_RAD;
            cos = Math.cos(r);
            sin = Math.sin(r);
        } else {
            cos = 1;
            sin = 0;
        }

        if (skewX || skewY) {
            // TODO: can this be combined into a single append operation?
            skewX *= Matrix2D.DEG_TO_RAD;
            skewY *= Matrix2D.DEG_TO_RAD;
            this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
        } else {
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
        }

        if (regX || regY) {
            // append the registration offset:
            this.tx -= regX * this.a + regY * this.c;
            this.ty -= regX * this.b + regY * this.d;
        }
        return this;
    }

	/**
	 * Generates matrix properties from the specified display object transform properties, and prepends them to this matrix.
	 *
	 * Note that the above example would not account for {@link DisplayObject#transformMatrix} values.
	 * See {@link Matrix2D#prependMatrix} for an example that does.
	 *
	 * @example <caption>Calculate the combined transformation for a child object</caption>
	 * let o = displayObject;
	 * let mtx = new Matrix2D();
	 * do  {
	 * 	 // prepend each parent's transformation in turn:
	 * 	 mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
	 * } while (o = o.parent);
	 *
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} scaleX
	 * @param {Number} scaleY
	 * @param {Number} rotation
	 * @param {Number} skewX
	 * @param {Number} skewY
	 * @param {Number} [regX]
	 * @param {Number} [regY]
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 */
    public prependTransform(x: float, y: float, scaleX: float, scaleY: float, rotation: float, skewX: float, skewY: float, regX: float, regY: float): Matrix2D {
        let r, cos, sin;
        if (rotation % 360) {
            r = rotation * Matrix2D.DEG_TO_RAD;
            cos = Math.cos(r);
            sin = Math.sin(r);
        } else {
            cos = 1;
            sin = 0;
        }

        if (regX || regY) {
            // prepend the registration offset:
            this.tx -= regX; this.ty -= regY;
        }
        if (skewX || skewY) {
            // TODO: can this be combined into a single prepend operation?
            skewX *= Matrix2D.DEG_TO_RAD;
            skewY *= Matrix2D.DEG_TO_RAD;
            this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
            this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
        } else {
            this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
        }
        return this;
    }

	/**
	 * Applies a clockwise rotation transformation to the matrix.
	 * @param {Number} angle The angle to rotate by, in degrees. To use a value in radians, multiply it by `Math.PI/180`.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 * @chainable
	 */
    public rotate(angle: float): Matrix2D {
        angle *= Matrix2D.DEG_TO_RAD;
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        let a1 = this.a;
        let b1 = this.b;

        this.a = a1 * cos + this.c * sin;
        this.b = b1 * cos + this.d * sin;
        this.c = -a1 * sin + this.c * cos;
        this.d = -b1 * sin + this.d * cos;
        return this;
    }

	/**
	 * Applies a skew transformation to the matrix.
	 * @param {Number} skewX The amount to skew horizontally in degrees. To use a value in radians, multiply it by `Math.PI/180`.
	 * @param {Number} skewY The amount to skew vertically in degrees.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 * @chainable
	*/
    public skew(skewX: float, skewY: float): Matrix2D {
        skewX *= Matrix2D.DEG_TO_RAD;
        skewY *= Matrix2D.DEG_TO_RAD;
        this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
        return this;
    }

	/**
	 * Applies a scale transformation to the matrix.
	 * @param {Number} x The amount to scale horizontally. E.G. a value of 2 will double the size in the X direction, and 0.5 will halve it.
	 * @param {Number} y The amount to scale vertically.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 * @chainable
	 */
    public scale(x: float, y: float): Matrix2D {
        this.a *= x;
        this.b *= x;
        this.c *= y;
        this.d *= y;
        //this.tx *= x;
        //this.ty *= y;
        return this;
    }

	/**
	 * Translates the matrix on the x and y axes.
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 * @chainable
	 */
    public translate(x: float, y: float): Matrix2D {
        this.tx += this.a * x + this.c * y;
        this.ty += this.b * x + this.d * y;
        return this;
    }

	/**
	 * Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 * @chainable
	 */
    public identity(): Matrix2D {
        this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        return this;
    }

	/**
	 * Inverts the matrix, causing it to perform the opposite transformation.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 * @chainable
	 */
    public invert(): Matrix2D {
        let a1 = this.a;
        let b1 = this.b;
        let c1 = this.c;
        let d1 = this.d;
        let tx1 = this.tx;
        let n = a1 * d1 - b1 * c1;

        this.a = d1 / n;
        this.b = -b1 / n;
        this.c = -c1 / n;
        this.d = a1 / n;
        this.tx = (c1 * this.ty - d1 * tx1) / n;
        this.ty = -(a1 * this.ty - b1 * tx1) / n;
        return this;
    }

	/**
	 * Returns true if the matrix is an identity matrix.
	 * @return {Boolean}
	 */
    public isIdentity(): boolean {
        return this.tx === 0 && this.ty === 0 && this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1;
    }

	/**
	 * Returns true if this matrix is equal to the specified matrix (all property values are equal).
	 * @param {Matrix2D} matrix The matrix to compare.
	 * @return {Boolean}
	 */
    public equals(matrix: Matrix2D): boolean {
        return this.tx === matrix.tx && this.ty === matrix.ty && this.a === matrix.a && this.b === matrix.b && this.c === matrix.c && this.d === matrix.d;
    }

	/**
	 * Transforms a point according to this matrix.
	 * @param {Number} x The x component of the point to transform.
	 * @param {Number} y The y component of the point to transform.
	 * @param {Point | Object} [pt] An object to copy the result into. If omitted a generic object with x/y properties will be returned.
	 * @return {Point} This matrix. Useful for chaining method calls.
	 */
    public transformPoint(x: float, y: float, pt: CGPoint = new CGPoint()): CGPoint {
        pt.X = x * this.a + y * this.c + this.tx;
        pt.Y = x * this.b + y * this.d + this.ty;
        return pt;
    }

	/**
	 * Decomposes the matrix into transform properties (x, y, scaleX, scaleY, and rotation). Note that these values
	 * may not match the transform properties you used to generate the matrix, though they will produce the same visual
	 * results.
	 * @param {Object} [target] The object to apply the transform properties to. If null, then a new object will be returned.
	 * @return {Object} The target, or a new generic object with the transform properties applied.
	*/
    public decompose(target: any = {}): any {
        // TODO: it would be nice to be able to solve for whether the matrix can be decomposed into only scale/rotation even when scale is negative
        target.x = this.tx;
        target.y = this.ty;
        target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
        target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);

        let skewX = Math.atan2(-this.c, this.d);
        let skewY = Math.atan2(this.b, this.a);

        let delta = Math.abs(1 - skewX / skewY);
        if (delta < 0.00001) { // effectively identical, can use rotation:
            target.rotation = skewY / Matrix2D.DEG_TO_RAD;
            if (this.a < 0 && this.d >= 0) {
                target.rotation += (target.rotation <= 0) ? 180 : -180;
            }
            target.skewX = target.skewY = 0;
        } else {
            target.skewX = skewX / Matrix2D.DEG_TO_RAD;
            target.skewY = skewY / Matrix2D.DEG_TO_RAD;
        }
        return target;
    }

	/**
	 * Copies all properties from the specified matrix to this matrix.
	 * @param {Matrix2D} matrix The matrix to copy properties from.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 * @chainable
	*/
    public copy(matrix: Matrix2D): Matrix2D {
        return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    }

	/**
	 * Returns a clone of the Matrix2D instance.
	 * @return {Matrix2D} a clone of the Matrix2D instance.
	 */
    public clone(): Matrix2D {
        return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
    }

	/**
	 * Returns a string representation of this object.
	 * @return {String} a string representation of the instance.
	 */
    public toString(): string {
        return `[${this.constructor.name} (a=${this.a} b=${this.b} c=${this.c} d=${this.d} tx=${this.tx} ty=${this.ty})]`;
    }

}



