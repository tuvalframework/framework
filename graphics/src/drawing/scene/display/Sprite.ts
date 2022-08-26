import { CGRectangle } from '@tuval/cg';
import { DisplayObject } from "./DisplayObject";

/**
 * Displays a frame or sequence of frames (ie. an animation) from a SpriteSheet instance. A sprite sheet is a series of
 * images (usually animation frames) combined into a single image. For example, an animation consisting of 8 100x100
 * images could be combined into a 400x200 sprite sheet (4 frames across by 2 high). You can display individual frames,
 * play frames as an animation, and even sequence animations together.
 *
 * @memberof easeljs
 * @extends DisplayObject
 * @example
 * let sprite = new Sprite(spriteSheet);
 * sprite.gotoAndStop("frameName");
 *
 * Until {@link Sprite#gotoAndStop} or {@link Sprite#gotoAndPlay} is called,
 * only the first defined frame defined in the sprite sheet will be displayed.
 *
 * @see {@link SpriteSheet "More information on setting up frames and animations."}
 * @param {SpriteSheet} spriteSheet The SpriteSheet instance to play back. This includes the source image(s), frame
 * dimensions, and frame data.
 * @param {String | Number} [frameOrAnimation] The frame number or animation to play initially.
 */
export class Sprite extends DisplayObject {
    /**
     * The frame index that will be drawn when draw is called. Note that with some {@link SpriteSheet}
     * definitions, this will advance non-sequentially. This will always be an integer value.
     * @type {Number}
     * @default 0
     * @readonly
     */
    public currentFrame: number;

    /**
     * Returns the name of the currently playing animation.
     * @type {String}
     * @readonly
     */
    public currentAnimation: string;

    /**
     * Prevents the animation from advancing each tick automatically. For example, you could create a sprite
     * sheet of icons, set paused to true, and display the appropriate icon by setting `currentFrame`.
     * @type {Boolean}
     * @default true
     */
    public paused: boolean;

    /**
     * The SpriteSheet instance to play back. This includes the source image, frame dimensions, and frame data.
     * @type {SpriteSheet}
     * @readonly
     */
    public spriteSheet: any;

    /**
     * Specifies the current frame index within the currently playing animation. When playing normally, this will increase
     * from 0 to n-1, where n is the number of frames in the current animation.
     * This could be a non-integer value if using time-based playback, or if the animation's speed is not an integer.
     * @see {@link Sprite#framerate}
     * @type {Number}
     * @default 0
     */
    public currentAnimationFrame: number;

    /**
     * By default Sprite instances advance one frame per tick. Specifying a framerate for the Sprite (or its related
     * SpriteSheet) will cause it to advance based on elapsed time between ticks as appropriate to maintain the target
     * framerate.
     *
     * For example, if a Sprite with a framerate of 10 is placed on a Stage being updated at 40fps, then the Sprite will
     * advance roughly one frame every 4 ticks. This will not be exact, because the time between each tick will
     * vary slightly between frames.
     *
     * This feature is dependent on the tick event object (or an object with an appropriate "delta" property) being
     * passed into {@link Stage#update}.
     * @type {Number}
     * @default 0
     */
    public framerate: number;

    /**
     * Current animation object.
     * @protected
     * @type {Object}
     * @default null
     */
    protected _animation: any;

    /**
     * Current frame index.
     * @protected
     * @type {Number}
     * @default null
     */
    protected _currentFrame: number;

    /**
     * Skips the next auto advance. Used by gotoAndPlay to avoid immediately jumping to the next frame
     * @protected
     * @type {Boolean}
     * @default false
     */
    protected _skipAdvance: boolean;

    public constructor(spriteSheet, frameOrAnimation?: string | number) {
        super();
        this.currentFrame = 0;
        this.currentAnimation = null as any;
        this.paused = true;
        this.spriteSheet = spriteSheet;
        this.currentAnimationFrame = 0;
        this.framerate = 0;
        this._animation = null;
        this._currentFrame = null as any;
        this._skipAdvance = false;

		/**
		 * Set as compatible with WebGL.
		 * @protected
		 * @type {Number}
		 * @default 1
		 */
        this._webGLRenderStyle = DisplayObject._StageGL_SPRITE;

        if (frameOrAnimation != null) {
            this.gotoAndPlay(frameOrAnimation);
        }
    }

    public isVisible(): boolean {
        let hasContent = this.cacheCanvas || this.spriteSheet.complete;
        return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
    }

