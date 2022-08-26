import { Shadow } from "../../Shadow";
import { Matrix2D } from "./Matrix2D";
import { float } from "@tuval/core";

/**
 * Used for calculating and encapsulating display related properties.
 * @memberof easeljs
 * @param {Number} [visible] Visible value.
 * @param {Number} [alpha] Alpha value.
 * @param {Number} [shadow] A Shadow instance or null.
 * @param {Number} [compositeOperation] A compositeOperation value or null.
 * @param {Number} [matrix] A transformation matrix. Defaults to a new identity matrix.
 */
export class DisplayProps {
    public visible: boolean = false;
    public alpha: number = 0;
    public shadow: Shadow = undefined as any;
    public compositeOperation: string = null as any;
    public matrix: Matrix2D = undefined as any;

    constructor(visible: boolean = true, alpha: number = 1, shadow?: Shadow, compositeOperation?: string, matrix?: Matrix2D) {
        this.setValues(visible, alpha, shadow as any, compositeOperation as any, matrix as any);

        // assigned in the setValues method.
		/**
		 * Property representing the alpha that will be applied to a display object.
		 * @property alpha
		 * @type {Number}
		 */

		/**
		 * Property representing the shadow that will be applied to a display object.
		 * @property shadow
		 * @type {easeljs.Shadow}
		 */

		/**
		 * Property representing the compositeOperation that will be applied to a display object.
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing}
		 * @property compositeOperation
		 * @type {String}
		 */

		/**
		 * Property representing the value for visible that will be applied to a display object.
		 * @property visible
		 * @type {Boolean}
		 */

		/**
		 * The transformation matrix that will be applied to a display object.
		 * @property matrix
		 * @type {easeljs.Matrix2D}
		 */
    }

	/**
	 * Reinitializes the instance with the specified values.
	 * @param {Number} [visible=true] Visible value.
	 * @param {Number} [alpha=1] Alpha value.
	 * @param {Number} [shadow] A Shadow instance or null.
	 * @param {Number} [compositeOperation] A compositeOperation value or null.
	 * @param {Number} [matrix] A transformation matrix. Defaults to an identity matrix.
	 * @return {easeljs.DisplayProps} This instance. Useful for chaining method calls.
	 * @chainable
	*/
    setValues(visible: boolean = true, alpha: float = 1, shadow: Shadow, compositeOperation: string, matrix: Matrix2D): DisplayProps {
        this.visible = visible;
        this.alpha = alpha;
        this.shadow = shadow;
        this.compositeOperation = compositeOperation;
        this.matrix = matrix || (this.matrix && this.matrix.identity()) || new Matrix2D();
        return this;
    }

	/**
	 * Appends the specified display properties. This is generally used to apply a child's properties its parent's.
	 * @param {Boolean} visible desired visible value
	 * @param {Number} alpha desired alpha value
	 * @param {easeljs.Shadow} shadow desired shadow value
	 * @param {String} compositeOperation desired composite operation value
	 * @param {easeljs.Matrix2D} [matrix] a Matrix2D instance
	 * @return {easeljs.DisplayProps} This instance. Useful for chaining method calls.
	 * @chainable
	*/
    public append(visible: boolean, alpha: float, shadow: Shadow, compositeOperation: string, matrix: Matrix2D): DisplayProps {
        this.alpha *= alpha;
        this.shadow = shadow || this.shadow;
        this.compositeOperation = compositeOperation || this.compositeOperation;
        this.visible = this.visible && visible;
        matrix && this.matrix.appendMatrix(matrix);
        return this;
    }

	/**
	 * Prepends the specified display properties. This is generally used to apply a parent's properties to a child's.
	 * For example, to get the combined display properties that would be applied to a child, you could use:
	 *
	 * @example
	 * let o = displayObject;
	 * let props = new DisplayProps();
	 * do {
	 * 	 // prepend each parent's props in turn:
	 * 	 props.prepend(o.visible, o.alpha, o.shadow, o.compositeOperation, o.getMatrix());
	 * } while (o = o.parent);
	 *
	 * @param {Boolean} visible desired visible value
	 * @param {Number} alpha desired alpha value
	 * @param {easeljs.Shadow} shadow desired shadow value
	 * @param {String} compositeOperation desired composite operation value
	 * @param {easeljs.Matrix2D} [matrix] a Matrix2D instance
	 * @return {easeljs.DisplayProps} This instance. Useful for chaining method calls.
	 * @chainable
	*/
    public prepend(visible: boolean, alpha: float, shadow: Shadow, compositeOperation: string, matrix?: Matrix2D): DisplayProps {
        this.alpha *= alpha;
        this.shadow = this.shadow || shadow;
        this.compositeOperation = this.compositeOperation || compositeOperation;
        this.visible = this.visible && visible;
        matrix && this.matrix.prependMatrix(matrix);
        return this;
    }

	/**
	 * Resets this instance and its matrix to default values.
	 * @return {easeljs.DisplayProps} This instance. Useful for chaining method calls.
	 * @chainable
	*/
    public identity(): DisplayProps {
        this.visible = true;
        this.alpha = 1;
        this.shadow = this.compositeOperation = null as any;
        this.matrix.identity();
        return this;
    }

	/**
	 * Returns a clone of the DisplayProps instance. Clones the associated matrix.
	 * @return {easeljs.DisplayProps} a clone of the DisplayProps instance.
	 */
    public clone(): DisplayProps {
        return new DisplayProps(this.visible, this.alpha, this.shadow, this.compositeOperation, this.matrix.clone());
    }
}