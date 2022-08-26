import { constants } from "./core/Constanst";
import { SketchImage } from "./image/SketchImage";
import { int, byte, is } from "@tuval/core";
import { CGContext2D, CGColor, CoreGraphicTypes } from "@tuval/cg";
import { Vector } from "./math/Vector";
import { SketchGraphics } from "./SketchGraphics";
import { Filters } from "./image/filters";
import { GraphicTypes } from "../../GDITypes";

export interface ISketchRenderer2D {
    arc(x: number, y: number, w: number, h: number, start: number, stop: number, mode: string): void;
}

const styleEmpty = 'rgba(0,0,0,0)';

export class SketchCanvasRenderer2D extends CGContext2D implements ISketchRenderer2D {
    private _pInst: SketchGraphics;
    private _cachedFillStyle: string | CanvasGradient | CanvasPattern = undefined as any;
    private _cachedStrokeStyle: string | CanvasGradient | CanvasPattern = undefined as any;
    public gifProperties: any;

    public _textSize: int = 12;
    public _textLeading: int = 15;
    public _textFont: string = 'sans-serif';
    private _textStyle: string = constants.NORMAL;
    private _textAscent: any = null;
    private _textDescent: any = null;
    private _textAlign: string = constants.LEFT;
    private _textBaseline: string = constants.BASELINE;

    public _rectMode: string = constants.CORNER;
    public _ellipseMode: string = constants.CENTER;
    public _curveTightness = 0;
    public _imageMode: string = constants.CORNER;

    public _tint: any = null;
    public _doStroke: boolean = true;
    public _doFill: boolean = true;
    public _strokeSet: boolean = false;
    public _fillSet: boolean = false;


    public isP3D: boolean = false;

    public constructor(context: CanvasRenderingContext2D, pinst: SketchGraphics) {
        super(context);
        this._pInst = pinst;
    }

    public _applyDefaults() {
        this._cachedFillStyle = this._cachedStrokeStyle = undefined as any;
        this._setFill(constants._DEFAULT_FILL);
        this._setStroke(constants._DEFAULT_STROKE);
        this.drawingContext.lineCap = <any>constants.ROUND;
        this.drawingContext.font = 'normal 12px sans-serif';
    }

    public background(value: byte);
    public background(color: CGColor);
    public background(values: Array<byte>);
    public background(value: string);
    public background(gray: byte, alpha: byte);
    public background(v1: byte, v2: byte, v3: byte);
    public background(v1: byte, v2: byte, v3: byte, alpha: byte);
    public background(...args: any[]) {
        this.drawingContext.save();
        this.resetMatrix();

        if (args[0] instanceof SketchImage) {
            this.image(args[0], 0, 0, this._pInst.width, this._pInst.height);
        } else {
            const curFill = this._getFill();
            // create background rect
            //const color = this._pInst.color(...args);
            let color: CGColor = undefined as any;
            if (args.length === 1 && is.typeof<CGColor>(args[0], CoreGraphicTypes.CGColor)) {
                color = args[0];
            } else if (args.length === 1 && (is.number(args[0]) || is.string(args[0]))) {
                color = this._pInst.color(args[0] as any);
            } else if (args.length === 1 && is.array(args[0])) {
                color = this._pInst.color(args[1][0], args[1][1], args[1][2], args[1][3]);
            } else if (args.length === 2 && is.number(args[0]) && is.number(args[1])) {
                color = this._pInst.color(args[1], args[2]);
            } else if (args.length === 3 && is.number(args[0]) && is.number(args[1]) && is.number(args[2])) {
                color = this._pInst.color(args[0], args[1], args[1]);
            } else if (args.length === 4 && is.number(args[0]) && is.number(args[1]) && is.number(args[2]) && is.number(args[3])) {
                color = this._pInst.color(args[0], args[1], args[2], args[3]);
            }
            if (color != null) {
                const newFill = color.toString();
                this._setFill(newFill);
                this.drawingContext.fillRect(0, 0, this._pInst.width, this._pInst.height);
                // reset fill
                this._setFill(curFill);
            }
        }
        this.drawingContext.restore();

        this._pInst._pixelsDirty = true;
    }

    public clear() {
        this.drawingContext.save();
        this.resetMatrix();
        this.drawingContext.clearRect(0, 0, this._pInst.width, this._pInst.height);
        this.drawingContext.restore();

        this._pInst._pixelsDirty = true;
    }

    public fill(value: byte);
    public fill(color: CGColor);
    public fill(values: Array<byte>);
    public fill(value: string);
    public fill(gray: byte, alpha: byte);
    public fill(v1: byte, v2: byte, v3: byte);
    public fill(v1: byte, v2: byte, v3: byte, alpha: byte);
    public fill(...args: any[]): void {
        let color: CGColor = undefined as any;
        if (args.length === 1 && args[0].maxes != null/* is.typeof<SketchColor>(args[0], GraphicTypes.SketchColor) */) {
            color = args[0];
        } else if (args.length === 1 && (is.number(args[0]) || is.string(args[0]))) {
            color = CGColor.FromSketchColor(args[0] as any);
        } else if (args.length === 1 && is.array(args[0])) {
            color = CGColor.FromSketchColor(args[1][0], args[1][1], args[1][2], args[1][3]);
        } else if (args.length === 2 && is.number(args[0]) && is.number(args[1])) {
            color = CGColor.FromSketchColor(args[1], args[2]);
        } else if (args.length === 3 && is.number(args[0]) && is.number(args[1]) && is.number(args[2])) {
            color = CGColor.FromSketchColor(args[0], args[1], args[1]);
        } else if (args.length === 4 && is.number(args[0]) && is.number(args[1]) && is.number(args[2]) && is.number(args[3])) {
            color = CGColor.FromSketchColor(args[0], args[1], args[2], args[3]);
        }
        if (color != null) {
            this._setFill(color.toString(), true);
        }
    }