    public draw(ctx, ignoreCache: boolean) {
        if (super.draw(ctx, ignoreCache)) { return true; }
        this._normalizeFrame();
        let o = this.spriteSheet.getFrame(this._currentFrame | 0);
        if (!o) { return false; }
        let rect = o.rect;
        if (rect.width && rect.height) { ctx.drawImage(o.image, rect.x, rect.y, rect.width, rect.height, -o.regX, -o.regY, rect.width, rect.height); }
        return true;
    }

    // Note, the doc sections below document using the specified APIs (from DisplayObject) from
    // Bitmap. This is why they have no method implementations.

	/**
	 * Because the content of a Sprite is already in a raster format, cache is unnecessary for Sprite instances.
	 * You should not cache Sprite instances as it can degrade performance.
	 * @name Sprite#cache
	 */

	/**
	 * Because the content of a Sprite is already in a raster format, cache is unnecessary for Sprite instances.
	 * You should not cache Sprite instances as it can degrade performance.
	 * @name Sprite#updateCache
	 */

	/**
	 * Because the content of a Sprite is already in a raster format, cache is unnecessary for Sprite instances.
	 * You should not cache Sprite instances as it can degrade performance.
	 * @name Sprite#uncache
	 */

	/**
	 * Play (unpause) the current animation. The Sprite will be paused if either {@link Sprite#stop}
	 * or {@link Sprite#gotoAndStop} is called. Single frame animations will remain unchanged.
	 */
    public play(): void {
        this.paused = false;
    }

	/**
	 * Stop playing a running animation. The Sprite will be playing if {@link Sprite#gotoAndPlay} is called.
	 * Note that calling `gotoAndPlay()` or {@link Sprite#play} will resume playback.
	 */
    public stop(): void {
        this.paused = true;
    }

	/**
	 * Sets paused to false and plays the specified animation name, named frame, or frame number.
	 * @param {String | Number} frameOrAnimation The frame number or animation name that the playhead should move to
	 * and begin playing.
	 */
    public gotoAndPlay(frameOrAnimation: string | number): void {
        this.paused = false;
        this._skipAdvance = true;
        this._goto(frameOrAnimation);
    }

	/**
	 * Sets paused to true and seeks to the specified animation name, named frame, or frame number.
	 * @param {String | Number} frameOrAnimation The frame number or animation name that the playhead should move to
	 * and stop.
	 */
    public gotoAndStop(frameOrAnimation: string | number): void {
        this.paused = true;
        this._goto(frameOrAnimation);
    }

	/**
	 * Advances the playhead. This occurs automatically each tick by default.
	 * @param {Number} [time] The amount of time in ms to advance by. Only applicable if framerate is set on the Sprite
	 * or its SpriteSheet.
	*/
    public advance(time: number): void {
        let fps = this.framerate || this.spriteSheet.framerate;
        let t = (fps && time != null) ? time / (1000 / fps) : 1;
        this._normalizeFrame(t);
    }

	/**
	 * Returns a {@link Rectangle} instance defining the bounds of the current frame relative to
	 * the origin. For example, a 90 x 70 frame with `regX=50` and `regY=40` would return a
	 * rectangle with [x=-50, y=-40, width=90, height=70]. This ignores transformations on the display object.
	 *
	 * @see {@link SpriteSheet#frameBounds}
	 * @return {Rectangle} A Rectangle instance. Returns null if the frame does not exist, or the image is not fully loaded.
	 */
    public getBounds(): CGRectangle {
        // TODO: should this normalizeFrame?
        return super.getBounds() || this.spriteSheet.getFrameBounds(this.currentFrame, this._rectangle);
    }

	/**
	 * Returns a clone of the Sprite instance. Note that the same SpriteSheet is shared between cloned instances.
	 * @return {Sprite} a clone of the Sprite instance.
	 */
    public clone(test?: boolean): Sprite {
        return this._cloneProps(new Sprite(this.spriteSheet));
    }

	/**
	 * @param {Sprite} o
	 * @return {Sprite} o
	 * @protected
	 */
    protected _cloneProps(o) {
        super._cloneProps(o);
        o.currentFrame = this.currentFrame;
        o.currentAnimation = this.currentAnimation;
        o.paused = this.paused;
        o.currentAnimationFrame = this.currentAnimationFrame;
        o.framerate = this.framerate;

        o._animation = this._animation;
        o._currentFrame = this._currentFrame;
        o._skipAdvance = this._skipAdvance;
        return o;
    }

