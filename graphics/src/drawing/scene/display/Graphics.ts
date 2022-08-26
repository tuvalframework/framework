import { Matrix2D } from "../geom/Matrix2D";
import { createCanvas } from "../utils/Canvas";
import { Graphics as TGI } from "../../Graphics";
import { Pen } from "../../Pen";
import { Brush } from "../../Brush";
import { float } from "@tuval/core";

/**
 * The Graphics class exposes an easy to use API for generating vector drawing instructions and drawing them to a
 * specified context. Note that you can use Graphics without any dependency on the EaselJS framework by calling {@link Graphics#draw}
 * directly, or it can be used with the {@link Shape} object to draw vector graphics within the
 * context of an EaselJS display list.
 *
 * There are two approaches to working with Graphics object: calling methods on a Graphics instance (the "Graphics API"), or
 * instantiating Graphics command objects and adding them to the graphics queue via {@link Graphics#append}.
 * The former abstracts the latter, simplifying beginning and ending paths, fills, and strokes.
 *
 * <h4>Tiny API</h4>
 * The Graphics class also includes a "tiny API", which is one or two-letter methods that are shortcuts for all of the
 * Graphics methods. These methods are great for creating compact instructions, and is used by the Toolkit for CreateJS
 * to generate readable code. All tiny methods are marked as protected, so you can view them by enabling protected
 * descriptions in the docs.
 *
 * <table>
 *     <tr><td><b>Tiny</b></td><td><b>Method</b></td><td><b>Tiny</b></td><td><b>Method</b></td></tr>
 *     <tr><td>mt</td><td>{@link Graphics#moveTo}</td>
 *     <td>lt</td> <td>{@link Graphics#lineTo}</td></tr>
 *     <tr><td>a/at</td><td>{@link Graphics#arc} / {@link Graphics#arcTo}</td>
 *     <td>bt</td><td>{@link Graphics#bezierCurveTo}</td></tr>
 *     <tr><td>qt</td><td>{@link Graphics#quadraticCurveTo} (also curveTo)</td>
 *     <td>r</td><td>{@link Graphics#rect}</td></tr>
 *     <tr><td>cp</td><td>{@link Graphics#closePath}</td>
 *     <td>c</td><td>{@link Graphics#clear}</td></tr>
 *     <tr><td>f</td><td>{@link Graphics#beginFill}</td>
 *     <td>lf</td><td>{@link Graphics#beginLinearGradientFill}</td></tr>
 *     <tr><td>rf</td><td>{@link Graphics#beginRadialGradientFill}</td>
 *     <td>bf</td><td>{@link Graphics#beginBitmapFill}</td></tr>
 *     <tr><td>ef</td><td>{@link Graphics#endFill}</td>
 *     <td>ss / sd</td><td>{@link Graphics#setStrokeStyle} / {@link Graphics#setStrokeDash}</td></tr>
 *     <tr><td>s</td><td>{@link Graphics#beginStroke}</td>
 *     <td>ls</td><td>{@link Graphics#beginLinearGradientStroke}</td></tr>
 *     <tr><td>rs</td><td>{@link Graphics#beginRadialGradientStroke}</td>
 *     <td>bs</td><td>{@link Graphics#beginBitmapStroke}</td></tr>
 *     <tr><td>es</td><td>{@link Graphics#endStroke}</td>
 *     <td>dr</td><td>{@link Graphics#drawRect}</td></tr>
 *     <tr><td>rr</td><td>{@link Graphics#drawRoundRect}</td>
 *     <td>rc</td><td>{@link Graphics#drawRoundRectComplex}</td></tr>
 *     <tr><td>dc</td><td>{@link Graphics#drawCircle}</td>
 *     <td>de</td><td>{@link Graphics#drawEllipse}</td></tr>
 *     <tr><td>dp</td><td>{@link Graphics#drawPolyStar}</td>
 *     <td>p</td><td>{@link Graphics#decodePath}</td></tr>
 * </table>
 *
 * @example
 * var g = new Graphics();
 * g.setStrokeStyle(1);
 * g.beginStroke("#000000");
 * g.beginFill("red");
 * g.drawCircle(0,0,30);
 *
 * @example
 * // All drawing methods in Graphics return the Graphics instance, so they can be chained together.
 * graphics.beginStroke("red").beginFill("blue").drawRect(20, 20, 100, 50);
 *
 * @example
 * // Each graphics API call generates a command object (see below). The last command to be created can be accessed via .command
 * let fillCommand = graphics.beginFill("red").command;
 * fillCommand.style = "blue";
 * // or change it to a bitmap fill:
 * fillCommand.bitmap(img);
 *
 * @example
 * // For more direct control of rendering, you can instantiate and append command objects to the graphics queue directly.
 * // In this case, you need to manage path creation manually, and ensure that fill/stroke is applied to a defined path:
 *
 * // start a new path. Graphics.beginCmd is a reusable BeginPath instance:
 * graphics.append(Graphics.beginCmd);
 * // we need to define the path before applying the fill:
 * let circle = new Graphics.Circle(0,0,30);
 * graphics.append(circle);
 * // fill the path we just defined:
 * let fill = new Graphics.Fill("red");
 * graphics.append(fill);
 *
 * // These approaches can be used together, for example to insert a custom command:
 * graphics.beginFill("red");
 * let customCommand = new CustomSpiralCommand(etc);
 * graphics.append(customCommand);
 * graphics.beginFill("blue");
 * graphics.drawCircle(0, 0, 30);
 *
 * @example <caption>Using the Tiny API</caption>
 * graphics.s("red").f("blue").r(20, 20, 100, 50);
 *
 * @see {@link Graphics#append}
 * @memberof easeljs
 */
export class Graphics {
    /**
	 * Holds a reference to the last command that was created or appended. For example, you could retain a reference
	 * to a Fill command in order to dynamically update the color later by using:
	 *
	 * @example
	 * let fill = graphics.beginFill("red").command;
	 * // update color later:
	 * fill.style = "yellow";
	 *
	 * @type {Object}
	 * @default null
	 */
    public command: ICommand;

    /**
	 * @protected
	 * @type {Graphics.Stroke}
	 */
    protected _stroke: Stroke;

    /**
	 * @protected
	 * @type {Graphics.StrokeStyle}
	 */
    protected _strokeStyle: StrokeStyle;

    /**
	 * @protected
	 * @type {Graphics.StrokeStyle}
	 */
    protected _oldStrokeStyle: any;

    /**
	 * @protected
	 * @type {Graphics.StrokeDash}
	 */
    protected _strokeDash: StrokeDash;

    /**
     * @protected
     * @type {Graphics.StrokeDash}
     */
    protected _oldStrokeDash: any;

    /**
	 * @protected
	 * @type {Graphics.Fill}
	 */
    protected _fill: Fill;

    /**
	 * @protected
	 * @type {Boolean}
	 */
    protected _strokeIgnoreScale: boolean;

    /**
	 * Indicates the last instruction index that was committed.
	 * @protected
	 * @type {Number}
	 * @default 0
	 */
    protected _commitIndex: number;

    /**
	 * @protected
	 * @type {Array}
	 */
    protected _instructions: ICommand[];

    /**
	 * Uncommitted instructions.
	 * @protected
	 * @type {Array}
	 */
    protected _activeInstructions: ICommand[];

    /**
	 * This indicates that there have been changes to the activeInstruction list since the last updateInstructions call.
	 * @protected
	 * @type {Boolean}
	 * @default false
	 */
    protected _dirty: boolean;

	/**
	 * Index to draw from if a store operation has happened.
	 * @protected
	 * @type {Number}
	 * @default 0
	 */
    protected _storeIndex: number;