    public stroke(value: byte);
    public stroke(color: CGColor);
    public stroke(values: Array<byte>);
    public stroke(value: string);
    public stroke(gray: byte, alpha: byte);
    public stroke(v1: byte, v2: byte, v3: byte);
    public stroke(v1: byte, v2: byte, v3: byte, alpha: byte);
    public stroke(...args: any[]) {
        let color: CGColor = undefined as any;
        if (args.length === 1 && is.typeof<CGColor>(args[0], CoreGraphicTypes.CGColor)) {
            color = args[0];
        } else if (args.length === 1 && (is.number(args[0]) || is.string(args[0]))) {
            color = this._pInst.color(args[0] as any);
        } else if (args.length === 1 && is.array(args[0])) {
            color = this._pInst.color(args[1][0], args[1][1], args[1][2], args[1][3]);
        } else if (args.length === 2 && is.number(args[0]) && is.number(args[1])) {
            color = this._pInst.color(args[1], args[2]);
        } else if (args.length === 3 && is.number(args[0]) && is.number(args[1]) && is.number(args[2])) {
            color = this._pInst.color(args[0], args[1], args[2]);
        } else if (args.length === 4 && is.number(args[0]) && is.number(args[1]) && is.number(args[2]) && is.number(args[3])) {
            color = this._pInst.color(args[0], args[1], args[2], args[3]);
        }
        if (color != null) {
            this._setStroke(color.toString());
        }

    }


    //////////////////////////////////////////////
    // IMAGE | Loading & Displaying
    //////////////////////////////////////////////

    public image(img, sx, sy, sWidth, sHeight, dx?, dy?, dWidth?, dHeight?) {
        let cnv;
        if (img.gifProperties) {
            img._animateGif(this._pInst);
        }

        try {
            if (this._tint) {
                /*  if (p5.MediaElement && img instanceof p5.MediaElement) {
                     img.loadPixels();
                 } */
                if (img.canvas) {
                    cnv = this._getTintedImageCanvas(img);
                }
            }
            if (!cnv) {
                cnv = img.canvas || img.elt;
            }
            let s = 1;
            if (img.width && img.width > 0) {
                s = cnv.width / img.width;
            }
            this.drawingContext.drawImage(
                cnv,
                s * sx,
                s * sy,
                s * sWidth,
                s * sHeight,
                dx,
                dy,
                dWidth,
                dHeight
            );
        } catch (e: any) {
            if (e.name !== 'NS_ERROR_NOT_AVAILABLE') {
                throw e;
            }
        }

        this._pInst._pixelsDirty = true;
    }

