import { CGRectangle } from '@tuval/cg';
import { Container } from "./Container";
import { DisplayObject } from "./DisplayObject";
import { MouseEvent } from '../events/MouseEvent';
import { float } from "@tuval/core";

/**
 * A stage is the root level {@link Container} for a display list. Each time its {@link Stage#tick}
 * method is called, it will render its display list to its target canvas.
 *
 * @memberof easeljs
 * @extends Container
 * @example
 * let stage = new Stage("canvasElementId");
 * let image = new Bitmap("imagePath.png");
 * stage.addChild(image);
 * Ticker.addEventListener("tick", event => {
 *   image.x += 10;
 * 	 stage.update();
 * });
 *
 * @param {HTMLCanvasElement | String | Object} canvas A canvas object that the Stage will render to, or the string id
 * of a canvas object in the current document.
 */
export class Stage extends Container {
    /**
     * Indicates whether the stage should automatically clear the canvas before each render. You can set this to `false`
     * to manually control clearing (for generative art, or when pointing multiple stages at the same canvas for
     * example).
     *
     * @example
     * let stage = new Stage("canvasId");
     * stage.autoClear = false;
     *
     * @type {Boolean}
     * @default true
     */
    public autoClear: boolean;
    /**
     * The canvas the stage will render to. Multiple stages can share a single canvas, but you must disable autoClear for all but the
     * first stage that will be ticked (or they will clear each other's render).
     *
     * When changing the canvas property you must disable the events on the old canvas, and enable events on the
     * new canvas or mouse events will not work as expected.
     *
     * @example
     * stage.enableDOMEvents(false);
     * stage.canvas = anotherCanvas;
     * stage.enableDOMEvents(true);
     *
     * @type {HTMLCanvasElement | Object}
     */
    public canvas: HTMLCanvasElement | any;
    /**
     * The current mouse X position on the canvas. If the mouse leaves the canvas, this will indicate the most recent
     * position over the canvas, and mouseInBounds will be set to false.
     * @type {Number}
     * @default 0
     * @readonly
     */
    public mouseX: number;
    /**
     * The current mouse Y position on the canvas. If the mouse leaves the canvas, this will indicate the most recent
     * position over the canvas, and mouseInBounds will be set to false.
     * @type {Number}
     * @default 0
     * @readonly
     */
    public mouseY: number;
    /**
     * Specifies the area of the stage to affect when calling update. This can be use to selectively
     * re-draw specific regions of the canvas. If null, the whole canvas area is drawn.
     * @type {Rectangle}
     */
    public drawRect: CGRectangle;
    /**
     * Indicates whether display objects should be rendered on whole pixels. You can set the {@link DisplayObject.snapToPixelEnabled}
     * property of display objects to false to enable/disable this behaviour on a per instance basis.
     * @type {Boolean}
     * @default false
     */
    public snapToPixelEnabled: boolean;
    /**
     * Indicates whether the mouse is currently within the bounds of the canvas.
     * @type {Boolean}
     * @default false
     */
    public mouseInBounds: boolean;
    /**
     * If true, tick callbacks will be called on all display objects on the stage prior to rendering to the canvas.
     * @type {Boolean}
     * @default true
     */
    public tickOnUpdate: boolean;
    /**
     * If true, mouse move events will continue to be called when the mouse leaves the target canvas.
     * See {@link Stage#mouseInBounds}, and {@link MouseEvent} x/y/rawX/rawY.
     * @type {Boolean}
     * @default false
     */
    public mouseMoveOutside: boolean;
    /**
     * Prevents selection of other elements in the html page if the user clicks and drags, or double clicks on the canvas.
     * This works by calling `preventDefault()` on any mousedown events (or touch equivalent) originating on the canvas.
     * @type {Boolean}
     * @default true
     */
    public preventSelection: boolean;
    /**
     * The hitArea property is not supported for Stage.
     * @property hitArea
     * @override
     * @default null
     * @private
     */

