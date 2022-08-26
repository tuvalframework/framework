import { CGRectangle, CGColor, CGContext2D, CoreGraphicTypes } from '@tuval/cg';
import { DraggablePoint } from './../../UI/DraggablePoint';
import { CanvasGraphics, Graphics, GraphicsBase, TextMetricsEx } from "../Graphics";
import { SketchCanvasRenderer2D } from "./SketchCanvasRenderer2D";
import { constants } from "./core/Constanst";
import { SketchImage } from "./image/SketchImage";
import { Filters } from "./image/filters";
import { int, byte, is, TMath, ArgumentException } from "@tuval/core";
import { Vector } from "./math/Vector";
import { SketchFont } from "./typography/SketchFont";
import { SolidBrush } from "../SolidBrush";
import { Pen } from "../Pen";
import { GraphicTypes } from '../../GDITypes';
import { Font } from '../Font';

function modeAdjust(a, b, c, d, mode) {
    if (mode === constants.CORNER) {
        return { x: a, y: b, w: c, h: d };
    } else if (mode === constants.CORNERS) {
        return { x: a, y: b, w: c - a, h: d - b };
    } else if (mode === constants.RADIUS) {
        return { x: a - c, y: b - d, w: 2 * c, h: 2 * d };
    } else if (mode === constants.CENTER) {
        return { x: a - c * 0.5, y: b - d * 0.5, w: c, h: d };
    }
}


const randomStateProp = '_lcg_random_state';
// Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
// m is basically chosen to be large (as it is the max period)
// and for its relationships to a and c
const m = 4294967296;
// a - 1 should be divisible by m's prime factors
const a = 1664525;
// c and m should be co-prime
const c = 1013904223;
let y2 = 0;


let shapeKind = null;
let vertices: any[] = [];
let contourVertices: any[] = [];
let isBezier = false;
let isCurve = false;
let isQuadratic = false;
let isContour = false;
let isFirstContour = true;

const PERLIN_YWRAPB = 4;
const PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
const PERLIN_ZWRAPB = 8;
const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
const PERLIN_SIZE = 4095;

let perlin_octaves = 4; // default to medium smooth
let perlin_amp_falloff = 0.5; // 50% reduction/octave

const scaled_cosine = i => 0.5 * (1.0 - Math.cos(i * Math.PI));

let perlin; // will be initialized lazily by noise() or noiseSeed()


function getWindowWidth() {
    return (
        window.innerWidth ||
        (document.documentElement && document.documentElement.clientWidth) ||
        (document.body && document.body.clientWidth) ||
        0
    );
}

function getWindowHeight() {
    return (
        window.innerHeight ||
        (document.documentElement && document.documentElement.clientHeight) ||
        (document.body && document.body.clientHeight) ||
        0
    );
}

export class SketchGraphics extends CanvasGraphics<SketchCanvasRenderer2D> {

    public _collideDebug: boolean = false;
    public _pixelsDirty: boolean = true;
    public antialias: boolean = false;
    public _bezierDetail: any;
    public _curveDetail: any;
    public _contourInited: boolean = false;
    public _contourVertices: any[] = [];
    public _pixelDensity: number = is.workerContext() ? 1 : Math.ceil(window.devicePixelRatio) || 1;
    public _gaussian_previous: boolean = false;
    public _colorMode: string = constants.RGB;
    public _angleMode: string = constants.RADIANS;
    public _colorMaxes = {
        rgb: [255, 255, 255, 255],
        hsb: [360, 100, 100, 1],
        hsl: [360, 100, 100, 1]
    };

    private _styles: any[] = [];

    public pixels: Uint8ClampedArray = undefined as any;
    public imageData: ImageData = undefined as any;

    private _hasMouseInteracted: boolean = false;
    public mouseX: number = 0;
    public mouseY: number = 0;
    public pmouseX: number = 0;
    public pmouseY: number = 0;
    public winMouseX: number = 0;
    public winMouseY: number = 0;
    public pwinMouseX: number = 0;
    public pwinMouseY: number = 0;
    public movedX: number = 0;
    public movedY: number = 0;
    public mouseButton: string = undefined as any;
    public mouseIsPressed: boolean = false;

    private _mouseWheelDeltaY: number = 0;
    private _pmouseWheelDeltaY: number = 0;

    public mouseMoved: Function = undefined as any;
    public mouseDragged: Function = undefined as any;
    public touchMoved: Function = undefined as any;
    public mousePressed: Function = undefined as any;
    public touchStarted: Function = undefined as any;
    public mouseReleased: Function = undefined as any;
    public touchEnded: Function = undefined as any;
    public mouseClicked: Function = undefined as any;
    public doubleClicked: Function = undefined as any;
    public mouseWheel: Function = undefined as any;
    public windowResized: Function = undefined as any;

    public isKeyPressed: boolean = false;
    public keyIsPressed: boolean = false;
    public key: string = '';
    public keyCode: number = 0;
    private _downKeys: any = {};
    private _lastKeyCodeTyped: number = 0;

    public keyPressed: Function = undefined as any;
    public keyReleased: Function = undefined as any;
    public keyTyped: Function = undefined as any;

    public get windowWidth(): number {
        return getWindowWidth();
    }

    public get windowHeight(): number {
        return getWindowHeight();
    }
    public provideRenderer2D():SketchCanvasRenderer2D;
    public provideRenderer2D(canvasContext: CanvasRenderingContext2D): SketchCanvasRenderer2D;
    public provideRenderer2D(...args:any[]): SketchCanvasRenderer2D {
        if (args.length === 1) {
            const canvasContext:CanvasRenderingContext2D = args[0];
            return new SketchCanvasRenderer2D(canvasContext, this);
        } else {
            throw new ArgumentException('');
        }

    }
    /*   public provideRenderer3D(canvasContext: CanvasRenderingContext2D): SketchCanvasRenderer2D {
          return new WebGLRenderer(canvasContext, this);
      } */

    public init(): void {
        this.renderer._applyDefaults();
        //const _elt = this.renderer.drawingContext.canvas;
        if (!is.workerContext()) {
            window.addEventListener('mousemove', this._onmousemove.bind(this), { passive: false });
            window.addEventListener('mousedown', this._onmousedown.bind(this), { passive: false });
            window.addEventListener('mouseup', this._onmouseup.bind(this), { passive: false });
            window.addEventListener('dragend', this._ondragend.bind(this), { passive: false });
            window.addEventListener('dragover', this._ondragover.bind(this), { passive: false });
            window.addEventListener('click', this._onclick.bind(this), { passive: false });
            window.addEventListener('dblclick', this._ondblclick.bind(this), { passive: false });
            //window.addEventListener('mouseover', this._onmou.bind(this), { passive: false });
            //window.addEventListener('mouseout', this._onmou.bind(this), { passive: false });
            window.addEventListener('keydown', this._onkeydown.bind(this), { passive: false });
            window.addEventListener('keyup', this._onkeyup.bind(this), { passive: false });
            window.addEventListener('keypress', this._onkeypress.bind(this), { passive: false });
            window.addEventListener('resize', this._onresize.bind(this), { passive: false });
        }
    }


    private _normalizeArcAngles(start, stop, width, height, correctForScaling) {
        const epsilon = 0.00001; // Smallest visible angle on displays up to 4K.
        let separation;

        // The order of the steps is important here: each one builds upon the
        // adjustments made in the steps that precede it.

        // Constrain both start and stop to [0,TWO_PI).
        start = start - constants.TWO_PI * Math.floor(start / constants.TWO_PI);
        stop = stop - constants.TWO_PI * Math.floor(stop / constants.TWO_PI);

        // Get the angular separation between the requested start and stop points.
        //
        // Technically this separation only matches what gets drawn if
        // correctForScaling is enabled.  We could add a more complicated calculation
        // for when the scaling is uncorrected (in which case the drawn points could
        // end up pushed together or pulled apart quite dramatically relative to what
        // was requested), but it would make things more opaque for little practical
        // benefit.
        //
        // (If you do disable correctForScaling and find that correspondToSamePoint
        // is set too aggressively, the easiest thing to do is probably to just make
        // epsilon smaller...)
        separation = Math.min(
            Math.abs(start - stop),
            constants.TWO_PI - Math.abs(start - stop)
        );

        // Optionally adjust the angles to counter linear scaling.
        if (correctForScaling) {
            if (start <= constants.HALF_PI) {
                start = Math.atan(width / height * Math.tan(start));
            } else if (start > constants.HALF_PI && start <= 3 * constants.HALF_PI) {
                start = Math.atan(width / height * Math.tan(start)) + constants.PI;
            } else {
                start = Math.atan(width / height * Math.tan(start)) + constants.TWO_PI;
            }
            if (stop <= constants.HALF_PI) {
                stop = Math.atan(width / height * Math.tan(stop));
            } else if (stop > constants.HALF_PI && stop <= 3 * constants.HALF_PI) {
                stop = Math.atan(width / height * Math.tan(stop)) + constants.PI;
            } else {
                stop = Math.atan(width / height * Math.tan(stop)) + constants.TWO_PI;
            }
        }

        // Ensure that start <= stop < start + TWO_PI.
        if (start > stop) {
            stop += constants.TWO_PI;
        }

        return {
            start,
            stop,
            correspondToSamePoint: separation < epsilon
        };
    }

