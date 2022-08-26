import { CGPoint } from '@tuval/cg';
import { CGRectangle } from '@tuval/cg';
import { BitmapCache } from "../filter/BitmapCache";
import { uid } from "../utils/uid";
import { Shadow } from "../../Shadow";
import { Matrix2D } from "../geom/Matrix2D";
import { DisplayProps } from "../geom/DisplayProps";
import { createCanvas } from "../utils/Canvas";
import {Container} from "./Container";
import { Shape } from "./Shape";
import { Stage } from "./Stage";
import { EventDispatcher, float } from "@tuval/core";
import { Filter } from "../filter/Filter";

export class DisplayObject extends EventDispatcher {
    /**
       * The alpha (transparency) for this display object. 0 is fully transparent, 1 is fully opaque.
       * @type {Number}
       * @default 1
       */
    public alpha: number;
    /**
      * If a cache is active, this returns the canvas that holds the image of this display object.
      * This will be a HTMLCanvasElement unless special cache rules have been deliberately enabled for this cache.
      * @see {@link DisplayObject#cache}
      * @type {HTMLCanvasElement|WebGLTexture|Object}
      * @default null
      * @readonly
      */
    public readonly cacheCanvas: HTMLCanvasElement | WebGLTexture;

    /**
 * If a cache has been made, this returns the class that is managing the cacheCanvas and its properties.
 * Use this to control, inspect, and change the cache. In special circumstances this may be a modified or subclassed BitmapCache.
 * @see {@link BitmapCache}
 * @type {BitmapCache}
 * @default null
 * @readonly
 */
    public bitmapCache: BitmapCache;
    /**
       * Unique ID for this display object. Makes display objects easier for some uses.
       * @type {Number}
       * @default -1
       */
    public id: number;

    /**
     * Indicates whether to include this object when running mouse interactions. Setting this to `false` for children
     * of a {@link Container} will cause events on the Container to not fire when that child is
     * clicked. Setting this property to `false` does not prevent the {@link Container#getObjectsUnderPoint}
     * method from returning the child.
     * @type {Boolean}
     * @default true
     */
    public mouseEnabled: boolean;

    /**
     * If false, the tick will not run on this display object (or its children). This can provide some performance benefits.
     * In addition to preventing the "tick" event from being dispatched, it will also prevent tick related updates
     * on some display objects (ex. Sprite & MovieClip frame advancing, and DOMElement display properties).
     * @type Boolean
     * @default true
     */
    public tickEnabled: boolean;
    /**
     * A reference to the {@link Container} or {@link Stage} object that
     * contains this display object, or null if it has not been added to one.
     * @type {Container}
     * @default null
     * @readonly
     */
    public parent: Container;
    /**
    * The left offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate
    * around its center, you would set regX and {@link DisplayObject#regY} to 50.
    * Cached object's registration points should be set based on pre-cache conditions, not cached size.
    * @type {Number}
    * @default 0
    */
    public regX: number;

    /**
     * The y offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate around
     * its center, you would set {@link DisplayObject#regX} and regY to 50.
     * Cached object's registration points should be set based on pre-cache conditions, not cached size.
     * @type {Number}
     * @default 0
     */
    public regY: number;

    /**
     * The rotation in degrees for this display object.
     * @type {Number}
     * @default 0
     */
    public rotation: number;

    /**
     * The factor to stretch this display object horizontally. For example, setting scaleX to 2 will stretch the display
     * object to twice its nominal width. To horizontally flip an object, set the scale to a negative number.
     * @type {Number}
     * @default 1
     */
    public scaleX: number;

    /**
     * The factor to stretch this display object vertically. For example, setting scaleY to 0.5 will stretch the display
     * object to half its nominal height. To vertically flip an object, set the scale to a negative number.
     * @type {Number}
     * @default 1
     */
    public scaleY: number;

    /**
     * The factor to skew this display object horizontally.
     * @type {Number}
     * @default 0
     */
    public skewX: number;

    /**
     * The factor to skew this display object vertically.
     * @type {Number}
     * @default 0
     */
    public skewY: number;

    /**
     * A shadow object that defines the shadow to render on this display object. Set to `null` to remove a shadow. If
     * null, this property is inherited from the parent container.
     * @type {Shadow}
     * @default null
     */
    public shadow: Shadow;

    /**
     * Indicates whether this display object should be rendered to the canvas and included when running the Stage
     * {@link Container#getObjectsUnderPoint} method.
     * @type {Boolean}
     * @default true
     */
    public visible: boolean;

    /**
     * The x (horizontal) position of the display object, relative to its parent.
     * @type {Number}
     * @default 0
     */
    public x: number;

    /** The y (vertical) position of the display object, relative to its parent.
     * @type {Number}
     * @default 0
     */
    public y: number;

    /**
     * If set, defines the transformation for this display object, overriding all other transformation properties
     * (x, y, rotation, scale, skew).
     * @type {Matrix2D}
     * @default null
     */
    public transformMatrix: Matrix2D;