	/**
	 * Maps the familiar ActionScript `curveTo()` method to the functionally similar {@link Graphics#quadraticCurveTo} method.
	 * @param {Number} cpx
	 * @param {Number} cpy
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    protected curveTo: (cpx: float, cpy: float, x: float, y: float) => Graphics;

	/**
	 * Maps the familiar ActionScript `drawRect()` method to the functionally similar {@link Graphics#rect} method.
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w Width of the rectangle
	 * @param {Number} h Height of the rectangle
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public drawRect: (x: float, y: float, w: float, h: float) => Graphics;
    protected mt: (x: float, y: float) => Graphics;
    protected lt: (x: float, y: float) => Graphics;
    protected at: (x1: float, y1: float, x2: float, y2: float, radius: float) => Graphics;
    protected bt: (cp1x: float, cp1y: float, cp2x: float, cp2y: float, x: float, y: float) => Graphics;
    protected qt: (cpx: float, cpy: float, x: float, y: float) => Graphics;
    protected a: (x: float, y: float, radius: float, startAngle: float, endAngle: float, anticlockwise: boolean) => Graphics;
    protected r: (x: float, y: float, w: float, h: float) => Graphics;
    protected cp: () => Graphics;
    protected c: () => Graphics;
    protected f: (color: string) => Graphics;
    protected lf: (colors: string[], ratios: float[], x0: float, y0: float, x1: float, y1: float) => Graphics;
    protected rf: (colors: string[], ratios: float[], x0: float, y0: float, r0: float, x1: float, y1: float, r1: float) => Graphics;
    protected bf: (image: any, repetition: string, matrix: Matrix2D) => Graphics;
    protected ef: () => Graphics;
    protected ss: (thickness: any, caps?: number, joints?: number, miterLimit?: number, ignoreScale?: boolean) => Graphics;
    protected sd: (segments: any, offset?: number) => Graphics;
    protected s: (color: any) => Graphics;
    protected ls: (colors: any, ratios: any, x0: any, y0: any, x1: any, y1: any) => Graphics;
    protected rs: (colors: any, ratios: any, x0: any, y0: any, r0: any, x1: any, y1: any, r1: any) => Graphics;
    protected bs: (image: any, repetition?: string) => Graphics;
    protected es: () => Graphics;
    protected dr: any;
    protected rr: (x: any, y: any, w: any, h: any, radius: any) => Graphics;
    protected rc: (x: any, y: any, w: any, h: any, radiusTL: any, radiusTR: any, radiusBR: any, radiusBL: any) => Graphics;
    protected dc: (x: any, y: any, radius: any) => Graphics;
    protected de: (x: any, y: any, w: any, h: any) => Graphics;
    protected dp: (x: any, y: any, radius: any, sides: any, pointSize: any, angle: any) => Graphics;
    protected p: (str: any) => Graphics;
    public static beginCmd: ICommand;
    public static _BASE_64: any;
    public static _ctx: any;
    public static _STROKE_CAPS_MAP: any;
    public static _STROKE_JOINTS_MAP: any;

    public constructor() {
        this.command = null as any;
        this._stroke = null as any;
        this._strokeStyle = null as any;
        this._oldStrokeStyle = null;
        this._strokeDash = null as any;
        this._oldStrokeDash = null;
        this._fill = null as any;
        this._strokeIgnoreScale = false;
        this._commitIndex = 0;
        this._instructions = [];
        this._activeInstructions = [];
        this._dirty = false;
        this._storeIndex = 0;
        this.curveTo = this.quadraticCurveTo;
        this.drawRect = this.rect;
        // tiny api
        this.mt = this.moveTo;
        this.lt = this.lineTo;
        this.at = this.arcTo;
        this.bt = this.bezierCurveTo;
        this.qt = this.quadraticCurveTo;
        this.a = this.arc;
        this.r = this.rect;
        this.cp = this.closePath;
        this.c = this.clear;
        this.f = this.beginFill;
        this.lf = this.beginLinearGradientFill;
        this.rf = this.beginRadialGradientFill;
        this.bf = this.beginBitmapFill;
        this.ef = this.endFill;
        this.ss = this.setStrokeStyle;
        this.sd = this.setStrokeDash;
        this.s = this.beginStroke;
        this.ls = this.beginLinearGradientStroke;
        this.rs = this.beginRadialGradientStroke;
        this.bs = this.beginBitmapStroke;
        this.es = this.endStroke;
        this.dr = this.drawRect;
        this.rr = this.drawRoundRect;
        this.rc = this.drawRoundRectComplex;
        this.dc = this.drawCircle;
        this.de = this.drawEllipse as any;
        this.dp = this.drawPolyStar;
        this.p = this.decodePath;

        this.clear();
    }

	/**
	 * Returns a CSS compatible color string based on the specified RGB numeric color values in the format
	 * "rgba(255,255,255,1.0)", or if alpha is null then in the format "rgb(255,255,255)".
	 * It also supports passing a single hex color value as the first param, and an optional alpha value as the second
	 * param.
	 *
	 * @example
	 * Graphics.getRGB(50, 100, 150, 0.5); // rgba(50,100,150,0.5)
	 * Graphics.getRGB(0xFF00FF, 0.2); // rgba(255,0,255,0.2)
	 *
	 * @static
	 * @param {Number} r The red component for the color, between 0 and 0xFF (255).
	 * @param {Number} g The green component for the color, between 0 and 0xFF (255).
	 * @param {Number} b The blue component for the color, between 0 and 0xFF (255).
	 * @param {Number} [alpha] The alpha component for the color where 0 is fully transparent and 1 is fully opaque.
	 * @return {String} A CSS compatible color string based on the specified RGB numeric color values in the format
	 * "rgba(255,255,255,1.0)", or if alpha is null then in the format "rgb(255,255,255)".
	 */
    public static getRGB(r: number, g: number, b: number, alpha: number): string {
        if (r != null && b == null) {
            alpha = g;
            b = r & 0xFF;
            g = r >> 8 & 0xFF;
            r = r >> 16 & 0xFF;
        }
        if (alpha == null) {
            return `rgb(${r},${g},${b})`;
        } else {
            return `rgba(${r},${g},${b},${alpha})`;
        }
    }

	/**
	 * Returns a CSS compatible color string based on the specified HSL numeric color values in the format "hsla(360,100,100,1.0)",
	 * or if alpha is null then in the format "hsl(360,100,100)".
	 *
	 * @example
	 * Graphics.getHSL(150, 100, 70); // hsl(150,100,70)
	 *
	 * @static
	 * @param {Number} hue The hue component for the color, between 0 and 360.
	 * @param {Number} saturation The saturation component for the color, between 0 and 100.
	 * @param {Number} lightness The lightness component for the color, between 0 and 100.
	 * @param {Number} [alpha] The alpha component for the color where 0 is fully transparent and 1 is fully opaque.
	 * @return {String} A CSS compatible color string based on the specified HSL numeric color values in the format
	 * "hsla(360,100,100,1.0)", or if alpha is null then in the format "hsl(360,100,100)".
	 */
    public static getHSL(hue: number, saturation: number, lightness: number, alpha: number): string {
        if (alpha == null) {
            return `hsl(${hue % 360},${saturation}%,${lightness}%)`;
        } else {
            return `hsl(${hue % 360},${saturation}%,${lightness}%,${alpha})`;
        }
    }

	/**
	 * Returns the graphics instructions array. Each entry is a graphics command object (ex. Graphics.Fill, Graphics.Rect)
	 * Modifying the returned array directly is not recommended, and is likely to result in unexpected behaviour.
	 *
	 * This property is mainly intended for introspection of the instructions (ex. for graphics export).
	 * @type {Array}
	 * @readonly
	 */
    public get instructions(): ICommand[] {
        this._updateInstructions();
        return this._instructions;
    }