    public arc(x: number, y: number, w: number, h: number, start: number, stop: number, mode?: string, detail?: number): void {
        // if the current stroke and fill settings wouldn't result in something
        // visible, exit immediately
        if (!this.renderer._doStroke && !this.renderer._doFill) {
            return;
        }

        start = this._toRadians(start);
        stop = this._toRadians(stop);

        // p5 supports negative width and heights for ellipses
        w = Math.abs(w);
        h = Math.abs(h);

        const vals: any = modeAdjust(x, y, w, h, this.renderer._ellipseMode);
        const angles = this._normalizeArcAngles(start, stop, vals.w, vals.h, true);

        if (angles.correspondToSamePoint) {
            // If the arc starts and ends at (near enough) the same place, we choose to
            // draw an ellipse instead.  This is preferable to faking an ellipse (by
            // making stop ever-so-slightly less than start + TWO_PI) because the ends
            // join up to each other rather than at a vertex at the centre (leaving
            // an unwanted spike in the stroke/fill).
            this.renderer.ellipse([vals.x, vals.y, vals.w, vals.h, detail]);
        } else {
            this.renderer.arc(
                vals.x,
                vals.y,
                vals.w,
                vals.h,
                angles.start, // [0, TWO_PI)
                angles.stop, // [start, start + TWO_PI)
                mode as any,
                detail
            );
        }

    }

    public ellipse(x, y, w, h, detailX?) {

        // if the current stroke and fill settings wouldn't result in something
        // visible, exit immediately
        if (!this.renderer._doStroke && !this.renderer._doFill) {
            return this;
        }

        // supports negative width and heights for rects
        if (w < 0) {
            w = Math.abs(w);
        }

        if (typeof h === 'undefined') {
            // Duplicate 3rd argument if only 3 given.
            h = w;
        } else if (h < 0) {
            h = Math.abs(h);
        }

        const vals: any = modeAdjust(x, y, w, h, this.renderer._ellipseMode);
        this.renderer.ellipse([vals.x, vals.y, vals.w, vals.h, detailX]);

        return this;
    }

    public circle(x: number, y: number, d: number): void {
        const args = Array.prototype.slice.call(arguments, 0, 2);
        args.push(arguments[2]);
        args.push(arguments[2]);
        return (this.ellipse as any).apply(this, args);
    }

    public line(...args: any[]) {
        if (this.renderer._doStroke) {
            this.renderer.line.apply(this.renderer, args as any);
        }

        return this;
    }

    public point(...args: any[]) {

        if (this.renderer._doStroke) {
            this.renderer.point.apply(this.renderer, args as any);
        }

        return this;
    }

    public quad(...args: any[]) {

        if (this.renderer._doStroke || this.renderer._doFill) {
            if (this.renderer.isP3D && args.length !== 12) {
                // if 3D and we weren't passed 12 args, assume Z is 0
                // prettier-ignore
                (this.renderer.quad as any).call(
                    this.renderer,
                    args[0], args[1], 0,
                    args[2], args[3], 0,
                    args[4], args[5], 0,
                    args[6], args[7], 0);
            } else {
                this.renderer.quad.apply(this.renderer, args as any);
            }
        }

        return this;
    }
    public rect(rect: CGRectangle): void;
    public rect(x: int, y: int, w: int, h: int, tl?: int, tr?: int, br?: int, bl?: int): void;
    public rect(...args: any[]) {
        if (args.length === 1) {
            const rect: CGRectangle = args[0];
            this.rect(rect.X, rect.Y, rect.Width, rect.Height);
        } else {
            if (this.renderer._doStroke || this.renderer._doFill) {
                const vals: any = modeAdjust(
                    arguments[0],
                    arguments[1],
                    arguments[2],
                    arguments[3],
                    this.renderer._rectMode
                );
                const args = [vals.x, vals.y, vals.w, vals.h];
                // append the additional arguments (either cornder radii, or
                // segment details) to the argument list
                for (let i = 4; i < arguments.length; i++) {
                    args[i] = arguments[i];
                }
                this.renderer.rect(args);
            }
        }

    }

    public square(x, y, s, tl, tr, br, bl) {
        return this.rect(x, y, s, s, tl, tr, br, bl);
    }

    public triangle(...args: any[]) {

        if (this.renderer._doStroke || this.renderer._doFill) {
            this.renderer.triangle(args);
        }
        return this;
    }

    public ellipseMode(m: string) {
        if (
            m === constants.CORNER ||
            m === constants.CORNERS ||
            m === constants.RADIUS ||
            m === constants.CENTER
        ) {
            this.renderer._ellipseMode = m;
        }
        return this;
    }

    public noSmooth() {
        this.antialias = false;
        if (!this.renderer.isP3D) {
            if ('imageSmoothingEnabled' in this.renderer.drawingContext) {
                this.renderer.drawingContext.imageSmoothingEnabled = false;
            }
        }
        return this;
    }

    public rectMode(m) {
        if (
            m === constants.CORNER ||
            m === constants.CORNERS ||
            m === constants.RADIUS ||
            m === constants.CENTER
        ) {
            this.renderer._rectMode = m;
        }
        return this;
    }

    public smooth() {
        this.antialias = true;
        if (!this.renderer.isP3D) {
            if ('imageSmoothingEnabled' in this.renderer.drawingContext) {
                this.renderer.drawingContext.imageSmoothingEnabled = true;
            }
        }
        return this;
    }
    public strokeCap(cap) {
        if (
            cap === constants.ROUND ||
            cap === constants.SQUARE ||
            cap === constants.PROJECT
        ) {
            this.renderer.strokeCap(cap);
        }
        return this;
    }
    public strokeJoin(join) {
        if (
            join === constants.ROUND ||
            join === constants.BEVEL ||
            join === constants.MITER
        ) {
            this.renderer.strokeJoin(join);
        }
        return this;
    }
    public strokeWeight(w) {
        this.renderer.strokeWeight(w);
        return this;
    }

    public bezier(...args: any[]) {
        if (!this.renderer._doStroke && !this.renderer._doFill) {
            return this;
        }
        this.renderer.bezier.apply(this.renderer, args as any);
        return this;
    }

    public bezierDetail(d) {
        this._bezierDetail = d;
        return this;
    }

    public bezierPoint(a, b, c, d, t) {
        const adjustedT = 1 - t;
        return (
            Math.pow(adjustedT, 3) * a +
            3 * Math.pow(adjustedT, 2) * t * b +
            3 * adjustedT * Math.pow(t, 2) * c +
            Math.pow(t, 3) * d
        );
    }

    public bezierTangent(a, b, c, d, t) {

        const adjustedT = 1 - t;
        return (
            3 * d * Math.pow(t, 2) -
            3 * c * Math.pow(t, 2) +
            6 * c * adjustedT * t -
            6 * b * adjustedT * t +
            3 * b * Math.pow(adjustedT, 2) -
            3 * a * Math.pow(adjustedT, 2)
        );
    }

    public curve(...args: any[]) {
        if (this.renderer._doStroke) {
            this.renderer.curve.apply(this.renderer, args as any);
        }

        return this;
    }

    public curveDetail(d) {
        if (d < 3) {
            this._curveDetail = 3;
        } else {
            this._curveDetail = d;
        }
        return this;
    }

    public curveTightness(t) {
        this.renderer._curveTightness = t;
        return this;
    }

    public curvePoint(a, b, c, d, t) {

        const t3 = t * t * t,
            t2 = t * t,
            f1 = -0.5 * t3 + t2 - 0.5 * t,
            f2 = 1.5 * t3 - 2.5 * t2 + 1.0,
            f3 = -1.5 * t3 + 2.0 * t2 + 0.5 * t,
            f4 = 0.5 * t3 - 0.5 * t2;
        return a * f1 + b * f2 + c * f3 + d * f4;
    }

    public curveTangent(a, b, c, d, t) {

        const t2 = t * t,
            f1 = -3 * t2 / 2 + 2 * t - 0.5,
            f2 = 9 * t2 / 2 - 5 * t,
            f3 = -9 * t2 / 2 + 4 * t + 0.5,
            f4 = 3 * t2 / 2 - t;
        return a * f1 + b * f2 + c * f3 + d * f4;
    }

    public beginContour() {
        contourVertices = [];
        isContour = true;
        return this;
    }

    public beginShape(kind?) {
        if (this.renderer.isP3D) {
            (<any>this.renderer).beginShape(kind);
        } else {
            if (
                kind === constants.POINTS ||
                kind === constants.LINES ||
                kind === constants.TRIANGLES ||
                kind === constants.TRIANGLE_FAN ||
                kind === constants.TRIANGLE_STRIP ||
                kind === constants.QUADS ||
                kind === constants.QUAD_STRIP
            ) {
                shapeKind = kind;
            } else {
                shapeKind = null;
            }

            vertices = [];
            contourVertices = [];
        }
        return this;
    }

    public bezierVertex(...args: any[]) {
        if (this.renderer.isP3D) {
            (<any>this.renderer).bezierVertex(...args);
        } else {
            if (vertices.length === 0) {
                console.error(
                    'vertex() must be used once before calling bezierVertex()',
                    'bezierVertex'
                );
            } else {
                isBezier = true;
                const vert: any[] = [];
                for (let i = 0; i < args.length; i++) {
                    vert[i] = args[i];
                }
                (<any>vert).isVert = false;
                if (isContour) {
                    contourVertices.push(vert);
                } else {
                    vertices.push(vert);
                }
            }
        }
        return this;
    }