    /**
     * The composite operation indicates how the pixels of this display object will be composited with the elements
     * behind it. If `null`, this property is inherited from the parent container.
     * @see {@link https://html.spec.whatwg.org/multipage/scripting.html#dom-context-2d-globalcompositeoperation "WHATWG spec on compositing"}
     * @see {@link https://drafts.fxtf.org/compositing/ "W3C draft on compositing and blending"}
     * @type {String}
     * @default null
     */
    public compositeOperation: string;
    /**
     * Indicates whether the display object should be drawn to a whole pixel when {@link Stage.snapToPixelEnabled} is true.
     * To enable/disable snapping on whole categories of display objects, set this value on the prototype.
     * (ex. Text.prototype.snapToPixel = true).
     * @type {Boolean}
     * @default true
     */
    public snapToPixel: boolean;

    /**
     * An array of {@link Filter} objects to apply to this display object. Filters are only applied/updated when {@link DisplayObject#cache}
     * or {@link DisplayObject#updateCache} is called on the display object, and only apply to the area that is cached.
     * @type {Array<Filter>}
     * @default null
     */
    public filters: Array<Filter>;

    /**
     * A Shape instance that defines a vector mask (clipping path) for this display object. The shape's transformation
     * will be applied relative to the display object's parent coordinates (as if it were a child of the parent).
     * @type {Shape}
     * @default null
     */
    public mask: Shape;

    /**
     * A display object that will be tested when checking mouse interactions or testing {@link Container#getObjectsUnderPoint}.
     * The hit area will have its transformation applied relative to this display object's coordinate space (as though
     * the hit test object were a child of this display object and relative to its regX/Y). The hitArea will be tested
     * using only its own `alpha` value regardless of the alpha value on the target display object, or the target's
     * ancestors (parents).
     *
     * If set on a {@link Container}, children of the Container will not receive mouse events.
     * This is similar to setting {@link DisplayObject#mouseChildren} to false.
     *
     * Note that hitArea is NOT currently used by the `hitTest()` method, nor is it supported for {@link Stage}.
     * @type {DisplayObject}
     * @default null
     */
    public hitArea: DisplayObject;

    /**
     * A CSS cursor (ex. "pointer", "help", "text", etc) that will be displayed when the user hovers over this display
     * object. You must enable mouseover events using the {@link Stage#enableMouseOver} method to
     * use this property. Setting a non-null cursor on a Container will override the cursor set on its descendants.
     * @type {String}
     * @default null
     */
    public cursor: string;

    public tag: any;

    /**
     * @protected
     * @type {DisplayProps}
     * @default {DisplayProps}
     */
    protected _props: DisplayProps;

    /**
     * @protected
     * @type {Rectangle}
     * @default {Rectangle}
     */
    protected _rectangle: CGRectangle;

    /**
     * @protected
     * @type {Rectangle}
     * @default null
     */
    protected _bounds: CGRectangle;

    /**
     * Where StageGL should look for required display properties, matters only for leaf display objects. Containers
     * or cached objects won't use this property, it's for native display of terminal elements.
     * @protected
     * @type {Number}
     * @default 0
     */
    protected _webGLRenderStyle: number;

    /**
    * Enum like property for determining StageGL render lookup, i.e. where to expect properties.
    * @protected
    * @static
    * @type {Number}
    */
    public static _StageGL_NONE: number;

    /**
       * Storage for the calculated position of an object in StageGL. If not using StageGL, you can null it to save memory.
       * @protected
       * @type {easeljsMatrix2D}
       * @default {Matrix2D}
       */
    protected _glMtx: Matrix2D;

    /**
    * {@link Stage#snapToPixelEnabled} is temporarily copied here during a draw to provide global access.
    * @protected
    * @static
    * @type {Boolean}
    * @default false
    */
    public static _snapToPixelEnabled: boolean;

    /**
    * @type {CanvasRenderingContext2D}
    * @static
    * @protected
    */
    public static _hitTestContext: CanvasRenderingContext2D;

    /**
    * Suppresses errors generated when using features like hitTest, mouse events, and {@link Container#getObjectsUnderPoint}
    * with cross domain content.
    * @static
    * @type {Boolean}
    * @default false
    */
    public static suppressCrossDomainErrors: boolean;

    /**
    * Listing of mouse event names. Used in _hasMouseEventListener.
    * @protected
    * @static
    * @type {Array}
    */
    public static _MOUSE_EVENTS: Array<string>;

    /**
    * Enum like property for determining StageGL render lookup, i.e. where to expect properties.
    * @protected
    * @static
    * @type {Number}
    */
    public static _StageGL_SPRITE: number;

    /**
    * Enum like property for determining StageGL render lookup, i.e. where to expect properties.
    * @protected
    * @static
    * @type {Number}
    */
    public static _StageGL_BITMAP: number;

    /**
    * @type {HTMLCanvasElement|Object}
    * @static
    * @protected
    */
    public static _hitTestCanvas: HTMLCanvasElement;


    constructor() {
        super();
        this.alpha = 1;
        this.cacheCanvas = null as any;
        this.bitmapCache = null as any;
        this.id = uid();
        this.mouseEnabled = true;
        this.tickEnabled = true;
        /**
         * An optional name for this display object. Included in {@link DisplayObject#toString}.
         * @type {String}
         * @default null
         */
        this.name = null as any;
        this.parent = null as any;
        this.regX = 0;
        this.regY = 0;
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.skewX = 0;
        this.skewY = 0;
        this.shadow = null as any;
        this.visible = true;
        this.x = 0;
        this.y = 0;
        this.transformMatrix = null as any;
        this.compositeOperation = null as any;
        this.snapToPixel = true;
        this.filters = null as any;
        this.mask = null as any;
        this.hitArea = null as any;
        this.cursor = null as any;
        this._props = new DisplayProps();
        this._rectangle = new CGRectangle();
        this._bounds = null as any;
        this._webGLRenderStyle = DisplayObject._StageGL_NONE;
        this._glMtx = new Matrix2D();
    }