	/**
	 * Returns true if this Graphics instance has no drawing commands.
	 * @return {Boolean} Returns true if this Graphics instance has no drawing commands.
	 */
    public isEmpty(): boolean {
        return !(this._instructions.length || this._activeInstructions.length);
    }

	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 *
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Object} data Optional data that is passed to graphics command exec methods. When called from a Shape instance, the shape passes itself as the data parameter. This can be used by custom graphic commands to insert contextual data.
	 */
    public draw(ctx: CanvasRenderingContext2D, data: any): void {
        this._updateInstructions();
        let instr = this._instructions;
        const l = instr.length;
        for (let i = this._storeIndex; i < l; i++) {
            instr[i].exec(ctx, data);
        }
    }

    public drawTGI(tg: TGI, data: any) {
        this._updateInstructions();
        let instr = this._instructions;
        const l = instr.length;
        for (let i = this._storeIndex + 1; i < l; i++) {
            instr[i].exec(tg, data);
        }
    }


	/**
	 * Draws only the path described for this Graphics instance, skipping any non-path instructions, including fill and
	 * stroke descriptions. Used for `DisplayObject.mask` to draw the clipping path, for example.
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 *
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 */
    public drawAsPath(ctx: CanvasRenderingContext2D) {
        this._updateInstructions();
        let instr, instrs = this._instructions;
        const l = instrs.length;
        for (let i = this._storeIndex; i < l; i++) {
            // the first command is always a beginPath command.
            if ((<any>(instr = instrs[i])).path !== false) { instr.exec(ctx); }
        }
    }

	/**
	 * Moves the drawing point to the specified position.
	 * A tiny API method "mt" also exists.
	 * @param {Number} x The x coordinate the drawing point should move to.
	 * @param {Number} y The y coordinate the drawing point should move to.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls).
	 * @chainable
	 */
    public moveTo(x: float, y: float): Graphics {
        return this.append(new MoveTo(x, y), true);
    }

	/**
	 * Draws a line from the current drawing point to the specified position, which become the new current drawing
	 * point. Note that you *must* call {@link Graphics#moveTo} before the first `lineTo()`.
	 * A tiny API method "lt" also exists.
	 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#complex-shapes-(paths) "WHATWG spec"}
	 * @param {Number} x The x coordinate the drawing point should draw to.
	 * @param {Number} y The y coordinate the drawing point should draw to.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public lineTo(x: float, y: float): Graphics {
        return this.append(new LineTo(x, y));
    }

    /**
 * Draws a line from the current drawing point to the specified position, which become the new current drawing
 * point. Note that you *must* call {@link Graphics#moveTo} before the first `lineTo()`.
 * A tiny API method "lt" also exists.
 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#complex-shapes-(paths) "WHATWG spec"}
 * @param {Number} x The x coordinate the drawing point should draw to.
 * @param {Number} y The y coordinate the drawing point should draw to.
 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 * @chainable
 */
    public drawLine(pen: Pen, x: float, y: float, x1: float, y1: float): Graphics {
        return this.append(new DrawLine(pen, x, y, x1, y1));
    }

	/**
	 * Draws an arc with the specified control points and radius.
	 * A tiny API method "at" also exists.
	 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-arcto "WHATWG spec"}
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} x2
	 * @param {Number} y2
	 * @param {Number} radius
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public arcTo(x1: float, y1: float, x2: float, y2: float, radius: float): Graphics {
        return this.append(new ArcTo(x1, y1, x2, y2, radius));
    }

	/**
	 * Draws an arc defined by the radius, startAngle and endAngle arguments, centered at the position (x, y).
	 * A tiny API method "a" also exists.
	 *
	 * @example
	 * // draw a full circle with a radius of 20 centered at (100, 100)
	 * arc(100, 100, 20, 0, Math.PI*2);
	 *
	 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-arc "WHATWG spec"}
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 * @param {Number} startAngle Measured in radians.
	 * @param {Number} endAngle Measured in radians.
	 * @param {Boolean} anticlockwise
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public arc(x: float, y: float, radius: float, startAngle: float, endAngle: float, anticlockwise: boolean): Graphics {
        return this.append(new Arc(x, y, radius, startAngle, endAngle, anticlockwise));
    }

	/**
	 * Draws a quadratic curve from the current drawing point to (x, y) using the control point (cpx, cpy).
	 * A tiny API method "qt" also exists.
	 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-quadraticcurveto "WHATWG spec"}
	 * @param {Number} cpx
	 * @param {Number} cpy
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public quadraticCurveTo(cpx: float, cpy: float, x: float, y: float): Graphics {
        return this.append(new QuadraticCurveTo(cpx, cpy, x, y));
    }

	/**
	 * Draws a bezier curve from the current drawing point to (x, y) using the control points (cp1x, cp1y) and (cp2x, cp2y).
	 * A tiny API method "bt" also exists.
	 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-beziercurveto "WHATWG spec"}
	 * @param {Number} cp1x
	 * @param {Number} cp1y
	 * @param {Number} cp2x
	 * @param {Number} cp2y
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public bezierCurveTo(cp1x: float, cp1y: float, cp2x: float, cp2y: float, x: float, y: float): Graphics {
        return this.append(new BezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y));
    }

	/**
	 * Draws a rectangle at (x, y) with the specified width and height using the current fill and/or stroke.
	 * A tiny API method "r" also exists.
	 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-rect "WHATWG spec"}
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w Width of the rectangle
	 * @param {Number} h Height of the rectangle
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public rect(x: float, y: float, w: float, h: float): Graphics {
        return this.append(new Rect(x, y, w, h));
    }

	/**
	 * Closes the current path, effectively drawing a line from the current drawing point to the first drawing point specified
	 * since the fill or stroke was last set.
	 * A tiny API method "cp" also exists.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public closePath(): Graphics {
        return this._activeInstructions.length ? this.append(new ClosePath()) : this;
    }

	/**
	 * Clears all drawing instructions, effectively resetting this Graphics instance. Any line and fill styles will need
	 * to be redefined to draw shapes following a clear call.
	 * A tiny API method "c" also exists.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public clear(): Graphics {
        this._instructions.length = this._activeInstructions.length = this._commitIndex = 0;
        this._strokeStyle = this._oldStrokeStyle = this._stroke = this._fill = this._strokeDash = this._oldStrokeDash = null as any;
        this._dirty = this._strokeIgnoreScale = false;
        return this;
    }

	/**
	 * Begins a fill with the specified color. This ends the current sub-path.
	 * A tiny API method "f" also exists.
	 * @param {String} color A CSS compatible color value (ex. "red", "#FF0000", or "rgba(255,0,0,0.5)"). Setting to
	 * null will result in no fill.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public beginFill(color?: string): Graphics {
        return this._setFill(color ? new Fill(color) : null as any);
    }

	/**
	 * Begins a linear gradient fill defined by the line (x0, y0) to (x1, y1).
	 * A tiny API method "lf" also exists.
	 *
	 * @example <caption>Define a black to white vertical gradient ranging from 20px to 120px, and draw a square to display it</caption>
	 * graphics.beginLinearGradientFill(["#000","#FFF"], [0, 1], 0, 20, 0, 120).drawRect(20, 20, 120, 120);
	 *
	 * @param {Array} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define a gradient
	 * drawing from red to blue.
	 * @param {Array} ratios An array of gradient positions which correspond to the colors. For example, [0.1, 0.9] would draw
	 * the first color to 10% then interpolating to the second color at 90%.
	 * @param {Number} x0 The position of the first point defining the line that defines the gradient direction and size.
	 * @param {Number} y0 The position of the first point defining the line that defines the gradient direction and size.
	 * @param {Number} x1 The position of the second point defining the line that defines the gradient direction and size.
	 * @param {Number} y1 The position of the second point defining the line that defines the gradient direction and size.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public beginLinearGradientFill(colors: string[], ratios: float[], x0: float, y0: float, x1: float, y1: float): Graphics {
        return this._setFill(new Fill().linearGradient(colors, ratios, x0, y0, x1, y1));
    }

	/**
	 * Begins a radial gradient fill. This ends the current sub-path.
	 * A tiny API method "rf" also exists.
	 *
	 * @example <caption>Define a red to blue radial gradient centered at (100, 100), with a radius of 50, and draw a circle to display it</caption>
	 * graphics.beginRadialGradientFill(["#F00","#00F"], [0, 1], 100, 100, 0, 100, 100, 50).drawCircle(100, 100, 50);
	 *
	 * @param {Array} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define
	 * a gradient drawing from red to blue.
	 * @param {Array} ratios An array of gradient positions which correspond to the colors. For example, [0.1,
	 * 0.9] would draw the first color to 10% then interpolating to the second color at 90%.
	 * @param {Number} x0 Center position of the inner circle that defines the gradient.
	 * @param {Number} y0 Center position of the inner circle that defines the gradient.
	 * @param {Number} r0 Radius of the inner circle that defines the gradient.
	 * @param {Number} x1 Center position of the outer circle that defines the gradient.
	 * @param {Number} y1 Center position of the outer circle that defines the gradient.
	 * @param {Number} r1 Radius of the outer circle that defines the gradient.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public beginRadialGradientFill(colors: string[], ratios: float[], x0: float, y0: float, r0: float, x1: float, y1: float, r1: float): Graphics {
        return this._setFill(new Fill().radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1));
    }

	/**
	 * Begins a pattern fill using the specified image. This ends the current sub-path.
	 * A tiny API method "bf" also exists.
	 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} image The Image, Canvas, or Video object to use
	 * as the pattern. Must be loaded prior to creating a bitmap fill, or the fill will be empty.
	 * @param {String} repetition Optional. Indicates whether to repeat the image in the fill area. One of "repeat",
	 * "repeat-x", "repeat-y", or "no-repeat". Defaults to "repeat". Note that Firefox does not support "repeat-x" or
	 * "repeat-y" (latest tests were in FF 20.0), and will default to "repeat".
	 * @param {Matrix2D} matrix Optional. Specifies a transformation matrix for the bitmap fill. This transformation
	 * will be applied relative to the parent transform.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public beginBitmapFill(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, repetition: string, matrix: Matrix2D) {
        return this._setFill(new Fill(null, matrix).bitmap(image, repetition));
    }

	/**
	 * Ends the current sub-path, and begins a new one with no fill. Functionally identical to `beginFill(null)`.
	 * A tiny API method "ef" also exists.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public endFill(): Graphics {
        return this.beginFill();
    }

	/**
	 * Sets the stroke style.
	 * A tiny API method "ss" also exists.
	 *
	 * @example
	 * graphics.setStrokeStyle(8,"round").beginStroke("#F00");
	 *
	 * @param {Number} thickness The width of the stroke.
	 * @param {String | Number} [caps=0] Indicates the type of caps to use at the end of lines. One of butt,
	 * round, or square. Defaults to "butt". Also accepts the values 0 (butt), 1 (round), and 2 (square) for use with
	 * the tiny API.
	 * @param {String | Number} [joints=0] Specifies the type of joints that should be used where two lines meet.
	 * One of bevel, round, or miter. Defaults to "miter". Also accepts the values 0 (miter), 1 (round), and 2 (bevel)
	 * for use with the tiny API.
	 * @param {Number} [miterLimit=10] If joints is set to "miter", then you can specify a miter limit ratio which
	 * controls at what point a mitered joint will be clipped.
	 * @param {Boolean} [ignoreScale=false] If true, the stroke will be drawn at the specified thickness regardless
	 * of active transformations.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public setStrokeStyle(thickness: float, caps: string | number = 0, joints: string | number = 0, miterLimit: number = 10, ignoreScale: boolean = false): Graphics {
        this._updateInstructions(true);
        this._strokeStyle = this.command = new StrokeStyle(thickness, caps, joints, miterLimit, ignoreScale);

        // ignoreScale lives on Stroke, not StrokeStyle, so we do a little trickery:
        if (this._stroke) { (<any>this._stroke).ignoreScale = ignoreScale; }
        this._strokeIgnoreScale = ignoreScale;
        return this;
    }

	/**
	 * Sets or clears the stroke dash pattern.
	 * A tiny API method `sd` also exists.
	 *
	 * @example
	 * graphics.setStrokeDash([20, 10], 0);
	 *
	 * @param {Array} [segments] An array specifying the dash pattern, alternating between line and gap.
	 * For example, `[20,10]` would create a pattern of 20 pixel lines with 10 pixel gaps between them.
	 * Passing null or an empty array will clear the existing stroke dash.
	 * @param {Number} [offset=0] The offset of the dash pattern. For example, you could increment this value to create a "marching ants" effect.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public setStrokeDash(segments: number[], offset: number = 0): Graphics {
        this._updateInstructions(true);
        this._strokeDash = this.command = new StrokeDash(segments as any, offset);
        return this;
    }

	/**
	 * Begins a stroke with the specified color. This ends the current sub-path.
	 * A tiny API method "s" also exists.
	 *
	 * @param {String} color A CSS compatible color value (ex. "#FF0000", "red", or "rgba(255,0,0,0.5)"). Setting to
	 * null will result in no stroke.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public beginStroke(color?: string): Graphics {
        return this._setStroke(color ? new Stroke(color) : null as any);
    }

	/**
	 * Begins a linear gradient stroke defined by the line (x0, y0) to (x1, y1). This ends the current sub-path.
	 * A tiny API method "ls" also exists.
	 *
	 * @example <caption>Define a black to white vertical gradient ranging from 20px to 120px, and draw a square to display it</caption>
	 * graphics.setStrokeStyle(10)
	 *   .beginLinearGradientStroke(["#000","#FFF"], [0, 1], 0, 20, 0, 120)
	 *   .drawRect(20, 20, 120, 120);
	 *
	 * @param {Array<String>} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define
	 * a gradient drawing from red to blue.
	 * @param {Array<Number>} ratios An array of gradient positions which correspond to the colors. For example, [0.1,
	 * 0.9] would draw the first color to 10% then interpolating to the second color at 90%.
	 * @param {Number} x0 The position of the first point defining the line that defines the gradient direction and size.
	 * @param {Number} y0 The position of the first point defining the line that defines the gradient direction and size.
	 * @param {Number} x1 The position of the second point defining the line that defines the gradient direction and size.
	 * @param {Number} y1 The position of the second point defining the line that defines the gradient direction and size.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public beginLinearGradientStroke(colors: string[], ratios: number[], x0: float, y0: float, x1: float, y1: float) {
        return this._setStroke(new Stroke().linearGradient(colors, ratios, x0, y0, x1, y1) as Stroke);
    }

	/**
	 * Begins a radial gradient stroke. This ends the current sub-path.
	 * A tiny API method "rs" also exists.
	 *
	 * @example <caption>Define a red to blue radial gradient centered at (100, 100), with a radius of 50, and draw a rectangle to display it</caption>
	 * graphics.setStrokeStyle(10)
	 *   .beginRadialGradientStroke(["#F00","#00F"], [0, 1], 100, 100, 0, 100, 100, 50)
	 *   .drawRect(50, 90, 150, 110);
	 *
	 * @param {Array<String>} colors An array of CSS compatible color values. For example, ["#F00","#00F"] would define
	 * a gradient drawing from red to blue.
	 * @param {Array<Number>} ratios An array of gradient positions which correspond to the colors. For example, [0.1,
	 * 0.9] would draw the first color to 10% then interpolating to the second color at 90%, then draw the second color
	 * to 100%.
	 * @param {Number} x0 Center position of the inner circle that defines the gradient.
	 * @param {Number} y0 Center position of the inner circle that defines the gradient.
	 * @param {Number} r0 Radius of the inner circle that defines the gradient.
	 * @param {Number} x1 Center position of the outer circle that defines the gradient.
	 * @param {Number} y1 Center position of the outer circle that defines the gradient.
	 * @param {Number} r1 Radius of the outer circle that defines the gradient.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public beginRadialGradientStroke(colors: string[], ratios: number[], x0: float, y0: float, r0: float, x1: float, y1: float, r1: float): Graphics {
        return this._setStroke(new Stroke().radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1) as Stroke);
    }

	/**
	 * Begins a pattern fill using the specified image. This ends the current sub-path. Note that unlike bitmap fills,
	 * strokes do not currently support a matrix parameter due to limitations in the canvas API.
	 * A tiny API method "bs" also exists.
	 *
	 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} image The Image, Canvas, or Video object to use
	 * as the pattern. Must be loaded prior to creating a bitmap fill, or the fill will be empty.
	 * @param {String} [repetition="repeat"] Indicates whether to repeat the image in the fill area. One of
	 * "repeat", "repeat-x", "repeat-y", or "no-repeat". Defaults to "repeat".
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public beginBitmapStroke(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, repetition: string = "repeat"): Graphics {
        // NOTE: matrix is not supported for stroke because transforms on strokes also affect the drawn stroke width.
        return this._setStroke(new Stroke().bitmap(image, repetition) as Stroke);
    }

	/**
	 * Ends the current sub-path, and begins a new one with no stroke. Functionally identical to `beginStroke(null)`.
	 * A tiny API method "es" also exists.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public endStroke(): Graphics {
        return this.beginStroke();
    }

	/**
	 * Draws a rounded rectangle with all corners with the specified radius.
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w
	 * @param {Number} h
	 * @param {Number} radius Corner radius.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public drawRoundRect(x: float, y: float, w: float, h: float, radius: float): Graphics {
        return this.drawRoundRectComplex(x, y, w, h, radius, radius, radius, radius);
    }

	/**
	 * Draws a rounded rectangle with different corner radii. Supports positive and negative corner radii.
	 * A tiny API method "rc" also exists.
	 * @param {Number} x The horizontal coordinate to draw the round rect.
	 * @param {Number} y The vertical coordinate to draw the round rect.
	 * @param {Number} w The width of the round rect.
	 * @param {Number} h The height of the round rect.
	 * @param {Number} radiusTL Top left corner radius.
	 * @param {Number} radiusTR Top right corner radius.
	 * @param {Number} radiusBR Bottom right corner radius.
	 * @param {Number} radiusBL Bottom left corner radius.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public drawRoundRectComplex(x: float, y: float, w: float, h: float, radiusTL: float, radiusTR: float, radiusBR: float, radiusBL: float): Graphics {
        return this.append(new RoundRect(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL));
    }

	/**
	 * Draws a circle with the specified radius at (x, y).
	 * A tiny API method "dc" also exists.
	 *
	 * @example
	 * let g = new Graphics();
	 * g.setStrokeStyle(1);
	 * g.beginStroke(Graphics.getRGB(0,0,0));
	 * g.beginFill(Graphics.getRGB(255,0,0));
	 * g.drawCircle(0,0,3);
	 * let s = new Shape(g);
	 * s.x = 100;
	 * s.y = 100;
	 * stage.addChild(s);
	 * stage.update();
	 *
	 * @param {Number} x x coordinate center point of circle.
	 * @param {Number} y y coordinate center point of circle.
	 * @param {Number} radius Radius of circle.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public drawCircle(x: float, y: float, radius: float): Graphics {
        return this.append(new Circle(x, y, radius));
    }

	/**
	 * Draws an ellipse (oval) with a specified width (w) and height (h). Similar to {@link easels.Graphics#drawCircle},
	 * except the width and height can be different.
	 * A tiny API method "de" also exists.
	 * @param {Number} x The left coordinate point of the ellipse. Note that this is different from {@link easels.Graphics#drawCircle}
	 * which draws from center.
	 * @param {Number} y The top coordinate point of the ellipse. Note that this is different from {@link easels.Graphics#drawCircle}
	 * which draws from the center.
	 * @param {Number} w The height (horizontal diameter) of the ellipse. The horizontal radius will be half of this
	 * number.
	 * @param {Number} h The width (vertical diameter) of the ellipse. The vertical radius will be half of this number.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public drawEllipse(pen: Pen, x: float, y: float, w: float, h: float): Graphics {
        return this.append(new Ellipse(pen, x, y, w, h));
    }

    /**
	 * Draws an ellipse (oval) with a specified width (w) and height (h). Similar to {@link easels.Graphics#drawCircle},
	 * except the width and height can be different.
	 * A tiny API method "de" also exists.
	 * @param {Number} x The left coordinate point of the ellipse. Note that this is different from {@link easels.Graphics#drawCircle}
	 * which draws from center.
	 * @param {Number} y The top coordinate point of the ellipse. Note that this is different from {@link easels.Graphics#drawCircle}
	 * which draws from the center.
	 * @param {Number} w The height (horizontal diameter) of the ellipse. The horizontal radius will be half of this
	 * number.
	 * @param {Number} h The width (vertical diameter) of the ellipse. The vertical radius will be half of this number.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public fillEllipse(brush: Brush, x: float, y: float, w: float, h: float): Graphics {
        return this.append(new FillEllipse(brush, x, y, w, h));
    }

	/**
	 * Draws a star if pointSize is greater than 0, or a regular polygon if pointSize is 0 with the specified number of points.
	 * A tiny API method "dp" also exists.
	 *
	 * @example <caption>Draw a 5 pointed star shape centered at 100, 100 and with a radius of 50</caption>
	 * graphics.beginFill("#FF0").drawPolyStar(100, 100, 50, 5, 0.6, -90);
	 * // Note: -90 makes the first point vertical
	 *
	 * @param {Number} x Position of the center of the shape.
	 * @param {Number} y Position of the center of the shape.
	 * @param {Number} radius The outer radius of the shape.
	 * @param {Number} sides The number of points on the star or sides on the polygon.
	 * @param {Number} pointSize The depth or "pointy-ness" of the star points. A pointSize of 0 will draw a regular
	 * polygon (no points), a pointSize of 1 will draw nothing because the points are infinitely pointy.
	 * @param {Number} angle The angle of the first point / corner. For example a value of 0 will draw the first point
	 * directly to the right of the center.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public drawPolyStar(x: float, y: float, radius: float, sides: float, pointSize: float, angle: float): Graphics {
        return this.append(new PolyStar(x, y, radius, sides, pointSize, angle));
    }

	/**
	 * Appends a graphics command object to the graphics queue. Command objects expose an "exec" method
	 * that accepts two parameters: the Context2D to operate on, and an arbitrary data object passed into
	 * {@link Graphics#draw}. The latter will usually be the Shape instance that called draw.
	 *
	 * This method is used internally by Graphics methods, such as drawCircle, but can also be used directly to insert
	 * built-in or custom graphics commands.
	 *
	 * @example
	 * // attach data to our shape, so we can access it during the draw:
	 * shape.color = "red";
	 *
	 * // append a Circle command object:
	 * shape.graphics.append(new Graphics.Circle(50, 50, 30));
	 *
	 * // append a custom command object with an exec method that sets the fill style
	 * // based on the shape's data, and then fills the circle.
	 * shape.graphics.append({
	 *   exec: (ctx, shape) => {
	 *     ctx.fillStyle = shape.color;
	 *     ctx.fill();
	 *   }
	 * });
	 *
	 * @param {Object} command A graphics command object exposing an "exec" method.
	 * @param {Boolean} clean The clean param is primarily for internal use. A value of true indicates that a command does not generate a path that should be stroked or filled.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public append(command: ICommand, clean?: boolean): Graphics {
        this._activeInstructions.push(command);
        this.command = command;
        if (!clean) { this._dirty = true; }
        return this;
    }

	/**
	 * Decodes a compact encoded path string into a series of draw instructions.
	 * This format is not intended to be human readable, and is meant for use by authoring tools.
	 * The format uses a base64 character set, with each character representing 6 bits, to define a series of draw
	 * commands.
	 *
	 * Each command is comprised of a single "header" character followed by a variable number of alternating x and y
	 * position values. Reading the header bits from left to right (most to least significant): bits 1 to 3 specify the
	 * type of operation (0-moveTo, 1-lineTo, 2-quadraticCurveTo, 3-bezierCurveTo, 4-closePath, 5-7 unused). Bit 4
	 * indicates whether position values use 12 bits (2 characters) or 18 bits (3 characters), with a one indicating the
	 * latter. Bits 5 and 6 are currently unused.
	 *
	 * Following the header is a series of 0 (closePath), 2 (moveTo, lineTo), 4 (quadraticCurveTo), or 6 (bezierCurveTo)
	 * parameters. These parameters are alternating x/y positions represented by 2 or 3 characters (as indicated by the
	 * 4th bit in the command char). These characters consist of a 1 bit sign (1 is negative, 0 is positive), followed
	 * by an 11 (2 char) or 17 (3 char) bit integer value. All position values are in tenths of a pixel. Except in the
	 * case of move operations which are absolute, this value is a delta from the previous x or y position (as
	 * appropriate).
	 *
	 * For example, the string "A3cAAMAu4AAA" represents a line starting at -150,0 and ending at 150,0.
	 * <br />A - bits 000000. First 3 bits (000) indicate a moveTo operation. 4th bit (0) indicates 2 chars per
	 * parameter.
	 * <br />n0 - 110111011100. Absolute x position of -150.0px. First bit indicates a negative value, remaining bits
	 * indicate 1500 tenths of a pixel.
	 * <br />AA - 000000000000. Absolute y position of 0.
	 * <br />I - 001100. First 3 bits (001) indicate a lineTo operation. 4th bit (1) indicates 3 chars per parameter.
	 * <br />Au4 - 000000101110111000. An x delta of 300.0px, which is added to the previous x value of -150.0px to
	 * provide an absolute position of +150.0px.
	 * <br />AAA - 000000000000000000. A y delta value of 0.
	 *
	 * A tiny API method "p" also exists.
	 *
	 * @param {String} str The path string to decode.
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public decodePath(str: string): Graphics {
        let instructions = [this.moveTo, this.lineTo, this.quadraticCurveTo, this.bezierCurveTo, this.closePath];
        let paramCount = [2, 2, 4, 6, 0];
        let i = 0;
        const l = str.length;
        let params: any = [];
        let x = 0, y = 0;
        let base64 = Graphics._BASE_64;

        while (i < l) {
            let c = str.charAt(i);
            let n = base64[c];
            let fi = n >> 3; // highest order bits 1-3 code for operation.
            let f = instructions[fi];
            // check that we have a valid instruction & that the unused bits are empty:
            if (!f || (n & 3)) { throw `Bad path data (@${i}):c`; }
            const pl = paramCount[fi];
            if (!fi) { x = y = 0; } // move operations reset the position.
            params.length = 0;
            i++;
            let charCount = (n >> 2 & 1) + 2;  // 4th header bit indicates number size for this operation.
            for (let p = 0; p < pl; p++) {
                let num = base64[str.charAt(i)];
                let sign = (num >> 5) ? -1 : 1;
                num = ((num & 31) << 6) | (base64[str.charAt(i + 1)]);
                if (charCount === 3) { num = (num << 6) | (base64[str.charAt(i + 2)]); }
                num = sign * num / 10;
                if (p % 2) { x = (num += x); }
                else { y = (num += y); }
                params[p] = num;
                i += charCount;
            }
            f.apply(this, params as any);
        }
        return this;
    }

	/**
	 * Stores all graphics commands so they won't be executed in future draws. Calling store() a second time adds to
	 * the existing store. This also affects `drawAsPath()`.
	 *
	 * This is useful in cases where you are creating vector graphics in an iterative manner (ex. generative art), so
	 * that only new graphics need to be drawn (which can provide huge performance benefits), but you wish to retain all
	 * of the vector instructions for later use (ex. scaling, modifying, or exporting).
	 *
	 * Note that calling store() will force the active path (if any) to be ended in a manner similar to changing
	 * the fill or stroke.
	 *
	 * For example, consider a application where the user draws lines with the mouse. As each line segment (or collection of
	 * segments) are added to a Shape, it can be rasterized using {@link DisplayObject#updateCache},
	 * and then stored, so that it can be redrawn at a different scale when the application is resized, or exported to SVGraphics.
	 *
	 * @example
	 * // set up cache:
	 * shape.cache(0,0,500,500,scale);
	 *
	 * // when the user drags, draw a new line:
	 * shape.graphics.moveTo(oldX,oldY).lineTo(newX,newY);
	 * // then draw it into the existing cache:
	 * shape.updateCache("source-over");
	 * // store the new line, so it isn't redrawn next time:
	 * shape.store();
	 *
	 * // then, when the window resizes, we can re-render at a different scale:
	 * // first, unstore all our lines:
	 * shape.unstore();
	 * // then cache using the new scale:
	 * shape.cache(0,0,500,500,newScale);
	 * // finally, store the existing commands again:
	 * shape.store();
	 *
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public store(): Graphics {
        this._updateInstructions(true);
        this._storeIndex = this._instructions.length;
        return this;
    }

	/**
	 * Unstores any graphics commands that were previously stored using {@link Graphics#store}
	 * so that they will be executed in subsequent draw calls.
	 *
	 * @return {Graphics} The Graphics instance the method is called on (useful for chaining calls.)
	 * @chainable
	 */
    public unstore(): Graphics {
        this._storeIndex = 0;
        return this;
    }

	/**
	 * Returns a clone of this Graphics instance. Note that the individual command objects are not cloned.
	 * @return {Graphics} A clone of the current Graphics instance.
	 */
    public clone(): Graphics {
        let o = new Graphics();
        o.command = this.command;
        o._stroke = this._stroke;
        o._strokeStyle = this._strokeStyle;
        o._strokeDash = this._strokeDash;
        o._strokeIgnoreScale = this._strokeIgnoreScale;
        o._fill = this._fill;
        o._instructions = this._instructions.slice();
        o._commitIndex = this._commitIndex;
        o._activeInstructions = this._activeInstructions.slice();
        o._dirty = this._dirty;
        o._storeIndex = this._storeIndex;
        return o;
    }

	/**
	 * Returns a string representation of this object.
	 * @return {String} a string representation of the instance.
	 */
    public toString(): string {
        return `[${this.constructor.name}]`;
    }

	/**
	 * @param {Boolean} commit
	 * @protected
	 */
    protected _updateInstructions(commit?: boolean) {
        let instr = this._instructions, active = this._activeInstructions, commitIndex = this._commitIndex;

        if (this._dirty && active.length) {
            instr.length = commitIndex; // remove old, uncommitted commands
            instr.push(Graphics.beginCmd);

            const l = active.length, ll = instr.length;
            instr.length = ll + l;
            for (let i = 0; i < l; i++) { instr[i + ll] = active[i]; }

            if (this._fill) { instr.push(this._fill); }
            if (this._stroke) {
                // doesn't need to be re-applied if it hasn't changed.
                if (this._strokeDash !== this._oldStrokeDash) {
                    instr.push(this._strokeDash);
                }
                if (this._strokeStyle !== this._oldStrokeStyle) {
                    instr.push(this._strokeStyle);
                }
                if (commit) {
                    this._oldStrokeDash = this._strokeDash;
                    this._oldStrokeStyle = this._strokeStyle;
                }
                instr.push(this._stroke);
            }

            this._dirty = false;
        }

        if (commit) {
            active.length = 0;
            this._commitIndex = instr.length;
        }
    }


	/**
	 * @param {Graphics.Fill} fill
	 * @protected
	 */
    public _setFill(fill: Fill): Graphics {
        this._updateInstructions(true);
        this.command = this._fill = fill;
        return this;
    }

	/**
	 * @param {Graphics.Stroke} stroke
	 * @protected
	 */
    public _setStroke(stroke: Stroke): Graphics {
        this._updateInstructions(true);
        if (this.command = this._stroke = stroke) {
            (<any>stroke).ignoreScale = this._strokeIgnoreScale;
        }
        return this;
    }

    public static get LineTo() { return LineTo; }
    public static get MoveTo() { return MoveTo; }
    public static get ArcTo() { return ArcTo; }
    public static get Arc() { return Arc; }
    public static get QuadraticCurveTo() { return QuadraticCurveTo; }
    public static get BezierCurveTo() { return BezierCurveTo; }
    public static get Rect() { return Rect; }
    public static get ClosePath() { return ClosePath; }
    public static get BeginPath() { return BeginPath; }
    public static get Fill() { return Fill; }
    public static get Stroke() { return Stroke; }
    public static get StrokeStyle() { return StrokeStyle; }
    public static get StrokeDash() { return StrokeDash; }
    public static get RoundRect() { return RoundRect; }
    public static get Circle() { return Circle; }
    public static get Ellipse() { return Ellipse; }
    public static get PolyStar() { return PolyStar; }

}