    public curveVertex(...args: any[]) {
        if (this.renderer.isP3D) {
            (<any>this.renderer).curveVertex(...args);
        } else {
            isCurve = true;
            this.vertex(args[0], args[1]);
        }
        return this;
    }

    public endContour() {
        const vert = contourVertices[0].slice(); // copy all data
        vert.isVert = contourVertices[0].isVert;
        vert.moveTo = false;
        contourVertices.push(vert);

        // prevent stray lines with multiple contours
        if (isFirstContour) {
            vertices.push(vertices[0]);
            isFirstContour = false;
        }

        for (let i = 0; i < contourVertices.length; i++) {
            vertices.push(contourVertices[i]);
        }
        return this;
    }

    public endShape(mode?) {
        if (this.renderer.isP3D) {
            this.renderer.endShape(
                mode,
                isCurve as any,
                isBezier,
                isQuadratic,
                isContour,
                shapeKind
            );
        } else {
            if (vertices.length === 0) {
                return this;
            }
            if (!this.renderer._doStroke && !this.renderer._doFill) {
                return this;
            }

            const closeShape = mode === constants.CLOSE;

            // if the shape is closed, the first element is also the last element
            if (closeShape && !isContour) {
                vertices.push(vertices[0]);
            }

            this.renderer.endShape(
                mode,
                vertices,
                isCurve,
                isBezier,
                isQuadratic,
                isContour,
                shapeKind
            );

            // Reset some settings
            isCurve = false;
            isBezier = false;
            isQuadratic = false;
            isContour = false;
            isFirstContour = true;

            // If the shape is closed, the first element was added as last element.
            // We must remove it again to prevent the list of vertices from growing
            // over successive calls to endShape(CLOSE)
            if (closeShape) {
                vertices.pop();
            }
        }
        return this;
    }

    public quadraticVertex(...args: any[]) {
        if (this.renderer.isP3D) {
            (<any>this.renderer).quadraticVertex(...args);
        } else {
            //if we're drawing a contour, put the points into an
            // array for inside drawing
            if (this._contourInited) {
                const pt: any = {};
                pt.x = args[0];
                pt.y = args[1];
                pt.x3 = args[2];
                pt.y3 = args[3];
                pt.type = constants.QUADRATIC;
                this._contourVertices.push(pt);

                return this;
            }
            if (vertices.length > 0) {
                isQuadratic = true;
                const vert: any[] = [];
                for (let i = 0; i < args.length; i++) {
                    vert[i] = args[i];
                }
                (<any>vert).isVert = false;
                if (isContour) {
                    contourVertices.push(vert);
                } else {
                    vertices.push(vert);
                }
            } else {
                console.error(
                    'vertex() must be used once before calling quadraticVertex()',
                    'quadraticVertex'
                );
            }
        }
        return this;
    }

    public vertex(x: int, y: int, moveTo?, u?, v?) {
        if (this.renderer.isP3D) {
            (<any>this.renderer).vertex(x, y, moveTo, u, v);
        } else {
            const vert: any = [];
            vert.isVert = true;
            vert[0] = x;
            vert[1] = y;
            vert[2] = 0;
            vert[3] = 0;
            vert[4] = 0;
            vert[5] = this.renderer._getFill();
            vert[6] = this.renderer._getStroke();

            if (moveTo) {
                vert.moveTo = moveTo;
            }
            if (isContour) {
                if (contourVertices.length === 0) {
                    vert.moveTo = true;
                }
                contourVertices.push(vert);
            } else {
                vertices.push(vert);
            }
        }
        return this;
    }

    public alpha(c) {
        return this.color(c).A;
    }

    public blue(c) {
        return this.color(c).B;
    }

    public brightness(c) {
        return this.color(c).getBrightness();
    }

    public color(value: CGColor): CGColor;
    public color(value: byte): CGColor;
    public color(values: Array<byte>): CGColor;
    public color(value: string): CGColor;
    public color(gray: byte, alpha: byte): CGColor;
    public color(v1: byte, v2: byte, v3: byte): CGColor;
    public color(v1: byte, v2: byte, v3: byte, alpha: byte): CGColor;
    public color(...args: any[]): CGColor {
        if (args.length === 1 && is.typeof<CGColor>(args[0], CoreGraphicTypes.CGColor)) {
            return args[0];
        } else if (args.length === 1 && (is.number(args[0]) || is.string(args[0]))) {
            return CGColor.FromSketchColor(args[0] as any);
        } else if (args.length === 1 && is.array(args[0])) {
            return CGColor.FromSketchColor(args[1][0], args[1][1], args[1][2], args[1][3]);
        } else if (args.length === 2 && is.number(args[0]) && is.number(args[1])) {
            return CGColor.FromSketchColor(args[1], args[2]);
        } else if (args.length === 3 && is.number(args[0]) && is.number(args[1]) && is.number(args[2])) {
            return CGColor.FromSketchColor(args[0], args[1], args[2]);
        } else if (args.length === 4 && is.number(args[0]) && is.number(args[1]) && is.number(args[2]) && is.number(args[3])) {
            return CGColor.FromSketchColor(args[0], args[1], args[2], args[3]);
        }
        return undefined as any;

    }

    public green(c) {
        return this.color(c).G;
    }

    public hue(c) {
        return this.color(c).getHue();
    }

    public lerpBrush(b1: SolidBrush, b2: SolidBrush, amt: number): SolidBrush {
        const c1 = this.color(b1.Color.R, b1.Color.G, b1.Color.B);
        const c2 = this.color(b2.Color.R, b2.Color.G, b2.Color.B);
        const color = this.lerpColor(c1, c2, amt);

        return new SolidBrush(CGColor.FromRgba(color.R, color.G, color.B, color.A));
    }

    public lerpPen(p1: Pen, p2: Pen, amt: number): Pen {
        const c1 = this.color(p1.Color.R, p1.Color.G, p1.Color.B);
        const c2 = this.color(p2.Color.R, p2.Color.G, p2.Color.B);
        const color = this.lerpColor(c1, c2, amt);
        const size = this.lerp(p1.Width, p2.Width, amt);

        return new Pen(CGColor.FromRgba(color.R, color.G, color.B, color.A), size);
    }

    public lerpColor(c1: CGColor, c2: CGColor, amt: number) {
        return CGColor.Lerp(c1, c2, amt);
    }

    public lightness(c) {
        return this.color(c).getLightness();
    }

    public red(c) {
        return this.color(c).R;
    }

    public saturation(c) {
        return this.color(c).getSaturation();
    }

    public background(value: byte);
    public background(color: CGColor);
    public background(values: Array<byte>);
    public background(value: string);
    public background(gray: byte, alpha: byte);
    public background(v1: byte, v2: byte, v3: byte);
    public background(v1: byte, v2: byte, v3: byte, alpha: byte);
    public background(...args: any[]) {
        if (args.length === 1 && is.typeof<CGColor>(args[0], CoreGraphicTypes.CGColor)) {
            this.renderer.background(args[0]);
        } else if (args.length === 1 && (is.number(args[0]) || is.string(args[0]))) {
            this.renderer.background(args[0] as any);
        } else if (args.length === 1 && is.array(args[0])) {
            this.renderer.background(args[1][0], args[1][1], args[1][2], args[1][3]);
        } else if (args.length === 2 && is.number(args[0]) && is.number(args[1])) {
            this.renderer.background(args[1], args[2]);
        } else if (args.length === 3 && is.number(args[0]) && is.number(args[1]) && is.number(args[2])) {
            this.renderer.background(args[0], args[1], args[1]);
        } else if (args.length === 4 && is.number(args[0]) && is.number(args[1]) && is.number(args[2]) && is.number(args[3])) {
            this.renderer.background(args[0], args[1], args[2], args[3]);
        }
        return this;
    }

    public clear() {
        this.renderer.clear();
        return this;
    }

    public colorMode(mode, max1, max2, max3, maxA) {
        if (
            mode === constants.RGB ||
            mode === constants.HSB ||
            mode === constants.HSL
        ) {
            // Set color mode.
            this._colorMode = mode;

            // Set color maxes.
            const maxes = this._colorMaxes[mode];
            if (arguments.length === 2) {
                maxes[0] = max1; // Red
                maxes[1] = max1; // Green
                maxes[2] = max1; // Blue
                maxes[3] = max1; // Alpha
            } else if (arguments.length === 4) {
                maxes[0] = max1; // Red
                maxes[1] = max2; // Green
                maxes[2] = max3; // Blue
            } else if (arguments.length === 5) {
                maxes[0] = max1; // Red
                maxes[1] = max2; // Green
                maxes[2] = max3; // Blue
                maxes[3] = maxA; // Alpha
            }
        }
        return this;
    }

