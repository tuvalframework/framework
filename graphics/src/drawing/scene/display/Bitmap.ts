import { CGRectangle, CGSize } from '@tuval/cg';
import { DisplayObject } from "./DisplayObject";

/**
 * A Bitmap represents an Image, Canvas, or Video in the display list. A Bitmap can be instantiated using an existing
 * HTML element, or a string.
 *
 * <strong>Notes:</strong>
 * <ol>
 * 	<li>When using a video source that may loop or seek, use a {@link VideoBuffer} object to
 * 	 prevent blinking / flashing.
 * 	<li>When a string path or image tag that is not yet loaded is used, the stage may need to be redrawn before it
 * 	 will be displayed.</li>
 * 	<li>Bitmaps with an SVG source currently will not respect an alpha value other than 0 or 1. To get around this,
 * 	the Bitmap can be cached.</li>
 * 	<li>Bitmaps with an SVG source will taint the canvas with cross-origin data, which prevents interactivity. This
 * 	happens in all browsers except recent Firefox builds.</li>
 * 	<li>Images loaded cross-origin will throw cross-origin security errors when interacted with using a mouse, using
 * 	methods such as `getObjectUnderPoint`, or using filters, or caching. You can get around this by setting
 * 	`crossOrigin` flags on your images before passing them to EaselJS, eg: `img.crossOrigin="Anonymous";`</li>
 * </ol>
 *
 * @memberof easeljs
 * @extends DisplayObject
 * @example
 * const bitmap = new Bitmap("./imagePath.jpg");
 */
export class SceneBitmap extends DisplayObject {
    /**
     * The source image to display. This can be a CanvasImageSource
     * (image, video, canvas), an object with a `getImage` method that returns a CanvasImageSource, or a string URL to an image.
     * If the latter, a new Image instance with the URL as its src will be used.
     * @property image
     * @type {CanvasImageSource|Object}
     */
    public image: HTMLImageElement;

    /**
     * Specifies an area of the source image to draw. If omitted, the whole image will be drawn.
     * Notes:
     * <ul>
     *     <li>that video sources must have a width / height set to work correctly with `sourceRect`</li>
     *     <li>Cached objects will ignore the `sourceRect` property</li>
     * </ul>
     * @type {RectangleF}
     * @default null
     */
    public sourceRect: CGRectangle;

    /**
	* Set as compatible with WebGL.
	* @protected
	* @type {Number}
	*/
    public _webGLRenderStyle: number;

	/**
	 * @param {CanvasImageSource|String|Object} imageOrUri The source image to display. This can be a CanvasImageSource
	 * (image, video, canvas), an object with a `getImage` method that returns a CanvasImageSource, or a string URL to an image.
	 * If the latter, a new Image instance with the URL as its src will be used.
	 */
    public constructor(imageOrUri: CanvasImageSource | String | Object) {
        super();
        if (typeof imageOrUri === "string") {
            this.image = document.createElement("img");
            this.image.src = imageOrUri;
        } else {
            this.image = <any>imageOrUri;
        }

        this.sourceRect = null as any;
        this._webGLRenderStyle = DisplayObject._StageGL_BITMAP;
    }

    public isVisible(): boolean {
        const image = this.image;
        const hasContent = this.cacheCanvas || (image && (image.naturalWidth || (<any>image).getContext || (<any>image).readyState >= 2));
        return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
    }

    public draw(ctx, ignoreCache = false) {
        if (super.draw(ctx, ignoreCache)) { return true; }
        const rect = this.sourceRect;
        let img = this.image;
        if ((<any>img).getImage) { img = (<any>img).getImage(); }
        if (!img) { return true; }
        if (rect) {
            // some browsers choke on out of bound values, so we'll fix them:
            let x1 = rect.X, y1 = rect.Y, x2 = x1 + rect.Width, y2 = y1 + rect.Height, x = 0, y = 0, w = img.width, h = img.height;
            if (x1 < 0) { x -= x1; x1 = 0; }
            if (x2 > w) { x2 = w; }
            if (y1 < 0) { y -= y1; y1 = 0; }
            if (y2 > h) { y2 = h; }
            ctx.drawImage(img, x1, y1, x2 - x1, y2 - y1, x, y, x2 - x1, y2 - y1);
        } else {
            ctx.drawImage(img, 0, 0);
        }
        return true;
    }

    public getBounds(): CGRectangle {
        const rect = super.getBounds();
        if (rect) { return rect; }
        const image = this.image;
        const o = this.sourceRect || new CGSize(image.width, image.height);
        const hasContent = (image && (image.naturalWidth || (<any>image).getContext || (<any>image).readyState >= 2));
        return hasContent ? this._rectangle.setValues(0, 0, o.Width, o.Height) : null as any;
    }

	/**
	 * Returns a clone of the Bitmap instance.
	 * @param {Boolean} [node=false] Whether the underlying dom element should be cloned as well.
	 * @return {Bitmap} a clone of the Bitmap instance.
	 */
    public clone(node: boolean = false): SceneBitmap {
        let image = this.image;
        if (image && node) {
            image = <any>image.cloneNode();
            image.src = image.src; // IE cloneNode bug fix
        }
        const o = new SceneBitmap(image);
        if (this.sourceRect) { o.sourceRect = this.sourceRect.clone(); }
        this._cloneProps(o);
        return o;
    }

    // Note, the doc sections below document using the specified APIs (from DisplayObject) from
    // Bitmap. This is why they have no method implementations.

	/**
	 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	 * You should <b>not</b> cache Bitmap instances as it can degrade performance.
	 *
	 * <strong>However: If you want to use a filter on a Bitmap, you <em>MUST</em> cache it, or it will not work.</strong>
	 * To see the API for caching, please visit the {@link DisplayObject#cache} method.
	 *
	 * @alias Bitmap#cache
	 */

	/**
	 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	 * You should <b>not</b> cache Bitmap instances as it can degrade performance.
	 *
	 * <strong>However: If you want to use a filter on a Bitmap, you <em>MUST</em> cache it, or it will not work.</strong>
	 * To see the API for caching, please visit the {@link DisplayObject#cache} method.
	 *
	 * @alias Bitmap#updateCache
	 */

	/**
	 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	 * You should <b>not</b> cache Bitmap instances as it can degrade performance.
	 *
	 * <strong>However: If you want to use a filter on a Bitmap, you <em>MUST</em> cache it, or it will not work.</strong>
	 * To see the API for caching, please visit the {@link DisplayObject#cache} method.
	 *
	 * @alias Bitmap#uncache
	 */

}