interface ICommand {
    exec(ctx: CanvasRenderingContext2D | TGI, data?: any): void;
}

/**
 * @see {@link Graphics#lineTo}
 * @alias Graphics.LineTo
 * @param {Number} x
 * @param {Number} y
 */
class LineTo implements ICommand {
    /**
	 * @type {Number}
	 */
    private x: float;

    /**
	 * @type {Number}
	 */
    private y: float;
    constructor(x: float, y: float) {
        this.x = x;
        this.y = y;
    }

	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
    public exec(ctx: CanvasRenderingContext2D): void {
        ctx.lineTo(this.x, this.y);
    }
}

class DrawMethod {
    /**
    * @type {Pen}
    */
    protected pen: Pen;
    public constructor(pen: Pen) {
        this.pen = pen;
    }
}

/**
 * @see {@link Graphics#lineTo}
 * @alias Graphics.DrawLine
 * @param {Number} x
 * @param {Number} y
 */
class DrawLine extends DrawMethod implements ICommand {
    /**
	 * @type {Number}
	 */
    private x: float;

    /**
	 * @type {Number}
	 */
    private y: float;
    /**
    * @type {Number}
    */
    private x1: float;

    /**
	 * @type {Number}
	 */
    private y1: float;
    constructor(pen: Pen, x: float, y: float, x1: float, y1: float) {
        super(pen);
        this.x = x;
        this.y = y;
        this.x1 = x1;
        this.y1 = y1;
    }

	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
    public exec(tgi: TGI): void {
        tgi.DrawLine(this.pen, this.x, this.y, this.x1, this.y1);
    }
}