    public fill(value: byte);
    public fill(color: CGColor);
    public fill(values: Array<byte>);
    public fill(value: string);
    public fill(gray: byte, alpha: byte);
    public fill(v1: byte, v2: byte, v3: byte);
    public fill(v1: byte, v2: byte, v3: byte, alpha: byte);
    public fill(...args) {
        this.renderer._fillSet = true;
        this.renderer._doFill = true;
        if (args.length === 1 && args[0].maxes != null /* is.typeof<SketchColor>(args[0], GraphicTypes.SketchColor) */) {
            this.renderer.fill(args[0]);
        } else if (args.length === 1 && is.string(args[0])) {
            this.renderer.fill(args[0] as any);
        } else if (args.length === 1 && is.number(args[0])) {
            let gray = args[0];
            const max = this._colorMaxes[this._colorMode];
            gray = TMath.map(gray, 0, max[0], 0, 255);
            this.renderer.fill(gray);
        } else if (args.length === 1 && is.array(args[0])) {
            const max = this._colorMaxes[this._colorMode];
            const r = TMath.map(args[0][0], 0, max[0], 0, 255);
            const g = TMath.map(args[0][1], 0, max[1], 0, 255);
            const b = TMath.map(args[0][2], 0, max[2], 0, 255);
            const _a = TMath.map(args[0][3], 0, max[3], 0, 255);
            this.renderer.fill(r, g, b, a);
        } else if (args.length === 2 && is.number(args[0]) && is.number(args[1])) {
            const max = this._colorMaxes[this._colorMode];
            const gray = TMath.map(args[0], 0, max[0], 0, 255);
            const alpha = TMath.map(args[3], 0, max[1], 0, 255);
            this.renderer.fill(gray, alpha);
        } else if (args.length === 3 && is.number(args[0]) && is.number(args[1]) && is.number(args[2])) {
            const max = this._colorMaxes[this._colorMode];
            const r = TMath.map(args[0], 0, max[0], 0, 255);
            const g = TMath.map(args[1], 0, max[1], 0, 255);
            const b = TMath.map(args[2], 0, max[2], 0, 255);
            this.renderer.fill(r, g, b);
        } else if (args.length === 4 && is.number(args[0]) && is.number(args[1]) && is.number(args[2]) && is.number(args[3])) {
            const max = this._colorMaxes[this._colorMode];
            const r = TMath.map(args[0], 0, max[0], 0, 255);
            const g = TMath.map(args[1], 0, max[1], 0, 255);
            const b = TMath.map(args[2], 0, max[2], 0, 255);
            const _a = TMath.map(args[3], 0, max[3], 0, 255);
            this.renderer.fill(r, g, b, _a);
        }
        return this;
    }
    public noFill() {
        this.renderer._doFill = false;
        return this;
    }
    public noStroke() {
        this.renderer._doStroke = false;
        return this;
    }

    public stroke(value: byte);
    public stroke(color: CGColor);
    public stroke(values: Array<byte>);
    public stroke(value: string);
    public stroke(gray: byte, alpha: byte);
    public stroke(v1: byte, v2: byte, v3: byte);
    public stroke(v1: byte, v2: byte, v3: byte, alpha: byte);
    public stroke(...args: any[]) {
        this.renderer._strokeSet = true;
        this.renderer._doStroke = true;
        if (args.length === 1 && is.typeof<CGColor>(args[0], CoreGraphicTypes.CGColor)) {
            this.renderer.stroke(args[0]);
        } else if (args.length === 1 && is.string(args[0])) {
            this.renderer.stroke(args[0] as any);
        } else if (args.length === 1 && is.number(args[0])) {
            const max = this._colorMaxes[this._colorMode];
            this.renderer.stroke(TMath.map(args[0], 0, max[0], 0, 255));
        } else if (args.length === 1 && is.array(args[0])) {
            const max = this._colorMaxes[this._colorMode];
            const r = TMath.map(args[0][0], 0, max[0], 0, 255);
            const g = TMath.map(args[0][1], 0, max[1], 0, 255);
            const b = TMath.map(args[0][2], 0, max[2], 0, 255);
            const _a = TMath.map(args[0][3], 0, max[3], 0, 255);
            this.renderer.stroke(r, g, b, _a);
        } else if (args.length === 2 && is.number(args[0]) && is.number(args[1])) {
            const max = this._colorMaxes[this._colorMode];
            const gray = TMath.map(args[0], 0, max[0], 0, 255);
            const alpha = TMath.map(args[3], 0, max[1], 0, 255);
            this.renderer.stroke(gray, alpha);
        } else if (args.length === 3 && is.number(args[0]) && is.number(args[1]) && is.number(args[2])) {
            const max = this._colorMaxes[this._colorMode];
            const r = TMath.map(args[0], 0, max[0], 0, 255);
            const g = TMath.map(args[1], 0, max[1], 0, 255);
            const b = TMath.map(args[2], 0, max[2], 0, 255);
            this.renderer.stroke(r, g, b);
        } else if (args.length === 4 && is.number(args[0]) && is.number(args[1]) && is.number(args[2]) && is.number(args[3])) {
            const max = this._colorMaxes[this._colorMode];
            const r = TMath.map(args[0], 0, max[0], 0, 255);
            const g = TMath.map(args[1], 0, max[1], 0, 255);
            const b = TMath.map(args[2], 0, max[2], 0, 255);
            const _a = TMath.map(args[3], 0, max[3], 0, 255);
            this.renderer.stroke(r, g, b, _a);
        }
        return this;
    }

    public createImage(width, height) {
        return new SketchImage(width, height);
    }

    public saveCanvas() {

        // copy arguments to array
        const args = [].slice.call(arguments);
        let htmlCanvas, filename, extension;

        if (arguments[0] instanceof HTMLCanvasElement) {
            htmlCanvas = arguments[0];
            args.shift();
        } /* else if (arguments[0] instanceof p5.Element) {
            htmlCanvas = arguments[0].elt;
            args.shift();
        } */ else {
            htmlCanvas = this.renderer.drawingContext.canvas;
        }

        if (args.length >= 1) {
            filename = args[0];
        }
        if (args.length >= 2) {
            extension = args[1];
        }

        extension =
            extension ||
            (this as any)._checkFileExtension(filename, extension)[1] ||
            'png';

        let mimeType;
        switch (extension) {

            case 'jpeg':
            case 'jpg':
                mimeType = 'image/jpeg';
                break;
            default:
                //case 'png':
                mimeType = 'image/png';
                break;
        }

        htmlCanvas.toBlob(blob => {
            // this.downloadFile(blob, filename, extension);
        }, mimeType);
    }

    public saveGif(pImg, filename) {

    }

    public saveFrames(fName, ext, _duration, _fps, callback) {

    }

    private _makeFrame(filename, extension, _cnv) {

    }

    public loadImage(path, successCallback, failureCallback) {
        const pImg = new SketchImage(1, 1);
        const self = this;

        const req = new Request(path, {
            method: 'GET',
            mode: 'cors'
        });

        fetch(path, req).then(response => {
            // GIF section
            if ((response.headers as any).get('content-type').includes('image/gif')) {
                response.arrayBuffer().then(
                    arrayBuffer => {
                        if (arrayBuffer) {
                            const byteArray = new Uint8Array(arrayBuffer);
                            this._createGif(
                                byteArray,
                                pImg,
                                successCallback,
                                failureCallback,
                                (pImg => {
                                    //self._decrementPreload();
                                }).bind(self)
                            );
                        }
                    },
                    e => {
                        if (typeof failureCallback === 'function') {
                            failureCallback(e);
                        } else {
                            console.error(e);
                        }
                    }
                );
            } else {
                // Non-GIF Section
                const img = new Image();

                img.onload = () => {
                    pImg.width = pImg.canvas.width = img.width;
                    pImg.height = pImg.canvas.height = img.height;

                    // Draw the image into the backing canvas of the p5.Image
                    pImg.drawingContext.drawImage(img, 0, 0);
                    (pImg as any).modified = true;
                    if (typeof successCallback === 'function') {
                        successCallback(pImg);
                    }
                    //self._decrementPreload();
                };

                img.onerror = e => {
                    // _friendlyFileLoadError(0, img.src);
                    if (typeof failureCallback === 'function') {
                        failureCallback(e);
                    } else {
                        console.error(e);
                    }
                };

                // Set crossOrigin in case image is served with CORS headers.
                // This will let us draw to the canvas without tainting it.
                // See https://developer.mozilla.org/en-US/docs/HTML/CORS_Enabled_Image
                // When using data-uris the file will be loaded locally
                // so we don't need to worry about crossOrigin with base64 file types.
                if (path.indexOf('data:image/') !== 0) {
                    img.crossOrigin = 'Anonymous';
                }
                // start loading the image
                img.src = path;
            }
            (pImg as any).modified = true;
        });
        return pImg;
    }


    private _createGif(
        arrayBuffer,
        pImg,
        successCallback,
        failureCallback,
        finishCallback
    ) {

    }

    private _sAssign(sVal, iVal) {
        if (sVal > 0 && sVal < iVal) {
            return sVal;
        } else {
            return iVal;
        }
    }

