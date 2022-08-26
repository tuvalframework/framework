import { CGRectangle } from '@tuval/cg';
import { DisplayObject } from "./DisplayObject";
import { createCanvas } from "../utils/Canvas";

export class Text extends DisplayObject {
    public text: string;
    public font: string;
    public color: string;
    public textAlign: string;
    public textBaseline: string;
    public maxWidth: number;
    public outline: number;
    public lineHeight: number;
    public lineWidth: number;

    private static _ctx: CanvasRenderingContext2D = createCanvas().getContext("2d") as any;
    private static readonly V_OFFSETS = { top: 0, hanging: -0.01, middle: -0.4, alphabetic: -0.8, ideographic: -0.85, bottom: -1 };
    private static readonly H_OFFSETS = { start: 0, left: 0, center: -0.5, end: -1, right: -1 };

    public constructor(text: string, font: string, color: string) {
        super();

		/**
		 * The text to display.
		 * @type {String}
		 */
        this.text = text;

		/**
		 * The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold 36px Arial").
		 * @type {String}
		 */
        this.font = font;

		/**
		 * The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex. "#F00"). Default is "#000".
		 * It will also accept valid canvas fillStyle values.
		 * @type {String}
		 */
        this.color = color;

		/**
		 * The horizontal text alignment. Any of "start", "end", "left", "right", and "center".
		 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles "WHATWG spec"}
		 * @type {String}
		 * @default left
		 */
        this.textAlign = "left";

		/**
		 * The vertical alignment point on the font. Any of "top", "hanging", "middle", "alphabetic", "ideographic", or "bottom".
		 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles "WHATWG spec"}
		 * @type {String}
		 * @default top
		*/
        this.textBaseline = "top";

		/**
		 * The maximum width to draw the text. If maxWidth is specified (not null), the text will be condensed or
		 * shrunk to make it fit in this width.
		 * @see {@link http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles "WHATWG spec"}
		 * @type {Number}
		*/
        this.maxWidth = null as any;

		/**
		 * If greater than 0, the text will be drawn as a stroke (outline) of the specified width.
		 * @type {Number}
		 */
        this.outline = 0;

		/**
		 * Indicates the line height (vertical distance between baselines) for multi-line text. If null or 0,
		 * the value of getMeasuredLineHeight is used.
		 * @type {Number}
		 * @default 0
		 */
        this.lineHeight = 0;

		/**
		 * Indicates the maximum width for a line of text before it is wrapped to multiple lines. If null,
		 * the text will not be wrapped.
		 * @type {Number}
		 */
        this.lineWidth = null as any;
    }

    public isVisible(): boolean {
        let hasContent = this.cacheCanvas || (this.text != null && this.text !== "");
        return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
    }

    public draw(ctx: CanvasRenderingContext2D, ignoreCache: boolean = false): boolean {
        if (super.draw(ctx, ignoreCache)) {
            return true;
        }

        let col = this.color || "#000";
        if (this.outline) {
            ctx.strokeStyle = col; ctx.lineWidth = this.outline * 1;
        }
        else {
            ctx.fillStyle = col;
        }

        this._drawText(this._prepContext(ctx));
        return true;
    }

    /**
     * Returns the measured, untransformed width of the text without wrapping. Use getBounds for a more robust value.
     * @return {Number} The measured, untransformed width of the text.
     */
    public getMeasuredWidth(): number {
        return this._getMeasuredWidth(this.text);
    }

    /**
     * Returns an approximate line height of the text, ignoring the lineHeight property. This is based on the measured
     * width of a "M" character multiplied by 1.2, which provides an approximate line height for most fonts.
     * @return {Number} an approximate line height of the text, ignoring the lineHeight property. This is
     * based on the measured width of a "M" character multiplied by 1.2, which approximates em for most fonts.
     */
    public getMeasuredLineHeight(): number {
        return this._getMeasuredWidth("M") * 1.2;
    }

    /**
     * Returns the approximate height of multi-line text by multiplying the number of lines against either the
     * `lineHeight` (if specified) or {@link easeljs.Text#getMeasuredLineHeight}. Note that
     * this operation requires the text flowing logic to run, which has an associated CPU cost.
     * @return {Number} The approximate height of the untransformed multi-line text.
     */
    public getMeasuredHeight(): number {
        return this._drawText(null, {}).height;
    }

    public getBounds(): CGRectangle {
        let rect = super.getBounds();
        if (rect) { return rect; }
        if (this.text == null || this.text === "") {
            return null as any;
        }
        let o = this._drawText(null, {});
        let w = (this.maxWidth && this.maxWidth < o.width) ? this.maxWidth : o.width;
        let x = w * Text.H_OFFSETS[this.textAlign || "left"];
        let lineHeight = this.lineHeight || this.getMeasuredLineHeight();
        let y = lineHeight * Text.V_OFFSETS[this.textBaseline || "top"];
        return this._rectangle.setValues(x, y, w, o.height);
    }