    public _getTintedImageCanvas(img) {
        if (!img.canvas) {
            return img;
        }
        const pixels = Filters._toPixels(img.canvas);
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = img.canvas.width;
        tmpCanvas.height = img.canvas.height;
        const tmpCtx: any = tmpCanvas.getContext('2d');
        const id = tmpCtx.createImageData(img.canvas.width, img.canvas.height);
        const newPixels = id.data;
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            newPixels[i] = r * this._tint[0] / 255;
            newPixels[i + 1] = g * this._tint[1] / 255;
            newPixels[i + 2] = b * this._tint[2] / 255;
            newPixels[i + 3] = a * this._tint[3] / 255;
        }
        tmpCtx.putImageData(id, 0, 0);
        return tmpCanvas;
    };

    //////////////////////////////////////////////
    // IMAGE | Pixels
    //////////////////////////////////////////////

    public blendMode(mode) {
        if (mode === constants.SUBTRACT) {
            console.warn('blendMode(SUBTRACT) only works in WEBGL mode.');
        } else if (
            mode === constants.BLEND ||
            mode === constants.DARKEST ||
            mode === constants.LIGHTEST ||
            mode === constants.DIFFERENCE ||
            mode === constants.MULTIPLY ||
            mode === constants.EXCLUSION ||
            mode === constants.SCREEN ||
            mode === constants.REPLACE ||
            mode === constants.OVERLAY ||
            mode === constants.HARD_LIGHT ||
            mode === constants.SOFT_LIGHT ||
            mode === constants.DODGE ||
            mode === constants.BURN ||
            mode === constants.ADD
        ) {
            this.drawingContext.globalCompositeOperation = mode;
        } else {
            throw new Error(`Mode ${mode} not recognized.`);
        }
    }

    public blend(...args: any[]) {
        const currBlend = this.drawingContext.globalCompositeOperation;
        const blendMode = args[args.length - 1];

        const copyArgs = Array.prototype.slice.call(args, 0, args.length - 1);

        this.drawingContext.globalCompositeOperation = blendMode;
        if (this._pInst) {
            this._pInst.copy(...copyArgs);
        } else {
            this.copy(...copyArgs);
        }
        this.drawingContext.globalCompositeOperation = currBlend;
    }


    public copy(...args: any[]) {
        let srcImage, sx, sy, sw, sh, dx, dy, dw, dh;
        if (args.length === 9) {
            srcImage = args[0];
            sx = args[1];
            sy = args[2];
            sw = args[3];
            sh = args[4];
            dx = args[5];
            dy = args[6];
            dw = args[7];
            dh = args[8];
        } else if (args.length === 8) {
            srcImage = this._pInst;
            sx = args[0];
            sy = args[1];
            sw = args[2];
            sh = args[3];
            dx = args[4];
            dy = args[5];
            dw = args[6];
            dh = args[7];
        } else {
            throw new Error('Signature not supported');
        }
        SketchCanvasRenderer2D._copyHelper(this, srcImage, sx, sy, sw, sh, dx, dy, dw, dh);

        this._pInst._pixelsDirty = true;
    }


    private static _copyHelper(
        dstImage,
        srcImage,
        sx,
        sy,
        sw,
        sh,
        dx,
        dy,
        dw,
        dh
    ) {
        srcImage.loadPixels();
        const s = srcImage.canvas.width / srcImage.width;
        dstImage.drawingContext.drawImage(
            srcImage.canvas,
            s * sx,
            s * sy,
            s * sw,
            s * sh,
            dx,
            dy,
            dw,
            dh
        );
    }

    private _getPixel(x, y) {
        let imageData, index;
        if (this._pInst._pixelsDirty) {
            imageData = this.drawingContext.getImageData(x, y, 1, 1).data;
            index = 0;
        } else {
            imageData = this._pInst.pixels;
            index = (Math.floor(x) + Math.floor(y) * this.drawingContext.canvas.width) * 4;
        }
        return [
            imageData[index + 0],
            imageData[index + 1],
            imageData[index + 2],
            imageData[index + 3]
        ];
    }

    public loadPixels() {
        if (!this._pInst._pixelsDirty) return;
        this._pInst._pixelsDirty = false;

        const pd = this._pInst._pixelDensity;
        const w = this._pInst.width * pd;
        const h = this._pInst.height * pd;
        const imageData: ImageData = this.drawingContext.getImageData(0, 0, w, h);
        // @todo this should actually set pixels per object, so diff buffers can
        // have diff pixel arrays.
        this._pInst.imageData = imageData;
        this._pInst.pixels = imageData.data;
    }

    public set(x, y, imgOrCol) {
        // round down to get integer numbers
        x = Math.floor(x);
        y = Math.floor(y);
        if (imgOrCol instanceof SketchImage) {
            this.drawingContext.save();
            this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
            this.drawingContext.scale(
                this._pInst._pixelDensity,
                this._pInst._pixelDensity
            );
            this.drawingContext.drawImage(imgOrCol.canvas, x, y);
            this.drawingContext.restore();
            this._pInst._pixelsDirty = true;
        } else {
            let r = 0,
                g = 0,
                b = 0,
                a = 0;
            let idx =
                4 *
                (y *
                    this._pInst._pixelDensity *
                    (this._pInst.width * this._pInst._pixelDensity) +
                    x * this._pInst._pixelDensity);
            if (!this._pInst.imageData || this._pInst._pixelsDirty) {
                this._pInst.loadPixels.call(this._pInst);
            }
            if (typeof imgOrCol === 'number') {
                if (idx < this._pInst.pixels.length) {
                    r = imgOrCol;
                    g = imgOrCol;
                    b = imgOrCol;
                    a = 255;
                    //this.updatePixels.call(this);
                }
            } else if (imgOrCol instanceof Array) {
                if (imgOrCol.length < 4) {
                    throw new Error('pixel array must be of the form [R, G, B, A]');
                }
                if (idx < this._pInst.pixels.length) {
                    r = imgOrCol[0];
                    g = imgOrCol[1];
                    b = imgOrCol[2];
                    a = imgOrCol[3];
                    //this.updatePixels.call(this);
                }
            } else if (imgOrCol instanceof CGColor) {
                if (idx < this._pInst.pixels.length) {
                    r = imgOrCol.Levels[0];
                    g = imgOrCol.Levels[1];
                    b = imgOrCol.Levels[2];
                    a = imgOrCol.Levels[3];
                    //this.updatePixels.call(this);
                }
            }
            // loop over pixelDensity * pixelDensity
            for (let i = 0; i < this._pInst._pixelDensity; i++) {
                for (let j = 0; j < this._pInst._pixelDensity; j++) {
                    // loop over
                    idx =
                        4 *
                        ((y * this._pInst._pixelDensity + j) *
                            this._pInst.width *
                            this._pInst._pixelDensity +
                            (x * this._pInst._pixelDensity + i));
                    this._pInst.pixels[idx] = r;
                    this._pInst.pixels[idx + 1] = g;
                    this._pInst.pixels[idx + 2] = b;
                    this._pInst.pixels[idx + 3] = a;
                }
            }
        }
    }


    public updatePixels(x, y, w, h) {
        const pd = this._pInst._pixelDensity;
        if (
            x === undefined &&
            y === undefined &&
            w === undefined &&
            h === undefined
        ) {
            x = 0;
            y = 0;
            w = this._pInst.width;
            h = this._pInst.height;
        }
        x *= pd;
        y *= pd;
        w *= pd;
        h *= pd;

        if (this.gifProperties) {
            this.gifProperties.frames[this.gifProperties.displayIndex] =
                this._pInst.imageData;
        }

        this.drawingContext.putImageData(this._pInst.imageData, x, y, 0, 0, w, h);

        if (x !== 0 || y !== 0 || w !== this._pInst.width || h !== this._pInst.height) {
            this._pInst._pixelsDirty = true;
        }
    }
    private _acuteArcToBezier(start: number, size: number) {
        // Evaluate constants.
        const alpha = size / 2.0,
            cos_alpha = Math.cos(alpha),
            sin_alpha = Math.sin(alpha),
            cot_alpha = 1.0 / Math.tan(alpha),
            phi = start + alpha, // This is how far the arc needs to be rotated.
            cos_phi = Math.cos(phi),
            sin_phi = Math.sin(phi),
            lambda = (4.0 - cos_alpha) / 3.0,
            mu = sin_alpha + (cos_alpha - lambda) * cot_alpha;

        // Return rotated waypoints.
        return {
            ax: Math.cos(start).toFixed(7),
            ay: Math.sin(start).toFixed(7),
            bx: (lambda * cos_phi + mu * sin_phi).toFixed(7),
            by: (lambda * sin_phi - mu * cos_phi).toFixed(7),
            cx: (lambda * cos_phi - mu * sin_phi).toFixed(7),
            cy: (lambda * sin_phi + mu * cos_phi).toFixed(7),
            dx: Math.cos(start + size).toFixed(7),
            dy: Math.sin(start + size).toFixed(7)
        };
    }
    public arc(x: number, y: number, w: number, h: number, start: number, stop: number, mode: string, detail?: any) {
        const ctx = this.drawingContext;

        const rx = w / 2.0;
        const ry = h / 2.0;
        const epsilon = 0.00001; // Smallest visible angle on displays up to 4K.
        let arcToDraw = 0;
        const curves: any[] = [];

        x += rx;
        y += ry;

        // Create curves
        while (stop - start >= epsilon) {
            arcToDraw = Math.min(stop - start, constants.HALF_PI);
            curves.push(this._acuteArcToBezier(start, arcToDraw));
            start += arcToDraw;
        }
        // Fill curves
        if (this._doFill) {
            ctx.beginPath();
            curves.forEach(function (curve, index) {
                if (index === 0) {
                    ctx.moveTo(x + curve.ax * rx, y + curve.ay * ry);
                }
                // prettier-ignore
                ctx.bezierCurveTo(x + curve.bx * rx, y + curve.by * ry,
                    x + curve.cx * rx, y + curve.cy * ry,
                    x + curve.dx * rx, y + curve.dy * ry);
            });
            if (mode === constants.PIE || mode == null) {
                ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            this._pInst._pixelsDirty = true;
        }

        // Stroke curves
        if (this._doStroke) {
            ctx.beginPath();
            curves.forEach(function (curve, index) {
                if (index === 0) {
                    ctx.moveTo(x + curve.ax * rx, y + curve.ay * ry);
                }
                // prettier-ignore
                ctx.bezierCurveTo(x + curve.bx * rx, y + curve.by * ry,
                    x + curve.cx * rx, y + curve.cy * ry,
                    x + curve.dx * rx, y + curve.dy * ry);
            });
            if (mode === constants.PIE) {
                ctx.lineTo(x, y);
                ctx.closePath();
            } else if (mode === constants.CHORD) {
                ctx.closePath();
            }
            ctx.stroke();
            this._pInst._pixelsDirty = true;
        }
    }

    public ellipse(args) {
        const ctx = this.drawingContext;
        const doFill = this._doFill,
            doStroke = this._doStroke;
        const x = args[0],
            y = args[1],
            w = args[2],
            h = args[3];
        if (doFill && !doStroke) {
            if (this._getFill() === styleEmpty) {
                return this;
            }
        } else if (!doFill && doStroke) {
            if (this._getStroke() === styleEmpty) {
                return this;
            }
        }
        const kappa = 0.5522847498,
            // control point offset horizontal
            ox = w / 2 * kappa,
            // control point offset vertical
            oy = h / 2 * kappa,
            // x-end
            xe = x + w,
            // y-end
            ye = y + h,
            // x-middle
            xm = x + w / 2,
            ym = y + h / 2; // y-middle
        ctx.beginPath();
        ctx.moveTo(x, ym);
        ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        ctx.closePath();
        if (doFill) {
            ctx.fill();
            this._pInst._pixelsDirty = true;
        }
        if (doStroke) {
            ctx.stroke();
            this._pInst._pixelsDirty = true;
        }
    }


    public line(x1, y1, x2, y2) {
        const ctx = this.drawingContext;
        if (!this._doStroke) {
            return this;
        } else if (this._getStroke() === styleEmpty) {
            return this;
        }
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        this._pInst._pixelsDirty = true;
        return this;
    }

    public point(x, y) {
        const ctx = this.drawingContext;
        if (!this._doStroke) {
            return this;
        } else if (this._getStroke() === styleEmpty) {
            return this;
        }
        const s = this._getStroke();
        const f = this._getFill();
        x = Math.round(x);
        y = Math.round(y);
        // swapping fill color to stroke and back after for correct point rendering
        this._setFill(s);
        if (ctx.lineWidth > 1) {
            ctx.beginPath();
            ctx.arc(x, y, ctx.lineWidth / 2, 0, constants.TWO_PI, false);
            ctx.fill();
        } else {
            ctx.fillRect(x, y, 1, 1);
        }
        this._setFill(f);
        this._pInst._pixelsDirty = true;
    }

    public quad(x1, y1, x2, y2, x3, y3, x4, y4) {
        const ctx = this.drawingContext;
        const doFill = this._doFill,
            doStroke = this._doStroke;
        if (doFill && !doStroke) {
            if (this._getFill() === styleEmpty) {
                return this;
            }
        } else if (!doFill && doStroke) {
            if (this._getStroke() === styleEmpty) {
                return this;
            }
        }
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.closePath();
        if (doFill) {
            ctx.fill();
        }
        if (doStroke) {
            ctx.stroke();
        }
        this._pInst._pixelsDirty = true;
        return this;
    }

    public rect(args) {
        const x = args[0];
        const y = args[1];
        const w = args[2];
        const h = args[3];
        let tl = args[4];
        let tr = args[5];
        let br = args[6];
        let bl = args[7];
        const ctx = this.drawingContext;
        const doFill = this._doFill,
            doStroke = this._doStroke;
        if (doFill && !doStroke) {
            if (this._getFill() === styleEmpty) {
                return this;
            }
        } else if (!doFill && doStroke) {
            if (this._getStroke() === styleEmpty) {
                return this;
            }
        }
        ctx.beginPath();

        if (typeof tl === 'undefined') {
            // No rounded corners
            ctx.rect(x, y, w, h);
        } else {
            // At least one rounded corner
            // Set defaults when not specified
            if (typeof tr === 'undefined') {
                tr = tl;
            }
            if (typeof br === 'undefined') {
                br = tr;
            }
            if (typeof bl === 'undefined') {
                bl = br;
            }

            // corner rounding must always be positive
            const absW = Math.abs(w);
            const absH = Math.abs(h);
            const hw = absW / 2;
            const hh = absH / 2;

            // Clip radii
            if (absW < 2 * tl) {
                tl = hw;
            }
            if (absH < 2 * tl) {
                tl = hh;
            }
            if (absW < 2 * tr) {
                tr = hw;
            }
            if (absH < 2 * tr) {
                tr = hh;
            }
            if (absW < 2 * br) {
                br = hw;
            }
            if (absH < 2 * br) {
                br = hh;
            }
            if (absW < 2 * bl) {
                bl = hw;
            }
            if (absH < 2 * bl) {
                bl = hh;
            }

            // Draw shape
            ctx.beginPath();
            ctx.moveTo(x + tl, y);
            ctx.arcTo(x + w, y, x + w, y + h, tr);
            ctx.arcTo(x + w, y + h, x, y + h, br);
            ctx.arcTo(x, y + h, x, y, bl);
            ctx.arcTo(x, y, x + w, y, tl);
            ctx.closePath();
        }
        if (this._doFill) {
            ctx.fill();
        }
        if (this._doStroke) {
            ctx.stroke();
        }
        this._pInst._pixelsDirty = true;
        return this;
    }

    public triangle(args) {
        const ctx = this.drawingContext;
        const doFill = this._doFill,
            doStroke = this._doStroke;
        const x1 = args[0],
            y1 = args[1];
        const x2 = args[2],
            y2 = args[3];
        const x3 = args[4],
            y3 = args[5];
        if (doFill && !doStroke) {
            if (this._getFill() === styleEmpty) {
                return this;
            }
        } else if (!doFill && doStroke) {
            if (this._getStroke() === styleEmpty) {
                return this;
            }
        }
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        if (doFill) {
            ctx.fill();
            this._pInst._pixelsDirty = true;
        }
        if (doStroke) {
            ctx.stroke();
            this._pInst._pixelsDirty = true;
        }
    }


    public endShape(
        mode,
        vertices: any[][],
        isCurve,
        isBezier,
        isQuadratic,
        isContour,
        shapeKind?
    ) {
        if (vertices.length === 0) {
            return this;
        }
        if (!this._doStroke && !this._doFill) {
            return this;
        }
        const closeShape = mode === constants.CLOSE;
        let v: any;
        if (closeShape && !isContour) {
            vertices.push(vertices[0]);
        }
        let i, j;
        const numVerts = vertices.length;
        if (isCurve && (shapeKind === constants.POLYGON || shapeKind === null)) {
            if (numVerts > 3) {
                const b: any[] = [],
                    s = 1 - this._curveTightness;
                this.drawingContext.beginPath();
                this.drawingContext.moveTo(vertices[1][0], vertices[1][1]);
                for (i = 1; i + 2 < numVerts; i++) {
                    v = vertices[i];
                    b[0] = [v[0], v[1]];
                    b[1] = [
                        v[0] + (s * vertices[i + 1][0] - s * vertices[i - 1][0]) / 6,
                        v[1] + (s * vertices[i + 1][1] - s * vertices[i - 1][1]) / 6
                    ];
                    b[2] = [
                        vertices[i + 1][0] +
                        (s * vertices[i][0] - s * vertices[i + 2][0]) / 6,
                        vertices[i + 1][1] + (s * vertices[i][1] - s * vertices[i + 2][1]) / 6
                    ];
                    b[3] = [vertices[i + 1][0], vertices[i + 1][1]];
                    this.drawingContext.bezierCurveTo(
                        b[1][0],
                        b[1][1],
                        b[2][0],
                        b[2][1],
                        b[3][0],
                        b[3][1]
                    );
                }
                if (closeShape) {
                    this.drawingContext.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
                }
                this._doFillStrokeClose(closeShape);
            }
        } else if (
            isBezier &&
            (shapeKind === constants.POLYGON || shapeKind === null)
        ) {
            this.drawingContext.beginPath();
            for (i = 0; i < numVerts; i++) {
                if ((vertices[i] as any).isVert) {
                    if ((vertices[i] as any).moveTo) {
                        this.drawingContext.moveTo(vertices[i][0], vertices[i][1]);
                    } else {
                        this.drawingContext.lineTo(vertices[i][0], vertices[i][1]);
                    }
                } else {
                    this.drawingContext.bezierCurveTo(
                        vertices[i][0],
                        vertices[i][1],
                        vertices[i][2],
                        vertices[i][3],
                        vertices[i][4],
                        vertices[i][5]
                    );
                }
            }
            this._doFillStrokeClose(closeShape);
        } else if (
            isQuadratic &&
            (shapeKind === constants.POLYGON || shapeKind === null)
        ) {
            this.drawingContext.beginPath();
            for (i = 0; i < numVerts; i++) {
                if ((vertices[i] as any).isVert) {
                    if ((vertices[i] as any).moveTo) {
                        this.drawingContext.moveTo(vertices[i][0], vertices[i][1]);
                    } else {
                        this.drawingContext.lineTo(vertices[i][0], vertices[i][1]);
                    }
                } else {
                    this.drawingContext.quadraticCurveTo(
                        vertices[i][0],
                        vertices[i][1],
                        vertices[i][2],
                        vertices[i][3]
                    );
                }
            }
            this._doFillStrokeClose(closeShape);
        } else {
            if (shapeKind === constants.POINTS) {
                for (i = 0; i < numVerts; i++) {
                    v = vertices[i];
                    if (this._doStroke) {
                        this._pInst.stroke(v[6]);
                    }
                    this._pInst.point(v[0], v[1]);
                }
            } else if (shapeKind === constants.LINES) {
                for (i = 0; i + 1 < numVerts; i += 2) {
                    v = vertices[i];
                    if (this._doStroke) {
                        this._pInst.stroke(vertices[i + 1][6]);
                    }
                    this._pInst.line(v[0], v[1], vertices[i + 1][0], vertices[i + 1][1]);
                }
            } else if (shapeKind === constants.TRIANGLES) {
                for (i = 0; i + 2 < numVerts; i += 3) {
                    v = vertices[i];
                    this.drawingContext.beginPath();
                    this.drawingContext.moveTo(v[0], v[1]);
                    this.drawingContext.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
                    this.drawingContext.lineTo(vertices[i + 2][0], vertices[i + 2][1]);
                    this.drawingContext.closePath();
                    if (this._doFill) {
                        this._pInst.fill(vertices[i + 2][5]);
                        this.drawingContext.fill();
                    }
                    if (this._doStroke) {
                        this._pInst.stroke(vertices[i + 2][6]);
                        this.drawingContext.stroke();
                    }
                }
            } else if (shapeKind === constants.TRIANGLE_STRIP) {
                for (i = 0; i + 1 < numVerts; i++) {
                    v = vertices[i];
                    this.drawingContext.beginPath();
                    this.drawingContext.moveTo(vertices[i + 1][0], vertices[i + 1][1]);
                    this.drawingContext.lineTo(v[0], v[1]);
                    if (this._doStroke) {
                        this._pInst.stroke(vertices[i + 1][6]);
                    }
                    if (this._doFill) {
                        this._pInst.fill(vertices[i + 1][5]);
                    }
                    if (i + 2 < numVerts) {
                        this.drawingContext.lineTo(vertices[i + 2][0], vertices[i + 2][1]);
                        if (this._doStroke) {
                            this._pInst.stroke(vertices[i + 2][6]);
                        }
                        if (this._doFill) {
                            this._pInst.fill(vertices[i + 2][5]);
                        }
                    }
                    this._doFillStrokeClose(closeShape);
                }
            } else if (shapeKind === constants.TRIANGLE_FAN) {
                if (numVerts > 2) {
                    // For performance reasons, try to batch as many of the
                    // fill and stroke calls as possible.
                    this.drawingContext.beginPath();
                    for (i = 2; i < numVerts; i++) {
                        v = vertices[i];
                        this.drawingContext.moveTo(vertices[0][0], vertices[0][1]);
                        this.drawingContext.lineTo(vertices[i - 1][0], vertices[i - 1][1]);
                        this.drawingContext.lineTo(v[0], v[1]);
                        this.drawingContext.lineTo(vertices[0][0], vertices[0][1]);
                        // If the next colour is going to be different, stroke / fill now
                        if (i < numVerts - 1) {
                            if (
                                (this._doFill && v[5] !== vertices[i + 1][5]) ||
                                (this._doStroke && v[6] !== vertices[i + 1][6])
                            ) {
                                if (this._doFill) {
                                    this._pInst.fill(v[5]);
                                    this.drawingContext.fill();
                                    this._pInst.fill(vertices[i + 1][5]);
                                }
                                if (this._doStroke) {
                                    this._pInst.stroke(v[6]);
                                    this.drawingContext.stroke();
                                    this._pInst.stroke(vertices[i + 1][6]);
                                }
                                this.drawingContext.closePath();
                                this.drawingContext.beginPath(); // Begin the next one
                            }
                        }
                    }
                    this._doFillStrokeClose(closeShape);
                }
            } else if (shapeKind === constants.QUADS) {
                for (i = 0; i + 3 < numVerts; i += 4) {
                    v = vertices[i];
                    this.drawingContext.beginPath();
                    this.drawingContext.moveTo(v[0], v[1]);
                    for (j = 1; j < 4; j++) {
                        this.drawingContext.lineTo(vertices[i + j][0], vertices[i + j][1]);
                    }
                    this.drawingContext.lineTo(v[0], v[1]);
                    if (this._doFill) {
                        this._pInst.fill(vertices[i + 3][5]);
                    }
                    if (this._doStroke) {
                        this._pInst.stroke(vertices[i + 3][6]);
                    }
                    this._doFillStrokeClose(closeShape);
                }
            } else if (shapeKind === constants.QUAD_STRIP) {
                if (numVerts > 3) {
                    for (i = 0; i + 1 < numVerts; i += 2) {
                        v = vertices[i];
                        this.drawingContext.beginPath();
                        if (i + 3 < numVerts) {
                            this.drawingContext.moveTo(vertices[i + 2][0], vertices[i + 2][1]);
                            this.drawingContext.lineTo(v[0], v[1]);
                            this.drawingContext.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
                            this.drawingContext.lineTo(vertices[i + 3][0], vertices[i + 3][1]);
                            if (this._doFill) {
                                this._pInst.fill(vertices[i + 3][5]);
                            }
                            if (this._doStroke) {
                                this._pInst.stroke(vertices[i + 3][6]);
                            }
                        } else {
                            this.drawingContext.moveTo(v[0], v[1]);
                            this.drawingContext.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
                        }
                        this._doFillStrokeClose(closeShape);
                    }
                }
            } else {
                this.drawingContext.beginPath();
                this.drawingContext.moveTo(vertices[0][0], vertices[0][1]);
                for (i = 1; i < numVerts; i++) {
                    v = vertices[i];
                    if (v.isVert) {
                        if (v.moveTo) {
                            this.drawingContext.moveTo(v[0], v[1]);
                        } else {
                            this.drawingContext.lineTo(v[0], v[1]);
                        }
                    }
                }
                this._doFillStrokeClose(closeShape);
            }
        }
        isCurve = false;
        isBezier = false;
        isQuadratic = false;
        isContour = false;
        if (closeShape) {
            vertices.pop();
        }

        this._pInst._pixelsDirty = true;
        return this;
    }


    public strokeCap(cap) {
        if (
            cap === constants.ROUND ||
            cap === constants.SQUARE ||
            cap === constants.PROJECT
        ) {
            this.drawingContext.lineCap = cap;
        }
        return this;
    }

    public strokeJoin(join) {
        if (
            join === constants.ROUND ||
            join === constants.BEVEL ||
            join === constants.MITER
        ) {
            this.drawingContext.lineJoin = join;
        }
        return this;
    }

    public strokeWeight(w) {
        if (typeof w === 'undefined' || w === 0) {
            // hack because lineWidth 0 doesn't work
            this.drawingContext.lineWidth = 0.0001;
        } else {
            this.drawingContext.lineWidth = w;
        }
        return this;
    }

    public _getFill() {
        if (!this._cachedFillStyle) {
            this._cachedFillStyle = this.drawingContext.fillStyle;
        }
        return this._cachedFillStyle;
    }

    public _setFill(fillStyle, force: boolean = false) {
        if (fillStyle !== this._cachedFillStyle || force) {
            this.drawingContext.fillStyle = fillStyle;
            this._cachedFillStyle = fillStyle;
        }
    }

    public _getStroke() {
        if (!this._cachedStrokeStyle) {
            this._cachedStrokeStyle = this.drawingContext.strokeStyle;
        }
        return this._cachedStrokeStyle;
    }

    public _setStroke(strokeStyle, force: boolean = false) {
        if (strokeStyle !== this._cachedStrokeStyle || force) {
            this.drawingContext.strokeStyle = strokeStyle;
            this._cachedStrokeStyle = strokeStyle;
        }
    }

    //////////////////////////////////////////////
    // SHAPE | Curves
    //////////////////////////////////////////////
    public bezier(x1, y1, x2, y2, x3, y3, x4, y4) {
        this._pInst.beginShape();
        this._pInst.vertex(x1, y1);
        this._pInst.bezierVertex(x2, y2, x3, y3, x4, y4);
        this._pInst.endShape();
        return this;
    }

    public curve(x1, y1, x2, y2, x3, y3, x4, y4) {
        this._pInst.beginShape();
        this._pInst.curveVertex(x1, y1);
        this._pInst.curveVertex(x2, y2);
        this._pInst.curveVertex(x3, y3);
        this._pInst.curveVertex(x4, y4);
        this._pInst.endShape();
        return this;
    }


    //////////////////////////////////////////////
    // SHAPE | Vertex
    //////////////////////////////////////////////

    private _doFillStrokeClose(closeShape) {
        if (closeShape) {
            this.drawingContext.closePath();
        }
        if (this._doFill) {
            this.drawingContext.fill();
        }
        if (this._doStroke) {
            this.drawingContext.stroke();
        }

        this._pInst._pixelsDirty = true;
    }

    //////////////////////////////////////////////
    // TRANSFORM
    //////////////////////////////////////////////

    public applyMatrix(a, b, c, d, e, f) {
        this.drawingContext.transform(a, b, c, d, e, f);
    }

    public resetMatrix() {
        this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
        this.drawingContext.scale(
            this._pInst._pixelDensity,
            this._pInst._pixelDensity
        );
        return this;
    }

    public rotate(rad, axis?) {
        this.drawingContext.rotate(rad);
    }

    public scale(x, y) {
        this.drawingContext.scale(x, y);
        return this;
    }

    public translate(x, y?) {
        // support passing a vector as the 1st parameter
        if (x instanceof Vector) {
            y = x.y;
            x = x.x;
        }
        this.drawingContext.translate(x, y);
        return this;
    }


    private _text(str, x, y, maxWidth, maxHeight) {
        const p: any = this._pInst;
        let cars;
        let n;
        let ii;
        let jj;
        let line;
        let testLine;
        let testWidth;
        let words;
        let totalHeight;
        let finalMaxHeight = Number.MAX_VALUE;

        if (!(this._doFill || this._doStroke)) {
            return;
        }

        if (typeof str === 'undefined') {
            return;
        } else if (typeof str !== 'string') {
            str = str.toString();
        }

        str = str.replace(/(\t)/g, '  ');
        cars = str.split('\n');

        if (typeof maxWidth !== 'undefined') {
            totalHeight = 0;
            for (ii = 0; ii < cars.length; ii++) {
                line = '';
                words = cars[ii].split(' ');
                for (n = 0; n < words.length; n++) {
                    testLine = `${line + words[n]} `;
                    testWidth = this.textWidth(testLine);
                    if (testWidth > maxWidth) {
                        line = `${words[n]} `;
                        totalHeight += p.textLeading();
                    } else {
                        line = testLine;
                    }
                }
            }

            if (this._rectMode === constants.CENTER) {
                x -= maxWidth / 2;
                y -= maxHeight / 2;
            }

            switch (this._textAlign) {
                case constants.CENTER:
                    x += maxWidth / 2;
                    break;
                case constants.RIGHT:
                    x += maxWidth;
                    break;
            }

            let baselineHacked = false;
            if (typeof maxHeight !== 'undefined') {
                switch (this._textBaseline) {
                    case constants.BOTTOM:
                        y += maxHeight - totalHeight;
                        break;
                    case constants.CENTER:
                        y += (maxHeight - totalHeight) / 2;
                        break;
                    case constants.BASELINE:
                        baselineHacked = true;
                        this._textBaseline = constants.TOP;
                        break;
                }

                // remember the max-allowed y-position for any line (fix to #928)
                finalMaxHeight = y + maxHeight - p.textAscent();
            }

            for (ii = 0; ii < cars.length; ii++) {
                line = '';
                words = cars[ii].split(' ');
                for (n = 0; n < words.length; n++) {
                    testLine = `${line + words[n]} `;
                    testWidth = this.textWidth(testLine);
                    if (testWidth > maxWidth && line.length > 0) {
                        this._renderText(p, line, x, y, finalMaxHeight);
                        line = `${words[n]} `;
                        y += p.textLeading();
                    } else {
                        line = testLine;
                    }
                }

                this._renderText(p, line, x, y, finalMaxHeight);
                y += p.textLeading();

                if (baselineHacked) {
                    this._textBaseline = constants.BASELINE;
                }
            }
        } else {
            // Offset to account for vertically centering multiple lines of text - no
            // need to adjust anything for vertical align top or baseline
            let offset = 0;

            const vAlign = p.textAlign().vertical;
            if (vAlign === constants.CENTER) {
                offset = (cars.length - 1) * p.textLeading() / 2;
            } else if (vAlign === constants.BOTTOM) {
                offset = (cars.length - 1) * p.textLeading();
            }

            for (jj = 0; jj < cars.length; jj++) {
                this._renderText(p, cars[jj], x, y - offset, finalMaxHeight);
                y += p.textLeading();
            }
        }

        return p;
    }
    public text(str, x, y, maxWidth, maxHeight) {
        let baselineHacked;

        // baselineHacked: (HACK)
        // A temporary fix to conform to Processing's implementation
        // of BASELINE vertical alignment in a bounding box

        if (typeof maxWidth !== 'undefined') {
            if (this.drawingContext.textBaseline === constants.BASELINE) {
                baselineHacked = true;
                this.drawingContext.textBaseline = <any>constants.TOP;
            }
        }

        const p = this._text(str, x, y, maxWidth, maxHeight);

        if (baselineHacked) {
            this.drawingContext.textBaseline = <any>constants.BASELINE;
        }

        return p;
    }

    private _renderText(p, line, x, y, maxY) {
        if (y >= maxY) {
            return; // don't render lines beyond our maxY position
        }

        p.push(); // fix to #803

        if (!this._isOpenType()) {
            // a system/browser font

            // no stroke unless specified by user
            if (this._doStroke && this._strokeSet) {
                this.drawingContext.strokeText(line, x, y);
            }

            if (this._doFill) {
                // if fill hasn't been set by user, use default text fill
                if (!this._fillSet) {
                    this._setFill(constants._DEFAULT_TEXT_FILL);
                }

                this.drawingContext.fillText(line, x, y);
            }
        } else {
            // an opentype font, let it handle the rendering

            (<any>this._textFont)._renderPath(line, x, y, { renderer: this });
        }

        p.pop();

        this._pInst._pixelsDirty = true;
        return p;
    }


    public textLeading(l) {
        if (typeof l === 'number') {
            this._textLeading = l;
            // return this._pInst;
        }

        return this._textLeading;
    }

    public textSize(s) {
        if (typeof s === 'number') {
            this._textSize = s;
            this._textLeading = s * constants._DEFAULT_LEADMULT;
            this._applyTextProperties();
        }

        return this._textSize;
    }

    public textStyle(s) {
        if (s) {
            if (
                s === constants.NORMAL ||
                s === constants.ITALIC ||
                s === constants.BOLD ||
                s === constants.BOLDITALIC
            ) {
                this._textStyle = s;
            }

            return this._applyTextProperties();
        }

        return this._textStyle;
    }

    public textAscent() {
        if (this._textAscent === null) {
            this._updateTextMetrics();
        }
        return this._textAscent;
    }

    /**
     * Helper fxn to check font type (system or otf)
     */
    private _isOpenType(f: any = this._textFont) {
        return typeof f === 'object' && f.font && f.font.supported;
    }

    public _updateTextMetrics() {
        if (this._isOpenType()) {
            this._textAscent = (<any>this._textFont)._textAscent();
            this._textDescent = (<any>this._textFont)._textDescent();
            return this;
        }

        // Adapted from http://stackoverflow.com/a/25355178
        const text = document.createElement('span');
        text.style.fontFamily = this._textFont;
        text.style.fontSize = `${this._textSize}px`;
        text.innerHTML = 'ABCjgq|';

        const block = document.createElement('div');
        block.style.display = 'inline-block';
        block.style.width = '1px';
        block.style.height = '0px';

        const container = document.createElement('div');
        container.appendChild(text);
        container.appendChild(block);

        container.style.height = '0px';
        container.style.overflow = 'hidden';
        document.body.appendChild(container);

        block.style.verticalAlign = 'baseline';
        let blockOffset = this._calculateOffset(block);
        let textOffset = this._calculateOffset(text);
        const ascent = blockOffset[1] - textOffset[1];

        block.style.verticalAlign = 'bottom';
        blockOffset = this._calculateOffset(block);
        textOffset = this._calculateOffset(text);
        const height = blockOffset[1] - textOffset[1];
        const descent = height - ascent;

        document.body.removeChild(container);

        this._textAscent = ascent;
        this._textDescent = descent;

        return this;
    }
    private _calculateOffset(object) {
        let currentLeft = 0,
            currentTop = 0;
        if (object.offsetParent) {
            do {
                currentLeft += object.offsetLeft;
                currentTop += object.offsetTop;
            } while ((object = object.offsetParent));
        } else {
            currentLeft += object.offsetLeft;
            currentTop += object.offsetTop;
        }
        return [currentLeft, currentTop];
    }

    public textDescent() {
        if (this._textDescent === null) {
            this._updateTextMetrics();
        }
        return this._textDescent;
    }

    public textAlign(h, v) {
        if (typeof h !== 'undefined') {
            this._textAlign = h;

            if (typeof v !== 'undefined') {
                this._textBaseline = v;
            }

            this._applyTextProperties();
        } else {
            return {
                horizontal: this._textAlign,
                vertical: this._textBaseline
            };
        }
    }

    public textWidth(s: string) {
        if (this._isOpenType()) {
            return (<any>this._textFont)._textWidth(s, this._textSize);
        }

        return this.drawingContext.measureText(s).width;
    }

    public _applyTextProperties() {
        let font;
        const p = this._pInst;

        this._textAscent = null;
        this._textDescent = null;

        font = this._textFont;

        if (this._isOpenType()) {
            font = (<any>this._textFont).font.familyName;
            this._textStyle = (<any>this._textFont).font.styleName;
        }

        this.drawingContext.font = `${this._textStyle || 'normal'} ${this._textSize ||
            12}px ${font || 'sans-serif'}`;

        this.drawingContext.textAlign = <any>this._textAlign;
        if (this._textBaseline === constants.CENTER) {
            this.drawingContext.textBaseline = <any>constants._CTX_MIDDLE;
        } else {
            this.drawingContext.textBaseline = <any>this._textBaseline;
        }

        return p;
    }

    //////////////////////////////////////////////
    // STRUCTURE
    //////////////////////////////////////////////

    // a push() operation is in progress.
    // the renderer should return a 'style' object that it wishes to
    // store on the push stack.
    // derived renderers should call the base class' push() method
    // to fetch the base style object.
    public push() {
        this.drawingContext.save();

        // get the base renderer style
        return {
            properties: {
                _doStroke: this._doStroke,
                _strokeSet: this._strokeSet,
                _doFill: this._doFill,
                _fillSet: this._fillSet,
                _tint: this._tint,
                _imageMode: this._imageMode,
                _rectMode: this._rectMode,
                _ellipseMode: this._ellipseMode,
                _textFont: this._textFont,
                _textLeading: this._textLeading,
                _textSize: this._textSize,
                _textAlign: this._textAlign,
                _textBaseline: this._textBaseline,
                _textStyle: this._textStyle
            }
        };
    }

    // a pop() operation is in progress
    // the renderer is passed the 'style' object that it returned
    // from its push() method.
    // derived renderers should pass this object to their base
    // class' pop method
    public pop(style) {
        this.drawingContext.restore();
        // Re-cache the fill / stroke state
        this._cachedFillStyle = this.drawingContext.fillStyle;
        this._cachedStrokeStyle = this.drawingContext.strokeStyle;

        if (style.properties) {
            // copy the style properties back into the renderer
            Object.assign(this, style.properties);
        }
    }


    public get(x, y, w, h) {
        const pd = this._pInst._pixelDensity;
        const canvas = this.drawingContext.canvas;

        if (typeof x === 'undefined' && typeof y === 'undefined') {
            // get()
            x = y = 0;
            w = this._pInst.width;
            h = this._pInst.height;
        } else {
            x *= pd;
            y *= pd;

            if (typeof w === 'undefined' && typeof h === 'undefined') {
                // get(x,y)
                if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
                    return [0, 0, 0, 0];
                }

                return this._getPixel(x, y);
            }
            // get(x,y,w,h)
        }

        const region: any = new SketchImage(w, h);
        region.canvas.getContext('2d').drawImage(canvas, x, y, w * pd, h * pd, 0, 0, w, h);

        return region;
    }

    public resize(w: number, h: number): void {
        const canvas = this._pInst.getCanvas();
        canvas.width = w * this._pInst._pixelDensity;
        canvas.height = h * this._pInst._pixelDensity;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        this._pInst.width = w;
        this._pInst.height = h;
    }
}