/**
 * @see {@link Graphics#moveTo}
 * @alias Graphics.MoveTo
 * @param {Number} x
 * @param {Number} y
 */
class MoveTo implements ICommand {
    /**
     * @type {Number}
     */
    private x: float;

    /**
     * @type {Number}
     */
    private y: float;
    constructor(x: float, y: float) {
        this.x = x;
        this.y = y;
    }
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
    public exec(ctx: CanvasRenderingContext2D) {
        ctx.moveTo(this.x, this.y);
    }
}

/**
 * @see {@link Graphics#arcTo}
 * @alias Graphics.ArcTo
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} radius
 */
class ArcTo implements ICommand {
    /**
     * @type {Number}
     */
    private x1: float;
    /**
     * @type {Number}
     */
    private y1: float;
    /**
     * @type {Number}
     */
    private x2: float;
    /**
     * @type {Number}
     */
    private y2: float;
    /**
     * @type {Number}
     */
    private radius: float;
    public constructor(x1: float, y1: float, x2: float, y2: float, radius: float) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.radius = radius;
    }
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
    public exec(ctx: CanvasRenderingContext2D): void {
        ctx.arcTo(this.x1, this.y1, this.x2, this.y2, this.radius);
    }
}

/**
 * @see {@link Graphics#arc}
 * @alias Graphics.Arc
 * @param {Number} x
 * @param {Number} y
 * @param {Number} radius
 * @param {Number} startAngle
 * @param {Number} endAngle
 * @param {Boolean} [anticlockwise=false]
 */