    /**
     * Returns an object with width, height, and lines properties. The width and height are the visual width and height
     * of the drawn text. The lines property contains an array of strings, one for
     * each line of text that will be drawn, accounting for line breaks and wrapping. These strings have trailing
     * whitespace removed.
     * @return {Object} An object with width, height, and lines properties.
     */
    public getMetrics() {
        let o: any = { lines: [] };
        o.lineHeight = this.lineHeight || this.getMeasuredLineHeight();
        o.vOffset = o.lineHeight * Text.V_OFFSETS[this.textBaseline || "top"];
        return this._drawText(null, o, o.lines);
    }

    /**
     * Returns a clone of the Text instance.
     * @return {easeljs.Text} a clone of the Text instance.
     */
    public clone(test?: boolean): Text {
        return this._cloneProps(new Text(this.text, this.font, this.color));
    }

    /**
     * Returns a string representation of this object.
     * @override
     * @return {String} a string representation of the instance.
     */
    public toString() {
        return `[${this.constructor.name} (text=${this.text.length > 20 ? `${this.text.substr(0, 17)}...` : this.text})]`;
    }

    /**
     * @param {easeljs.Text} o
     * @protected
     * @return {easeljs.Text} o
     */
    protected _cloneProps(o: Text): Text {
        super._cloneProps(o);
        o.textAlign = this.textAlign;
        o.textBaseline = this.textBaseline;
        o.maxWidth = this.maxWidth;
        o.outline = this.outline;
        o.lineHeight = this.lineHeight;
        o.lineWidth = this.lineWidth;
        return o;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @return {CanvasRenderingContext2D}
     * @protected
     */
    protected _prepContext(ctx) {
        ctx.font = this.font || "10px sans-serif";
        ctx.textAlign = this.textAlign || "left";
        ctx.textBaseline = this.textBaseline || "top";
        ctx.lineJoin = "miter";
        ctx.miterLimit = 2.5;
        return ctx;
    }

	/**
	 * Draws multiline text.
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Object} o
	 * @param {Array} lines
	 * @return {Object}
	 * @protected
	 */
    protected _drawText(ctx, o?, lines?) {
        const paint = !!ctx;
        if (!paint) {
            ctx = Text._ctx;
            ctx.save();
            this._prepContext(ctx);
        }
        let lineHeight = this.lineHeight || this.getMeasuredLineHeight();

        let maxW = 0, count = 0;
        let hardLines = String(this.text).split(/(?:\r\n|\r|\n)/);
        for (let str of hardLines) {
            let w: any = null;

            if (this.lineWidth != null && (w = ctx.measureText(str).width) > this.lineWidth) {
                // text wrapping:
                let words = str.split(/(\s)/);
                str = words[0];
                w = ctx.measureText(str).width;

                const l = words.length;
                for (let i = 1; i < l; i += 2) {
                    // Line needs to wrap:
                    let wordW = ctx.measureText(words[i] + words[i + 1]).width;
                    if (w + wordW > this.lineWidth) {
                        if (paint) { this._drawTextLine(ctx, str, count * lineHeight); }
                        if (lines) { lines.push(str); }
                        if (w > maxW) {
                            maxW = w as any; }
                        str = words[i + 1];
                        w = ctx.measureText(str).width;
                        count++;
                    } else {
                        str += words[i] + words[i + 1];
                        w += wordW;
                    }
                }
            }

            if (paint) {
                this._drawTextLine(ctx, str, count * lineHeight);
            }
            if (lines) {
                lines.push(str);
            }
            if (o && w == null) {
                w = ctx.measureText(str).width;
            }
            if (w > maxW) {
                maxW = w;
            }
            count++;
        }

        if (o) {
            o.width = maxW;
            o.height = count * lineHeight;
        }
        if (!paint) { ctx.restore(); }
        return o;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {String} text
     * @param {Number} y
     * @protected
     */
    _drawTextLine(ctx, text, y) {
        // Chrome 17 will fail to draw the text if the last param is included but null, so we feed it a large value instead:
        if (this.outline) {
            ctx.strokeText(text, 0, y, this.maxWidth || 0xFFFF);
        }
        else {
            ctx.fillText(text, 0, y, this.maxWidth || 0xFFFF);
        }
    }

    /**
     * @param {String} text
     * @protected
     */
    _getMeasuredWidth(text) {
        let ctx = Text._ctx;
        ctx.save();
        let w = this._prepContext(ctx).measureText(text).width;
        ctx.restore();
        return w;
    }

}