    public image(
        img,
        dx,
        dy,
        dWidth,
        dHeight,
        sx?,
        sy?,
        sWidth?,
        sHeight?
    ) {
        // set defaults per spec: https://goo.gl/3ykfOq


        let defW = img.width;
        let defH = img.height;

        if (img.canvas) {
            defW = img.canvas.width;
            defH = img.canvas.height;
        } else if (img.elt && img.elt.videoWidth && !img.canvas) {
            // video no canvas
            defW = img.elt.videoWidth;
            defH = img.elt.videoHeight;
        }

        const _dx = dx;
        const _dy = dy;
        const _dw = dWidth || defW;
        const _dh = dHeight || defH;
        let _sx = sx || 0;
        let _sy = sy || 0;
        let _sw = sWidth || defW;
        let _sh = sHeight || defH;

        _sw = this._sAssign(_sw, defW);
        _sh = this._sAssign(_sh, defH);

        // This part needs cleanup and unit tests
        // see issues https://github.com/processing/p5.js/issues/1741
        // and https://github.com/processing/p5.js/issues/1673
        let pd = 1;

        if (img.elt && !img.canvas && img.elt.style.width) {
            //if img is video and img.elt.size() has been used and
            //no width passed to image()
            if (img.elt.videoWidth && !dWidth) {
                pd = img.elt.videoWidth;
            } else {
                //all other cases
                pd = img.elt.width;
            }
            pd /= parseInt(img.elt.style.width, 10);
        }

        _sx *= pd;
        _sy *= pd;
        _sh *= pd;
        _sw *= pd;

        const vals: any = modeAdjust(_dx, _dy, _dw, _dh, this.renderer._imageMode);

        // tint the image if there is a tint
        this.renderer.image(img, _sx, _sy, _sw, _sh, vals.x, vals.y, vals.w, vals.h);
    }

    public tint(value: byte);
    public tint(color: CGColor);
    public tint(values: Array<byte>);
    public tint(value: string);
    public tint(gray: byte, alpha: byte);
    public tint(v1: byte, v2: byte, v3: byte);
    public tint(v1: byte, v2: byte, v3: byte, alpha: byte);
    public tint(...args: any[]) {
        let color: CGColor = undefined as any;
        if (args.length === 1 && is.typeof<CGColor>(args[0], CoreGraphicTypes.CGColor)) {
            color = args[0];
        } else if (args.length === 1 && (is.number(args[0]) || is.string(args[0]))) {
            color = this.color(args[0] as any);
        } else if (args.length === 1 && is.array(args[0])) {
            color = this.color(args[1][0], args[1][1], args[1][2], args[1][3]);
        } else if (args.length === 2 && is.number(args[0]) && is.number(args[1])) {
            color = this.color(args[1], args[2]);
        } else if (args.length === 3 && is.number(args[0]) && is.number(args[1]) && is.number(args[2])) {
            color = this.color(args[0], args[1], args[1]);
        } else if (args.length === 4 && is.number(args[0]) && is.number(args[1]) && is.number(args[2]) && is.number(args[3])) {
            color = this.color(args[0], args[1], args[2], args[3]);
        }
        if (color != null) {
            this.renderer._tint = color.Levels;
        }

    }
    public noTint() {
        this.renderer._tint = null;
    }
    private _getTintedImageCanvas(img) {
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

            newPixels[i] = r * this.renderer._tint[0] / 255;
            newPixels[i + 1] = g * this.renderer._tint[1] / 255;
            newPixels[i + 2] = b * this.renderer._tint[2] / 255;
            newPixels[i + 3] = a * this.renderer._tint[3] / 255;
        }