    /**
     * Holds objects with data for each active pointer id. Each object has the following properties:
     * x, y, event, target, overTarget, overX, overY, inBounds, posEvtObj (native event that last updated position)
     * @type {Object}
     * @private
     */
    protected _pointerData: any;
    /**
     * Number of active pointers.
     * @type {Number}
     * @private
     */
    protected _pointerCount: number;
    /**
     * The ID of the primary pointer.
     * @type {String}
     * @private
     */
    protected _primaryPointerID: string;
    /**
     * @protected
     * @type {Number}
     */
    protected _mouseOverIntervalID: number;
    /**
     * @protected
     * @type {Stage}
     */
    protected _nextStage: Stage;
    /**
     * @protected
     * @type {Stage}
     */
    protected _prevStage: Stage;
    protected _eventListeners: any;
    protected _mouseOverX: number = 0;
    protected _mouseOverY: number = 0;
    protected _mouseOverTarget: any[] = undefined as any;

    public isUpdateRequired: boolean = true;

    public constructor(canvas: HTMLCanvasElement | String | Object) {
        super();
        this.autoClear = true;
        this.canvas = (typeof canvas === "string") ? document.getElementById(canvas) : canvas;
        this.mouseX = 0;
        this.mouseY = 0;
        this.drawRect = null as any;
        this.snapToPixelEnabled = false;
        this.mouseInBounds = false;
        this.tickOnUpdate = true;
        this.mouseMoveOutside = false;
        this.preventSelection = true;
        this._pointerData = {};
        this._pointerCount = 0;
        this._primaryPointerID = null as any;
        this._mouseOverIntervalID = null as any;
        this._nextStage = null as any;
        this._prevStage = null as any;
        // this.enableDOMEvents(true);
    }

	/**
	 * Specifies a target stage that will have mouse/touch interactions relayed to it after this stage handles them.
	 * This can be useful in cases where you have multiple layered canvases and want user interactions
	 * events to pass through.
	 *
	 * MouseOver, MouseOut, RollOver, and RollOut interactions are also passed through using the mouse over settings
	 * of the top-most stage, but are only processed if the target stage has mouse over interactions enabled.
	 * Considerations when using roll over in relay targets:
	 * <ol>
	 *   <li> The top-most (first) stage must have mouse over interactions enabled (via enableMouseOver)</li>
	 *   <li> All stages that wish to participate in mouse over interaction must enable them via enableMouseOver</li>
	 *   <li> All relay targets will share the frequency value of the top-most stage</li>
	 * </ol>
	 *
	 * @example <caption>Relay mouse events from topStage to bottomStage</caption>
	 * topStage.nextStage = bottomStage;
	 *
	 * @example <caption>Disable DOM events</caption>
	 * stage.enableDOMEvents(false);
	 *
	 * @type {Stage}
	 */
    public get nextStage(): Stage { return this._nextStage; }
    public set nextStage(stage: Stage) {
        if (this._nextStage) {
            this._nextStage._prevStage = null as any;
        }
        if (stage) { stage._prevStage = this; }
        this._nextStage = stage;
    }