class Arc implements ICommand {
    /**
     * @type {Number}
     */
    private x: float;
    /**
     * @type {Number}
     */
    private y: float;
    /**
     * @type {Number}
     */
    private radius: float;
    /**
     * @type {Number}
     */
    private startAngle: float;
    /**
     * @type {Number}
     */
    private endAngle: float;
    /**
     * @type {Boolean}
     */
    private anticlockwise: boolean;
    public constructor(x: float, y: float, radius: float, startAngle: float, endAngle: float, anticlockwise: boolean = false) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.anticlockwise = anticlockwise;
    }
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
    public exec(ctx: CanvasRenderingContext2D): void {
        ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise);
    }
}

/**
 * @see {@link Graphics#quadraticCurveTo}
 * @alias Graphics.QuadraticCurveTo
 * @param {Number} cpx
 * @param {Number} cpy
 * @param {Number} x
 * @param {Number} y
 */
class QuadraticCurveTo implements ICommand {
    /**
     * @property cpx
     * @type Number
     */
    private cpx: float;
    /**
     * @property cpy
     * @type Number
     */
    private cpy: float;
    /**
     * @property x
     * @type Number
     */
    private x: float;
    /**
     * @property y
     * @type Number
     */
    private y: float;
    public constructor(cpx: float, cpy: float, x: float, y: float) {
        this.cpx = cpx;
        this.cpy = cpy;
        this.x = x;
        this.y = y;
    }
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
    public exec(ctx: CanvasRenderingContext2D): void {
        ctx.quadraticCurveTo(this.cpx, this.cpy, this.x, this.y);
    }
}