    protected _tick(evtObj) {
        if (!this.paused) {
            if (!this._skipAdvance) { this.advance(evtObj && evtObj.delta); }
            this._skipAdvance = false;
        }
        super._tick(evtObj);
    }

	/**
	 * Normalizes the current frame, advancing animations and dispatching callbacks as appropriate.
	 * @protected
	 * @param {Number} [frameDelta=0]
	 */
    protected _normalizeFrame(frameDelta: number = 0): void {
        let animation = this._animation;
        let paused = this.paused;
        let frame = this._currentFrame;

        if (animation) {
            let speed = animation.speed || 1;
            let animFrame = this.currentAnimationFrame;
            let l = animation.frames.length;
            if (animFrame + frameDelta * speed >= l) {
                let next = animation.next;
                if (this._dispatchAnimationEnd(animation, frame, paused, next, l - 1)) {
                    // something changed in the event stack, so we shouldn't make any more changes here.
                    return;
                } else if (next) {
                    // sequence. Automatically calls _normalizeFrame again with the remaining frames.
                    return this._goto(next, frameDelta - (l - animFrame) / speed);
                } else {
                    // end.
                    this.paused = true;
                    animFrame = animation.frames.length - 1;
                }
            } else {
                animFrame += frameDelta * speed;
            }
            this.currentAnimationFrame = animFrame;
            this._currentFrame = animation.frames[animFrame | 0]
        } else {
            frame = (this._currentFrame += frameDelta);
            let l = this.spriteSheet.getNumFrames();
            if (frame >= l && l > 0) {
                if (!this._dispatchAnimationEnd(animation, frame, paused, l - 1)) {
                    // looped.
                    if ((this._currentFrame -= l) >= l) { return this._normalizeFrame(); }
                }
            }
        }
        frame = this._currentFrame | 0;
        if (this.currentFrame != frame) {
            this.currentFrame = frame;
            this.dispatchEvent("change");
        }
    }

	/**
	 * Dispatches the "animationend" event. Returns true if a handler changed the animation (ex. calling {@link easlejs.Sprite#stop},
	 * {@link Sprite#gotoAndPlay}, etc.)
	 * @param animation
	 * @param frame
	 * @param paused
	 * @param next
	 * @param end
	 * @private
	 */
    private _dispatchAnimationEnd(animation, frame, paused, next, end?): boolean {
        let name = animation ? animation.name : null;
        if (this.hasEventListener("animationend")) {
            let evt = new Event("animationend");
            (evt as any).name = name;
            (evt as any).next = next;
            this.dispatchEvent(evt as any);
        }
        // did the animation get changed in the event stack?:
        let changed = (this._animation != animation || this._currentFrame != frame);
        // if the animation hasn't changed, but the sprite was paused, then we want to stick to the last frame:
        if (!changed && !paused && this.paused) { this.currentAnimationFrame = end; changed = true; }
        return changed;
    }

	/**
	 * Moves the playhead to the specified frame number or animation.
	 * @param {String | Number} frameOrAnimation The frame number or animation that the playhead should move to.
	 * @param {Number} [frame=0] The frame of the animation to go to. Defaults to 0.
	 * @protected
	 */
    protected _goto(frameOrAnimation: string | number, frame: number = 0) {
        this.currentAnimationFrame = 0;
        if (isNaN(<any>frameOrAnimation)) {
            let data = this.spriteSheet.getAnimation(frameOrAnimation);
            if (data) {
                this._animation = data;
                this.currentAnimation = <any>frameOrAnimation;
                this._normalizeFrame(frame);
            }
        } else {
            this.currentAnimation = this._animation = null as any;
            this._currentFrame = <any>frameOrAnimation;
            this._normalizeFrame();
        }
    }

}

/**
 * Dispatched when an animation reaches its ends.
 * @event Sprite#animationend
 * @property {Object} target The object that dispatched the event.
 * @property {String} type The event type.
 * @property {String} name The name of the animation that just ended.
 * @property {String} next The name of the next animation that will be played, or null. This will be the same as name if the animation is looping.
 * @since 0.6.0
 */

/**
 * Dispatched any time the current frame changes. For example, this could be due to automatic advancement on a tick,
 * or calling gotoAndPlay() or gotoAndStop().
 * @event Sprite#change
 * @property {Object} target The object that dispatched the event.
 * @property {String} type The event type.
 */