	/**
	 * Each time the update method is called, the stage will call {@link Stage#tick}
	 * unless {@link Stage#tickOnupdate} is set to false,
	 * and then render the display list to the canvas.
	 *
	 * @param {Object} [props] Props object to pass to `tick()`. Should usually be a {@link core.Ticker} event object, or similar object with a delta property.
	 */
    public update(props?: any): void {
        if (!this.canvas) { return; }
        if (this.tickOnUpdate) { this.tick(props); }
        if (this.dispatchEvent("drawstart", false, true) === false) { return; }
        DisplayObject._snapToPixelEnabled = this.snapToPixelEnabled;
        let r = this.drawRect, ctx = this.canvas.getContext("2d");
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        if (this.autoClear) {
            if (r) { ctx.clearRect(r.X, r.Y, r.Width, r.Height); }
            else { ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1); }
        }
        ctx.save();
        if (this.drawRect) {
            ctx.beginPath();
            ctx.rect(r.X, r.Y, r.Width, r.Height);
            ctx.clip();
        }
        this.updateContext(ctx);
        this.draw(ctx, false);
        ctx.restore();
        this.dispatchEvent("drawend");
    }

    public draw(ctx: CanvasRenderingContext2D, ignoreCache: boolean) {
        const result = super.draw(ctx, ignoreCache);
        (<any>this.canvas)._invalid = true;
        return result;
    }

	/**
	 * Propagates a tick event through the display list. This is automatically called by {@link Stage#update}
	 * unless {@link Stage#tickOnUpdate} is set to false.
	 *
	 * If a props object is passed to `tick()`, then all of its properties will be copied to the event object that is
	 * propagated to listeners.
	 *
	 * Some time-based features in EaselJS (for example {@link Sprite#framerate} require that
	 * a {@link core.Ticker#event:tick} event object (or equivalent object with a delta property) be
	 * passed as the `props` parameter to `tick()`.
	 *
	 * @example
	 * Ticker.on("tick", (evt) => {
	 *   // clone the event object from Ticker, and add some custom data to it:
	 * 	 let data = evt.clone().set({ greeting: "hello", name: "world" });
	 * 	 // pass it to stage.update():
	 * 	 stage.update(data); // subsequently calls tick() with the same param
	 * });
	 *
	 * shape.on("tick", (evt) => {
	 *   console.log(evt.delta); // the delta property from the Ticker tick event object
	 * 	 console.log(evt.greeting, evt.name); // custom data: "hello world"
	 * });
	 *
	 * @emits Stage#event:tickstart
	 * @emits Stage#event:tickend
	 * @param {Object} [props] An object with properties that should be copied to the event object. Should usually be a Ticker event object, or similar object with a delta property.
	 */
    public tick(props: any): void {
        if (!this.tickEnabled || this.dispatchEvent("tickstart", false, true) === false) { return; }
        let evtObj = new Event("tick");
        if (props) {
            for (let n in props) {
                if (props.hasOwnProperty(n)) { evtObj[n] = props[n]; }
            }
        }
        this._tick(evtObj);
        this.dispatchEvent("tickend");
    }

	/**
	 * Default event handler that calls the Stage {@link Stage#update} method when a {@link DisplayObject#event:tick}
	 * event is received. This allows you to register a Stage instance as a event listener on {@link core.Ticker} directly.
	 * Note that if you subscribe to ticks using this pattern, then the tick event object will be passed through to
	 * display object tick handlers, instead of `delta` and `paused` parameters.
	 */
    public handleEvent(evt: Event): void {
        if (evt.type === "tick") { this.update(evt); }
    }

	/**
	 * Clears the target canvas. Useful if {@link State#autoClear} is set to `false`.
	 */
    public clear(): void {
        if (!this.canvas) { return; }
        let ctx = this.canvas.getContext("2d");
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1);
    }

	/**
	 * Returns a data url that contains a Base64-encoded image of the contents of the stage. The returned data url can
	 * be specified as the src value of an image element.
	 *
	 * @param {String} [backgroundColor] The background color to be used for the generated image. Any valid CSS color
	 * value is allowed. The default value is a transparent background.
	 * @param {String} [mimeType="image/png"] The MIME type of the image format to be create. If an unknown MIME type
	 * is passed in, or if the browser does not support the specified MIME type, the default value will be used.
	 * @param {Number} [encoderOptions=0.92] A Number between 0 and 1 indicating the image quality to use for image
	 * formats that use lossy  compression such as image/jpeg and image/webp.
	 * @return {String} a Base64 encoded image.
	 */
    public toDataURL(backgroundColor: string, mimeType: string = "image/png", encoderOptions: float = 0.92) {
        let data, ctx = this.canvas.getContext('2d'), w = this.canvas.width, h = this.canvas.height;

        if (backgroundColor) {
            data = ctx.getImageData(0, 0, w, h);
            var compositeOperation = ctx.globalCompositeOperation;
            ctx.globalCompositeOperation = "destination-over";

            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, w, h);
        }

        let dataURL = this.canvas.toDataURL(mimeType, encoderOptions);

        if (backgroundColor) {
            ctx.putImageData(data, 0, 0);
            ctx.globalCompositeOperation = compositeOperation;
        }

        return dataURL;
    }

	/**
	 * Enables or disables (by passing a frequency of 0) mouse over {@link DisplayObject#event:mouseover}
	 * and {@link DisplayObject#event:mouseout} and roll over events {@link DisplayObject#event:rollover}
	 * and {@link DisplayObject#event:rollout} for this stage's display list. These events can
	 * be expensive to generate, so they are disabled by default. The frequency of the events can be controlled
	 * independently of mouse move events via the optional `frequency` parameter.
	 *
	 * @example
	 * const stage = new Stage("canvasId");
	 * stage.enableMouseOver(10); // 10 updates per second
	 *
	 * @param {Number} [frequency=20] Optional param specifying the maximum number of times per second to broadcast
	 * mouse over/out events. Set to 0 to disable mouse over events completely. Maximum is 50. A lower frequency is less
	 * responsive, but uses less CPU.
	 */
    public enableMouseOver(frequency: number = 20) {
        if (this._mouseOverIntervalID) {
            clearInterval(this._mouseOverIntervalID);
            this._mouseOverIntervalID = null as any;
            if (frequency === 0) {
                this._testMouseOver(true);
            }
        }
        if (frequency <= 0) { return; }
        this._mouseOverIntervalID = <any>setInterval(() => this._testMouseOver(), 1000 / Math.min(50, frequency));
    }

	/**
	 * Enables or disables the event listeners that stage adds to DOM elements (window, document and canvas). It is good
	 * practice to disable events when disposing of a Stage instance, otherwise the stage will continue to receive
	 * events from the page.
	 * When changing the canvas property you must disable the events on the old canvas, and enable events on the
	 * new canvas or mouse events will not work as expected.
	 *
	 * @example
	 * stage.enableDOMEvents(false);
	 * stage.canvas = anotherCanvas;
	 * stage.enableDOMEvents(true);
	 *
	 * @param {Boolean} [enable=true] Indicates whether to enable or disable the events.
	 */
    public enableDOMEvents(enable: boolean = true): void {
        let ls = this._eventListeners;
        if (!enable && ls) {
            for (let n in ls) {
                let o = ls[n];
                o.t.removeEventListener(n, o.f, false);
            }
            this._eventListeners = null;
        } else if (enable && !ls && this.canvas) {
            let t = (window as any).addEventListener ? window : document;
            ls = this._eventListeners = {
                mouseup: { t, f: e => this._handleMouseUp(e) },
                mousemove: { t, f: e => this._handleMouseMove(e) },
                dblclick: { t: this.canvas, f: e => this._handleDoubleClick(e) },
                mousedown: { t: this.canvas, f: e => this._handleMouseDown(e) }
            };
            for (let n in ls) {
                let o = ls[n];
                if (o.t != null && o.t.addEventListener != null) {
                    o.t.addEventListener(n, o.f, false);
                }
            }
        }
    }

	/**
	 * Stage instances cannot be cloned.
	 * @throws Stage cannot be cloned
	 * @override
	 */
    public clone(test: boolean): Stage {
        throw "Stage cannot be cloned.";
    }

	/**
	 * @protected
	 * @param {HTMLElement} e
	 * @returns {Object}
	 */
    protected _getElementRect(e: HTMLCanvasElement): { left: float, right: float, top: float, bottom: float } {
        let bounds;
        try {
            if (e.parentElement == null && e.parentNode == null) {
                bounds = { x: 0, y: 0, width: e.width, height: e.height, left: 0, top: 0, right: e.width, bottom: e.height };
            } else {
                bounds = e.getBoundingClientRect();
            }

        } // this can fail on disconnected DOM elements in IE9
        catch (err) {
            bounds = { top: e.offsetTop, left: e.offsetLeft, width: e.offsetWidth, height: e.offsetHeight };
        }

        let offX = (window.pageXOffset || (<any>document).scrollLeft || 0) - ((<any>document).clientLeft || document.body.clientLeft || 0);
        let offY = (window.pageYOffset || (<any>document).scrollTop || 0) - ((<any>document).clientTop || document.body.clientTop || 0);

        let styles = (window as any).getComputedStyle ? getComputedStyle(e, null) : (<any>e).currentStyle; // IE <9 compatibility.
        let padL = parseInt(styles.paddingLeft === '' ? '0px' : styles.paddingLeft) + parseInt(styles.borderLeftWidth === '' ? '0px' : styles.borderLeftWidth);
        let padT = parseInt(styles.paddingTop === '' ? '0px' : styles.paddingTop) + parseInt(styles.borderTopWidth === '' ? '0px' : styles.borderTopWidth);
        let padR = parseInt(styles.paddingRight === '' ? '0px' : styles.paddingRight) + parseInt(styles.borderRightWidth === '' ? '0px' : styles.borderRightWidth);
        let padB = parseInt(styles.paddingBottom === '' ? '0px' : styles.paddingBottom) + parseInt(styles.borderBottomWidth === '' ? '0px' : styles.borderBottomWidth);

        // note: in some browsers bounds properties are read only.
        return {
            left: bounds.left + offX + padL,
            right: bounds.right + offX - padR,
            top: bounds.top + offY + padT,
            bottom: bounds.bottom + offY - padB
        };
    }

	/**
	 * @protected
	 * @param {Number} id
	 * @returns {Object}
	 */
    protected _getPointerData(id) {
        let data = this._pointerData[id];
        if (!data) {
            data = this._pointerData[id] = { x: 0, y: 0 };
        }
        return data;
    }

	/**
	 * @protected
	 * @param {MouseEvent} [e=window.event]
	 */
    protected _handleMouseMove(e: MouseEvent = <any>window.event) {
        this._handlePointerMove(-1, e, (e as any).pageX, (e as any).pageY);
    }

    public onMouseMove(e: any) {
        this._handlePointerMove(-1, e, e.pageX, e.pageY);
    }

	/**
	 * @emits {@link DisplayObject#event:mouseleave}
	 * @emits {@link DisplayObject#event:mouseenter}
	 * @emits {@link DisplayObject#event:pressmove}
	 * @emits {@link Stage#event:stagemousemove}
	 * @protected
	 * @param {Number} id
	 * @param {MouseEvent | Event} e
	 * @param {Number} pageX
	 * @param {Number} pageY
	 * @param {Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
	 */
    protected _handlePointerMove(id: number, e: MouseEvent | Event, pageX: float, pageY: float, owner?: Stage) {
        if (this._prevStage && owner === undefined) { return; } // redundant listener.
        if (!this.canvas) { return; }
        let nextStage = this._nextStage, o = this._getPointerData(id);

        let inBounds = o.inBounds;
        this._updatePointerPosition(id, e, pageX, pageY);
        if (inBounds || o.inBounds || this.mouseMoveOutside) {
            if (id === -1 && o.inBounds === !inBounds) {
                this._dispatchMouseEvent(this, (inBounds ? "mouseleave" : "mouseenter"), false, id, o, <any>e);
            }

            this._dispatchMouseEvent(this, "stagemousemove", false, id, o, <any>e);
            this._dispatchMouseEvent(o.target, "pressmove", true, id, o, <any>e);
        }

        nextStage && nextStage._handlePointerMove(id, e, pageX, pageY, null as any);
    }

	/**
	 * @protected
	 * @param {Number} id
	 * @param {MouseEvent | Event} e
	 * @param {Number} pageX
	 * @param {Number} pageY
	 */
    protected _updatePointerPosition(id: number, e: MouseEvent | Event, pageX: float, pageY: float): void {
        let rect = this._getElementRect(this.canvas);
        pageX -= rect.left;
        pageY -= rect.top;

        let w = this.canvas.width;
        let h = this.canvas.height;
        pageX /= (rect.right - rect.left) / w;
        pageY /= (rect.bottom - rect.top) / h;
        let o = this._getPointerData(id);
        if (o.inBounds = (pageX >= 0 && pageY >= 0 && pageX <= w - 1 && pageY <= h - 1)) {
            o.x = pageX;
            o.y = pageY;
        } else if (this.mouseMoveOutside) {
            o.x = pageX < 0 ? 0 : (pageX > w - 1 ? w - 1 : pageX);
            o.y = pageY < 0 ? 0 : (pageY > h - 1 ? h - 1 : pageY);
        }

        o.posEvtObj = e;
        o.rawX = pageX;
        o.rawY = pageY;

        if (id.toString() === this._primaryPointerID || id === -1) {
            this.mouseX = o.x;
            this.mouseY = o.y;
            this.mouseInBounds = o.inBounds;
        }
    }

	/**
	 * @protected
	 * @param {MouseEvent} e
	 */
    protected _handleMouseUp(e: MouseEvent): void {
        this._handlePointerUp(-1, e, false);
    }

    public onMouseUp(e: any) {
        this._handlePointerUp(-1, e, false);
    }

	/**
	 * @emits {@link Stage#event:stagemouseup}
	 * @emits {@link DisplayObject#event:click}
	 * @emits {@link DisplayObject#event:pressup}
	 * @protected
	 * @param {Number} id
	 * @param {MouseEvent | Event} e
	 * @param {Boolean} clear
	 * @param {Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
	 */
    protected _handlePointerUp(id: number, e: MouseEvent | Event, clear: boolean, owner?: Stage) {
        let nextStage = this._nextStage, o = this._getPointerData(id);
        if (this._prevStage && owner === undefined) { return; } // redundant listener.

        let target = null, oTarget = o.target;
        if (!owner && (oTarget || nextStage)) { target = this._getObjectsUnderPoint(o.x, o.y, null as any, true); }

        if (o.down) { this._dispatchMouseEvent(this, "stagemouseup", false, id, o, <any>e, target as any); o.down = false; }

        if (target === oTarget) { this._dispatchMouseEvent(oTarget, "click", true, id, o, <any>e); }
        this._dispatchMouseEvent(oTarget, "pressup", true, id, o, <any>e);

        if (clear) {
            if (id.toString() === this._primaryPointerID) { this._primaryPointerID = null as any; }
            delete (this._pointerData[id]);
        } else { o.target = null; }

        nextStage && nextStage._handlePointerUp(id, e, clear, (owner || target && this) as any);
    }

	/**
	 * @protected
	 * @param {MouseEvent} e
	 */
    protected _handleMouseDown(e: MouseEvent) {
        this._handlePointerDown(-1, e, (e as any).pageX, (e as any).pageY);
    }

    public onMouseDown(e: any) {
        this._handlePointerDown(-1, e, e.pageX, e.pageY);
    }

	/**
	 * @emits {@link Stage#event:stagemousedown}
	 * @emits {@link DisplayObject#event:mousedown}
	 * @protected
	 * @param {Number} id
	 * @param {MouseEvent | Event} e
	 * @param {Number} pageX
	 * @param {Number} pageY
	 * @param {Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
	 */
    protected _handlePointerDown(id: number, e: MouseEvent | Event, pageX: number, pageY: number, owner?: Stage): void {
        if (this.preventSelection) {
            (e as any).preventDefault();
        }
        if (this._primaryPointerID == null || id === -1) {
            this._primaryPointerID = id.toString();
        } // mouse always takes over.

        if (pageY != null) {
            this._updatePointerPosition(id, e, pageX, pageY);
        }
        let target = null;
        let nextStage = this._nextStage;
        let o = this._getPointerData(id);

        if (!owner) {
            target = o.target = this._getObjectsUnderPoint(o.x, o.y, null as any, true);
        }

        if (o.inBounds) {
            this._dispatchMouseEvent(this, "stagemousedown", false, id, o, <any>e, target as any); o.down = true;
        }
        this._dispatchMouseEvent(target as any, "mousedown", true, id, o, <any>e);

        nextStage && nextStage._handlePointerDown(id, e, pageX, pageY, (owner || target && this) as any);
    }

	/**
	 * @emits {@link DisplayObject#event:mouseout}
	 * @emits {@link DisplayObject#event:rollout}
	 * @emits {@link DisplayObject#event:rollover}
	 * @emits {@link DisplayObject#event:mouseover}
	 * @param {Boolean} clear If true, clears the mouseover / rollover (ie. no target)
	 * @param {Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
	 * @param {Stage} eventTarget The stage that the cursor is actively over.
	 * @protected
	 */
    protected _testMouseOver(clear?: boolean, owner?: Stage, eventTarget?: Stage): void {
        if (this._prevStage && owner === undefined) { return; } // redundant listener.

        let nextStage = this._nextStage;
        if (!this._mouseOverIntervalID) {
            // not enabled for mouseover, but should still relay the event.
            nextStage && nextStage._testMouseOver(clear, owner, eventTarget);
            return;
        }
        let o = this._getPointerData(-1);
        // only update if the mouse position has changed. This provides a lot of optimization, but has some trade-offs.
        if (!o || (!clear && this.mouseX === this._mouseOverX && this.mouseY === this._mouseOverY && this.mouseInBounds)) { return; }

        let e = o.posEvtObj;
        let isEventTarget = eventTarget || e && (e.target === this.canvas);
        let target = null, common = -1, cursor = "";

        if (!owner && (clear || this.mouseInBounds && isEventTarget)) {
            target = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null as any, true);
            this._mouseOverX = this.mouseX;
            this._mouseOverY = this.mouseY;
        }

        let oldList = this._mouseOverTarget || [];
        let oldTarget = oldList[oldList.length - 1];
        let list = this._mouseOverTarget = [];

        // generate ancestor list and check for cursor:
        let t = target;
        while (t) {
            list.unshift(t);
            if (!cursor) { cursor = (t as any).cursor; }
            t = (t as any).parent;
        }
        this.canvas.style.cursor = cursor;
        if (!owner && eventTarget) { eventTarget.canvas.style.cursor = cursor; }

        // find common ancestor:
        for (let i = 0, l = list.length; i < l; i++) {
            if (list[i] != oldList[i]) { break; }
            common = i;
        }

        if (oldTarget != target) {
            this._dispatchMouseEvent(oldTarget, "mouseout", true, -1, o, e, target as any);
        }

        for (let i = oldList.length - 1; i > common; i--) {
            this._dispatchMouseEvent(oldList[i], "rollout", false, -1, o, e, target as any);
        }

        for (let i = list.length - 1; i > common; i--) {
            this._dispatchMouseEvent(list[i], "rollover", false, -1, o, e, oldTarget);
        }

        if (oldTarget != target) {
            this._dispatchMouseEvent(target as any, "mouseover", true, -1, o, e, oldTarget);
        }

        nextStage && nextStage._testMouseOver(clear, (owner || target && this) as any, (eventTarget || isEventTarget && this) as any);
    }

	/**
	 * @emits {@link DisplayObject#event:dblclick}
	 * @protected
	 * @param {MouseEvent} e
	 * @param {Stage} owner Indicates that the event has already been captured & handled by the indicated stage.
	 */
    protected _handleDoubleClick(e: MouseEvent, owner?: Stage): void {
        let target = null, nextStage = this._nextStage, o = this._getPointerData(-1);
        if (!owner) {
            target = this._getObjectsUnderPoint(o.x, o.y, null as any, true);
            this._dispatchMouseEvent(target as any, "dblclick", true, -1, o, e);
        }
        nextStage && nextStage._handleDoubleClick(e, (owner || target && this) as any);
    }

    public onDbClick(e: any, owner?: Stage) {
        this._handleDoubleClick(e);
    }

	/**
	 * @protected
	 * @param {DisplayObject} target
	 * @param {String} type
	 * @param {Boolean} bubbles
	 * @param {Number} pointerId
	 * @param {Object} o
	 * @param {MouseEvent} [nativeEvent]
	 * @param {DisplayObject} [relatedTarget]
	 */
    protected _dispatchMouseEvent(target: DisplayObject, type: string, bubbles: boolean, pointerId: number, o: any, nativeEvent: MouseEvent, relatedTarget?: DisplayObject) {
        // TODO: might be worth either reusing MouseEvent instances, or adding a willTrigger method to avoid GC.
        if (!target || (!bubbles && !target.hasEventListener(type))) { return; }
		/*
		// TODO: account for stage transformations?
		this._mtx = this.getConcatenatedMatrix(this._mtx).invert();
		let pt = this._mtx.transformPoint(o.x, o.y);
		let evt = new MouseEvent(type, bubbles, false, pt.x, pt.y, nativeEvent, pointerId, pointerId==this._primaryPointerID || pointerId==-1, o.rawX, o.rawY);
		*/
        let evt = new MouseEvent(type, bubbles, false, o.x, o.y, nativeEvent, pointerId, pointerId.toString() === this._primaryPointerID || pointerId === -1, o.rawX, o.rawY, relatedTarget);
        target.dispatchEvent(evt as any);
    }

}