/**
 * @see {@link Graphics#bezierCurveTo}
 * @alias Graphics.BezierCurveTo
 * @param {Number} cp1x
 * @param {Number} cp1y
 * @param {Number} cp2x
 * @param {Number} cp2y
 * @param {Number} x
 * @param {Number} y
 */
class BezierCurveTo implements ICommand {
    /**
     * @type {Number}
     */
    private cp1x: float;
    /**
     * @type {Number}
     */
    private cp1y: float;
    /**
     * @type {Number}
     */
    private cp2x: float;
    /**
     * @type {Number}
     */
    private cp2y: float;
    /**
     * @type {Number}
     */
    private x: float;
    /**
     * @type {Number}
     */
    private y: float;
    constructor(cp1x: float, cp1y: float, cp2x: float, cp2y: float, x: float, y: float) {
        this.cp1x = cp1x;
        this.cp1y = cp1y;
        this.cp2x = cp2x;
        this.cp2y = cp2y;
        this.x = x;
        this.y = y;
    }
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
    public exec(ctx: CanvasRenderingContext2D): void {
        ctx.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x, this.y);
    }
}

/**
 * @see {@link Graphics#rect}
 * @alias Graphics.Rect
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 */
class Rect implements ICommand {
    /**
     * @type {Number}
     */
    private x: float;
    /**
     * @type {Number}
     */
    private y: float;
    /**
     * @type {Number}
     */
    private w: float;
    /**
     * @type {Number}
     */
    private h: float;
    constructor(x: float, y: float, w: float, h: float) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
    public exec(ctx: CanvasRenderingContext2D): void {
        ctx.rect(this.x, this.y, this.w, this.h);
    }
}

/**
 * @see {@link Graphics#closePath}
 * @alias Graphics.ClosePath
 */
class ClosePath implements ICommand {
    constructor() { }
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
    public exec(ctx: CanvasRenderingContext2D): void {
        ctx.closePath();
    }
}

/**
 * @see {@link Graphics#beginPath}
 * @alias Graphics.BeginPath
 */
class BeginPath implements ICommand {
    constructor() { }
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
    public exec(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
    }
}

/**
 * @see {@link Graphics#beginFill}
 * @alias Graphics.Fill
 * @param {Object} style A valid Context2D fillStyle.
 * @param {Matrix2D} matrix
 */
class Fill implements ICommand {
    /**
     * A valid Context2D fillStyle.
     * @type {Object}
     */
    protected style: any;
    /**
     * @type {Matrix2D}
     */
    private matrix: Matrix2D;
    /**
     * @type {Boolean}
     */
    protected path: boolean;
    public constructor(style?: any, matrix?: Matrix2D) {
        this.style = style;
        this.matrix = matrix as any;
        this.path = false;
    }
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
    public exec(ctx: CanvasRenderingContext2D): void {
        if (!this.style) { return; }
        ctx.fillStyle = this.style;
        let mtx = this.matrix;
        if (mtx) { ctx.save(); ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty); }
        ctx.fill();
        if (mtx) { ctx.restore(); }
    }
	/**
	 * Creates a linear gradient style and assigns it to {@link Graphics.Fill#style}.
	 * @see {@link Graphics#beginLinearGradientFill}
	 * @param {Array<String>} colors
	 * @param {Array<Number>} ratios
	 * @param {Number} x0
	 * @param {Number} y0
	 * @param {Number} x1
	 * @param {Number} y1
	 * @return {Graphics.Fill} Returns this Fill object for chaining or assignment.
	 */
    public linearGradient(colors: string[], ratios: float[], x0: float, y0: float, x1: float, y1: float): Fill {
        let o = this.style = Graphics._ctx.createLinearGradient(x0, y0, x1, y1);
        const l = colors.length;
        for (let i = 0; i < l; i++) { o.addColorStop(ratios[i], colors[i]); }
        o.props = { colors, ratios, x0, y0, x1, y1, type: "linear" };
        return this;
    }
	/**
	 * Creates a linear gradient style and assigns it to {@link Graphics.Fill#style}.
	 * @see {@link Graphics#beginRadialGradientFill}
	 * @param {Array<String>} colors
	 * @param {Array<Number>} ratios
	 * @param {Number} x0
	 * @param {Number} y0
	 * @param {Number} r0
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} r1
	 * @return {Graphics.Fill} Returns this Fill object for chaining or assignment.
	 */
    public radialGradient(colors: string[], ratios: float[], x0: float, y0: float, r0: float, x1: float, y1: float, r1: float): Fill {
        let o = this.style = Graphics._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
        const l = colors.length;
        for (let i = 0; i < l; i++) { o.addColorStop(ratios[i], colors[i]); }
        o.props = { colors, ratios, x0, y0, r0, x1, y1, r1, type: "radial" };
        return this;
    }
	/**
	 * Creates a linear gradient style and assigns it to {@link Graphics.Fill#style}.
	 * @see {@link Graphics#beginBitmapFill}
	 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} image  Must be loaded prior to creating a bitmap fill, or the fill will be empty.
	 * @param {String} [repetition=""] One of: repeat, repeat-x, repeat-y, or no-repeat.
	 * @return {Graphics.Fill} Returns this Fill object for chaining or assignment.
	 */
    public bitmap(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, repetition: string = ""): Fill {
        if ((<any>image).naturalWidth || (<any>image).getContext || (<any>image).readyState >= 2) {
            let o = this.style = Graphics._ctx.createPattern(image, repetition);
            o.props = { image, repetition, type: "bitmap" };
        }
        return this;
    }
}

/**
 * @see {@link Graphics#beginStroke}
 * @alias Graphics.Stroke
 * @extends Graphics.Fill
 * @param {Object} style A valid Context2D fillStyle.
 * @param {Boolean} ignoreScale
 */
class Stroke extends Fill implements ICommand {
    private ignoreScale: boolean;
    constructor(style?, ignoreScale?) {
        super();
        this.style = style;
        this.ignoreScale = ignoreScale;
        this.path = false;
    }
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @override
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
    public exec(ctx: CanvasRenderingContext2D): void {
        if (!this.style) { return; }
        ctx.strokeStyle = this.style;
        if (this.ignoreScale) { ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        ctx.stroke();
        if (this.ignoreScale) { ctx.restore(); }
    }
}

/**
 * @see {@link Graphics#setStrokeStyle}
 * @alias Graphics.StrokeStyle
 * @param {Number} [width=1]
 * @param {String} [caps=butt]
 * @param {String} [joints=miter]
 * @param {Number} [miterLimit=10]
 * @param {Boolean} [ignoreScale=false]
 */
class StrokeStyle implements ICommand {
    /**
     * @type {Number}
     */
    private width: number;
    /**
     * One of: butt, round, square
     * @type {String}
     */
    private caps: string | number;
    /**
     * One of: round, bevel, miter
     * @type {String}
     */
    private joints: string | number;
    /**
     * @type {Number}
     */
    private miterLimit: number;
    /**
     * @type {Boolean}
     */
    private ignoreScale: boolean;
    /**
     * @type {Boolean}
     */
    private path: boolean;
    constructor(width: float = 1, caps: string | number = "butt", joints: string | number = "miter", miterLimit: number = 10, ignoreScale: boolean = false) {
        this.width = width;
        this.caps = caps;
        this.joints = joints;
        this.miterLimit = miterLimit;
        this.ignoreScale = ignoreScale;
        this.path = false;
    }
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
    public exec(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.width;
        ctx.lineCap = (isNaN(<any>this.caps) ? this.caps : Graphics._STROKE_CAPS_MAP[this.caps]);
        ctx.lineJoin = (isNaN(<any>this.joints) ? this.joints : Graphics._STROKE_JOINTS_MAP[this.joints]);
        ctx.miterLimit = this.miterLimit;
        (<any>ctx).ignoreScale = this.ignoreScale;
    }
}

/**
 * @see {@link Graphics#setStrokeDash}
 * @alias Graphics.StrokeDash
 * @param {Array} [segments=[]]
 * @param {Number} [offset=0]
 */
class StrokeDash implements ICommand {
    /**
     * @type {Array}
     */
    private segments: number[];
    /**
     * @type {Number}
     */
    private offset: number;
    constructor(segments = [], offset = 0) {
        this.segments = segments;
        this.offset = offset;
    }

	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
    public exec(ctx: CanvasRenderingContext2D): void {
        if (ctx.setLineDash) { // feature detection.
            ctx.setLineDash(this.segments);
            ctx.lineDashOffset = this.offset;
        }
    }
}

/**
 * @see {@link Graphics#drawRoundRectComplex}
 * @alias Graphics.RoundRect
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @param {Number} radiusTL
 * @param {Number} radiusTR
 * @param {Number} radiusBR
 * @param {Number} radiusBL
 */
class RoundRect implements ICommand {
    /**
     * @type {Number}
     */
    private x: float;
    /**
     * @type {Number}
     */
    private y: float;
    /**
     * @type {Number}
     */
    private w: float;
    /**
     * @type {Number}
     */
    private h: float;
    /**
     * @type {Number}
     */
    private radiusTL: float;
    /**
     * @type {Number}
     */
    private radiusTR: float;
    /**
     * @type {Number}
     */
    private radiusBR: float;
    /**
     * @type {Number}
     */
    private radiusBL: float;
    constructor(x: float, y: float, w: float, h: float, radiusTL: float, radiusTR: float, radiusBR: float, radiusBL: float) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.radiusTL = radiusTL;
        this.radiusTR = radiusTR;
        this.radiusBR = radiusBR;
        this.radiusBL = radiusBL;
    }
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
    public exec(ctx: CanvasRenderingContext2D): void {
        let max = (this.w < this.h ? this.w : this.h) / 2;
        let mTL = 0, mTR = 0, mBR = 0, mBL = 0;
        let x = this.x, y = this.y, w = this.w, h = this.h;
        let rTL = this.radiusTL, rTR = this.radiusTR, rBR = this.radiusBR, rBL = this.radiusBL;

        if (rTL < 0) { rTL *= (mTL = -1); }
        if (rTL > max) { rTL = max; }
        if (rTR < 0) { rTR *= (mTR = -1); }
        if (rTR > max) { rTR = max; }
        if (rBR < 0) { rBR *= (mBR = -1); }
        if (rBR > max) { rBR = max; }
        if (rBL < 0) { rBL *= (mBL = -1); }
        if (rBL > max) { rBL = max; }

        ctx.moveTo(x + w - rTR, y);
        ctx.arcTo(x + w + rTR * mTR, y - rTR * mTR, x + w, y + rTR, rTR);
        ctx.lineTo(x + w, y + h - rBR);
        ctx.arcTo(x + w + rBR * mBR, y + h + rBR * mBR, x + w - rBR, y + h, rBR);
        ctx.lineTo(x + rBL, y + h);
        ctx.arcTo(x - rBL * mBL, y + h + rBL * mBL, x, y + h - rBL, rBL);
        ctx.lineTo(x, y + rTL);
        ctx.arcTo(x - rTL * mTL, y - rTL * mTL, x + rTL, y, rTL);
        ctx.closePath();
    }
}