    /**
     * Returns the {@link Stage} instance that this display object will be rendered on, or null if it has not been added to one.
     * @type {Stage}
     * @readonly
     */
    public get stage(): Stage {
        // uses dynamic access to avoid circular dependencies;
        let o: any = this;
        while (o.parent) { o = o.parent; }
        if (/^\[Stage(GL)?(\s\(name=\w+\))?\]$/.test(o.toString())) { return o; }
        return null as any;
    }

    /**
     * Set both the {@link DisplayObject#scaleX} and the {@link DisplayObject#scaleY} property to the same value.
     * @type {Number}
     * @default 1
     */
    public set scale(value: number) {
        this.scaleX = this.scaleY = value;
    }

    /**
     * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
     * This does not account for whether it would be visible within the boundaries of the stage.
     *
     * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
     * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
     */
    public isVisible(): boolean {
        return !!(this.visible && this.alpha > 0 && this.scaleX !== 0 && this.scaleY !== 0);
    }

    /**
     * Alias for {@link DisplayObject#drawCache}. Use drawCache() directly from a grandchild to bypass
     * the middle parent's draw().
     *
     * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
     * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache. For example,
     * used for drawing the cache (to prevent it from simply drawing an existing cache back into itself).
     * @return {Boolean}
     */
    public draw(ctx: CanvasRenderingContext2D, ignoreCache: boolean = false): boolean {
        return this.drawCache(ctx, ignoreCache);
    }

    /**
     * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
     * Returns `true` if the draw was handled (useful for overriding functionality).
     *
     * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
     * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
     * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache. For example,
     * used for drawing the cache (to prevent it from simply drawing an existing cache back into itself).
     * @return {Boolean}
     */
    public drawCache(ctx: CanvasRenderingContext2D, ignoreCache: boolean = false): boolean {
        const cache = this.bitmapCache;
        if (cache && !ignoreCache) {
            return cache.draw(ctx);
        }
        return false;
    }

    /**
     * Applies this display object's `transformation`, `alpha`, `globalCompositeOperation`, `mask` (clipping path), and `shadow`
     * to the specified context. This is typically called prior to {@link DisplayObject#draw}.
     * @param {CanvasRenderingContext2D} ctx The canvas 2D to update.
     */
    public updateContext(ctx: CanvasRenderingContext2D): void {
        const mask = this.mask,
            mtx = this._props.matrix;

        if (mask && mask.graphics && !mask.graphics.isEmpty()) {
            mask.getMatrix(mtx);
            ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);

            mask.graphics.drawAsPath(ctx);
            ctx.clip();

            mtx.invert();
            ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
        }

