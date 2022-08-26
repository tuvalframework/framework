import { DisplayObject } from "./DisplayObject";
import { Graphics } from "./Graphics";

/**
 * A Shape allows you to display vector art in the display list. It composites a {@link Graphics}
 * instance which exposes all of the vector drawing methods. The Graphics instance can be shared between multiple Shape
 * instances to display the same vector graphics with different positions or transforms.
 *
 * If the vector art will not change between draws, you may want to use the {@link DisplayObject#cache}
 * method to reduce the rendering cost.
 *
 * @memberof easeljs
 * @example
 * var graphics = new Graphics().beginFill("#ff0000").drawRect(0, 0, 100, 100);
 * var shape = new Shape(graphics);
 * // Alternatively use can also use the graphics property of the Shape class to renderer the same as above.
 * var shape = new Shape();
 * shape.graphics.beginFill("#ff0000").drawRect(0, 0, 100, 100);
 *
 * @extends DisplayObject
 * @param {Graphics} [graphics] The graphics instance to display. If null, a new Graphics instance will be created.
 */
export class Shape extends DisplayObject {
    /**
     * The graphics instance to display.
     * @type {Graphics}
     */
    public graphics: Graphics;

    public constructor(graphics = new Graphics()) {
        super();
        this.graphics = graphics;
    }

    public isVisible(): boolean {
        let hasContent = this.cacheCanvas || (this.graphics && !this.graphics.isEmpty());
        return !!(this.visible && this.alpha > 0 && this.scaleX !== 0 && this.scaleY !== 0 && hasContent);
    }

    public draw(ctx: CanvasRenderingContext2D, ignoreCache: boolean = false) {
        if (super.draw(ctx, ignoreCache)) { return true; }
        this.graphics.draw(ctx, this);
        return true;
    }

	/**
	 * Returns a clone of this Shape. Some properties that are specific to this instance's current context are reverted to
	 * their defaults (for example .parent).
	 * @override
	 * @param {Boolean} [recursive=false] If true, this Shape's {@link Graphics} instance will also be
	 * cloned. If false, the Graphics instance will be shared with the new Shape.
	 */
    public clone(recursive: boolean = false): Shape {
        let g = (recursive && this.graphics) ? this.graphics.clone() : this.graphics;
        return this._cloneProps(new Shape(g)) as any;
    }


}