        tmpCtx.putImageData(id, 0, 0);
        return tmpCanvas;
    }
    public imageMode(m) {
        if (
            m === constants.CORNER ||
            m === constants.CORNERS ||
            m === constants.CENTER
        ) {
            this.renderer._imageMode = m;
        }
    }

    public blend(...args: any[]) {
        if (this.renderer) {
            this.renderer.blend(...args);
        }
    }

    public copy(...args: any[]) {
        this.renderer.copy.apply(this.renderer, args);
    }

    public filter(operation, value) {
        Filters.apply(this.renderer.drawingContext.canvas, Filters[operation], value);
    }

    public get(...args: any[]) {
        return (this.renderer.get as any).apply(this.renderer, ...args);
    }
    public loadPixels(...args: any[]) {
        this.renderer.loadPixels();
    }

    public set(x, y, imgOrCol) {
        this.renderer.set(x, y, imgOrCol);
    }

    public updatePixels(x?, y?, w?, h?) {
        // graceful fail - if loadPixels() or set() has not been called, pixel
        // array will be empty, ignore call to updatePixels()
        if (this.pixels.length === 0) {
            return;
        }
        this.renderer.updatePixels(x, y, w, h);
    }

    public abs(x: number): number {
        return Math.abs(x);
    }

    public ceil(x: number): number {
        return Math.ceil(x);
    }
    public constrain(n, low, high) {
        return Math.max(Math.min(n, high), low);
    }

    public dist(...args: any[]): number {
        if (args.length === 4) {
            //2D
            return this.hypot(args[2] - args[0], args[3] - args[1]);
        } else if (args.length === 6) {
            //3D
            return this.hypot(args[3] - args[0], args[4] - args[1], args[5] - args[2]);
        }
        return -1;
    }
    public exp(x: number) {
        return Math.exp(x);
    }

    public floor(x: number) {
        return Math.floor(x);
    }

    public lerp(start, stop, amt) {
        return amt * (stop - start) + start;
    }
    public log(x: number) {
        return Math.log(x);
    }
    public mag(x: number, y: number) {
        return this.hypot(x, y);
    }
    public map(n, start1, stop1, start2, stop2, withinBounds?) {
        const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        if (!withinBounds) {
            return newval;
        }
        if (start2 < stop2) {
            return this.constrain(newval, start2, stop2);
        } else {
            return this.constrain(newval, stop2, start2);
        }
    }

    public max(...args: any[]) {
        if (args[0] instanceof Array) {
            return Math.max.apply(null, args[0]);
        } else {
            return Math.max.apply(null, args);
        }
    }
    public min(...args: any[]) {
        if (args[0] instanceof Array) {
            return Math.min.apply(null, args[0]);
        } else {
            return Math.min.apply(null, args);
        }
    }
    public norm(n, start, stop) {
        return this.map(n, start, stop, 0, 1);
    }
    public pow(x: number, y: number): number {
        return Math.pow(x, y);
    }
    public round(x: number): number {
        return Math.round(x);
    }
    public sq(n: number): number {
        return n * n;
    }
    public sqrt(x: number): number {
        return Math.sqrt(x);
    }
    private hypot(x, y, z?) {
        // Use the native implementation if it's available
        if (typeof Math.hypot === 'function') {
            return Math.hypot.apply(null, arguments as any);
        }

        // Otherwise use the V8 implementation
        // https://github.com/v8/v8/blob/8cd3cf297287e581a49e487067f5cbd991b27123/src/js/math.js#L217
        const length = arguments.length;
        const args: any[] = [];
        let max = 0;
        for (let i = 0; i < length; i++) {
            let n = arguments[i];
            n = +n;
            if (n === Infinity || n === -Infinity) {
                return Infinity;
            }
            n = Math.abs(n);
            if (n > max) {
                max = n;
            }
            args[i] = n;
        }

        if (max === 0) {
            max = 1;
        }
        let sum = 0;
        let compensation = 0;
        for (let j = 0; j < length; j++) {
            const m = args[j] / max;
            const summand = m * m - compensation;
            const preliminary = sum + summand;
            compensation = preliminary - sum - summand;
            sum = preliminary;
        }
        return Math.sqrt(sum) * max;
    }

    public createVector(x, y, z?) {
        return new Vector(x, y, z);
    }


    public noise(x, y = 0, z = 0) {
        if (perlin == null) {
            perlin = new Array(PERLIN_SIZE + 1);
            for (let i = 0; i < PERLIN_SIZE + 1; i++) {
                perlin[i] = Math.random();
            }
        }

        if (x < 0) {
            x = -x;
        }
        if (y < 0) {
            y = -y;
        }
        if (z < 0) {
            z = -z;
        }

        let xi = Math.floor(x),
            yi = Math.floor(y),
            zi = Math.floor(z);
        let xf = x - xi;
        let yf = y - yi;
        let zf = z - zi;
        let rxf, ryf;

        let r = 0;
        let ampl = 0.5;

        let n1, n2, n3;

        for (let o = 0; o < perlin_octaves; o++) {
            let of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

            rxf = scaled_cosine(xf);
            ryf = scaled_cosine(yf);

            n1 = perlin[of & PERLIN_SIZE];
            n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1);
            n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
            n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
            n1 += ryf * (n2 - n1);

            of += PERLIN_ZWRAP;
            n2 = perlin[of & PERLIN_SIZE];
            n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2);
            n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
            n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
            n2 += ryf * (n3 - n2);

            n1 += scaled_cosine(zf) * (n2 - n1);

            r += n1 * ampl;
            ampl *= perlin_amp_falloff;
            xi <<= 1;
            xf *= 2;
            yi <<= 1;
            yf *= 2;
            zi <<= 1;
            zf *= 2;

            if (xf >= 1.0) {
                xi++;
                xf--;
            }
            if (yf >= 1.0) {
                yi++;
                yf--;
            }
            if (zf >= 1.0) {
                zi++;
                zf--;
            }
        }
        return r;
    }

    public noiseDetail(lod, falloff) {
        if (lod > 0) {
            perlin_octaves = lod;
        }
        if (falloff > 0) {
            perlin_amp_falloff = falloff;
        }
    }

    public noiseSeed(seed) {
        // Linear Congruential Generator
        // Variant of a Lehman Generator
        const lcg = (() => {
            // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
            // m is basically chosen to be large (as it is the max period)
            // and for its relationships to a and c
            const m = 4294967296;
            // a - 1 should be divisible by m's prime factors
            const a = 1664525;
            // c and m should be co-prime
            const c = 1013904223;
            let seed, z;
            return {
                setSeed(val) {
                    // pick a random seed if val is undefined or null
                    // the >>> 0 casts the seed to an unsigned 32-bit integer
                    z = seed = (val == null ? Math.random() * m : val) >>> 0;
                },
                getSeed() {
                    return seed;
                },
                rand() {
                    // define the recurrence relationship
                    z = (a * z + c) % m;
                    // return a float in [0, 1)
                    // if z = m then z / m = 0 therefore (z % m) / m < 1 always
                    return z / m;
                }
            };
        })();

        lcg.setSeed(seed);
        perlin = new Array(PERLIN_SIZE + 1);
        for (let i = 0; i < PERLIN_SIZE + 1; i++) {
            perlin[i] = lcg.rand();
        }
    }

    private _lcg(stateProperty) {
        // define the recurrence relationship
        this[stateProperty] = (a * this[stateProperty] + c) % m;
        // return a float in [0, 1)
        // we've just used % m, so / m is always < 1
        return this[stateProperty] / m;
    }

    private _lcgSetSeed(stateProperty, val) {
        // pick a random seed if val is undefined or null
        // the >>> 0 casts the seed to an unsigned 32-bit integer
        this[stateProperty] = (val == null ? Math.random() * m : val) >>> 0;
    }

    public randomSeed(seed) {
        this._lcgSetSeed(randomStateProp, seed);
        this._gaussian_previous = false;
    }
    public random(min?, max?) {
        let rand;

        if (this[randomStateProp] != null) {
            rand = this._lcg(randomStateProp);
        } else {
            rand = Math.random();
        }
        if (typeof min === 'undefined') {
            return rand;
        } else if (typeof max === 'undefined') {
            if (min instanceof Array) {
                return min[Math.floor(rand * min.length)];
            } else {
                return rand * min;
            }
        } else {
            if (min > max) {
                const tmp = min;
                min = max;
                max = tmp;
            }

            return rand * (max - min) + min;
        }
    }

    public randomGaussian(mean, sd) {
        let y1, x1, x2, w;
        if (this._gaussian_previous) {
            y1 = y2;
            this._gaussian_previous = false;
        } else {
            do {
                x1 = this.random(2) - 1;
                x2 = this.random(2) - 1;
                w = x1 * x1 + x2 * x2;
            } while (w >= 1);
            w = Math.sqrt(-2 * Math.log(w) / w);
            y1 = x1 * w;
            y2 = x2 * w;
            this._gaussian_previous = true;
        }

        const m = mean || 0;
        const s = sd || 1;
        return y1 * s + m;
    }
    public acos(ratio) {
        return this._fromRadians(Math.acos(ratio));
    }

    public asin(ratio) {
        return this._fromRadians(Math.asin(ratio));
    }

    public atan(ratio) {
        return this._fromRadians(Math.atan(ratio));
    }
    public atan2(y, x) {
        return this._fromRadians(Math.atan2(y, x));
    }

    public cos(angle) {
        return Math.cos(this._toRadians(angle));
    }
    public sin(angle) {
        return Math.sin(this._toRadians(angle));
    }
    public tan(angle) {
        return Math.tan(this._toRadians(angle));
    }

    public degrees(angle) {
        angle * constants.RAD_TO_DEG;
    }

    public radians(angle) {
        return angle * constants.DEG_TO_RAD;
    }

    public angleMode(mode: string) {
        if (mode === constants.DEGREES || mode === constants.RADIANS) {
            this._angleMode = mode;
        }
    }

    private _toRadians(angle) {
        if (this._angleMode === constants.DEGREES) {
            return angle * constants.DEG_TO_RAD;
        }
        return angle;
    }
    private _toDegrees(angle) {
        if (this._angleMode === constants.RADIANS) {
            return angle * constants.RAD_TO_DEG;
        }
        return angle;
    }

    private _fromRadians(angle) {
        if (this._angleMode === constants.DEGREES) {
            return angle * constants.RAD_TO_DEG;
        }
        return angle;
    }

    public textAlign(horizAlign?, vertAlign?) {
        return this.renderer.textAlign(horizAlign, vertAlign);
    }

    public textLeading(theLeading?) {
        return this.renderer.textLeading(theLeading);
    }
    public textSize(theSize) {
        return this.renderer.textSize(theSize);
    }

    public textStyle(theStyle) {
        return this.renderer.textStyle(theStyle);
    }

    public textWidth(...args: any[]) {
        args[0] += '';
        if (args[0].length === 0) {
            return 0;
        }
        return (this.renderer as any).textWidth(...args);
    }
    public textAscent(...args: any[]) {
        return this.renderer.textAscent();
    }
    public textDescent(...args: any[]) {
        return this.renderer.textDescent();
    }
    private _updateTextMetrics() {
        return this.renderer._updateTextMetrics();
    }

    public loadFont(path, onSuccess, onError) {
        const p5Font = new SketchFont(this);

        const self = this;


        return p5Font;
    }
    public text(str, x, y, maxWidth?, maxHeight?) {
        return !(this.renderer._doFill || this.renderer._doStroke)
            ? this
            : this.renderer.text(str, x, y, maxWidth, maxHeight);
    }
    public textFont(theFont, theSize?) {
        if (arguments.length) {
            if (!theFont) {
                throw new Error('null font passed to textFont');
            }

            this.renderer._textFont = theFont;

            if (theSize) {
                this.renderer._textSize = theSize;
                this.renderer._textLeading = theSize * constants._DEFAULT_LEADMULT
            }

            return this.renderer._applyTextProperties();
        }

        return this.renderer._textFont;
    }

    public push() {
        this._styles.push({
            props: {
                _colorMode: this._colorMode
            },
            renderer: this.renderer.push()
        });
    }
    public pop() {
        const style = this._styles.pop();
        if (style) {
            this.renderer.pop(style.renderer);
            Object.assign(this, style.props);
        } else {
            console.warn('pop() was called without matching push()');
        }
    }
    public _updateNextMouseCoords(e) {
        if (this.renderer.drawingContext.canvas !== null && (!e.touches || e.touches.length > 0)) {
            const mousePos = this.getMousePos(
                this.renderer.drawingContext.canvas,
                this.width,
                this.height,
                e
            );
            this.movedX = e.movementX;
            this.movedY = e.movementY;
            this.mouseX = mousePos.x;
            this.mouseY = mousePos.y;
            this.winMouseX = mousePos.winX
            this.winMouseY = mousePos.winY
        }
        if (!this._hasMouseInteracted) {
            // For first draw, make previous and next equal
            this._updateMouseCoords();
            this._hasMouseInteracted = true;
        }
    }

    public _updateMouseCoords() {
        this.pmouseX = this.mouseX;
        this.pmouseY = this.mouseY;
        this.pwinMouseX = this.winMouseX;
        this.pwinMouseY = this.winMouseY;

        this._pmouseWheelDeltaY = this._mouseWheelDeltaY;
    }

    private getMousePos(canvas, w, h, evt) {
        if (evt && !evt.clientX) {
            // use touches if touch and not mouse
            if (evt.touches) {
                evt = evt.touches[0];
            } else if (evt.changedTouches) {
                evt = evt.changedTouches[0];
            }
        }
        var rect = canvas.getBoundingClientRect();
        var sx = canvas.scrollWidth / w || 1;
        var sy = canvas.scrollHeight / h || 1;
        return {
            x: (evt.clientX - rect.left) / sx,
            y: (evt.clientY - rect.top) / sy,
            winX: evt.clientX,
            winY: evt.clientY,
            id: evt.identifier
        };
    }

    private _setMouseButton(e) {
        if (e.button === 1) {
            this.mouseButton = constants.CENTER;
        } else if (e.button === 2) {
            this.mouseButton = constants.RIGHT;
        } else {
            this.mouseButton = constants.LEFT;
        }
    }

    private _onmousemove(e) {
        var executeDefault;
        this._updateNextMouseCoords(e);
        if (!this.mouseIsPressed) {
            if (typeof this.mouseMoved === 'function') {
                executeDefault = this.mouseMoved(e);
                if (executeDefault === false) {
                    e.preventDefault();
                }
            }
        } else {
            if (typeof this.mouseDragged === 'function') {
                executeDefault = this.mouseDragged(e);
                if (executeDefault === false) {
                    e.preventDefault();
                }
            } else if (typeof this.touchMoved === 'function') {
                executeDefault = this.touchMoved(e);
                if (executeDefault === false) {
                    e.preventDefault();
                }
            }
        }
    }

    private _onmousedown(e) {
        let executeDefault;
        this.mouseIsPressed = true;
        this._setMouseButton(e);
        this._updateNextMouseCoords(e);

        if (typeof this.mousePressed === 'function') {
            executeDefault = this.mousePressed(e);
            if (executeDefault === false) {
                e.preventDefault();
            }
            // only safari needs this manual fallback for consistency
        } else if (
            navigator.userAgent.toLowerCase().includes('safari') &&
            typeof this.touchStarted === 'function'
        ) {
            executeDefault = this.touchStarted(e);
            if (executeDefault === false) {
                e.preventDefault();
            }
        }
    }
    private _onmouseup(e) {
        let executeDefault;
        this.mouseIsPressed = false;
        if (typeof this.mouseReleased === 'function') {
            executeDefault = this.mouseReleased(e);
            if (executeDefault === false) {
                e.preventDefault();
            }
        } else if (typeof this.touchEnded === 'function') {
            executeDefault = this.touchEnded(e);
            if (executeDefault === false) {
                e.preventDefault();
            }
        }
    }

    private _ondragend(e) {
        this._onmouseup(e);
    }

    private _ondragover(e) {
        this._onmousemove(e);
    }

    private _onclick(e) {
        if (typeof this.mouseClicked === 'function') {
            var executeDefault = this.mouseClicked(e);
            if (executeDefault === false) {
                e.preventDefault();
            }
        }
    }

    private _ondblclick(e) {
        if (typeof this.doubleClicked === 'function') {
            var executeDefault = this.doubleClicked(e);
            if (executeDefault === false) {
                e.preventDefault();
            }
        }
    }

    private _onwheel(e) {
        this._mouseWheelDeltaY = e.deltaY;
        if (typeof this.mouseWheel === 'function') {
            e.delta = e.deltaY;
            var executeDefault = this.mouseWheel(e);
            if (executeDefault === false) {
                e.preventDefault();
            }
        }
    }

    private _onkeydown(e) {
        if (this._downKeys[e.which]) {
            // prevent multiple firings
            return;
        }
        this.isKeyPressed = true;
        this.keyIsPressed = true;
        this.keyCode = e.which;
        this._downKeys[e.which] = true;
        this.key = e.key || String.fromCharCode(e.which) || e.which;
        const keyPressed = this.keyPressed;
        if (typeof keyPressed === 'function' && !e.charCode) {
            const executeDefault = keyPressed(e);
            if (executeDefault === false) {
                e.preventDefault();
            }
        }
    }
    private _onkeyup(e) {
        const keyReleased = this.keyReleased;
        this._downKeys[e.which] = false;

        if (!this._areDownKeys()) {
            this.isKeyPressed = false;
            this.keyIsPressed = false;
        }

        this._lastKeyCodeTyped = null as any;

        this.key = e.key || String.fromCharCode(e.which) || e.which;
        this.keyCode = e.which;
        if (typeof keyReleased === 'function') {
            const executeDefault = keyReleased(e);
            if (executeDefault === false) {
                e.preventDefault();
            }
        }
    }
    private _onkeypress(e) {
        if (e.which === this._lastKeyCodeTyped) {
            // prevent multiple firings
            return;
        }
        this._lastKeyCodeTyped = e.which; // track last keyCode
        this.key = String.fromCharCode(e.which);
        const keyTyped = this.keyTyped;
        if (typeof keyTyped === 'function') {
            const executeDefault = keyTyped(e);
            if (executeDefault === false) {
                e.preventDefault();
            }
        }
    }

    private _onblur(e) {
        this._downKeys = {};
    }

    public keyIsDown(code) {
        return this._downKeys[code] || false;
    }

    private _areDownKeys() {
        for (const key in this._downKeys) {
            if (this._downKeys.hasOwnProperty(key) && this._downKeys[key] === true) {
                return true;
            }
        }
        return false;
    }

    private _onresize(e) {
        let executeDefault;
        if (typeof this.windowResized === 'function') {
            executeDefault = this.windowResized(e);
            if (executeDefault !== undefined && !executeDefault) {
                e.preventDefault();
            }
        }
    }

    public applyMatrix(a, b, c, d, e, f) {
        this.renderer.applyMatrix(a, b, c, d, e, f);
        return this;
    }

    public resetMatrix() {
        this.renderer.resetMatrix();
        return this;
    }

    public rotate(angle, axis?) {
        this.renderer.rotate(this._toRadians(angle), axis);
        return this;
    }

    public scale(x, y, z) {
        // Only check for Vector argument type if Vector is available
        if (x instanceof Vector) {
            const v = x;
            x = v.x;
            y = v.y;
            z = v.z;
        } else if (x instanceof Array) {
            const rg = x;
            x = rg[0];
            y = rg[1];
            z = rg[2] || 1;
        }
        if (isNaN(y)) {
            y = z = x;
        } else if (isNaN(z)) {
            z = 1;
        }

        (this.renderer.scale as any).call(this.renderer, x, y, z);

        return this;
    }

    public shearX(angle) {
        const rad = this._toRadians(angle);
        this.renderer.applyMatrix(1, 0, Math.tan(rad), 1, 0, 0);
        return this;
    }

    public shearY(angle) {
        const rad = this._toRadians(angle);
        this.renderer.applyMatrix(1, Math.tan(rad), 0, 1, 0, 0);
        return this;
    }

    public translate(vector: Vector);
    public translate(x: number, y: number, z?: number);
    public translate(...args: any[]) {
        if (args.length === 1 && args[0] instanceof Vector) {
            const vector: Vector = args[0];
            this.renderer.translate(vector);
        } else {
            const x: number = args[0];
            const y: number = args[1];
            this.renderer.translate(x, y);
        }

        return this;
    }

    public collideRectRect(x, y, w, h, x2, y2, w2, h2): boolean {
        //2d
        //add in a thing to detect rectMode CENTER
        if (x + w >= x2 &&    // r1 right edge past r2 left
            x <= x2 + w2 &&    // r1 left edge past r2 right
            y + h >= y2 &&    // r1 top edge past r2 bottom
            y <= y2 + h2) {    // r1 bottom edge past r2 top
            return true;
        }
        return false;
    }

    public collideRectCircle(rx, ry, rw, rh, cx, cy, diameter) {
        //2d
        // temporary variables to set edges for testing
        let testX = cx;
        let testY = cy;

        // which edge is closest?
        if (cx < rx) {
            testX = rx       // left edge
        } else if (cx > rx + rw) {
            testX = rx + rw
        }   // right edge

        if (cy < ry) {
            testY = ry       // top edge
        } else if (cy > ry + rh) {
            testY = ry + rh
        }   // bottom edge

        // // get distance from closest edges
        const distance: any = this.dist(cx, cy, testX, testY)

        // if the distance is less than the radius, collision!
        if (distance <= diameter / 2) {
            return true;
        }
        return false;
    }

    public collideCircleCircle(x: number, y: number, d: number, x2: number, y2: number, d2: number) {
        //2d
        if (this.dist(x, y, x2, y2) <= (d / 2) + (d2 / 2)) {
            return true;
        }
        return false;
    }

    public collidePointCircle(x, y, cx, cy, d) {
        //2d
        if (this.dist(x, y, cx, cy) <= d / 2) {
            return true;
        }
        return false;
    }

    public collidePointEllipse(x, y, cx, cy, dx, dy) {
        //2d
        const rx = dx / 2, ry = dy / 2;
        // Discarding the points outside the bounding box
        if (x > cx + rx || x < cx - rx || y > cy + ry || y < cy - ry) {
            return false;
        }
        // Compare the point to its equivalent on the ellipse
        const xx = x - cx, yy = y - cy;
        const eyy = ry * this.sqrt(this.abs(rx * rx - xx * xx)) / rx;
        return yy <= eyy && yy >= -eyy;
    }

    public collidePointRect(pointX, pointY, x, y, xW, yW) {
        //2d
        if (pointX >= x &&         // right of the left edge AND
            pointX <= x + xW &&    // left of the right edge AND
            pointY >= y &&         // below the top AND
            pointY <= y + yW) {    // above the bottom
            return true;
        }
        return false;
    }

    public collidePointLine(px, py, x1, y1, x2, y2, buffer?) {
        // get distance from the point to the two ends of the line
        const d1: number = this.dist(px, py, x1, y1);
        const d2: number = this.dist(px, py, x2, y2);

        // get the length of the line
        const lineLen: number = this.dist(x1, y1, x2, y2);

        // since floats are so minutely accurate, add a little buffer zone that will give collision
        if (buffer === undefined) {
            buffer = 0.1;
        }   // higher # = less accurate

        // if the two distances are equal to the line's length, the point is on the line!
        // note we use the buffer here to give a range, rather than one #
        if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
            return true;
        }
        return false;
    }

    public collideLineCircle(x1, y1, x2, y2, cx, cy, diameter) {
        // is either end INSIDE the circle?
        // if so, return true immediately
        const inside1 = this.collidePointCircle(x1, y1, cx, cy, diameter);
        const inside2 = this.collidePointCircle(x2, y2, cx, cy, diameter);
        if (inside1 || inside2) return true;

        // get length of the line
        let distX = x1 - x2;
        let distY = y1 - y2;
        const len = this.sqrt((distX * distX) + (distY * distY));

        // get dot product of the line and circle
        const dot = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / this.pow(len, 2);

        // find the closest point on the line
        const closestX = x1 + (dot * (x2 - x1));
        const closestY = y1 + (dot * (y2 - y1));

        // is this point actually on the line segment?
        // if so keep going, but if not, return false
        const onSegment = this.collidePointLine(closestX, closestY, x1, y1, x2, y2);
        if (!onSegment) return false;

        // draw a debug circle at the closest point on the line
        if (this._collideDebug) {
            this.ellipse(closestX, closestY, 10, 10);
        }

        // get distance to closest point
        distX = closestX - cx;
        distY = closestY - cy;
        var distance = this.sqrt((distX * distX) + (distY * distY));

        if (distance <= diameter / 2) {
            return true;
        }
        return false;
    }

    public collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4, calcIntersection?) {

        let intersection;

        // calculate the distance to intersection point
        const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

        // if uA and uB are between 0-1, lines are colliding
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

            let intersectionX;
            let intersectionY;

            if (this._collideDebug || calcIntersection) {
                // calc the point where the lines meet
                intersectionX = x1 + (uA * (x2 - x1));
                intersectionY = y1 + (uA * (y2 - y1));
            }

            if (this._collideDebug) {
                this.ellipse(intersectionX, intersectionY, 10, 10);
            }

            if (calcIntersection) {
                intersection = {
                    "x": intersectionX,
                    "y": intersectionY
                }
                return intersection;
            } else {
                return true;
            }
        }
        if (calcIntersection) {
            intersection = {
                "x": false,
                "y": false
            }
            return intersection;
        }
        return false;
    }

    public collideLineRect(x1, y1, x2, y2, rx, ry, rw, rh, calcIntersection?) {

        // check if the line has hit any of the rectangle's sides. uses the collideLineLine function above
        let left, right, top, bottom, intersection;

        if (calcIntersection) {
            left = this.collideLineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh, true);
            right = this.collideLineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh, true);
            top = this.collideLineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry, true);
            bottom = this.collideLineLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh, true);
            intersection = {
                "left": left,
                "right": right,
                "top": top,
                "bottom": bottom
            }
        } else {
            //return booleans
            left = this.collideLineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh);
            right = this.collideLineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
            top = this.collideLineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry);
            bottom = this.collideLineLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);
        }

        // if ANY of the above are true, the line has hit the rectangle
        if (left || right || top || bottom) {
            if (calcIntersection) {
                return intersection;
            }
            return true;
        }
        return false;
    }


    public collidePointPoly(px, py, vertices) {
        let collision = false;

        // go through each of the vertices, plus the next vertex in the list
        let next = 0;
        for (let current = 0; current < vertices.length; current++) {

            // get next vertex in list if we've hit the end, wrap around to 0
            next = current + 1;
            if (next == vertices.length) next = 0;

            // get the PVectors at our current position this makes our if statement a little cleaner
            const vc = vertices[current];    // c for "current"
            const vn = vertices[next];       // n for "next"

            // compare position, flip 'collision' variable back and forth
            if (((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py)) &&
                (px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x)) {
                collision = !collision;
            }
        }
        return collision;
    }

    // POLYGON/CIRCLE
    public collideCirclePoly(cx: number, cy: number, diameter: number, vertices: any[], interior: boolean) {

        if (interior == undefined) {
            interior = false;
        }

        // go through each of the vertices, plus the next vertex in the list
        let next = 0;
        for (let current = 0; current < vertices.length; current++) {

            // get next vertex in list if we've hit the end, wrap around to 0
            next = current + 1;
            if (next === vertices.length) {
                next = 0;
            }

            // get the PVectors at our current position this makes our if statement a little cleaner
            const vc = vertices[current];    // c for "current"
            const vn = vertices[next];       // n for "next"

            // check for collision between the circle and a line formed between the two vertices
            const collision = this.collideLineCircle(vc.x, vc.y, vn.x, vn.y, cx, cy, diameter);
            if (collision) {
                return true;
            }
        }

        // test if the center of the circle is inside the polygon
        if (interior == true) {
            const centerInside = this.collidePointPoly(cx, cy, vertices);
            if (centerInside) return true;
        }

        // otherwise, after all that, return false
        return false;
    }

    public collideRectPoly(rx, ry, rw, rh, vertices, interior) {
        if (interior == undefined) {
            interior = false;
        }

        // go through each of the vertices, plus the next vertex in the list
        let next = 0;
        for (let current = 0; current < vertices.length; current++) {

            // get next vertex in list if we've hit the end, wrap around to 0
            next = current + 1;
            if (next == vertices.length) {
                next = 0;
            }

            // get the PVectors at our current position this makes our if statement a little cleaner
            const vc = vertices[current];    // c for "current"
            const vn = vertices[next];       // n for "next"

            // check against all four sides of the rectangle
            const collision = this.collideLineRect(vc.x, vc.y, vn.x, vn.y, rx, ry, rw, rh);
            if (collision) {
                return true;
            }

            // optional: test if the rectangle is INSIDE the polygon note that this iterates all sides of the polygon again, so only use this if you need to
            if (interior == true) {
                var inside = this.collidePointPoly(rx, ry, vertices);
                if (inside) return true;
            }
        }

        return false;
    }

    public collideLinePoly(x1, y1, x2, y2, vertices) {

        // go through each of the vertices, plus the next vertex in the list
        let next = 0;
        for (let current = 0; current < vertices.length; current++) {

            // get next vertex in list if we've hit the end, wrap around to 0
            next = current + 1;
            if (next == vertices.length) next = 0;

            // get the PVectors at our current position extract X/Y coordinates from each
            const x3 = vertices[current].x;
            const y3 = vertices[current].y;
            const x4 = vertices[next].x;
            const y4 = vertices[next].y;

            // do a Line/Line comparison if true, return 'true' immediately and stop testing (faster)
            const hit = this.collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4);
            if (hit) {
                return true;
            }
        }
        // never got a hit
        return false;
    }

    public collidePolyPoly(p1, p2, interior) {
        if (interior == undefined) {
            interior = false;
        }

        // go through each of the vertices, plus the next vertex in the list
        let next = 0;
        for (let current = 0; current < p1.length; current++) {

            // get next vertex in list, if we've hit the end, wrap around to 0
            next = current + 1;
            if (next == p1.length) {
                next = 0;
            }

            // get the PVectors at our current position this makes our if statement a little cleaner
            const vc = p1[current];    // c for "current"
            const vn = p1[next];       // n for "next"

            //use these two points (a line) to compare to the other polygon's vertices using polyLine()
            let collision = this.collideLinePoly(vc.x, vc.y, vn.x, vn.y, p2);
            if (collision) return true;

            //check if the 2nd polygon is INSIDE the first
            if (interior == true) {
                collision = this.collidePointPoly(p2[0].x, p2[0].y, p1);
                if (collision) return true;
            }
        }

        return false;
    }

    public collidePointTriangle(px, py, x1, y1, x2, y2, x3, y3) {

        // get the area of the triangle
        const areaOrig = this.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1));

        // get the area of 3 triangles made between the point and the corners of the triangle
        const area1 = this.abs((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py));
        const area2 = this.abs((x2 - px) * (y3 - py) - (x3 - px) * (y2 - py));
        const area3 = this.abs((x3 - px) * (y1 - py) - (x1 - px) * (y3 - py));

        // if the sum of the three areas equals the original, we're inside the triangle!
        if (area1 + area2 + area3 == areaOrig) {
            return true;
        }
        return false;
    }

    public collidePointPoint(x, y, x2, y2, buffer) {
        if (buffer == undefined) {
            buffer = 0;
        }

        if (this.dist(x, y, x2, y2) <= buffer) {
            return true;
        }

        return false;
    };

    public collidePointArc(px, py, ax, ay, arcRadius, arcHeading, arcAngle, buffer) {

        if (buffer == undefined) {
            buffer = 0;
        }
        // point
        const point = this.createVector(px, py);
        // arc center point
        const arcPos = this.createVector(ax, ay);
        // arc radius vector
        const radius = this.createVector(arcRadius, 0).rotate(arcHeading);

        const pointToArc = point.copy().sub(arcPos);

        if (point.dist(arcPos) <= (arcRadius + buffer)) {
            const dot = radius.dot(pointToArc);
            const angle = radius.angleBetween(pointToArc);
            if (dot > 0 && angle <= arcAngle / 2 && angle >= -arcAngle / 2) {
                return true;
            }
        }

        return false;
    }


    public cursor(type, x?, y?) {
        var standardCursors = ['arrow', 'cross', 'hand', 'move', 'text', 'wait'];
        var cursor = 'auto';
        var canvas = this.renderer.drawingContext.canvas;
        if (standardCursors.indexOf(type) > -1) {
            // Standard css cursor
            cursor = type;
        } else if (typeof type === 'string') {
            var coords = '';
            if (x && y && (typeof x === 'number' && typeof y === 'number')) {
                // Note that x and y values must be unit-less positive integers < 32
                // https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
                coords = x + ' ' + y;
            }
            if (
                type.substring(0, 7) === 'http://' ||
                type.substring(0, 8) === 'https://'
            ) {
                // Image (absolute url)
                cursor = 'url(' + type + ') ' + coords + ', auto';
            } else if (/\.(cur|jpg|jpeg|gif|png|CUR|JPG|JPEG|GIF|PNG)$/.test(type)) {
                // Image file (relative path) - Separated for performance reasons
                cursor = 'url(' + type + ') ' + coords + ', auto';
            } else {
                // Any valid string for the css cursor property
                cursor = type;
            }
        }
        if (!is.workerContext()) {
            canvas.style.cursor = cursor;
        }
    }

    public createDraggablePoint(x: int, y: int): DraggablePoint {
        return new DraggablePoint(x, y);
    }
    public pixelDensity(val: number) {
        let returnValue;
        if (typeof val === 'number') {
            if (val !== this._pixelDensity) {
                this._pixelDensity = val;
            }
            returnValue = this;
            this.resizeCanvas(this.width, this.height, true); // as a side effect, it will clear the canvas
        } else {
            returnValue = this._pixelDensity;
        }
        return returnValue;
    }

    public resizeCanvas(w: number, h: number, noRedraw: boolean): void {
        if (this.renderer) {
            this.renderer.resize(w, h);
            this.width = w;
            this.height = h;
        }
    }

}