        this.getMatrix(mtx);
        let tx = mtx.tx, ty = mtx.ty;
        if (DisplayObject._snapToPixelEnabled && this.snapToPixel) {
            tx = tx + (tx < 0 ? -0.5 : 0.5) | 0;
            ty = ty + (ty < 0 ? -0.5 : 0.5) | 0;
        }
        ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, tx, ty);
        ctx.globalAlpha *= this.alpha;
        if (this.compositeOperation) { ctx.globalCompositeOperation = this.compositeOperation; }
        if (this.shadow) { this._applyShadow(ctx, this.shadow); }
    };

    /**
     * Draws the display object into a new element, which is then used for subsequent draws. Intended for complex content
     * that does not change frequently (ex. a Container with many children that do not move, or a complex vector Shape),
     * this can provide for much faster rendering because the content does not need to be re-rendered each tick. The
     * cached display object can be moved, rotated, faded, etc freely, however if its content changes, you must manually
     * update the cache by calling `updateCache()` again. You must specify the cached area via the x, y, w, and h
     * parameters. This defines the rectangle that will be rendered and cached using this display object's coordinates.
     *
     * Filters need to be defined <em>before</em> the cache is applied or you will have to call updateCache after
     * application. Check out the {@link Filter} class for more information. Some filters
     * (ex. {@link BlurFilter}) may not work as expected in conjunction with the scale param.
     *
     * Usually, the resulting cacheCanvas will have the dimensions width * scale, height * scale, however some filters (ex. BlurFilter)
     * will add padding to the canvas dimensions.
     *
     * In previous versions, caching was handled on DisplayObject but has since been moved to {@link BitmapCache}.
     * This allows for easier interaction and alternate cache methods like WebGL with {@link StageGL}.
     * For more information on the options object, see the {@link BitmapCache#define}.
     *
     * @example
     * const shape = new Shape();
     * shape.graphics.beginFill("#ff0000").drawCircle(0, 0, 25);
     * shape.cache(-25, -25, 50, 50);
     *
     * @param {Number} x The x coordinate origin for the cache region.
     * @param {Number} y The y coordinate origin for the cache region.
     * @param {Number} width The width of the cache region.
     * @param {Number} height The height of the cache region.
     * @param {Number} [scale=1] The scale at which the cache will be created. For example, if you cache a vector shape using
     * 	myShape.cache(0,0,100,100,2) then the resulting cacheCanvas will be 200x200 px. This lets you scale and rotate
     * 	cached elements with greater fidelity.
     * @param {Object} [options] Specify additional parameters for the cache logic
     */
    public cache(x: float, y: float, width: float, height: float, scale: float = 1, options: any) {
        if (!this.bitmapCache) {
            this.bitmapCache = new BitmapCache();
        } else {
            this.bitmapCache._autoGenerated = false;
        }
        this.bitmapCache.define(this, x, y, width, height, scale, options);
    }

    /**
     * Redraws the display object to its cache. Calling updateCache without an active cache will throw an error.
     * If `compositeOperation` is null the current cache will be cleared prior to drawing. Otherwise the display object
     * will be drawn over the existing cache using the specified `compositeOperation`.
     *
     * In previous versions caching was handled on DisplayObject but has since been moved to {@link BitmapCache}
     * This allows for easier interaction and alternate cache methods like WebGL and {@link StageGL}.
     *
     * @example
     * // clear current graphics
     * shapeInstance.clear();
     * // draw some new instructions
     * shapeInstance.setStrokeStyle(3).beginStroke("#ff0000").moveTo(100, 100).lineTo(200,200);
     * // update cache, new line will be drawn on top of the old one
     * shapeInstance.updateCache();
     *
     * @see {@link https://html.spec.whatwg.org/multipage/scripting.html#dom-context-2d-globalcompositeoperation "WHATWG spec on compositing"}
     * @param {String} [compositeOperation] The composite operation to use, or nul to clear it
     */
    public updateCache(compositeOperation: string): void {
        if (!this.bitmapCache) {
            throw "cache() must be called before updateCache()";
        }
        this.bitmapCache.update(compositeOperation);
    }

    /**
     * Clears the current cache.
     * @see {@link DisplayObject#cache}
     */
    public uncache(): void {
        if (this.bitmapCache) {
            this.bitmapCache.release();
            this.bitmapCache = undefined as any;
        }
    }

    /**
     * Returns a data URL for the cache, or null if this display object is not cached.
     * Only generated if the cache has changed, otherwise returns last result.
     * @param {} type
     * @params {} encoderOptions
     * @return {String} The image data url for the cache.
     */
    public getCacheDataURL(type: string, encoderOptions: any): string {
        return this.bitmapCache ? this.bitmapCache.getCacheDataURL(type, encoderOptions) : null as any;
    }

    /**
     * Transforms the specified x and y position from the coordinate space of the display object
     * to the global (stage) coordinate space. For example, this could be used to position an HTML label
     * over a specific point on a nested display object. Returns a Point instance with x and y properties
     * correlating to the transformed coordinates on the stage.
     *
     * @example
     * displayObject.x = 300;
     * displayObject.y = 200;
     * stage.addChild(displayObject);
     * const point = displayObject.localToGlobal(100, 100);
     * // x=400, y=300
     *
     * @param {Number} x The x position in the source display object to transform.
     * @param {Number} y The y position in the source display object to transform.
     * @param {Point|Object} [pt=Point] An object to copy the result into.
     * @return {PointF} A Point instance with x and y properties correlating to the transformed coordinates
     * on the stage.
     */
    public localToGlobal(x: float, y: float, pt: CGPoint = new CGPoint()): CGPoint {
        return this.getConcatenatedMatrix(this._props.matrix).transformPoint(x, y, pt);
    }

    /**
     * Transforms the specified x and y position from the global (stage) coordinate space to the
     * coordinate space of the display object. For example, this could be used to determine
     * the current mouse position within the display object. Returns a Point instance with x and y properties
     * correlating to the transformed position in the display object's coordinate space.
     *
     * @example
     * displayObject.x = 300;
     * displayObject.y = 200;
     * stage.addChild(displayObject);
     * const point = displayObject.globalToLocal(100, 100);
     * // x=-200, y=-100
     *
     * @method globalToLocal
     * @param {Number} x The x position on the stage to transform.
     * @param {Number} y The y position on the stage to transform.
     * @param {Point|Object} [pt=Point] An object to copy the result into.
     * @return {Point} A Point instance with x and y properties correlating to the transformed position in the
     * display object's coordinate space.
     */
    public globalToLocal(x: float, y: float, pt: CGPoint = new CGPoint()): CGPoint {
        return this.getConcatenatedMatrix(this._props.matrix).invert().transformPoint(x, y, pt);
    }

    /**
     * Transforms the specified x and y position from the coordinate space of this display object to the coordinate
     * space of the target display object. Returns a Point instance with x and y properties correlating to the
     * transformed position in the target's coordinate space. Effectively the same as using the following code with
     * {@link DisplayObject#localToGlobal} and {@link DisplayObject#globalToLocal}.
     *
     * @example
     * let pt = this.localToGlobal(x, y);
     * pt = target.globalToLocal(pt.x, pt.y);
     *
     * @param {Number} x The x position in the source display object to transform.
     * @param {Number} y The y position on the source display object to transform.
     * @param {DisplayObject} target The target display object to which the coordinates will be transformed.
     * @param {Point|Object} [pt=Point] An object to copy the result into.
     * @return {Point} Returns a Point instance with x and y properties correlating to the transformed position
     * in the target's coordinate space.
     */
    public localToLocal(x: float, y: float, target: DisplayObject, pt: CGPoint = new CGPoint()): CGPoint {
        pt = this.localToGlobal(x, y, pt);
        return target.globalToLocal(pt.X, pt.Y, pt);
    }

    /**
     * Shortcut method to quickly set the transform properties on the display object. All parameters are optional.
     * Omitted parameters will have the default value set.
     *
     * @example
     * displayObject.setTransform(100, 100, 2, 2);
     *
     * @param {Number|Object} [x=0] The horizontal translation (x position) in pixels
     * @param {Number} [y=0] The vertical translation (y position) in pixels
     * @param {Number} [scaleX=1] The horizontal scale, as a percentage of 1
     * @param {Number} [scaleY=1] the vertical scale, as a percentage of 1
     * @param {Number} [rotation=0] The rotation, in degrees
     * @param {Number} [skewX=0] The horizontal skew factor
     * @param {Number} [skewY=0] The vertical skew factor
     * @param {Number} [regX=0] The horizontal registration point in pixels
     * @param {Number} [regY=0] The vertical registration point in pixels
     * @return {DisplayObject} Returns this instance. Useful for chaining commands.
     * @chainable
    */
    public setTransform(xOrParams: float = 0, y: float = 0, scaleX: float = 1, scaleY: float = 1, rotation: float = 0, skewX: float = 0, skewY: float = 0, regX: float = 0, regY: float = 0): DisplayObject {
        if (typeof xOrParams !== "number") {
            this.set(xOrParams);
        } else {
            this.x = xOrParams;
            this.y = y;
            this.scaleX = scaleX;
            this.scaleY = scaleY;
            this.rotation = rotation;
            this.skewX = skewX;
            this.skewY = skewY;
            this.regX = regX;
            this.regY = regY;
        }
        return this;
    }

    /**
     * Returns a matrix based on this object's current transform.
     * @param {Matrix2D} [matrix=Matrix2D] A Matrix2D object to populate with the calculated values. If null, a new
     * Matrix object is returned.
     * @return {Matrix2D} A matrix representing this display object's transform.
     */
    public getMatrix(matrix = new Matrix2D()): Matrix2D {
        const o = this;
        return o.transformMatrix ? matrix.copy(o.transformMatrix) :
            (matrix.identity() && matrix.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY));
    }

    /**
     * Generates a Matrix2D object representing the combined transform of the display object and all of its
     * parent Containers up to the highest level ancestor (usually the {@link Stage}). This can
     * be used to transform positions between coordinate spaces, such as with {@link DisplayObject#localToGlobal}
     * and {@link DisplayObject#globalToLocal}.
     * @param {Matrix2D} [matrix=Matrix2D] A Matrix2D object to populate with the calculated values.
     * If null, a new Matrix2D object is returned.
     * @return {Matrix2D} The combined matrix.
     */
    public getConcatenatedMatrix(matrix = new Matrix2D()): Matrix2D {
        const mtx = this.getMatrix(matrix);
        let o;
        while (o = o.parent) {
            mtx.prependMatrix(o.getMatrix(o._props.matrix));
        }
        return mtx;
    }

    /**
     * Generates a DisplayProps object representing the combined display properties of the  object and all of its
     * parent Containers up to the highest level ancestor (usually the {@link Stage}).
     * @param {DisplayProps} [props=DisplayProps] A DisplayProps object to populate with the calculated values.
     * If null, a new DisplayProps object is returned.
     * @return {DisplayProps} The combined display properties.
     */
    public getConcatenatedDisplayProps(props = new DisplayProps()): DisplayProps {
        props = props.identity();
        let o: any = this;
        const mtx = o.getMatrix(props.matrix);
        do {
            props.prepend(o.visible, o.alpha, o.shadow, o.compositeOperation);
            // we do this to avoid problems with the matrix being used for both operations when o._props.matrix is passed in as the props param.
            // this could be simplified (ie. just done as part of the prepend above) if we switched to using a pool.
            if (o != this) { mtx.prependMatrix(o.getMatrix(o._props.matrix)); }
        } while (o = o.parent);
        return props;
    }

    /**
     * Tests whether the display object intersects the specified point in local coordinates (ie. draws a pixel with alpha > 0 at
     * the specified position). This ignores the alpha, shadow, hitArea, mask, and compositeOperation of the display object.
     *
     * Please note that shape-to-shape collision is not currently supported by
     *
     * @example
     * stage.addEventListener("stagemousedown", event => {
     *   const didHit = myShape.hitTest(event.stageX, event.stageY);
     * });
     *
     * @param {Number} x The x position to check in the display object's local coordinates.
     * @param {Number} y The y position to check in the display object's local coordinates.
     * @return {Boolean} A Boolean indicating whether a visible portion of the DisplayObject intersect the specified
     * local Point.
    */
    public hitTest(x: float, y: float): boolean {
        const ctx = DisplayObject._hitTestContext;
        ctx.setTransform(1, 0, 0, 1, -x, -y);
        // hit tests occur in a 2D context, so don't attempt to draw a GL only Texture into a 2D context
        this.draw(ctx, !(this.bitmapCache && !(this.bitmapCache._cacheCanvas instanceof WebGLTexture)));
        const hit = this._testHit(ctx);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, 2, 2);
        return hit;
    }

    /**
     * Provides a chainable shortcut method for setting a number of properties on the instance.
     *
     * @example
     * const myGraphics = new Graphics().beginFill("#ff0000").drawCircle(0, 0, 25);
     * const shape = new Shape().set({ graphics: myGraphics, x: 100, y: 100, alpha: 0.5 });
     *
     * @param {Object} props A generic object containing properties to copy to the DisplayObject instance.
     * @return {DisplayObject} Returns the instance the method is called on (useful for chaining calls.)
     * @chainable
    */
    public set(props: any): DisplayObject {
        for (var n in props) { this[n] = props[n]; }
        return this;
    }

    /**
     * Returns a rectangle representing this object's bounds in its local coordinate system (ie. with no transformation).
     * Objects that have been cached will return the bounds of the cache.
     *
     * Not all display objects can calculate their own bounds (ex. Shape). For these objects, you can use
     * {@link DisplayObject#setBounds} so that they are included when calculating Container bounds.
     *
     * <table>
     * 	<tr><td><b>All</b></td><td>
     * 		All display objects support setting bounds manually using setBounds(). Likewise, display objects that
     * 		have been cached using cache() will return the bounds of their cache. Manual and cache bounds will override
     * 		the automatic calculations listed below.
     * 	</td></tr>
     * 	<tr><td><b>Bitmap</b></td><td>
     * 		Returns the width and height of the {{#crossLink "Bitmap/sourceRect"}}{{/crossLink}} (if specified) or image,
     * 		extending from (x=0,y=0).
     * 	</td></tr>
     * 	<tr><td><b>Sprite</b></td><td>
     * 		Returns the bounds of the current frame. May have non-zero x/y if a frame registration point was specified
     * 		in the spritesheet data. See also {{#crossLink "SpriteSheet/getFrameBounds"}}{{/crossLink}}
     * 	</td></tr>
     * 	<tr><td><b>Container</b></td><td>
     * 		Returns the aggregate (combined) bounds of all children that return a non-null value from `getBounds()`.
     * 	</td></tr>
     * 	<tr><td><b>Shape</b></td><td>
     * 		Does not currently support automatic bounds calculations. Use `setBounds()` to manually define bounds.
     * 	</td></tr>
     * 	<tr><td><b>Text</b></td><td>
     * 		Returns approximate bounds. Horizontal values (x/width) are quite accurate, but vertical values (y/height)
     * 		are not, especially when using {{#crossLink "Text/textBaseline:property"}}{{/crossLink}} values other than "top".
     * 	</td></tr>
     * 	<tr><td><b>BitmapText</b></td><td>
     * 		Returns approximate bounds. Values will be more accurate if spritesheet frame registration points are close
     * 		to (x=0,y=0).
     * 	</td></tr>
    * </table>
     *
     * @example <caption>Bounds can be expensive to calculate for some objects (ex. text, or containers with many children), and
     * are recalculated each time you call getBounds(). You can prevent recalculation on static objects by setting the
     * bounds explicitly<caption>
     *
     * const bounds = obj.getBounds();
     * obj.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
     * // getBounds will now use the set values, instead of recalculating
     *
     * @example <caption>To reduce memory impact, the returned Rectangle instance may be reused internally; clone the instance or copy its
     * values if you need to retain it</caption>
     *
     * const bounds = obj.getBounds().clone();
     * // OR:
     * myRect.copy(obj.getBounds());
     *
     * @return {Rectangle} A Rectangle instance representing the bounds, or null if bounds are not available for this
     * object.
     */
    public getBounds(): CGRectangle {
        if (this._bounds) { return this._rectangle.copy(this._bounds); }
        const cache = this.bitmapCache;
        if (cache && this.cacheCanvas) {
            return cache.getBounds();
        }
        return null as any;
    }

    /**
     * Returns a rectangle representing this object's bounds in its parent's coordinate system (ie. with transformations applied).
     * Objects that have been cached will return the transformed bounds of the cache.
     *
     * Not all display objects can calculate their own bounds (ex. Shape). For these objects, you can use
     * {@link DisplayObject#setBounds} so that they are included when calculating Container
     * bounds.
     *
     * To reduce memory impact, the returned Rectangle instance may be reused internally; clone the instance or copy its
     * values if you need to retain it.
     *
     * Container instances calculate aggregate bounds for all children that return bounds via getBounds.
     * @return {Rectangle} A Rectangle instance representing the bounds, or null if bounds are not available for this object.
     */
    public getTransformedBounds(): CGRectangle {
        return this._getBounds();
    }

    /**
     * Allows you to manually specify the bounds of an object that either cannot calculate their own bounds (ex. Shape &
     * Text) for future reference, or so the object can be included in Container bounds. Manually set bounds will always
     * override calculated bounds.
     *
     * The bounds should be specified in the object's local (untransformed) coordinates. For example, a Shape instance
     * with a 25px radius circle centered at 0,0 would have bounds of (-25, -25, 50, 50).
     * @param {Number} x The x origin of the bounds. Pass null to remove the manual bounds.
     * @param {Number} y The y origin of the bounds.
     * @param {Number} width The width of the bounds.
     * @param {Number} height The height of the bounds.
     */
    public setBounds(x?: float, y?: float, width?: float, height?: float) {
        if (x == null) {
            this._bounds = null as any;
            return;
        }
        this._bounds = (this._bounds || new CGRectangle()).setValues(x, y, width, height);
    }

    /**
     * Returns a clone of this DisplayObject. Some properties that are specific to this instance's current context are
     * reverted to their defaults (for example .parent). Caches are not maintained across clones, and some elements
     * are copied by reference (masks, individual filter instances, hit area)
     * @return {DisplayObject} A clone of the current DisplayObject instance.
     */
    public clone(test?: boolean): DisplayObject {
        return this._cloneProps(new DisplayObject());
    }

    /**
     * Returns a string representation of this object.
     * @return {String} a string representation of the instance.
     */
    public toString(): string {
        return `[${this.constructor.name} (name=${this.name})]`;
    }

    /**
     * Called before the object gets drawn and is a chance to ensure the display state of the object is correct.
     * Mostly used by {@link MovieClip} and {@link BitmapText} to
     * correct their internal state and children prior to being drawn.
     *
     * Is manually called via draw in a {@link Stage} but is automatically called when
     * present in a {@link StageGL} instance.
     *
     * @method _updateState
     * @protected
     */
    protected _updateState() { }

    /**
     * @param {DisplayObject} o The DisplayObject instance which will have properties from the current DisplayObject
     * instance copied into.
     * @return {DisplayObject} o
     * @protected
     */
    protected _cloneProps(o: DisplayObject): DisplayObject {
        o.alpha = this.alpha;
        o.mouseEnabled = this.mouseEnabled;
        o.tickEnabled = this.tickEnabled;
        o.name = this.name;
        o.regX = this.regX;
        o.regY = this.regY;
        o.rotation = this.rotation;
        o.scaleX = this.scaleX;
        o.scaleY = this.scaleY;
        o.shadow = this.shadow;
        o.skewX = this.skewX;
        o.skewY = this.skewY;
        o.visible = this.visible;
        o.x = this.x;
        o.y = this.y;
        o.compositeOperation = this.compositeOperation;
        o.snapToPixel = this.snapToPixel;
        o.filters = this.filters == null ? null : this.filters.slice() as any;
        o.mask = this.mask;
        o.hitArea = this.hitArea;
        o.cursor = this.cursor;
        o._bounds = this._bounds;
        o._webGLRenderStyle = this._webGLRenderStyle;
        return o;
    }

    /**
     * @protected
     * @param {CanvasRenderingContext2D} ctx
     * @param {Shadow} shadow
     */
    protected _applyShadow(ctx: CanvasRenderingContext2D, shadow: Shadow = Shadow.identity) {
        ctx.shadowColor = shadow.color.toString();
        ctx.shadowOffsetX = shadow.offsetX;
        ctx.shadowOffsetY = shadow.offsetY;
        ctx.shadowBlur = shadow.blur;
    }

    /**
     * @param {Object} evt An event object that will be dispatched to all tick listeners. This object is reused between dispatchers to reduce construction & GC costs.
     * @protected
     */
    protected _tick(evt: any) {
        // because tick can be really performance sensitive, check for listeners before calling dispatchEvent.
        const ls = (<any>this)._listeners;
        if (ls && ls.tick) {
            // reset & reuse the event object to avoid construction / GC costs:
            evt.target = null;
            evt.propagationStopped = evt.immediatePropagationStopped = false;
            this.dispatchEvent(evt);
        }
    }

    /**
     * @protected
     * @param {CanvasRenderingContext2D} ctx
     * @return {Boolean}
     */
    protected _testHit(ctx: CanvasRenderingContext2D): boolean {
        let hit: boolean = false;
        try {
            hit = ctx.getImageData(0, 0, 1, 1).data[3] > 1;
        } catch (e) {
            if (!DisplayObject.suppressCrossDomainErrors) {
                throw "An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images.";
            }
        }
        return hit;
    }

    /**
     * @param {Matrix2D} matrix
     * @param {Boolean} ignoreTransform If true, does not apply this object's transform.
     * @return {Rectangle}
     * @protected
     */
    protected _getBounds(matrix?: Matrix2D, ignoreTransform?: boolean): CGRectangle {
        return this._transformBounds(this.getBounds(), matrix as any, ignoreTransform as any);
    }

    /**
     * @param {Rectangle} bounds
     * @param {Matrix2D} matrix
     * @param {Boolean} ignoreTransform
     * @return {Rectangle}
     * @protected
     */
    protected _transformBounds(bounds: CGRectangle, matrix: Matrix2D, ignoreTransform: boolean): CGRectangle {
        if (!bounds) { return bounds; }
        let x: float = bounds.X;
        let y: float = bounds.Y;
        const width: float = bounds.Width;
        const height: float = bounds.Height;
        const mtx = ignoreTransform ? this._props.matrix.identity() : this.getMatrix(this._props.matrix);

        if (x || y) { mtx.appendTransform(0, 0, 1, 1, 0, 0, 0, -x, -y); } // TODO: simplify this.
        if (matrix) { mtx.prependMatrix(matrix); }

        const x_a = width * mtx.a,
            x_b = width * mtx.b,
            y_c = height * mtx.c,
            y_d = height * mtx.d,
            tx = mtx.tx,
            ty = mtx.ty;

        let minX = tx,
            maxX = tx,
            minY = ty,
            maxY = ty;

        if ((x = x_a + tx) < minX) { minX = x; } else if (x > maxX) { maxX = x; }
        if ((x = x_a + y_c + tx) < minX) { minX = x; } else if (x > maxX) { maxX = x; }
        if ((x = y_c + tx) < minX) { minX = x; } else if (x > maxX) { maxX = x; }

        if ((y = x_b + ty) < minY) { minY = y; } else if (y > maxY) { maxY = y; }
        if ((y = x_b + y_d + ty) < minY) { minY = y; } else if (y > maxY) { maxY = y; }
        if ((y = y_d + ty) < minY) { minY = y; } else if (y > maxY) { maxY = y; }

        return bounds.setValues(minX, minY, maxX - minX, maxY - minY);
    }

    /**
     * Indicates whether the display object has any mouse event listeners or a cursor.
     * @return {Boolean}
     * @protected
     */
    protected _hasMouseEventListener(): boolean {
        const evts = DisplayObject._MOUSE_EVENTS;
        for (let i = 0, l = evts.length; i < l; i++) {
            if (this.hasEventListener(evts[i])) { return true; }
        }
        return !!this.cursor;
    }

}