/**
 * Dispatched when the user moves the mouse over the canvas.
 * @see {@link MouseEvent}
 * @event Stage#stagemousemove
 * @since 0.6.0
 */
/**
 * Dispatched when the user presses their left mouse button on the canvas.
 * You can use {@link Stage#mouseInBounds} to check whether the mouse is currently within the stage bounds.
 * @see {@link MouseEvent}
 * @event Stage#stagemousedown
 * @since 0.6.0
 */
/**
 * Dispatched when the user the user presses somewhere on the stage, then releases the mouse button anywhere that the page can detect it (this varies slightly between browsers).
 * You can use {@link Stage#mouseInBounds} to check whether the mouse is currently within the stage bounds.
 * @see {@link MouseEvent}
 * @event Stage#stagemouseup
 * @since 0.6.0
 */
/**
 * Dispatched when the mouse moves from within the canvas area (mouseInBounds === true) to outside it (mouseInBounds === false).
 * This is currently only dispatched for mouse input (not touch).
 * @see {@link MouseEvent}
 * @event Stage#mouseleave
 * @since 0.7.0
 */
/**
 * Dispatched when the mouse moves into the canvas area (mouseInBounds === false) from outside it (mouseInBounds === true).
 * This is currently only dispatched for mouse input (not touch).
 * @see {@link MouseEvent}
 * @event Stage#mouseenter
 * @since 0.7.0
 */
/**
 * Dispatched each update immediately before the tick event is propagated through the display list.
 * You can call preventDefault on the event object to cancel propagating the tick event.
 * @event Stage#tickstart
 * @since 0.7.0
 */
/**
 * Dispatched each update immediately after the tick event is propagated through the display list. Does not fire if
 * tickOnUpdate is false. Precedes the "drawstart" event.
 * @event Stage#tickend
 * @since 0.7.0
 */
/**
 * Dispatched each update immediately before the canvas is cleared and the display list is drawn to it.
 * You can call preventDefault on the event object to cancel the draw.
 * @event Stage#drawstart
 * @since 0.7.0
 */
/**
 * Dispatched each update immediately after the display list is drawn to the canvas and the canvas context is restored.
 * @event Stage#drawend
 * @since 0.7.0
 */