/**
 * @see {@link Graphics#drawCircle}
 * @alias Graphics.Circle
 * @param {Number} x
 * @param {Number} y
 * @param {Number} radius
 */
class Circle implements ICommand {
    /**
     * @type {Number}
     */
    private x: float;
    /**
     * @type {Number}
     */
    private y: float;
    /**
     * @type {Number}
     */
    private radius: float;
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
    public exec(ctx: CanvasRenderingContext2D): void {
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    }
}

/**
 * @see {@link Graphics#drawEllipse}
 * @alias Graphics.Ellipse
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 */
class Ellipse implements ICommand {
    /**
     * @type {Pen}
     */
    private pen: Pen;
    /**
     * @type {Number}
     */
    private x: float;
    /**
     * @type {Number}
     */
    private y: float;
    /**
     * @type {Number}
     */
    private w: float;
    /**
     * @type {Number}
     */
    private h: float;
    constructor(pen: Pen, x: float, y: float, w: float, h: float) {
        this.pen = pen;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
    public exec(ctx: CanvasRenderingContext2D | TGI): void {
        if (ctx instanceof CanvasRenderingContext2D) {
            let x = this.x, y = this.y;
            let w = this.w, h = this.h;

            let k = 0.5522848;
            let ox = (w / 2) * k;
            let oy = (h / 2) * k;
            let xe = x + w;
            let ye = y + h;
            let xm = x + w / 2;
            let ym = y + h / 2;

            ctx.moveTo(x, ym);
            ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
            ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
            ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
            ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        } else {
            var tg: TGI = ctx;
            tg.DrawEllipse(this.pen, this.x, this.y, this.w, this.h)
        }
    }
}

/**
 * @see {@link Graphics#drawEllipse}
 * @alias Graphics.FillEllipse
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 */
class FillEllipse implements ICommand {
    /**
     * @type {Pen}
     */
    private brush: Brush;
    /**
     * @type {Number}
     */
    private x: float;
    /**
     * @type {Number}
     */
    private y: float;
    /**
     * @type {Number}
     */
    private w: float;
    /**
     * @type {Number}
     */
    private h: float;
    constructor(brush: Brush, x: float, y: float, w: float, h: float) {
        this.brush = brush;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
    public exec(ctx: CanvasRenderingContext2D | TGI): void {
        if (ctx instanceof CanvasRenderingContext2D) {

        } else {
            var tg: TGI = ctx;
            tg.FillEllipse(this.brush, this.x, this.y, this.w, this.h)
        }
    }
}

/**
 *  @see {@link Graphics#drawPolyStar}
 * @alias Graphics.PolyStar
 * @param {Number} x
 * @param {Number} y
 * @param {Number} radius
 * @param {Number} sides
 * @param {Number} [pointSize=0]
 * @param {Number} [angle=0]
 */
class PolyStar implements ICommand {
    /**
     * @type {Number}
     */
    private x: float;
    /**
     * @type {Number}
     */
    private y: float;
    /**
     * @type {Number}
     */
    private radius: float;
    /**
     * @type {Number}
     */
    private sides: float;
    /**
     * @type {Number}
     */
    private pointSize: number;
    /**
     * @type {Number}
     */
    private angle: number;
    constructor(x: float, y: float, radius: float, sides: float, pointSize: number = 0, angle: float = 0) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.sides = sides;
        this.pointSize = pointSize;
        this.angle = angle;
    }
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
    public exec(ctx: CanvasRenderingContext2D): void {
        let x = this.x, y = this.y;
        let radius = this.radius;
        let angle = this.angle / 180 * Math.PI;
        let sides = this.sides;
        let ps = 1 - this.pointSize;
        let a = Math.PI / sides;

        ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
        for (let i = 0; i < sides; i++) {
            angle += a;
            if (ps != 1) {
                ctx.lineTo(x + Math.cos(angle) * radius * ps, y + Math.sin(angle) * radius * ps);
            }
            angle += a;
            ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
        }
        ctx.closePath();
    }
}

/**
 * A reusable instance of {@link Graphics.BeginPath} to avoid unnecessary instantiation.
 * @static
 * @readonly
 * @type {Graphics.BeginPath}
 */
Graphics.beginCmd = new BeginPath();
/**
 * Map of Base64 characters to values. Used by {@link Graphics#decodePath}.
 * @static
 * @readonly
 * @protected
 * @type {Object}
 */
Graphics._BASE_64 = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16, "R": 17, "S": 18, "T": 19, "U": 20, "V": 21, "W": 22, "X": 23, "Y": 24, "Z": 25, "a": 26, "b": 27, "c": 28, "d": 29, "e": 30, "f": 31, "g": 32, "h": 33, "i": 34, "j": 35, "k": 36, "l": 37, "m": 38, "n": 39, "o": 40, "p": 41, "q": 42, "r": 43, "s": 44, "t": 45, "u": 46, "v": 47, "w": 48, "x": 49, "y": 50, "z": 51, "0": 52, "1": 53, "2": 54, "3": 55, "4": 56, "5": 57, "6": 58, "7": 59, "8": 60, "9": 61, "+": 62, "/": 63 };
/**
 * Maps numeric values for the caps parameter of {@link Graphics#setStrokeStyle} to
 * corresponding string values. This is primarily for use with the tiny API.<br />
 * The mappings are as follows:
 * <ul>
 *   <li>0 to "butt"</li>
 *   <li>1 to "round"</li>
 *   <li>2 to "square".</li>
 * </ul>
 *
 * @example <caption>Set line caps to "square"</caption>
 * graphics.ss(16, 2);
 *
 * @static
 * @readonly
 * @protected
 * @type {Array<String>}
 */
Graphics._STROKE_CAPS_MAP = ["butt", "round", "square"];
/**
 * Maps numeric values for the joints parameter of {@link Graphics#setStrokeStyle} to
 * corresponding string values. This is primarily for use with the tiny API.<br />
 * The mappings are as follows:
 * <ul>
 *   <li>0 to "miter"</li>
 *   <li>1 to "round"</li>
 *   <li>2 to "bevel".</li>
 * </ul>
 *
 * @example <caption>Set the line joints to "bevel"</caption>
 * graphics.ss(16, 0, 2);
 *
 * @static
 * @readonly
 * @protected
 * @type {Array<String>}
 */
Graphics._STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
/**
 * @static
 * @readonly
 * @protected
 * @type {CanvasRenderingContext2D}
 */
Graphics._ctx = createCanvas().getContext("2d");