DisplayObject._MOUSE_EVENTS = ["click", "dblclick", "mousedown", "mouseout", "mouseover", "pressmove", "pressup", "rollout", "rollover"];
DisplayObject.suppressCrossDomainErrors = false;
DisplayObject._snapToPixelEnabled = false;
DisplayObject._StageGL_NONE = 0;
DisplayObject._StageGL_SPRITE = 1;
DisplayObject._StageGL_BITMAP = 2;
const canvas = createCanvas();
DisplayObject._hitTestCanvas = canvas;
DisplayObject._hitTestContext = canvas.getContext("2d") as any;

/**
* Dispatched when the user presses their left mouse button over the display object.
* @see {@link MouseEvent}
* @event DisplayObject#mousedown
* @since 0.6.0
*/

/**
* Dispatched when the user presses their left mouse button and then releases it while over the display object.
* @see {@link MouseEvent}
* @event DisplayObject#click
* @since 0.6.0
*/

/**
* Dispatched when the user double clicks their left mouse button over this display object.
* @see {@link MouseEvent}
* @event DisplayObject#dblclick
* @since 0.6.0
*/

/**
* Dispatched when the user's mouse enters this display object. This event must be enabled using
* {@link Stage#enableMouseOver}.
* @see {@link DisplayObject#event:rollover}
* @see {@link MouseEvent}
* @event DisplayObject#mouseover
* @since 0.6.0
*/

