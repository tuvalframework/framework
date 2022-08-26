import { CGColor } from '@tuval/cg';

/**
 * This class encapsulates the properties required to define a shadow to apply to a {@link DisplayObject}
 * via its `shadow` property.
 *
 * @memberof easeljs
 * @example
 * img.shadow = new Shadow("#000000", 5, 5, 10);
 *
 * @param {String} [color=black] The color of the shadow. This can be any valid CSS color value.
 * @param {Number} [offsetX=0] The x offset of the shadow in pixels.
 * @param {Number} [offsetY=0] The y offset of the shadow in pixels.
 * @param {Number} [blur=0] The size of the blurring effect.
 */
export class Shadow {

    /**
     * The color of the shadow. This can be any valid CSS color value.
     * @type {String}
     * @default black
     */
    public color: CGColor;

    /**
     * The x offset of the shadow.
     * @type {Number}
     * @default 0
     */
    public offsetX: number;


    /**
     * The y offset of the shadow.
     * @type {Number}
     * @default 0
     */
    public offsetY: number;

    /**
	 * The blur of the shadow.
	 * @type {Number}
	 * @default 0
	 */
    public blur: number;

    public static identity: Shadow;
    constructor(color: CGColor = new CGColor(0, 0, 0), offsetX = 0, offsetY = 0, blur = 0) {
        this.color = color;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.blur = blur;
    }

	/**
	 * Returns a string representation of this object.
	 * @return {String}
	 */
    public toString() {
        return `[${this.constructor.name}]`;
    }

	/**
	 * Returns a clone of this Shadow instance.
	 * @return {Shadow} A clone of the current Shadow instance.
	 */
    public clone() {
        return new Shadow(this.color, this.offsetX, this.offsetY, this.blur);
    }

}

/**
 * An identity shadow object (all properties are set to 0).
 * @type {Shadow}
 * @static
 * @readonly
 */
Shadow.identity = new Shadow(new CGColor(0, 0, 0, 0));