/**
* Dispatched when the user's mouse leaves this display object. This event must be enabled using
* {@link Stage#enableMouseOver}.
* @see {@link DisplayObject#event:rollout}
* @see {@link MouseEvent}
* @event DisplayObject#mouseout
* @since 0.6.0
*/

/**
* This event is similar to {@link DisplayObject#event:mouseover}, with the following
* differences: it does not bubble, and it considers {@link Container} instances as an
* aggregate of their content.
*
* For example, myContainer contains two overlapping children: shapeA and shapeB. The user moves their mouse over
* shapeA and then directly on to shapeB. With a listener for {@link DisplayObject#event:mouseover} on
* myContainer, two events would be received, each targeting a child element:
* <ol>
*   <li>when the mouse enters shapeA (target=shapeA)</li>
*   <li>when the mouse enters shapeB (target=shapeB)</li>
* </ol>
* However, with a listener for "rollover" instead, only a single event is received when the mouse first enters
* the aggregate myContainer content (target=myContainer).
*
* This event must be enabled using {@link Stage#enableMouseOver}.
* @see {@link MouseEvent}
* @event DisplayObject#rollover
* @since 0.7.0
*/

/**
* This event is similar to {@link DisplayObject#event:mouseout}, with the following
* differences: it does not bubble, and it considers {@link Container} instances as an
* aggregate of their content.
*
* For example, myContainer contains two overlapping children: shapeA and shapeB. The user moves their mouse over
* shapeA, then directly on to shapeB, then off both. With a listener for {@link DisplayObject#event:mouseout}
* on myContainer, two events would be received, each targeting a child element:<OL>
* <LI>when the mouse leaves shapeA (target=shapeA)</LI>
* <LI>when the mouse leaves shapeB (target=shapeB)</LI>
* </OL>
* However, with a listener for "rollout" instead, only a single event is received when the mouse leaves
* the aggregate myContainer content (target=myContainer).
*
* This event must be enabled using {@link Stage#enableMouseOver}.
* @see {@link MouseEvent}
* @event DisplayObject#rollout
* @since 0.7.0
*/

/**
* After a {@link DisplayObject#event:mousedown} occurs on a display object, a pressmove
* event will be generated on that object whenever the mouse moves until the mouse press is released. This can be
* useful for dragging and similar operations.
* @event DisplayObject#pressmove
* @since 0.7.0
*/

/**
* After a {@link DisplayObject#event:mousedown} occurs on a display object, a pressup event
* will be generated on that object when that mouse press is released. This can be useful for dragging and similar
* operations.
* @event DisplayObject#pressup
* @since 0.7.0
*/

/**
* Dispatched when the display object is added to a parent container.
* @event DisplayObject#added
*/

/**
* Dispatched when the display object is removed from its parent container.
* @event DisplayObject#removed
*/

/**
* Dispatched on each display object on a stage whenever the stage updates. This occurs immediately before the
* rendering (draw) pass. When {@link Stage#update} is called, first all display objects on
* the stage dispatch the tick event, then all of the display objects are drawn to stage. Children will have their
* tick event dispatched in order of their depth prior to the event being dispatched on their parent.
* @event DisplayObject#tick
* @param {Object} target The object that dispatched the event.
* @param {String} type The event type.
* @param {Array} params An array containing any arguments that were passed to the Stage.update() method.
* @since 0.6.0
*/