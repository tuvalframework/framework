import { Tween } from './scene/tween/Tween';
import { Pen } from "./Pen";
import { Brush } from "./Brush";
import { TextMetrics } from '../Text/TextMetrics';

import {
    CGRectangle, IContext2D,
    CGImage, CGInterpolationQuality, CGColor, CGPathDrawingMode,
    CGPoint, CGSize, CGContext2D, CGBlendMode,
    CoreGraphicTypes, CGCommandContext2D
} from "@tuval/cg";
import { GraphicsUnit } from "./GraphicsUnit";
import { InterpolationMode } from "./InterpolationMode";
import { SmoothingMode } from "./SmoothingMode";
import { Matrix, MatrixOrder } from "./drawing2D/Matrix";
import { float, Out, byte, int, nameof, foreach, is, Context, EventBus, Ticker, TObject, IntPtr, Convert, Locale, New, Dictionary, System, Runtime, Browser } from '@tuval/core';
import { Region } from "./Region";
import { MeasureStringCache } from "./MeasureStringCache";
import { ArgumentNullException, ArgumentException, NotImplementedException, newOutEmpty, Exception } from "@tuval/core";
import { ConversionHelpers } from "./ConversionHelpers";
import { FillMode } from "./drawing2D/FillMode";
import { CurveType, CURVE_MIN_TERMS, GraphicsPath } from "./drawing2D/GraphicsPath";
import { GeomUtilities } from "./GeomUtilities";
import { PathPointType } from "./PathPointType";
import { CombineMode } from "./drawing2D/CombineMode";
import { GraphicsContainer } from "./drawing2D/GraphicsContainer";
import { PixelOffsetMode } from "./drawing2D/PixelOffsetMode";
import { CompositingQuality } from "./drawing2D/CompositingQuality";
import { GraphicsState } from "./drawing2D/GraphicsState";
import { FlushIntention } from "./drawing2D/FlushIntention";
import { CoordinateSpace } from "./drawing2D/CoordinateSpace";
import { Font } from "./Font";
import { StringFormat } from "./StringFormat";
import { createCanvasElement, get2DCanvasContext } from "./createCanvasElement";
import { DrawStringCache } from "./DrawStringCache";
import { Bitmap } from "./Bitmap";
import { StringFormatFlags } from "./StringFormatFlags";
import { GraphicTypes } from '../GDITypes';
import { StringAlignment } from "./StringAlignment";
import { SolidBrush } from "./SolidBrush";
// import { Sketch } from "./Sketch/Core/Sketch";
import { ClassInfo } from "@tuval/core";
import { ImageAttributes } from "./imaging/ImageAttributes";
import { Image } from "./Image";
import { PixelFormat } from './imaging/PixelFormat';
import { Status } from './gdipEnums';
import { GDIPlus, GraphicsHandleTable } from './GDIPlus';
import { FontStyle } from './FontStyle';
import { TextStyle } from '../Text/TextStyle';

declare var OffscreenCanvas, OffscreenCanvasRenderingContext2D;

var leadDiv = document.createElement("div");
try{
    document.body.appendChild(leadDiv);
}
catch {

}


var __canvas = document.createElement("canvas");

var beginTime = (performance || Date).now(), prevTime = beginTime, frames = 0;
type DrawImageAbort = () => void;

export enum AngleModes {
    Degrees = 'degrees',
    Radians = 'radians',

}
export enum EllipseModes {
    Radians = 'radians',
    Corner = 'corner',
    Corners = 'corners',
    Center = 'center'
}
export enum RectangleModes {
    Radians = 'radians',
    Corner = 'corner',
    Corners = 'corners',
    Center = 'center'
}

export enum ArcModes {
    Chord = 'chord',
    Pie = 'pie',
    Open = 'open'
}
export enum CompositingMode {
    SourceOver = 0,
    SourceCopy = 1
}

export interface TextMetricsEx {
    width: number;
    fontSize: number;
    leading: number;
    ascent: number;
    descent: number;
    bounds: any;
    height: number;
}
export const PI = Math.PI;
export const DEG_TO_RAD = PI / 180.0;
export const RAD_TO_DEG = 180.0 / PI;
export const TWO_PI = PI * 2;
export const HALF_PI = PI / 2;
export const QUARTER_PI = PI / 4;
export const CORNER = 'corner';
export const CORNERS = 'corners';

@ClassInfo({
    fullName: GraphicTypes.GraphicsBase,
    instanceof: [
        GraphicTypes.GraphicsBase
    ]
})
export abstract class GraphicsBase<T extends IContext2D> extends TObject {

    public nativeObject: IntPtr = null as any;
    private ticker: Ticker = undefined as any;
    public renderer: T = undefined as any;
    private hasClientTransform: boolean = false;
    public LastPen: Pen = undefined as any;
    public LastBrush: Brush = undefined as any;
    private boundingBox: CGRectangle = undefined as any;
    private quartzUnit: GraphicsUnit = GraphicsUnit.Point;
    protected isFlipped: boolean = false;
    private interpolationMode: InterpolationMode = InterpolationMode.Default;
    private myAngleMode: AngleModes = AngleModes.Degrees;
    private myEllipseMode: EllipseModes = EllipseModes.Corner;
    public x: number = 0;
    public y: number = 0;
    public width: number = 0;
    public height: number = 0;

    // Need to keep a transform around, since it is not possible to
    // set the transform on the context, merely to concatenate.
    // private transform: CGAffineTransform;
    private smoothingMode: SmoothingMode = SmoothingMode.Default;

    // Text Layout
    public LastBrushColor: CGColor = undefined as any;

    // User Space variables
    public modelMatrix: Matrix = undefined as any;
    private viewMatrix: Matrix = undefined as any;
    private modelViewMatrix: Matrix = undefined as any;
    private userspaceScaleX: float = 1;
    private userspaceScaleY: float = 1;
    private graphicsUnit: GraphicsUnit = GraphicsUnit.Display;
    private pageScale: float = 1;
    private renderingOrigin: CGPoint = CGPoint.Empty;
    private subviewClipOffset: CGRectangle = CGRectangle.Empty;
    private static infiniteRegion: Region = new Region();
    private clip: Region = undefined as any;
    protected screenScale: float = 1;
    private compositing_mode: CompositingMode = CompositingMode.SourceOver;
    private static maxSize: CGSize = new CGSize(Number.MAX_VALUE, Number.MAX_VALUE);
    private static readonly DrawStringCacheCapacity: number = 2000;
    private static DrawStringCache: DrawStringCache = new DrawStringCache(GraphicsBase.DrawStringCacheCapacity);
    private static MeasureStringCache: MeasureStringCache = new MeasureStringCache(GraphicsBase.DrawStringCacheCapacity);

    public constructor() {
        super();
        this.ticker = new Ticker('TGI_Ticker');
        this.ticker.timingMode = Ticker.RAF;
    }
    private myCurrentPen: Pen = undefined as any;
    public get CurrentPen(): Pen {
        return this.getCurrentPen();
    }
    public set CurrentPen(value: Pen) {
        this.setCurrentPen(value);
    }
    protected getCurrentPen(): Pen {
        return this.myCurrentPen;
    }
    protected setCurrentPen(value: Pen) {
        this.myCurrentPen = value;
    }

    private myCurrentBrush: Brush = undefined as any;
    public get CurrentBrush(): Brush {
        return this.getCurrentBrush();
    }
    public set CurrentBrush(value: Brush) {
        this.setCurrentBrush(value);
    }
    protected getCurrentBrush(): Brush {
        return this.myCurrentBrush;
    }
    protected setCurrentBrush(value: Brush) {
        this.myCurrentBrush = value;
    }

    public setSize(width: int, height: int) {
        this.width = width;
        this.height = height;
    }
    public abstract provideRenderer2D(): T;
    public abstract init(): void;
    public get CompositingMode(): CompositingMode {
        return this.compositing_mode;
    }
    public set CompositingMode(value: CompositingMode) {
        this.compositing_mode = value;
        switch (this.compositing_mode) {
            case CompositingMode.SourceCopy:
                this.renderer.setBlendMode(CGBlendMode.Copy);
                break;
            case CompositingMode.SourceOver:
                this.renderer.setBlendMode(CGBlendMode.Overlay);
                break;
        }
    }

    public Graphics(context: CanvasRenderingContext2D, flipped: boolean): void;
    public Graphics(context: CGContext2D, flipped: boolean): void;
    public Graphics(context: CGContext2D | CanvasRenderingContext2D, flipped: boolean = true): void {
        if (context == null)
            throw new ArgumentNullException(nameof(context));
        this.isFlipped = flipped;
        this.screenScale = 1;
        if (context instanceof CGContext2D) {
            this.initializeContext(context);
        } else {
            this.initializeContext(new CGContext2D(context));
        }
    }

    public DeltaTime: int = 0;
    public FPS: int = 0;
    public MemoryUsage: int = 0;
    private totalFPS: int = 0;
    private totalFPSCount: int = 0;
    private AvgFPS: int = 0;
    public FrameCount: int = 0;
    private prevFPS: int = 0;

    private begin() {
        beginTime = (performance || Date).now();
    }
    private end(): number {
        frames++;
        var time = (performance || Date).now();
        this.DeltaTime = time - beginTime;
        if (time >= prevTime + 1000) {
            this.FPS = Math.round((frames * 1000) / (time - prevTime));
            prevTime = time;
            frames = 0;
            var memory = (performance as any).memory;
            this.MemoryUsage = Math.round(memory?.usedJSHeapSize / 1048576);/* , memory.jsHeapSizeLimit / 1048576 */;
        }
        return time;
    }
    public CreateTween(obj: any, props?: any): Tween {
        //Tween._ticker = this.ticker;
        const tween = Tween.get(obj, props);
        return tween;
    }
    public UpdateTween(event: any) {
        Tween.handleEvent(event);
    }
    public RequestAnimationFrame(func: Function): void {
        this.ticker.addEventListener('tick', (event) => {
            this.begin();
            //Tween.handleEvent(event);
            // TWEEN.update(event.time);
            func(event.time);
            this.end();

            this.totalFPS += this.FPS;
            this.AvgFPS = Math.round(this.totalFPS / this.totalFPSCount);
            if (this.totalFPSCount > 1000) {
                this.totalFPS = this.FPS;
                this.totalFPSCount = 0;
            }
            this.FrameCount++;
            this.totalFPSCount++;
            this.prevFPS = this.FPS;
        });
    }

    private modeAdjust(a: number, b: number, c: number, d: number, mode: AngleModes | EllipseModes | RectangleModes): CGRectangle {
        if (mode === EllipseModes.Corner) {
            return new CGRectangle({ x: a, y: b, width: c, height: d });
        } else if (mode === EllipseModes.Corners) {
            return new CGRectangle({ x: a, y: b, width: c - a, height: d - b });
        } else if (mode === EllipseModes.Radians) {
            return new CGRectangle({ x: a - c, y: b - d, width: 2 * c, height: 2 * d });
        } else if (mode === EllipseModes.Center) {
            return new CGRectangle({ x: a - c * 0.5, y: b - d * 0.5, width: c, height: d });
        }
        return CGRectangle.Empty;
    }
    protected initializeContext(context: IContext2D) {
        this.renderer = context as any;

        context.saveState();

        this.modelMatrix = new Matrix();
        this.viewMatrix = new Matrix();
        this.modelViewMatrix = new Matrix();

        this.boundingBox = context.getClipBoundingBox();

        this.graphicsUnit = GraphicsUnit.Pixel;
        this.pageScale = 1;

        // Set anti-aliasing
        this.SmoothingMode = SmoothingMode.Default;

        this.setupgetView();


    }

    private initializeMatrix(matrix: Out<Matrix>, isFlipped: boolean): void {
        if (!isFlipped) {
            //				matrix.Reset();
            //				matrix.Translate(0, boundingBox.Height, MatrixOrder.Append);
            //				matrix.Scale(1,-1, MatrixOrder.Append);
            matrix.value = new Matrix(1, 0, 0, -1, 0, this.boundingBox.Height);

        }
        else {
            matrix.value.reset();
        }

        // It looks like we really do not need to determin if it is flipped or not.
        // So far this following is working no matter which coordinate system is being used
        // on both Mac and iOS.
        // I will leave the previous commented out code there just in case.  When first implementing
        // DrawString the flipped coordinates were causing problems.  Now after implementing with
        // CoreText it seems to all be working.  Fingers Crossed.
        //matrix = new Matrix(
        //	1, 0, 0, -1, 0, boundingBox.Height);
    }

    private graphicsUnitConvertX(x: float): float {
        return ConversionHelpers.GraphicsUnitConversion1(this.PageUnit, GraphicsUnit.Pixel, this.DpiX, x);
    }

    private graphicsUnitConvertY(y: float): float {
        return ConversionHelpers.GraphicsUnitConversion1(this.PageUnit, GraphicsUnit.Pixel, this.DpiY, y);
    }

    public dispose(disposing?: boolean): void {
        if (disposing) {
            if (this.renderer != null) {
                this.renderer.restoreState();
                if (this.hasClientTransform)
                    this.renderer.restoreState();
                this.renderer = undefined as any;
            }

            // PlatformDispose();
        }
    }

    public transferToImageBitmap(): ImageBitmap {
        return this.renderer.transferToImageBitmap();
    }
    public moveTo(point: CGPoint): void;
    public moveTo(x: float, y: float): void;
    public moveTo(x: float | CGPoint, y?: float): void {
        if (is.typeof<CGPoint>(x, CoreGraphicTypes.CGPoint)) {
            this.moveTo(x.X, x.Y);
        } else {
            this.renderer.moveTo(x, y as any);
        }
    }

    public lineTo(point: CGPoint): void;
    public lineTo(x: float, y: float): void;
    public lineTo(x: float | CGPoint, y?: float): void {
        if (is.typeof<CGPoint>(x, CoreGraphicTypes.CGPoint)) {
            this.lineTo(x.X, x.Y);
        } else {
            this.renderer.addLineToPoint(x, y as any);
        }
    }

    public curveTo(x1: float, y1: float, x2: float, y2: float, x3: float, y3: float): void {
        this.renderer.addCurveToPoint(x1, y1, x2, y2, x3, y3);
    }

    public preparePen(pen: Pen): void {

        if (pen.Width <= 1) {
            this.renderer.translateCTM(-.5, -.5);
        }
    }

    private strokePen(pen: Pen): void {

        // FIXME: draw custom start/end caps
        // First we call the Pen with a fill of false so the brush can setup the stroke
        // For LinearGradientBrush this will setup a TransparentLayer so the gradient can
        // be filled at the end.  See comments.
        (<any>pen).setup(this, false);
        this.renderer.drawPath(CGPathDrawingMode.Stroke);

        // Next we call the Pen with a fill of true so the brush can draw the Gradient.
        // For LinearGradientBrush this will draw the Gradient and end the TransparentLayer.
        // See comments.
        (<any>pen).setup(this, true);
        if (pen.Width <= 1) {
            this.renderer.translateCTM(.5, .5);
        }
    }

    private fillBrush(brush: Brush, fillMode: FillMode = FillMode.Alternate) {
        (<any>brush).setup(this, true);
        if (fillMode === FillMode.Alternate)
            this.renderer.eOFillPath();
        else
            this.renderer.fillPath();
    }


    /*  public drawArc(pen: Pen, rect: CGRectangle, startAngle: float, sweepAngle: float, mode?: ArcModes): void;
     public drawArc(pen: Pen, x: float, y: float, width: float, height: float, startAngle: float, sweepAngle: float, mode?: ArcModes): void;
     public drawArc(...args: any[]): void {


     } */
    public drawArc(pen: Pen, rect: CGRectangle, startAngle: float, sweepAngle: float): void;
    public drawArc(pen: Pen, x: float, y: float, width: float, height: float, startAngle: float, sweepAngle: float): void;
    public drawArc(pen: Pen, x: float | CGRectangle, y: float, width: float, height?: float, startAngle?: float, sweepAngle?: float): void {
        if (pen instanceof Pen && x instanceof CGRectangle && typeof y === 'number' && typeof width === 'number') {
            const rect: CGRectangle = x;
            const startAngle: float = y;
            const sweepAngle: float = width;
            this.drawArc(pen, rect.X, rect.Y, rect.Width, rect.Height, startAngle, sweepAngle);
        } else if (typeof x === 'number' && typeof y === 'number' && typeof width === 'number' && typeof height === 'number') {
            if (pen == null) {
                throw new ArgumentNullException(nameof(pen));
            }
            this.renderer.beginPath();
            this.preparePen(pen);
            this.drawEllipticalArc(x, y, width, height, startAngle!, sweepAngle!, false);
            this.strokePen(pen);
        }
    }

    public DrawLine(pen: Pen, pt1: CGPoint, pt2: CGPoint): void;
    public DrawLine(pen: Pen, x1: float, y1: float, x2: float, y2: float): void;
    public DrawLine(param1: Pen, param2: float | CGPoint, param3: float | CGPoint, param4?: float, param5?: float): void {

        if (is.typeof<CGPoint>(param2, CoreGraphicTypes.CGPoint) && is.typeof<CGPoint>(param3, CoreGraphicTypes.CGPoint)) {
            const pen: Pen = param1;
            const pt1: CGPoint = param2;
            const pt2: CGPoint = param3;
            if (pen == null)
                throw new ArgumentNullException(nameof(pen));

            // DrawLine is throwing an assertion error on MonoTouch
            // Assertion failed: (CGFloatIsValid(x) && CGFloatIsValid(y))
            // , function void CGPathAddLineToPoint(CGMutablePathRef, const CGAffineTransform *, CGFloat, CGFloat)
            // What we will do here is not draw the line at all if any of the points are Single.NaN
            if (!Number.isNaN(pt1.X) && !Number.isNaN(pt1.Y) &&
                !Number.isNaN(pt2.X) && !Number.isNaN(pt2.Y)) {
                this.preparePen(pen);
                this.renderer.beginPath();
                this.moveTo(pt1.X, pt1.Y);
                this.lineTo(pt2.X, pt2.Y);
                this.strokePen(pen);
            }
        } else if (typeof param2 === 'number' && typeof param3 === 'number') {
            const pen: Pen = param1;
            const x1: float = param2;
            const y1: float = param3;
            const x2: float = param4 as any;
            const y2: float = param5 as any;

            if (pen == null) {
                throw new ArgumentNullException(nameof(pen));
            }
            this.preparePen(pen);
            this.renderer.beginPath();
            this.moveTo(x1, y1);
            this.lineTo(x2, y2);
            this.strokePen(pen);
        }

    }

    public drawBezier(pen: Pen, pt1: CGPoint, pt2: CGPoint, pt3: CGPoint, pt4: CGPoint): void;
    public drawBezier(pen: Pen, x1: float, y1: float, x2: float, y2: float, x3: float, y3: float, x4: float, y4: float): void;
    public drawBezier(pen: Pen, param2: float | CGPoint, param3: float | CGPoint, param4: float | CGPoint, param5: float | CGPoint, param6?: float, param7?: float, param8?: float, param9?: float): void {
        if (pen == null) {
            throw new ArgumentNullException(nameof(pen));
        }

        this.preparePen(pen);
        this.renderer.beginPath();
        if (is.typeof<CGPoint>(param2, CoreGraphicTypes.CGPoint) &&
            is.typeof<CGPoint>(param3, CoreGraphicTypes.CGPoint) && is.typeof<CGPoint>(param4, CoreGraphicTypes.CGPoint) &&
            is.typeof<CGPoint>(param5, CoreGraphicTypes.CGPoint)) {
            this.moveTo(param2.X, param2.Y);
            this.curveTo(param3.X, param3.Y, param4.X, param4.Y, param5.X, param5.Y);
        } else if (typeof param2 === 'number' && typeof param3 === 'number' && typeof param4 === 'number' && typeof param5 === 'number') {
            this.moveTo(param2, param3);
            this.curveTo(param4, param5, param6 as any, param7 as any, param8 as any, param9 as any);
        }
        this.strokePen(pen);
    }

    public drawBeziers(pen: Pen, points: CGPoint[]): void {
        if (pen == null)
            throw new ArgumentNullException(nameof(pen));
        if (points == null)
            throw new ArgumentNullException(nameof(points));
        const length: number = points.length;
        if (length < 4)
            return;

        for (let i = 0; i < length - 1; i += 3) {
            const p1: CGPoint = points[i];
            const p2: CGPoint = points[i + 1];
            const p3: CGPoint = points[i + 2];
            const p4: CGPoint = points[i + 3];

            this.drawBezier(pen, p1, p2, p3, p4);
        }
    }

    public drawLines(pen: Pen, points: CGPoint[]) {
        if (pen == null)
            throw new ArgumentNullException(nameof(pen));

        if (points == null)
            throw new ArgumentNullException(nameof(points));
        const count: float = points.length;
        if (count < 2)
            return;

        this.preparePen(pen);
        this.renderer.beginPath();
        this.moveTo(points[0]);
        for (let i = 1; i < count; i++)
            this.lineTo(points[i]);
        this.strokePen(pen);
    }

    private rectanglePath(x: float, y: float, w: float, h: float, tl?: number, tr?: number, br?: number, bl?: number): void {

        this.renderer.beginPath();
        if (typeof tl === 'undefined') {
            // No rounded corners
            this.renderer.addRect(new CGRectangle(x, y, w, h));
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

            var hw = w / 2;
            var hh = h / 2;

            // Clip radii
            if (w < 2 * tl) {
                tl = hw;
            }
            if (h < 2 * tl) {
                tl = hh;
            }
            if (w < 2 * tr) {
                tr = hw;
            }
            if (h < 2 * tr) {
                tr = hh;
            }
            if (w < 2 * br) {
                br = hw;
            }
            if (h < 2 * br) {
                br = hh;
            }
            if (w < 2 * bl) {
                bl = hw;
            }
            if (h < 2 * bl) {
                bl = hh;
            }

            // Draw shape
            this.renderer.beginPath();
            this.renderer.moveTo(x + tl, y);
            this.renderer.addArcToPoint(x + w, y, x + w, y + h, tr);
            this.renderer.addArcToPoint(x + w, y + h, x, y + h, br);
            this.renderer.addArcToPoint(x, y + h, x, y, bl);
            this.renderer.addArcToPoint(x, y, x + w, y, tl);
            this.renderer.closePath();

            /*  this.context.beginPath();
             this.moveTo(x1, y1);
             this.lineTo(x1, y2);
             this.lineTo(x2, y2);
             this.lineTo(x2, y1);
             this.lineTo(x1, y1);
             this.context.closePath(); */
        }
    }

    public DrawRectangle(pen: Pen, rect: CGRectangle, mode?: RectangleModes): void;
    public DrawRectangle(pen: Pen, rect: CGRectangle, tl: number, tr?: number, br?: number, bl?: number, mode?: RectangleModes): void;
    public DrawRectangle(pen: Pen, x1: float, y1: float, w: float, h: float, mode?: RectangleModes): void;
    public DrawRectangle(pen: Pen, x1: float, y1: float, w: float, h: float, tl: number, tr?: number, br?: number, bl?: number, mode?: RectangleModes): void;
    public DrawRectangle(...args: any[]): void {
        const pen = args[0];
        if (pen == null)
            throw new ArgumentNullException(nameof(pen));

        if (args.length === 2 && is.typeof<CGRectangle>(args[1], CoreGraphicTypes.CGRectangle)) {
            const rect: CGRectangle = args[1];
            this.DrawRectangle(pen, rect.X, rect.Y, rect.Width, rect.Height);
        } else if (args.length === 3 && is.typeof<CGRectangle>(args[1], CoreGraphicTypes.CGRectangle) && typeof args[2] === 'string') {
            const rect: CGRectangle = args[1];
            const mode: RectangleModes = args[2] as any;
            this.DrawRectangle(pen, rect.X, rect.Y, rect.Width, rect.Height, mode);
        } else if (args.length === 3 && is.typeof<CGRectangle>(args[1], CoreGraphicTypes.CGRectangle) && typeof args[2] === 'string') {
            const rect: CGRectangle = args[1];
            const mode: RectangleModes = args[2] as any;
            this.DrawRectangle(pen, rect.X, rect.Y, rect.Width, rect.Height, mode);
        } else if (args.length >= 3 && is.typeof<CGRectangle>(args[1], CoreGraphicTypes.CGRectangle) && typeof args[2] === 'number') {
            const rect: CGRectangle = args[1];
            const tl: number = args[2];
            let tr: number = args[3];
            let br: number = args[4];
            let bl: number = args[5];
            const mode: RectangleModes = args[6] || RectangleModes.Corner;

            if (typeof tr === 'undefined') {
                tr = tl;
            }
            if (typeof br === 'undefined') {
                br = tr;
            }
            if (typeof bl === 'undefined') {
                bl = br;
            }
            this.DrawRectangle(pen, rect.X, rect.Y, rect.Width, rect.Height, tl, tr, br, bl, mode);
        } else if (args.length === 5) {
            const x: number = args[1];
            const y: number = args[2];
            const w: number = args[3];
            const h: number = args[4];
            const mode: RectangleModes = RectangleModes.Corner;

            this.DrawRectangle(pen, x, y, w, h, mode);
        } else if (args.length === 6 && typeof args[5] === 'string') {
            const x: number = args[1];
            const y: number = args[2];
            const w: number = args[3];
            const h: number = args[4];
            const mode: RectangleModes = args[5] as any;

            this.DrawRectangle(pen, x, y, w, h, 0, 0, 0, 0, mode);
        } else if (args.length >= 6 && args.length < 10) {
            const x: number = args[1];
            const y: number = args[2];
            const w: number = args[3];
            const h: number = args[4];
            const tl: number = args[5];
            let tr: number = args[6];
            let br: number = args[7];
            let bl: number = args[8];
            const mode: RectangleModes = args[9] || RectangleModes.Corner;

            if (typeof tr === 'undefined') {
                tr = tl;
            }
            if (typeof br === 'undefined') {
                br = tr;
            }
            if (typeof bl === 'undefined') {
                bl = br;
            }
            this.DrawRectangle(pen, x, y, w, h, tl, tr, br, bl, mode);
        }
        else if (args.length === 10) {
            this.preparePen(pen);
            const x: number = args[1];
            const y: number = args[2];
            const w: number = args[3];
            const h: number = args[4];
            const tl: number = args[5];
            const tr: number = args[6];
            const br: number = args[7];
            const bl: number = args[8];
            const mode: RectangleModes = args[9] || RectangleModes.Corner;
            const adjustedRect = this.modeAdjust(x, y, w, h, mode);
            this.rectanglePath(adjustedRect.X, adjustedRect.Y, adjustedRect.Width, adjustedRect.Height, tl, tr, br, bl);
            this.strokePen(pen);
        }
    }

    public FillRectangle(brush: Brush, rect: CGRectangle, mode?: RectangleModes): void;
    public FillRectangle(brush: Brush, rect: CGRectangle, tl: number, tr?: number, br?: number, bl?: number, mode?: RectangleModes): void;
    public FillRectangle(brush: Brush, x1: float, y1: float, w: float, h: float, mode?: RectangleModes): void;
    public FillRectangle(brush: Brush, x1: float, y1: float, w: float, h: float, tl: number, tr?: number, br?: number, bl?: number, mode?: RectangleModes): void;
    public FillRectangle(...args: any[]): void {
        const brush: Brush = args[0];

        if (brush == null)
            throw new ArgumentNullException(nameof(brush));

        if (args.length === 2 && is.typeof<CGRectangle>(args[1], CoreGraphicTypes.CGRectangle)) {
            const rect: CGRectangle = args[1];
            this.FillRectangle(brush, rect.X, rect.Y, rect.Width, rect.Height);
        } else if (args.length === 3 && is.typeof<CGRectangle>(args[1], CoreGraphicTypes.CGRectangle) && typeof args[2] === 'string') {
            const rect: CGRectangle = args[1];
            const mode: RectangleModes = args[2] as any;
            this.FillRectangle(brush, rect.X, rect.Y, rect.Width, rect.Height, mode);
        } else if (args.length === 3 && is.typeof<CGRectangle>(args[1], CoreGraphicTypes.CGRectangle) && typeof args[2] === 'string') {
            const rect: CGRectangle = args[1];
            const mode: RectangleModes = args[2] as any;
            this.FillRectangle(brush, rect.X, rect.Y, rect.Width, rect.Height, mode);
        } else if (args.length >= 3 && is.typeof<CGRectangle>(args[1], CoreGraphicTypes.CGRectangle) && typeof args[2] === 'number') {
            const rect: CGRectangle = args[1];
            const tl: number = args[2];
            let tr: number = args[3];
            let br: number = args[4];
            let bl: number = args[5];
            const mode: RectangleModes = args[6] || RectangleModes.Corner;

            if (typeof tr === 'undefined') {
                tr = tl;
            }
            if (typeof br === 'undefined') {
                br = tr;
            }
            if (typeof bl === 'undefined') {
                bl = br;
            }
            this.FillRectangle(brush, rect.X, rect.Y, rect.Width, rect.Height, tl, tr, br, bl, mode);
        } else if (args.length === 5) {
            const x: number = args[1];
            const y: number = args[2];
            const w: number = args[3];
            const h: number = args[4];
            const mode: RectangleModes = RectangleModes.Corner;

            this.FillRectangle(brush, x, y, w, h, mode);
        } else if (args.length === 6 && typeof args[5] === 'string') {
            const x: number = args[1];
            const y: number = args[2];
            const w: number = args[3];
            const h: number = args[4];
            const mode: RectangleModes = args[5] as any;

            this.FillRectangle(brush, x, y, w, h, 0, 0, 0, 0, mode);
        } else if (args.length >= 6 && args.length < 10) {
            const x: number = args[1];
            const y: number = args[2];
            const w: number = args[3];
            const h: number = args[4];
            const tl: number = args[5];
            let tr: number = args[6];
            let br: number = args[7];
            let bl: number = args[8];
            const mode: RectangleModes = args[9] || RectangleModes.Corner;

            if (typeof tr === 'undefined') {
                tr = tl;
            }
            if (typeof br === 'undefined') {
                br = tr;
            }
            if (typeof bl === 'undefined') {
                bl = br;
            }
            this.FillRectangle(brush, x, y, w, h, tl, tr, br, bl, mode);
        }
        else if (args.length === 10) {
            const x: number = args[1];
            const y: number = args[2];
            const w: number = args[3];
            const h: number = args[4];
            const tl: number = args[5];
            const tr: number = args[6];
            const br: number = args[7];
            const bl: number = args[8];
            const mode: RectangleModes = args[9] || RectangleModes.Corner;
            const adjustedRect = this.modeAdjust(x, y, w, h, mode);
            this.translateTransform(adjustedRect.X, adjustedRect.Y);
            this.rectanglePath(0, 0, adjustedRect.Width, adjustedRect.Height, tl, tr, br, bl);
            this.fillBrush(brush);
            this.translateTransform(-adjustedRect.X, -adjustedRect.Y);
        }

    }

    public fillRegion(brush: Brush, region: Region) {
        if (brush == null)
            throw new ArgumentNullException("brush");
        if (region == null)
            throw new ArgumentNullException("region");

        // We will clear the rectangle of our clipping bounds for Empty
        if (region.regionPath == null) {
            // This may set the rectangle to Black depending on the context
            // passed.  On a NSView set WantsLayers and the Layer Background color.
            this.renderer.clearRect(this.renderer.getClipBoundingBox());
            return;
        }

        this.renderer.addPath(region.regionPath as any);
        this.fillBrush(brush);
    }

    private makeEllipse(x: number, y: number, width: number, height: number, ellipseMode: EllipseModes) {
        if (width < 0) {
            width = Math.abs(width);
        }
        if (height < 0) {
            height = Math.abs(height);
        }
        const vals = this.modeAdjust(x, y, width, height, ellipseMode);

        x = vals.X,
            y = vals.Y,
            width = vals.Width,
            height = vals.Height;

        var kappa = 0.5522847498,
            ox = width / 2 * kappa, // control point offset horizontal
            oy = height / 2 * kappa, // control point offset vertical
            xe = x + width, // x-end
            ye = y + height, // y-end
            xm = x + width / 2, // x-middle
            ym = y + height / 2; // y-middle
        this.renderer.beginPath();
        this.renderer.moveTo(x, ym);
        this.renderer.addCurveToPoint(x, ym - oy, xm - ox, y, xm, y);
        this.renderer.addCurveToPoint(xm + ox, y, xe, ym - oy, xe, ym);
        this.renderer.addCurveToPoint(xe, ym + oy, xm + ox, ye, xm, ye);
        this.renderer.addCurveToPoint(xm - ox, ye, x, ym + oy, x, ym);
        this.renderer.closePath();

    }
    public drawPoint(pen: Pen, point: CGPoint): void;
    public drawPoint(pen: Pen, x: number, y: number): void;
    public drawPoint(...args: any[]): void {
        const pen: Pen = args[0];
        let x: float, y: float;
        if (args.length === 2 && is.typeof<CGPoint>(args[1], CoreGraphicTypes.CGPoint)) {
            x = Math.round(args[1].X);
            y = Math.round(args[1].Y);
        } else {
            x = Math.round(args[1]);
            y = Math.round(args[2]);
        }
        // swapping fill color to stroke and back after for correct point rendering
        const newBrush = new SolidBrush(pen.Color);
        if (pen.Width > 1) {
            this.renderer.beginPath();
            this.renderer.addArc(x, y, pen.Width / 2, 0, Math.PI * 2, false);
            this.fillBrush(newBrush);
        } else {
            this.renderer.beginPath();
            this.renderer.addRect(new CGRectangle(x, y, 1, 1));
            this.fillBrush(newBrush);
        }
    }
    public DrawEllipse(pen: Pen, rect: CGRectangle): void;
    public DrawEllipse(pen: Pen, x: float, y: float, radius: float, ellipseMode?: EllipseModes): void;
    public DrawEllipse(pen: Pen, x: float, y: float, width: float, height: float, ellipseMode?: EllipseModes): void;
    public DrawEllipse(...args: any[]): void {
        const pen: Pen = args[0];
        if (args.length === 2 && is.typeof<CGRectangle>(args[1], CoreGraphicTypes.CGRectangle)) {
            const rect: CGRectangle = args[1];
            this.DrawEllipse(pen, rect.X, rect.Y, rect.Width, rect.Height, EllipseModes.Corner)
        } else if (args.length === 4 &&
            (is.typeof<Pen>(args[0], GraphicTypes.Pen) && typeof args[1] === 'number' && typeof args[2] === 'number' && typeof args[3] === 'number')) {
            const x: number = args[1];
            const y: number = args[2];
            const w: number = args[3];
            const h: number = w;
            const mode: EllipseModes = EllipseModes.Corner;
            this.DrawEllipse(pen, x, y, w, h, mode);
        } else if (args.length === 5 &&
            (is.typeof<Pen>(args[0], GraphicTypes.Pen) && typeof args[1] === 'number' &&
                typeof args[2] === 'number' && typeof args[3] === 'number' && typeof args[4] === 'string')) {
            const x: number = args[1];
            const y: number = args[2];
            const w: number = args[3];
            const h: number = w;
            const mode: EllipseModes = args[4] as any;
            this.DrawEllipse(pen, x, y, w, h, mode);
        } else if (args.length === 5 &&
            (is.typeof<Pen>(args[0], GraphicTypes.Pen) && typeof args[1] === 'number' &&
                typeof args[2] === 'number' && typeof args[3] === 'number' && typeof args[4] === 'number')) {
            const x: number = args[1];
            const y: number = args[2];
            const w: number = args[3];
            const h: number = args[4];
            const mode: EllipseModes = EllipseModes.Corner;
            this.DrawEllipse(pen, x, y, w, h, mode);
        }
        else if (args.length === 6) {
            const x: number = args[1];
            const y: number = args[2];
            const w: number = args[3];
            const h: number = args[4];
            const mode: EllipseModes = args[5];
            this.preparePen(pen);
            this.makeEllipse(x, y, w, h, mode);
            this.strokePen(pen);

        }
        /* const pen: Pen = args[0];
        let rect: RectangleF;

        if (pen == null) {
            throw new ArgumentNullException(nameof(pen));
        }

        if (args.length === 2) {
            rect = args[1];
        } else if (args.length === 5) {
            rect = new RectangleF(args[1], args[2], args[3], args[4]);
        }
        this.preparePen(pen);
        this.context.beginPath();
        this.context.addEllipseInRect(rect);
        this.context.closePath();
        this.strokePen(pen); */
    }

    public FillEllipse(pen: Brush, rect: CGRectangle): void;
    public FillEllipse(pen: Brush, x: float, y: float, radius: float, ellipseMode?: EllipseModes): void;
    public FillEllipse(pen: Brush, x: float, y: float, width: float, height: float, ellipseMode?: EllipseModes): void;
    public FillEllipse(...args: any[]): void {
        const brush: Brush = args[0];
        if (args.length === 2 && is.typeof<CGRectangle>(args[1], CoreGraphicTypes.CGRectangle)) {
            const rect: CGRectangle = args[1];
            this.FillEllipse(brush, rect.X, rect.Y, rect.Width, rect.Height, EllipseModes.Corner)
        } else if (args.length === 4 &&
            (is.typeof<Brush>(args[0], GraphicTypes.Brush) && typeof args[1] === 'number' && typeof args[2] === 'number' && typeof args[3] === 'number')) {
            const x: number = args[1];
            const y: number = args[2];
            const w: number = args[3];
            const h: number = w;
            const mode: EllipseModes = EllipseModes.Corner;
            this.FillEllipse(brush, x, y, w, h, mode);
        } else if (args.length === 5 &&
            (is.typeof<Brush>(args[0], GraphicTypes.Brush) && typeof args[1] === 'number' &&
                typeof args[2] === 'number' && typeof args[3] === 'number' && typeof args[4] === 'string')) {
            const x: number = args[1];
            const y: number = args[2];
            const w: number = args[3];
            const h: number = w;
            const mode: EllipseModes = args[4] as any;
            this.FillEllipse(brush, x, y, w, h, mode);
        } else if (args.length === 5 &&
            (is.typeof<Brush>(args[0], GraphicTypes.Brush) && typeof args[1] === 'number' &&
                typeof args[2] === 'number' && typeof args[3] === 'number' && typeof args[4] === 'number')) {
            const x: number = args[1];
            const y: number = args[2];
            const w: number = args[3];
            const h: number = args[4];
            const mode: EllipseModes = EllipseModes.Corner;
            this.FillEllipse(brush, x, y, w, h, mode);
        }
        else if (args.length === 6) {
            const x: number = args[1];
            const y: number = args[2];
            const w: number = args[3];
            const h: number = args[4];
            const mode: EllipseModes = args[5];
            this.translateTransform(x, y);
            this.makeEllipse(0, 0, w, h, mode);
            this.fillBrush(brush);
            this.translateTransform(-x, -y);

        }
        /*  const brush: Brush = args[0];
         let rect: RectangleF;

         if (brush == null) {
             throw new ArgumentNullException("brush");
         }

         if (args.length === 2) {
             rect = args[1];
         } else if (args.length === 5) {
             rect = new RectangleF(args[1], args[2], args[3], args[4]);
         }

         this.context.beginPath();
         this.context.addEllipseInRect(rect);
         this.context.closePath();
         this.fillBrush(brush); */
    }

    private applyModelgetView(): void {

        // Since there is no context.SetCTM, only ConcatCTM
        // get the current transform, invert it, and concat this to
        // obtain the identity.   Then we concatenate the value passed
        this.renderer.concatCTM(this.modelViewMatrix.transform.invert());

        this.modelViewMatrix = this.viewMatrix.clone();
        this.modelViewMatrix.multiply(this.modelMatrix);

        //			Console.WriteLine("------------ apply Model View ------");
        //			Console.WriteLine("Model: " + modelMatrix.transform);
        //			Console.WriteLine("View: " + viewMatrix.transform);
        //			Console.WriteLine("ModelView: " + modelViewMatrix.transform);
        //			Console.WriteLine("------------ end apply Model View ------\n\n");
        // we apply the Model View matrix passed to the context
        this.renderer.concatCTM(this.modelViewMatrix.transform);

    }

    public resetTransform(): void {
        this.modelMatrix.reset();
        this.applyModelgetView();
    }

    public get Transform(): Matrix {
        return this.modelMatrix;
    }
    public set Transform(value: Matrix) {
        this.modelMatrix = value;
        this.applyModelgetView();
    }

    public rotateTransform(angle: float): void;
    public rotateTransform(angle: float, order: MatrixOrder): void;
    public rotateTransform(angle: float, order: MatrixOrder = MatrixOrder.Prepend): void {
        /* this.modelMatrix.rotate(angle, order);
        this.applyModelgetView(); */
        this.renderer.rotateCTM(angle);
    }

    public translateTransform(tx: float, ty: float): void;
    public translateTransform(tx: float, ty: float, order: MatrixOrder): void;
    public translateTransform(tx: float, ty: float, order: MatrixOrder = MatrixOrder.Prepend): void {
        //Console.WriteLine ("Currently does not support anything but prepend mode");
        /*  this.modelMatrix.translate(tx, ty, order);
         this.applyModelgetView(); */
        this.renderer.translateCTM(tx, ty);
    }

    public ScaleTransform(sx: float, sy: float): void;
    public ScaleTransform(sx: float, sy: float, order: MatrixOrder): void;
    public ScaleTransform(sx: float, sy: float, order: MatrixOrder = MatrixOrder.Prepend): void {
        // TODO scale de problem çıkardığı için commentlendi.
        //this.modelMatrix.scale(sx, sy, order);
        //this.applyModelgetView();
        this.renderer.scaleCTM(sx, sy);
    }

    private makeCurve(points: CGPoint[], tangents: CGPoint[], offset: number, length: number, type: CurveType): void {
        this.moveTo(points[offset].X, points[offset].Y);
        let i = offset;
        for (; i < offset + length; i++) {
            const j = i + 1;

            const x1: float = points[i].X + tangents[i].X;
            const y1: float = points[i].Y + tangents[i].Y;

            const x2: float = points[j].X - tangents[j].X;
            const y2: float = points[j].Y - tangents[j].Y;

            const x3: float = points[j].X;
            const y3: float = points[j].Y;

            this.renderer.addCurveToPoint(x1, y1, x2, y2, x3, y3);
        }

        if (type === CurveType.Close) {
            /* complete (close) the curve using the first point */
            const x1: float = points[i].X + tangents[i].X;
            const y1: float = points[i].Y + tangents[i].Y;

            const x2: float = points[0].X - tangents[0].X;
            const y2: float = points[0].Y - tangents[0].Y;

            const x3: float = points[0].X;
            const y3: float = points[0].Y;

            this.renderer.addCurveToPoint(x1, y1, x2, y2, x3, y3);

            this.renderer.closePath();
        }
    }
    public drawCurve(pen: Pen, points: CGPoint[]): void;
    public drawCurve(pen: Pen, points: CGPoint[], tension: float): void;
    public drawCurve(pen: Pen, points: CGPoint[], offset: number, numberOfSegments: number, tension: float): void
    public drawCurve(...args: any[]): void {
        if (args.length === 2) {
            const pen: Pen = args[0];
            const points: CGPoint[] = args[1];
            const tension: float = 0.5;
            if (points == null) {
                throw new ArgumentNullException(nameof(points));
            }
            const count: number = points.length;
            if (count == 2)
                this.drawLines(pen, points);
            else {
                const segments: number = (count > 3) ? (count - 1) : (count - 2);
                this.drawCurve(pen, points, 0, segments, tension);
            }
        } else if (args.length === 3) {
            const pen: Pen = args[0];
            const points: CGPoint[] = args[1];
            const tension: float = args[2];
            if (points == null) {
                throw new ArgumentNullException(nameof(points));
            }
            const count: number = points.length;
            if (count == 2)
                this.drawLines(pen, points);
            else {
                const segments: number = (count > 3) ? (count - 1) : (count - 2);
                this.drawCurve(pen, points, 0, segments, tension);
            }
        } else if (arguments.length === 5) {
            const pen: Pen = args[0];
            const points: CGPoint[] = args[1];
            const offset: number = args[2];
            const numberOfSegments: number = args[3];
            let tension: number = 0.5;
            if (args[4] != null) {
                tension = args[4];
            }

            if (points == null) {
                throw new ArgumentNullException(nameof(points));
            }
            if (pen == null) {
                throw new ArgumentNullException(nameof(pen));
            }
            if (numberOfSegments < 1) {
                throw new ArgumentException(nameof(numberOfSegments));
            }

            const count = points.length;
            // we need 3 points for the first curve, 2 more for each curves
            // and it's possible to use a point prior to the offset (to calculate)
            if (offset === 0 && numberOfSegments === 1 && count < 3)
                throw new ArgumentException("invalid parameters");
            if (numberOfSegments >= points.length - offset)
                throw new ArgumentException("offset");

            var tangents = GeomUtilities.GetCurveTangents(CURVE_MIN_TERMS, points, count, tension, CurveType.Open);
            this.preparePen(pen);
            this.renderer.beginPath();
            this.makeCurve(points, tangents, offset, numberOfSegments, CurveType.Open);
            this.strokePen(pen);
        }
    }

    private plotPath(path: GraphicsPath): void {
        let x1: float = 0, y1: float = 0, x2: float = 0, y2: float = 0, x3: float = 0, y3: float = 0;
        const points: CGPoint[] = path.PathPoints;
        const types: byte[] = path.PathTypes;
        let bidx: number = 0;

        this.renderer.beginPath();
        for (let i = 0; i < points.length; i++) {
            var point = points[i];
            var type = types[i];

            switch (type & PathPointType.PathTypeMask) {
                case PathPointType.Start:
                    this.moveTo(point.X, point.Y);
                    break;

                case PathPointType.Line:
                    this.lineTo(point.X, point.Y);
                    break;

                case PathPointType.Bezier3:
                    // collect 3 points
                    switch (bidx++) {
                        case 0:
                            x1 = point.X;
                            y1 = point.Y;
                            break;
                        case 1:
                            x2 = point.X;
                            y2 = point.Y;
                            break;
                        case 2:
                            x3 = point.X;
                            y3 = point.Y;
                            break;
                    }
                    if (bidx === 3) {
                        this.renderer.addCurveToPoint(x1, y1, x2, y2, x3, y3);
                        bidx = 0;
                    }
                    break;
                default:
                    throw new Error("Inconsistent internal state, path type=" + type);
            }
            if ((type & PathPointType.CloseSubpath) !== 0)
                this.renderer.closePath();
        }
    }


    public drawContextPath(pen: Pen): void {
        this.strokePen(pen);
    }
    public drawPath(pen: Pen, path: GraphicsPath): void {
        if (pen == null) {
            throw new ArgumentNullException(nameof(pen));
        }

        if (path == null) {
            throw new ArgumentNullException(nameof(path));
        }

        this.preparePen(pen);
        this.plotPath(path);
        this.strokePen(pen);
    }

    public fillContextPath(brush: Brush): void {
        if (brush == null) {
            throw new ArgumentNullException(nameof(brush));
        }
        this.fillBrush(brush);
    }
    public fillPath(brush: Brush, path: GraphicsPath): void {
        if (brush == null) {
            throw new ArgumentNullException(nameof(brush));
        }
        if (path == null) {
            throw new ArgumentNullException(nameof(path));
        }
        this.plotPath(path);

        var fillMode = path.FillMode;
        if (path.isReverseWindingOnFill)
            fillMode = (fillMode === FillMode.Alternate) ? FillMode.Winding : FillMode.Alternate;

        this.fillBrush(brush, fillMode);
    }

    public getNearestColor(color: CGColor): CGColor {
        // this uses a color pallette which we really do not implement
        // so just return back the color passed for now.
        return CGColor.FromRgba(color.R, color.G, color.B);
    }

    private setupgetView(): void {
        const outParam: Out<Matrix> = { value: this.viewMatrix };
        this.initializeMatrix(outParam, this.isFlipped);

        // Take into account retina diplays
        this.viewMatrix.scale(this.screenScale, this.screenScale);

        this.userspaceScaleX = this.graphicsUnitConvertX(1) * this.pageScale;
        this.userspaceScaleY = this.graphicsUnitConvertY(1) * this.pageScale;
        this.viewMatrix.scale(this.userspaceScaleX, this.userspaceScaleY);
        this.viewMatrix.translate(this.renderingOrigin.X * this.userspaceScaleX,
            -this.renderingOrigin.Y * this.userspaceScaleY, MatrixOrder.Append);
        this.applyModelgetView();
    }

    public get PageUnit(): GraphicsUnit {

        return this.graphicsUnit;
    }
    public set PageUnit(value: GraphicsUnit) {
        this.graphicsUnit = value;
        this.setupgetView();
    }

    public get PageScale(): float {
        return this.pageScale;
    }
    public set PageScale(value: float) {
        // TODO: put some validation in here maybe?  Need to
        this.pageScale = value;
        this.setupgetView();
    }


    /* public static FromImage(image: CGImage): Graphics {

        if (image == null)
            throw new ArgumentNullException(nameof(image));


        return new Graphics(image.getContext()); */

    // FIXME:
    //throw new NotImplementedException('Graphics.FromImage');
    /*  if (isNullOrUndefined(image))
         throw new ArgumentNullException(nameof(image));

     if ((image.PixelFormat & PixelFormat.Indexed) != 0)
         throw new Exception("Cannot create Graphics from an indexed bitmap.");

     const b: Bitmap = as(image, Bitmap);
     if (isNullOrUndefined(b)) {
         throw new Exception("Can not create Graphics contexts from " + image.GetType() + " Images, only Bitmaps are supported");
     }

     var bitmapContext = b.getRenderableContext();
     return new Graphics(bitmapContext, false); */
    // }

    public setClip(rect: CGRectangle): void;
    public setClip(graphicsPath: GraphicsPath): void;
    public setClip(g: Graphics): void;
    public setClip(rect: CGRectangle, combineMode: CombineMode): void;
    public setClip(graphicsPath: GraphicsPath, combineMode: CombineMode): void;
    public setClip(g: Graphics, combineMode: CombineMode): void;
    public setClip(region: Region, combineMode: CombineMode): void;
    public setClip(...args: any[]): void {
        if (args.length === 1 && is.typeof<CGRectangle>(args[0], CoreGraphicTypes.CGRectangle)) {
            this.setClip(args[0], CombineMode.Replace);
        } else if (args.length === 1 && is.typeof<GraphicsPath>(args[0], GraphicTypes.GraphicsPath)) {
            this.setClip(args[0], CombineMode.Replace);
        } else if (args.length === 1 && is.typeof<Graphics>(args[0], GraphicTypes.Graphics)) {
            this.setClip(args[0], CombineMode.Replace);
        } else if (args.length === 2 && is.typeof<CGRectangle>(args[0], CoreGraphicTypes.CGRectangle)) {
            if (args[1] === CombineMode.Intersect) {
                // TODO: aşağıdaki kod yavaşlık ve kullanılmadığı için kapatıldı.
                /* if (this.clip == null || this.clip.isInfinite(this)) {
                    this.clip = new Region(args[0]);
                } else {
                    this.clip.intersect(args[0]);
                } */
                this.renderer.clipToRect(args[0]);
            } else if (args[1] === CombineMode.Replace) {
                if (args[1] === CombineMode.Replace && this.clip != null && !this.clip.isInfinite(this as any)) {
                    this.resetNativeClip();
                }
                this.clip = new Region(args[0]);
                this.renderer.clipToRect(args[0]);
            } else {
                this.setClip(new Region(args[0]), args[1]);
            }
        } else if (args.length === 2 && is.typeof<GraphicsPath>(args[0], GraphicTypes.GraphicsPath)) {
            this.setClip(new Region(args[0]), args[1]);
        } else if (args.length === 2 && is.typeof<Graphics>(args[0], GraphicTypes.Graphics)) {
            throw new NotImplementedException('Graphics.setClip');
        } else if (args.length === 2 && args[0] instanceof Region) {
            const region: Region = args[0];
            // We need to reset the clip that is active now so that the graphic
            // states are correct when we set them.
            this.resetNativeClip();

            switch (args[1]) {
                case CombineMode.Replace:
                    // Set our clip region by cloning the region that is passed for now
                    this.clip = region.clone();
                    break;
                case CombineMode.Intersect:
                    if (this.clip == null) {
                        this.clip = region.clone();
                    } else {
                        this.clip.intersect(region);
                    }
                    break;
                case CombineMode.Union:
                    if (this.clip != null) {
                        this.clip.union(region);
                    }
                    break;
                case CombineMode.Exclude:
                    if (this.clip == null) {
                        this.clip = new Region();
                    }
                    this.clip.exclude(region);
                    break;
                case CombineMode.Xor:
                    if (this.clip == null) {
                        this.clip = new Region();
                    }
                    this.clip.xor(region);
                    break;
                default:
                    throw new NotImplementedException("SetClip for CombineMode " + args[1] + " not implemented");
            }

            //Unlike the current path, the current clipping path is part of the graphics state.
            //Therefore, to re-enlarge the paintable area by restoring the clipping path to a
            //prior state, you must save the graphics state before you clip and restore the graphics
            //state after you’ve completed any clipped drawing.
            if (this.Clip.isEmpty(this as any)) {
                this.renderer.clipToRect(CGRectangle.Empty);
            } else {
                this.renderer.addPath(this.Clip.regionPath as any); // FIXME:
                this.renderer.closePath();
                this.renderer.clip();
            }
        }
    }

    public beginContainer(dstRect: CGRectangle, srcRect: CGRectangle, unit: GraphicsUnit): GraphicsContainer;
    public beginContainer(...args: any[]): GraphicsContainer {
        throw new NotImplementedException('beginContainer');
    }

    public endContainer(container: GraphicsContainer): void {
        throw new NotImplementedException('endContainer');
    }

    public get SmoothingMode(): SmoothingMode {
        return this.smoothingMode;
    }
    public set SmoothingMode(value: SmoothingMode) {
        if (this.smoothingMode !== value) {
            // Quartz performs antialiasing for a graphics context if both the allowsAntialiasing parameter
            // and the graphics state parameter shouldAntialias are true.
            switch (value) {
                case SmoothingMode.AntiAlias:
                case SmoothingMode.HighQuality:
                case SmoothingMode.Default:
                    if (this.smoothingMode !== SmoothingMode.AntiAlias &&
                        this.smoothingMode !== SmoothingMode.HighQuality &&
                        this.smoothingMode !== SmoothingMode.Default) {
                        //context.SetAllowsAntialiasing(true);  // This parameter is not part of the graphics state.
                        this.renderer.setShouldAntialias(true);
                    }
                    break;
                default:
                    if (this.smoothingMode === SmoothingMode.AntiAlias &&
                        this.smoothingMode === SmoothingMode.HighQuality &&
                        this.smoothingMode === SmoothingMode.Default) {
                        //context.SetAllowsAntialiasing(false); // This parameter is not part of the graphics state.
                        this.renderer.setShouldAntialias(false);
                    }
                    break;
            }
            this.smoothingMode = value;
        }
    }

    public get IsClipEmpty(): boolean {
        return this.Clip.isEmpty(this as any);
    }

    public get PixelOffsetMode(): PixelOffsetMode {
        //throw new NotImplementedException ();
        return PixelOffsetMode.None;
    }
    public set PixelOffsetMode(value: PixelOffsetMode) {
        //throw new NotImplementedException('set PixelOffsetMode');
        //console.error('set PixelOffsetMode not implemented.')
    }

    public get Clip(): Region {

        return this.clip == null ? Graphics.infiniteRegion : this.clip;
    }
    public set Clip(value: Region) {
        //this.setClip(value, CombineMode.Replace);
    }

    public get ClipBounds(): CGRectangle {
        return this.Clip.getBounds();
        //return context.GetClipBoundingBox ();
    }
    public set ClipBounds(value: CGRectangle) {
        this.setClip(value);
    }

    public get VisibleClipBounds(): CGRectangle {
        // FIXME
        return this.Clip.getBounds();
        //throw new NotImplementedException ();
    }
    public set VisibleClipBounds(value: CGRectangle) {
        throw new NotImplementedException('set VisibleClipBounds');
    }

    public get InterpolationMode(): InterpolationMode {
        return this.interpolationMode;
    }
    public set InterpolationMode(value: InterpolationMode) {
        this.interpolationMode = value;
        switch (value) {
            case InterpolationMode.Low:
                this.renderer.InterpolationQuality = CGInterpolationQuality.Low;
                break;
            case InterpolationMode.High:
            case InterpolationMode.HighQualityBicubic:
            case InterpolationMode.HighQualityBilinear:
                this.renderer.InterpolationQuality = CGInterpolationQuality.High;
                break;
            case InterpolationMode.NearestNeighbor:
            case InterpolationMode.Bicubic:
            case InterpolationMode.Bilinear:
                this.renderer.InterpolationQuality = CGInterpolationQuality.Medium;
                break;
            case InterpolationMode.Invalid:
                this.renderer.InterpolationQuality = CGInterpolationQuality.None;
                break;
            default:
                this.renderer.InterpolationQuality = CGInterpolationQuality.Default;
                break;
        }
    }

    public get RenderingOrigin(): CGPoint {
        return this.renderingOrigin;
    }
    public set RenderingOrigin(value: CGPoint) {
        this.renderingOrigin = value;
        this.setupgetView();
    }

    public get TextContrast(): number {
        throw new NotImplementedException('get TextContrast');
    }
    public set TextContrast(value: number) {
        throw new NotImplementedException('set TextContrast');
    }

    public get DpiX(): float {
        // We should probably read the NSScreen attributes and get the resolution
        //    but there are problems getting the value from NSValue to a Rectangle
        // We will set this to a fixed value for now
        return 96.0;
    }

    public get DpiY(): float {
        // We should probably read the NSScreen attributes and get the resolution
        //    but there are problems getting the value from NSValue to a Rectangle
        // We will set this to a fixed value for now
        return 96.0;
    }


    public get CompositingQuality(): CompositingQuality {
        // There is no support for CompositingQuality in CoreGraphics.
        // Instead of throwing a NotImplementedException we will just let
        // things fall through when setting and return Default always.
        return CompositingQuality.Default;
    }

    public get isVisibleClipEmpty(): boolean {
        return this.Clip.isEmpty(this as any);
    }


    public translateClip(dx: float, dy: float): void {
        if (this.clip != null) {
            this.Clip.translate(dx, dy);
            this.setClip(this.Clip, CombineMode.Replace);
        }
    }

    public resetClip(): void {
        this.resetNativeClip();
        this.clip = undefined as any;
    }

    public resetNativeClip(): void {
        this.LastPen = undefined as any;
        this.LastBrush = undefined as any;

        //Unlike the current path, the current clipping path is part of the graphics state.
        //Therefore, to re-enlarge the paintable area by restoring the clipping path to a
        //prior state, you must save the graphics state before you clip and restore the graphics
        //state after you’ve completed any clipped drawing.
        this.renderer.restoreState();
        this.renderer.saveState();
        this.modelViewMatrix.reset();
        this.applyModelgetView();
    }

    public excludeClip(region: Region): void;
    public excludeClip(rect: CGRectangle): void;
    public excludeClip(...args: any[]): void {
        this.setClip(args[0], CombineMode.Exclude);
    }

    public intersectClip(region: Region): void;
    public intersectClip(rect: CGRectangle): void;
    public intersectClip(...args: any[]): void {
        this.setClip(args[0], CombineMode.Intersect);
    }

    public clear(color?: CGColor): void {
        if (color == null) {
            this.renderer.clearRect(this.renderer.getClipBoundingBox());
        } else {
            this.renderer.saveState();
            //context.SetFillColorWithColor(new CGColor(color.R / 255f, color.G / 255f, color.B / 255f, color.A / 255f));
            this.renderer.setFillColor(color);
            this.renderer.fillRect(this.renderer.getClipBoundingBox());
            this.renderer.restoreState();
        }
    }

    public restore(gstate?: GraphicsState): void {
        //LastPen = gstate.lastPen;
        //LastBrush = gstate.lastBrush;
        if (gstate) {
            this.modelMatrix = gstate.model;
            this.viewMatrix = gstate.view;
            this.renderingOrigin = gstate.renderingOrigin;
            this.graphicsUnit = gstate.pageUnit;
            this.pageScale = gstate.pageScale;
            this.SmoothingMode = gstate.smoothingMode;
            this.clip = gstate.clipRegion;
            this.applyModelgetView();
        }
        this.renderer.restoreState();
    }

    public save(): GraphicsState {
        const currentState: GraphicsState = new GraphicsState();
        //currentState.lastPen = LastPen;
        //currentState.lastBrush = LastBrush;
        // Make sure we clone the Matrices or we will still modify
        // them after the save as they are the same objects.  Woops!!
        currentState.model = this.modelMatrix.clone();
        currentState.view = this.viewMatrix.clone();
        currentState.renderingOrigin = this.renderingOrigin;
        currentState.pageUnit = this.graphicsUnit;
        currentState.pageScale = this.pageScale;
        currentState.smoothingMode = this.smoothingMode;
        currentState.clipRegion = (this.clip == null ? undefined : this.clip.clone()) as any;
        this.renderer.saveState();
        return currentState;
    }

    public drawClosedCurve(pen: Pen, points: CGPoint[]): void;
    public drawClosedCurve(pen: Pen, points: CGPoint[], tension: float, fillmode: FillMode): void;
    public drawClosedCurve(...args: any[]): void {
        if (args.length === 2) {
            if (args[0] == null) {
                throw new ArgumentNullException(nameof(args[0]));
            }
            if (args[1] == null) {
                throw new ArgumentNullException(nameof(args[1]));
            }

            this.drawClosedCurve(args[0], args[1], 0.5, FillMode.Winding);
        } else if (args.length === 4) {
            if (args[0] == null) {
                throw new ArgumentNullException(nameof(args[0]));
            }
            if (args[1] == null) {
                throw new ArgumentNullException(nameof(args[1]));
            }

            const count = args[1].length;

            if (count === 2) {
                this.drawPolygon(args[0], args[1]);
            }
            else {
                const segments = (count > 3) ? (count - 1) : (count - 2);

                const tangents = GeomUtilities.GetCurveTangents(CURVE_MIN_TERMS, args[1], count, args[2], CurveType.Close);
                this.preparePen(args[0]);
                this.makeCurve(args[1], tangents, 0, segments, CurveType.Close);
                this.strokePen(args[0]);
            }
        }
    }

    public fillClosedCurve(brush: Brush, points: CGPoint[], fillmode: FillMode, tension: float): void
    public fillClosedCurve(brush: Brush, points: CGPoint[]): void
    public fillClosedCurve(...args: any[]): void {

        if (args.length === 2) {
            if (args[0] == null) {
                throw new ArgumentNullException(nameof(args[0]));
            }
            if (args[1] == null) {
                throw new ArgumentNullException(nameof(args[1]));
            }

            this.fillClosedCurve(args[0], args[1], FillMode.Alternate, 0.5);
        } else if (args.length === 4) {
            args[3] = args[3] == null ? 0.5 : args[3];

            if (args[0] == null) {
                throw new ArgumentNullException(nameof(args[0]));
            }
            if (args[1] == null) {
                throw new ArgumentNullException(nameof(args[1]));
            }

            const count = args[1].length;
            if (count === 2)
                this.fillPolygon(args[0], args[1], FillMode.Alternate);
            else {
                const segments = (count > 3) ? (count - 1) : (count - 2);

                const tangents: CGPoint[] = GeomUtilities.GetCurveTangents(CURVE_MIN_TERMS, args[1], count, args[3], CurveType.Close);
                this.makeCurve(args[1], tangents, 0, segments, CurveType.Close);
                this.fillBrush(args[0]);
            }
        }
    }

    // FIXME:
    /* public drawIcon(icon: Icon, x: number, y: number): void;
    public drawIcon(icon: Icon, targetRect: RectangleF): void;
    public drawIcon(...args: any[]): void {
        if (args.length === 2) {
            if (isNullOrUndefined(args[0])) {
                throw new ArgumentNullException("icon");
            }

            const scaledSize: SizeF = this.context.convertSizeToDeviceSpace(new SizeF(args[1].Width, args[1].Height));
            icon = new Icon(args[0], new SizeF(scaledSize.Width, scaledSize.Height));

            this.drawImage(args[0].toBitmap(), args[1]);
        } else if (args.length === 3) {
            if (isNullOrUndefined(args[0])) {
                throw new ArgumentNullException("icon");
            }

            this.drawImage(args[0].toBitmap(), args[1], args[2]);
        }
    }

    public drawIconUnstretched(icon: Icon, targetRect: RectangleF): void {
        if (isNullOrUndefined(icon)) {
            throw new ArgumentNullException("icon");
        }

        this.drawImageUnscaled(icon.ToBitmap(), targetRect);
    } */

    public drawPie(pen: Pen, x: float, y: float, width: float, height: float, startAngle: float, sweepAngle: float): void;
    public drawPie(pen: Pen, rect: CGRectangle, startAngle: float, sweepAngle: float): void;
    public drawPie(...args: any[]): void {
        const pen: Pen = args[0];

        if (pen == null) {
            throw new ArgumentNullException(nameof(pen));
        }

        if (args.length === 4) {
            this.drawPie(pen, args[1].X, args[1].Y, args[1].Width, args[1].Height, args[2], args[3]);
        } else if (args.length === 7) {
            this.preparePen(pen);
            this.renderer.beginPath();
            this.drawEllipticalArc(args[1], args[2], args[3], args[4], args[5], args[6], true);
            this.strokePen(pen);
        }
    }

    private static radians(degrees: float): float {
        return degrees * Math.PI / 180;
    }

    public fillPie(brush: Brush, rect: CGRectangle, startAngle: float, sweepAngle: float): void;
    public fillPie(brush: Brush, x: float, y: float, width: float, height: float, startAngle: float, sweepAngle: float): void;
    public fillPie(...args: any[]) {
        const brush: Brush = args[0];

        if (brush == null) {
            throw new ArgumentNullException(nameof(brush));
        }

        if (args.length === 4) {
            this.renderer.beginPath();
            this.drawEllipticalArc(args[1], args[2], args[3], true);
            this.fillBrush(brush);
        } else if (args.length === 7) {
            this.renderer.beginPath();
            this.drawEllipticalArc(args[1], args[2], args[3], args[4], args[5], args[6], true);
            this.fillBrush(brush);
        }
    }

    private polygonSetup(points: CGPoint[]): void {
        if (points == null) {
            throw new ArgumentNullException(nameof(points));
        }
        if (points.length < 2) {
            throw new ArgumentException("Needs at least two points");
        }
        this.renderer.beginPath();
        this.moveTo(points[0]);
        for (let i = 0; i < points.length - 0; i++) {
            this.lineTo(points[i]);
        }
        this.renderer.closePath();
    }

    public drawPolygon(pen: Pen, points: CGPoint[]): void {
        if (pen == null) {
            throw new ArgumentNullException(nameof(pen));
        }
        this.preparePen(pen);
        this.polygonSetup(points);
        this.renderer.closePath();
        this.strokePen(pen);
    }

    public fillPolygon(brush: Brush, points: CGPoint[], fillMode: FillMode): void;
    public fillPolygon(brush: Brush, points: CGPoint[]): void;
    public fillPolygon(...args: any[]): void {
        const brush: Brush = args[0];
        const points: CGPoint[] = args[1];

        if (brush == null) {
            throw new ArgumentNullException(nameof(brush));
        }
        if (points == null) {
            throw new ArgumentNullException(nameof(points));
        }

        if (args.length === 2) {
            this.fillPolygon(brush, points, FillMode.Alternate);
        } else if (args.length === 3) {
            this.polygonSetup(points);
            this.fillBrush(brush, args[2]);
        }
    }

    public drawRectangles(pen: Pen, rects: CGRectangle[]): void {
        if (pen == null) {
            throw new ArgumentNullException(nameof(pen));
        }
        if (rects == null) {
            throw new ArgumentNullException(nameof(rects));
        }

        this.preparePen(pen);
        foreach(rects, (rect: CGRectangle) => {
            this.rectanglePath(rect.X, rect.Y, rect.Right, rect.Bottom);
        });
        this.strokePen(pen);
    }

    public fillRectangles(brush: Brush, rects: CGRectangle[]): void {
        if (brush == null) {
            throw new ArgumentNullException(nameof(brush));
        }
        if (rects == null) {
            throw new ArgumentNullException(nameof(rects));
        }

        foreach(rects, (rect: CGRectangle) => {
            this.rectanglePath(rect.X, rect.Y, rect.Right, rect.Bottom);
        })

        this.fillBrush(brush);
    }

    public flush(intention: FlushIntention): void;
    public flush(): void;
    public flush(...args: any[]): void {
        if (args.length === 0) {
            this.flush(FlushIntention.Flush);
        } else if (args.length === 1) {
            if (this.renderer == null) {
                return;
            }
            this.renderer.synchronize();
        }
    }

    public isVisible(x: float, y: float, width: float, height: float): boolean;
    public isVisible(x: float, y: float): boolean;
    public isVisible(rect: CGRectangle): boolean;
    public isVisible(point: CGPoint): boolean;
    public isVisible(...args: any[]): boolean {
        if (args.length === 1 && is.typeof<CGRectangle>(args[0], CoreGraphicTypes.CGRectangle)) {
            return this.Clip.isVisible(args[0] as any);
        } else if (args.length === 1 && is.typeof<CGPoint>(args[0], CoreGraphicTypes.CGPoint)) {
            return this.Clip.isVisible(args[0]);
        } else if (args.length === 2) {
            return this.Clip.isVisible(args[0], args[1]);
        } else if (args.length === 4) {
            return this.isVisible(new CGRectangle(args[0], args[1], args[2], args[3]));
        }
        return false;
    }

    public multiplyTransform(matrix: Matrix): void;
    public multiplyTransform(matrix: Matrix, order: MatrixOrder): void;
    public multiplyTransform(...args: any[]): void {
        if (args.length === 1) {
            this.multiplyTransform(args[0], MatrixOrder.Prepend);
        } else if (args.length === 2) {

            if (args[0] == null) {
                throw new ArgumentNullException(nameof(args[0]));
            }

            //if (args[1] === MatrixOrder.Prepend) {
            this.renderer.concatCTM(args[0].transform);
            //}
            //else {
            //   this.context.concatCTM(args[0].transform);
            //}
        }
    }

    public transformPoints(destSpace: CoordinateSpace, srcSpace: CoordinateSpace, pts: CGPoint[]): void {
        if (pts == null) {
            throw new ArgumentNullException(nameof(pts));
        }

        const transform: Out<Matrix> = newOutEmpty();
        transform.value = new Matrix();
        ConversionHelpers.GetGraphicsTransform(this as any, destSpace, srcSpace, transform);
        transform.value.transformPoints(pts);
    }

    public drawEllipticalArc(x: float, y: float, width: float, height: float, lambda1: float, lambda2: float,
        isPieSlice: boolean): void;
    public drawEllipticalArc(arcRect: CGRectangle, lambda1: float, lambda2: float,
        isPieSlice: boolean): void;
    public drawEllipticalArc(...args: any[]): void {

        if (args.length === 4) {
            GraphicsBase.make_arcs(this.renderer,
                args[0].X, args[0].Y, args[0].Width, args[0].Height,
                args[1], args[2],
                false, true, args[3]);
        } else if (args.length === 7) {
            GraphicsBase.make_arcs(this.renderer,
                args[0], args[1], args[2], args[3],
                args[4], args[5],
                false, true, args[6]);
        }

    }

    private static make_arc(graphics: IContext2D, start: boolean, x: float, y: float, width: float,
        height: float, startAngle: float, endAngle: float, antialiasing: boolean, isPieSlice: boolean): void {
        let delta: float, bcp: float;
        let sin_alpha: float, sin_beta: float, cos_alpha: float, cos_beta: float;
        let PI: float = Math.PI;

        const rx: float = width / 2;
        const ry: float = height / 2;

        /* center */
        const cx: float = x + rx;
        const cy = y + ry;

        /* angles in radians */
        let alpha: float = startAngle * PI / 180;
        let beta: float = endAngle * PI / 180;

        /* adjust angles for ellipses */
        alpha = Math.atan2(rx * Math.sin(alpha), ry * Math.cos(alpha));
        beta = Math.atan2(rx * Math.sin(beta), ry * Math.cos(beta));

        if (Math.abs(beta - alpha) > PI) {
            if (beta > alpha)
                beta -= 2 * PI;
            else
                alpha -= 2 * PI;
        }

        delta = beta - alpha;
        bcp = (4.0 / 3.0 * (1 - Math.cos(delta / 2)) / Math.sin(delta / 2));

        sin_alpha = Math.sin(alpha);
        sin_beta = Math.sin(beta);
        cos_alpha = Math.cos(alpha);
        cos_beta = Math.cos(beta);

        /* don't move to starting point if we're continuing an existing curve */
        if (start) {
            /* starting point */
            const sx: float = cx + rx * cos_alpha;
            const sy: float = cy + ry * sin_alpha;
            if (isPieSlice)
                graphics.addLineToPoint(sx, sy);
            else
                graphics.moveTo(sx, sy);
        }

        graphics.addCurveToPoint(cx + rx * (cos_alpha - bcp * sin_alpha),
            cy + ry * (sin_alpha + bcp * cos_alpha),
            cx + rx * (cos_beta + bcp * sin_beta),
            cy + ry * (sin_beta - bcp * cos_beta),
            cx + rx * cos_beta, cy + ry * sin_beta);
    }

    private static make_arcs(graphics: IContext2D, x: float, y: float, width: float, height: float, startAngle: float, sweepAngle: float,
        convert_units: boolean, antialiasing: boolean, isPieSlice: boolean) {
        let i: number;
        let drawn: float = 0;
        let endAngle: float;
        let enough: boolean = false;

        // I do not think we need to convert the units so commented this out.

        /* if required deal, once and for all, with unit conversions */
        //if (convert_units && !OPTIMIZE_CONVERSION(graphics))
        //{
        //    x = gdip_unitx_convgr(graphics, x);
        //    y = gdip_unity_convgr(graphics, y);
        //    width = gdip_unitx_convgr(graphics, width);
        //    height = gdip_unity_convgr(graphics, height);
        //}

        if (Math.abs(sweepAngle) >= 360) {
            graphics.addEllipseInRect(new CGRectangle(x, y, width, height));
            return;
        }

        endAngle = startAngle + sweepAngle;
        /* if we end before the start then reverse positions (to keep increment positive) */
        if (endAngle < startAngle) {
            var temp = endAngle;
            endAngle = startAngle;
            startAngle = temp;
        }

        if (isPieSlice) {
            graphics.moveTo(x + (width / 2), y + (height / 2));
        }

        /* i is the number of sub-arcs drawn, each sub-arc can be at most 90 degrees.*/
        /* there can be no more then 4 subarcs, ie. 90 + 90 + 90 + (something less than 90) */
        for (i = 0; i < 4; i++) {
            const current: float = startAngle + drawn;
            let additional: float;

            if (enough) {
                if (isPieSlice) {
                    graphics.closePath();
                }
                return;
            }

            additional = endAngle - current; /* otherwise, add the remainder */
            if (additional > 90) {
                additional = 90.0;
            }
            else {
                /* a near zero value will introduce bad artefact in the drawing (#78999) */
                if ((additional >= -0.0001) && (additional <= 0.0001)) {
                    return;
                }
                enough = true;
            }

            this.make_arc(graphics, (i === 0),	/* only move to the starting pt in the 1st iteration */
                x, y, width, height,	/* bounding rectangle */
                current, current + additional, antialiasing, isPieSlice);

            drawn += additional;

        }

        if (isPieSlice) {
            graphics.closePath();
        }

    }

    public measureCharacterRanges(text: string, font: Font, layoutRect: CGRectangle, stringFormat: StringFormat): Region[] {
        if ((text == null) || (text.length === 0))
            return new Array<Region>(0);

        if (font == null) {
            throw new ArgumentNullException("font");
        }

        if (stringFormat == null) {
            throw new ArgumentException("stringFormat");
        }

        // TODO:
        // FIXME TODO:
        const n: number = stringFormat.measurableCharacterRanges != null ? stringFormat.measurableCharacterRanges.length : 0;
        const regions: Region[] = new Array(n);
        for (let i = 0; i < n; ++i)
            regions[i] = new Region(); //layoutRect);

        return regions;
    }

    protected abstract measureStringEx(textstring: string, font: Font): TextMetricsEx;

    public MeasureString(text: string, font: Font): CGSize;
    public MeasureString(text: string, font: Font, width: number): CGSize;
    public MeasureString(text: string, font: Font, area: CGSize): CGSize;
    public MeasureString(text: string, font: Font, point: CGPoint, stringFormat: StringFormat): CGSize;
    public MeasureString(text: string, font: Font, area: CGSize, stringFormat: StringFormat): CGSize;
    public MeasureString(text: string, font: Font, width: number, stringFormat: StringFormat): CGSize;
    public MeasureString(text: string, font: Font, area: CGSize, format: StringFormat, charactersFitted: Out<number>, linesFilled: Out<number>): CGSize;
    public MeasureString(...args: any[]): CGSize {
        if (args.length === 2) {
            const textMetrics: TextMetricsEx = this.measureStringEx(args[0], args[1]);
            return new CGSize(textMetrics.width, textMetrics.height);
        } else if (args.length === 4) {
            const textMetrics: TextMetricsEx = this.measureStringEx(args[0], args[1]);
            return new CGSize(textMetrics.width, textMetrics.height);
        } else if (args.length === 6) {
            const text: string = args[0];
            const font: Font = args[1];
            const area: CGSize = args[2];
            const format: StringFormat = args[3];
            const charactersFitted: Out<number> = args[4];
            const linesFilled: Out<number> = args[5];

            const defaultStyle = {
                breakWords: false,
                fontFamily: font.Name,
                fontSize: font.Size,
                fontStyle: font.Style === FontStyle.Italic ? 'italic' : '',
                fontVariant: 'normal',
                fontWeight: 900,
                wordWrap: true,
                wordWrapWidth: area.Width,
                letterSpacing: 4,
            };

            const textMetrics = TextMetrics.measureText(text, new TextStyle(defaultStyle as any));
            return new CGSize(textMetrics.width, textMetrics.height);

        } else {
            //console.warn("NotImplementedException('Graphics.measureString not implemented.')");
            throw new NotImplementedException('Graphics.measureString not implemented.');
        }
       // return new CGSize(1, 1);

    }

    public drawString(s: string, font: Font, brush: Brush, x: float, y: float): void;
    public drawString(s: string, font: Font, brush: Brush, x: float, y: float, format: StringFormat): void;
    public drawString(s: string, font: Font, brush: Brush, point: CGPoint, format: StringFormat): void;
    public drawString(s: string, font: Font, brush: Brush, x: float, y: float, format: StringFormat): void;
    public drawString(s: string, font: Font, brush: Brush, layoutRectangle: CGRectangle, format: StringFormat): void;
    public drawString(...args: any[]): void {
        if (args.length === 5 && typeof args[3] === 'number' && typeof args[4] === 'number') {
            const s: string = args[0];
            const font: Font = args[1];
            const brush: Brush = args[2];
            const x: float = args[3];
            const y: float = args[4];
            font.setup(this.renderer);
            brush.setup(this as any, true);
            this.renderer.showText(s, x, y);
            return;
        } else if (args.length === 6 && typeof args[3] === 'number' && typeof args[4] === 'number' && is.typeof<StringFormat>(args[5], GraphicTypes.StringFormat)) {
            const s: string = args[0];
            const font: Font = args[1];
            const brush: Brush = args[2];
            const x: float = args[3];
            const y: float = args[4];
            const format: StringFormat = args[5];
            font.setup(this.renderer);
            brush.setup(this as any, true);
            if (format.FormatFlags & StringFormatFlags.DirectionVertical) {
                this.translateTransform(x + font.Size, y);
                this.rotateTransform(90 * Math.PI / 180);
            } else {
                this.translateTransform(x, y);
            }

            if (format.Alignment === StringAlignment.Near) {
                this.renderer.setTextAlign('start');
            } else if (format.Alignment === StringAlignment.Center) {
                this.renderer.setTextAlign('center');
            } else if (format.Alignment === StringAlignment.Far) {
                this.renderer.setTextAlign('right');
            }

            if (format.LineAlignment === StringAlignment.Near) {
                this.renderer.setTextBaseline('top');
            } else if (format.LineAlignment === StringAlignment.Center) {
                this.renderer.setTextBaseline('middle');
            } else if (format.LineAlignment === StringAlignment.Far) {
                this.renderer.setTextBaseline('bottom');
            }


            this.renderer.showText(s, 0, 0);
            if (format.FormatFlags & StringFormatFlags.DirectionVertical) {
                this.rotateTransform(-90 * Math.PI / 180);
                this.translateTransform(-(x + font.Size), -y);

            } else {
                this.translateTransform(-x, -y);
            }

        }
        else if (args.length === 5 && is.typeof<CGPoint>(args[3], CoreGraphicTypes.CGPoint)) {
            const s: string = args[0];
            const font: Font = args[1];
            const brush: Brush = args[2];
            const point: CGPoint = args[3];
            const format: StringFormat = args[4];
        }
        if (args.length === 5 && is.typeof<CGRectangle>(args[3], CoreGraphicTypes.CGRectangle)) {
            const s: string = args[0];
            const font: Font = args[1];
            const brush: Brush = args[2];
            const rect: CGRectangle = args[3];
            const format: StringFormat = args[4];
            let x: number = 0, y: number = 0;
            font.setup(this.renderer);
            brush.setup(this as any, true);

            if (format.Alignment === StringAlignment.Near) {
                this.renderer.setTextAlign('start');
                x = rect.X1;
            } else if (format.Alignment === StringAlignment.Center) {
                this.renderer.setTextAlign('center');
                x = rect.X1 + rect.Width / 2;
            } else if (format.Alignment === StringAlignment.Far) {
                this.renderer.setTextAlign('right');
                x = rect.X2;
            }

            if (format.LineAlignment === StringAlignment.Near) {
                this.renderer.setTextBaseline('top');
                y = rect.Y1;
            } else if (format.LineAlignment === StringAlignment.Center) {
                this.renderer.setTextBaseline('middle');
                y = rect.Y1 + rect.Height / 2;
            } else if (format.LineAlignment === StringAlignment.Far) {
                this.renderer.setTextBaseline('bottom');
                y = rect.Y2;
            }

            this.renderer.showText(s, x, y);

        } else if (args.length === 6) {

        } else {
            const s: string = args[0];
            const font: Font = args[1];
            const brush: Brush = args[2];
            const rect: CGRectangle = args[3];

            font.setup(this.renderer);
            brush.setup(this as any, true);
            this.renderer.showText(s, rect.X, rect.Y);
        }
    }

    /* public DrawImage(image: CGImage, point: CGPoint): void;
    public DrawImage(image: CGImage, x: float, y: float): void;
    public DrawImage(image: CGImage, rect: CGRectangle): void;
    public DrawImage(image: CGImage, x: float, y: float, width: float, height: float): void;
    public DrawImage(image: CGImage, x: float, y: float, srcRect: CGRectangle, srcUnit: GraphicsUnit): void;
    public DrawImage(image: CGImage, destRect: CGRectangle, srcRect: CGRectangle, srcUnit: GraphicsUnit): void;
    public DrawImage(image: CGImage, destPoints: CGPoint[], srcRect: CGRectangle, srcUnit: GraphicsUnit): void;
    public DrawImage(image: CGImage, destPoints: CGPoint[], srcRect: CGRectangle, srcUnit: GraphicsUnit, imageAttr: ImageAttributes): void;
    public DrawImage(image: CGImage, destPoints: CGPoint[], srcRect: CGRectangle, srcUnit: GraphicsUnit, imageAttr: ImageAttributes, callback: DrawImageAbort): void;
    public DrawImage(image: CGImage, destPoints: CGPoint[], srcRect: CGRectangle, srcUnit: GraphicsUnit, imageAttr: ImageAttributes, callback: DrawImageAbort, callbackData: int): void;
    public DrawImage(image: CGImage, destPoints: CGPoint[]): void;
    public DrawImage(image: CGImage, destRect: CGRectangle, srcX: float, srcY: float, srcWidth: float, srcHeight: float, srcUnit: GraphicsUnit): void;
    public DrawImage(image: CGImage, destRect: CGRectangle, srcX: float, srcY: float, srcWidth: float, srcHeight: float, srcUnit: GraphicsUnit, imageAttr: ImageAttributes): void;
    public DrawImage(image: CGImage, x: float, y: float, srcRect: CGRectangle, srcUnit: GraphicsUnit): void;
    public DrawImage(image: CGImage, destRect: CGRectangle, srcX: float, srcY: float, srcWidth: float, srcHeight: float, srcUnit: GraphicsUnit, imageAttrs: ImageAttributes, callback: DrawImageAbort, callbackData: any): void;
    public DrawImage(image: CGImage, rect: CGRectangle): void;
    public DrawImage(image: CGImage, x: float, y: float): void;
    public DrawImage(image: CGImage, destRect: CGRectangle, srcRect: CGRectangle): void;
    public DrawImage(image: CGImage, sx: float, sy: float, sw: float, sh: float): void;
    public DrawImage(image: CGImage, sx: float, sy: float, sw: float, sh: float, dx: float, dy: float): void;
    public DrawImage(image: CGImage, sx: float, sy: float, sw: float, sh: float, dx: float, dy: float, dw: float, dh: float): void;
    public DrawImage(...args: any[]): void {
        if (args.length === 2 && is.typeof<CGRectangle>(args[1], CoreGraphicTypes.CGRectangle)) {
            const rect: CGRectangle = args[1];
            this.DrawImage(args[0], rect.X, rect.Y, rect.Width, rect.Height);
        } else if (args.length === 2 && is.typeof<CGPoint>(args[1], CoreGraphicTypes.CGPoint)) {
            const point: CGPoint = args[1];
            this.DrawImage(args[0], point.X, point.Y);
        } else if (args.length === 3 && typeof args[1] === 'number' && typeof args[2] === 'number') {
            const img: CGImage = args[0];
            const x: number = args[1];
            const y: number = args[2];
            this.DrawImage(args[0], 0, 0, img.Width, img.Height, x, y);
        } else if (args.length === 3 && is.typeof<CGRectangle>(args[1], CoreGraphicTypes.CGRectangle) && is.typeof<CGRectangle>(args[2], CoreGraphicTypes.CGRectangle)) {
            const sRect: CGRectangle = args[1];
            const dRect: CGRectangle = args[2];
            this.DrawImage(args[0], sRect.X, sRect.Y, sRect.Width, sRect.Height, dRect.X, dRect.Y, dRect.Width, dRect.Height);
        } else if (args.length === 5 && typeof args[1] === 'number' && typeof args[2] === 'number' && typeof args[3] === 'number' && typeof args[4] === 'number') {
            const img: CGImage = args[0];
            const sx: number = args[1];
            const sy: number = args[2];
            const sw: number = args[3];
            const sh: number = args[4];
            this.DrawImage(args[0], 0, 0, img.Width, img.Height, sx, sy, sw, sh);
        } else if (args.length === 7 && typeof args[1] === 'number' && typeof args[2] === 'number' &&
            typeof args[3] === 'number' && typeof args[4] === 'number' &&
            typeof args[5] === 'number' && typeof args[6] === 'number') {
            const img: CGImage = args[0];
            const sx: number = args[1];
            const sy: number = args[2];
            const sw: number = args[3];
            const sh: number = args[4];
            const dx: number = args[5];
            const dy: number = args[6];
            this.DrawImage(args[0], sx, sy, sw, sh, dx, dy, sw, sh);
        }
        else if (args.length === 9) {
            const img: CGImage = args[0];
            const sx: float = args[1];
            const sy: float = args[2];
            const sw: float = args[3];
            const sh: float = args[4];
            const dx: float = args[5];
            const dy: float = args[6];
            const dw: float = args[7];
            const dh: float = args[8]
            try {
                let cnv;
                if (!cnv) {
                    cnv = img.canvas;
                }
                var s = 1;
                if (img.Width && img.Width > 0) {
                    s = cnv.width / img.Width;
                }
                this.renderer.drawImage(
                    cnv,
                    s * sx,
                    s * sy,
                    s * sw,
                    s * sh,
                    dx,
                    dy,
                    dw,
                    dh
                );
            } catch (e) {
                if (e.name !== 'NS_ERROR_NOT_AVAILABLE') {
                    throw e;
                }
            }
        }
    } */

    public DrawImage(image: Image, rect: CGRectangle): void;
    public DrawImage(image: Image, point: CGPoint): void;
    public DrawImage(image: Image, destPoints: CGPoint[]): void;
    public DrawImage(image: Image, x: int, y: int): void;
    public DrawImage(image: Image, destRect: CGRectangle, srcRect: CGRectangle, srcUnit: GraphicsUnit): void;
    public DrawImage(image: Image, destPoints: CGPoint[], srcRect: CGRectangle, srcUnit: GraphicsUnit): void;
    public DrawImage(image: Image, destPoints: CGPoint[], srcRect: CGRectangle, srcUnit: GraphicsUnit, imageAttr: ImageAttributes): void;
    public DrawImage(image: Image, x: float, y: float, width: float, height: float): void;
    public DrawImage(...args: any[]): void {
        if (args.length === 2 && is.typeof<Image>(args[0], GraphicTypes.Image) && is.typeof<CGRectangle>(args[1], CoreGraphicTypes.CGRectangle)) {
            const image: Image = args[0];
            const rect: CGRectangle = args[1];
            if (image == null)
                throw new ArgumentNullException("image");

            const status: Status = GDIPlus.GdipDrawImageRect(this.nativeObject, image.NativeObject, rect.X, rect.Y, rect.Width, rect.Height);
            GDIPlus.CheckStatus(status);
        } else if (args.length === 2 && is.typeof<Image>(args[0], GraphicTypes.Image) && is.typeof<CGPoint>(args[1], CoreGraphicTypes.CGPoint)) {
            const image: Image = args[0];
            const point: CGPoint = args[1];
            if (image == null)
                throw new ArgumentNullException("image");

            const status: Status = GDIPlus.GdipDrawImage(this.nativeObject, image.NativeObject, point.X, point.Y);
            GDIPlus.CheckStatus(status);
        } else if (args.length === 2 && is.typeof<Image>(args[0], GraphicTypes.Image) && is.array(args[1])) {
            const image: Image = args[0];
            const destPoints: CGPoint[] = args[1];
            if (image == null)
                throw new ArgumentNullException("image");
            if (destPoints == null)
                throw new ArgumentNullException("destPoints");

            const status: Status = GDIPlus.GdipDrawImagePoints(this.nativeObject, image.NativeObject, destPoints, destPoints.length);
            GDIPlus.CheckStatus(status);
        } else if (args.length === 3 && is.typeof<Image>(args[0], GraphicTypes.Image) && is.int(args[1]) && is.int(args[2])) {
            const image: Image = args[0];
            const x: int = args[1];
            const y: int = args[2];
            if (image == null)
                throw new ArgumentNullException("image");
            const status: Status = GDIPlus.GdipDrawImageI(this.nativeObject, image.NativeObject, x, y);
            GDIPlus.CheckStatus(status);
        } else if (args.length === 4 && is.typeof<Image>(args[0], GraphicTypes.Image) && is.typeof<CGRectangle>(args[1], CoreGraphicTypes.CGRectangle) && is.typeof<CGRectangle>(args[2], CoreGraphicTypes.CGRectangle) && is.int(args[3])) {
            const image: Image = args[0];
            const destRect: CGRectangle = args[1];
            const srcRect: CGRectangle = args[2];
            const srcUnit: GraphicsUnit = args[3];
            if (image == null)
                throw new ArgumentNullException("image");
            const status: Status = GDIPlus.GdipDrawImageRectRect(this.nativeObject, image.NativeObject,
                destRect.X, destRect.Y, destRect.Width, destRect.Height,
                srcRect.X, srcRect.Y, srcRect.Width, srcRect.Height,
                srcUnit, IntPtr.Zero, null as any, IntPtr.Zero);
            GDIPlus.CheckStatus(status);
        } else if (args.length === 4 && is.typeof<Image>(args[0], GraphicTypes.Image) && is.array(args[1]) && is.typeof<CGRectangle>(args[2], CoreGraphicTypes.CGRectangle) && is.int(args[3])) {
            const image: Image = args[0];
            const destPoints: CGPoint[] = args[1];
            const srcRect: CGRectangle = args[2];
            const srcUnit: GraphicsUnit = args[3];

            if (image == null)
                throw new ArgumentNullException("image");
            if (destPoints == null)
                throw new ArgumentNullException("destPoints");

            const status: Status = GDIPlus.GdipDrawImagePointsRect(this.nativeObject, image.NativeObject,
                destPoints, destPoints.length, srcRect.X, srcRect.Y,
                srcRect.Width, srcRect.Height, srcUnit, IntPtr.Zero,
                null as any, IntPtr.Zero);
            GDIPlus.CheckStatus(status);
        } else if (args.length === 5 && is.typeof<Image>(args[0], GraphicTypes.Image) && is.array(args[1]) && is.typeof<CGRectangle>(args[2], CoreGraphicTypes.CGRectangle) && is.int(args[3]) && is.typeof<ImageAttributes>(args[4], GraphicTypes.Imaging.ImageAttributes)) {
            const image: Image = args[0];
            const destPoints: CGPoint[] = args[1];
            const srcRect: CGRectangle = args[2];
            const srcUnit: GraphicsUnit = args[3];
            const imageAttr: ImageAttributes = args[4];
            if (image == null)
                throw new ArgumentNullException("image");
            if (destPoints == null)
                throw new ArgumentNullException("destPoints");
            const status: Status = GDIPlus.GdipDrawImagePointsRect(this.nativeObject, image.NativeObject,
                destPoints, destPoints.length, srcRect.X, srcRect.Y,
                srcRect.Width, srcRect.Height, srcUnit,
                imageAttr != null ? (imageAttr as any).NativeObject : IntPtr.Zero, null as any, IntPtr.Zero);
            GDIPlus.CheckStatus(status);
        } else if (args.length === 5 && is.typeof<Image>(args[0], GraphicTypes.Image) && is.int(args[1]) && is.int(args[2])) {
            const image: Image = args[0];
            const x: float = args[1];
            const y: float = args[2];
            const width: float = args[3];
            const height: float = args[4];
            if (image == null)
                throw new ArgumentNullException("image");
            const status: Status = GDIPlus.GdipDrawImageRect(this.nativeObject, image.NativeObject, x, y, width, height);
            GDIPlus.CheckStatus(status);
        }
    }

    /*  public drawSketch(sketchShape: (...args: any[]) => any, x: float, y: float, width: float, height: float): void {
         if ((<any>sketchShape).pIns == null) {

             if (sketchShape.prototype.setup == null && (<any>sketchShape).setup == null) {
                 sketchShape.prototype.setup = function () {
                     this.createCanvas(width, height);
                 }
             }

             sketchShape.prototype.x = x;
             sketchShape.prototype.y = y;
             sketchShape.prototype.width = width;
             sketchShape.prototype.height = height;
             sketchShape.prototype.mouseX = 0;
             sketchShape.prototype.mouseY = 0;

             var sketchInstance = new (<any>sketchShape)();

             window.addEventListener('mousemove', function (evt: MouseEvent) {
                 if (evt.offsetX < sketchShape.prototype.x) {
                     sketchShape.prototype.mouseX = 0;
                 } else if (evt.offsetX > x && evt.offsetX < x + width) {
                     sketchShape.prototype.mouseX = evt.offsetX - x;
                 }

                 if (evt.offsetY < sketchShape.prototype.y) {
                     sketchShape.prototype.mouseY = 0;
                 } else if (evt.offsetY > y && evt.offsetY < y + height) {
                     sketchShape.prototype.mouseY = evt.offsetY - y;
                 }


             });

             window.addEventListener('mousedown', function (evt: MouseEvent) {
                 if ((evt.offsetX > x && evt.offsetX < x + width) && (evt.offsetY > y && evt.offsetY < y + height)) {
                     if (sketchInstance.mousePressed != null) {
                         sketchInstance.mousePressed();
                     }
                 }

             });

              var ss = new Sketch(sketchInstance);
             (<any>sketchShape).pIns = ss;
         }
         var image = new Tuval.Image((<any>sketchShape).pIns.drawingContext);
         this.drawImage(image, x, y);
     } */

    /*  public background(color: number): void;
     public background(r: number, g: number, b: number): void;
     public background(color: string): void;
     public background(color: Color): void;
     public background(brush: Brush): void;
     public background(...args: any[]): void { }

     public fill(color: number): void;
     public fill(r: number, g: number, b: number): void;
     public fill(color: string): void;
     public fill(color: Color): void;
     public fill(brush: Brush): void;
     public fill(...args: any[]): void { }

     public stroke(color: number): void;
     public stroke(r: number, g: number, b: number): void;
     public stroke(color: string): void;
     public stroke(color: Color): void;
     public stroke(pen: Pen): void;
     public stroke(...args: any[]): void { }
     public noStroke(): void { }
     public strokeWeight(weight: number): void { }

     public line(x: number, y: number, x1: number, y1: number): void;
     public line(p1: PointF, p2: PointF): void;
     public line(...args: any[]): void { }

     public rect(x: number, y: number, w: number, h: number): void;
     public rect(x: number, y: number, w: number, h: number, tl?: number, tr?: number, br?: number, bl?: number): void;
     public rect(x: number, y: number, w: number, h: number, detailX?: number, detailY?: number): void;
     public rect(...args: any[]): void { }

     public ellipse(x: number, y: number, w: number, h: number): void;
     public ellipse(...args: any[]): void { }
     public lerpColor(c1: Color, c2: Color, amt: float): Color { return undefined; }

     public animate(animFunc: Function) { }


     public toRadians(angle: number): number { return undefined; } */

    public drawImageBitmap(image: ImageBitmap, x: float, y: float): void {
        this.renderer.drawImageBitmap(image, x, y);
    }


    public createRectangle(x: int, y: int, width: int, height: int): CGRectangle {
        return new CGRectangle(x, y, width, height);
    }
    public createColor(r: byte, g: byte, b: byte): CGColor {
        return new CGColor(Convert.ToByte(r), Convert.ToByte(g), Convert.ToByte(b));
    }
    public createSolidBrush(r: byte, g: byte, b: byte): SolidBrush {
        return new SolidBrush(new CGColor(Convert.ToByte(r), Convert.ToByte(g), Convert.ToByte(b)));
    }
    public createPen(r: byte, g: byte, b: byte, size: int = 1): Pen {
        return new Pen(new CGColor(Convert.ToByte(r), Convert.ToByte(g), Convert.ToByte(b)), size);
    }

}

@ClassInfo({
    fullName: GraphicTypes.Graphics,
    instanceof: [
        GraphicTypes.Graphics
    ]
})
export abstract class CanvasGraphics<T extends IContext2D> extends GraphicsBase<T> {
    private m_canvasElement: HTMLCanvasElement = undefined as any;

    public constructor();
    public constructor(handle: IntPtr);
    public constructor(width: number, height: number);
    public constructor(width: number, height: number, pixelSize: int);
    public constructor(left: number, top: number, width: number, height: number);
    public constructor(context: CanvasRenderingContext2D, flipped?: boolean);
    public constructor(context: CGContext2D, flipped?: boolean);
    public constructor(...args: any[]) {
        super();
        this.isFlipped = true;
        this.screenScale = 1;

        function setupCanvas(canvasElement: HTMLCanvasElement, left: int, top: int, width: int, height: int, pixelSize: int = 1) {
            if (!is.workerContext()) {
                canvasElement.style.width = `${width * pixelSize}px`;
                canvasElement.style.height = `${height * pixelSize}px`;
                canvasElement.style.padding = '0';
                //canvasElement.style.margin = 'auto';
                canvasElement.style.border = '0';
                canvasElement.style.background = 'transparent';
                canvasElement.style.position = 'absolute';
                canvasElement.style.top = `${top}px`;
                canvasElement.style.left = `${left}px`;
                canvasElement.style.bottom = `0px`;
                canvasElement.style.right = `0px`;
            }

            canvasElement.width = width;
            canvasElement.height = height;
        }

        if (args.length === 0) { //Auto Size
            const eventBus: EventBus = Context.Current.get('eventBus');
            const env = Context.Current.get('envoriment');
            this.m_canvasElement = createCanvasElement();
            setupCanvas(this.m_canvasElement, 0, 0, env.WindowWidth, env.WindowHeight, 1);

            if (!is.workerContext() && document && document.body) {
                document.body.appendChild(this.m_canvasElement);
            }
            const context = get2DCanvasContext(this.m_canvasElement);
            const rendererContext: IContext2D = this.provideRenderer2D(context);
            this.nativeObject = GraphicsHandleTable.Default.CreateHandle(rendererContext);

            this.initializeContext(rendererContext);

            this.width = env.WindowWidth;
            this.height = env.WindowHeight;

        } else if (args.length === 1 && is.typeof<IntPtr>(args[0], System.Types.IntPtr)) {
            if (GraphicsHandleTable.Default.ContainsKey(args[0])) {
                this.nativeObject = args[0];
                const rendererContexty = GraphicsHandleTable.Default.GetGraphics(this.nativeObject);
                this.initializeContext(rendererContexty);
            }

        } else if (args.length === 1) {
            if (args[0] instanceof CGContext2D) {
                this.m_canvasElement = args[0].drawingContext.canvas;
                this.initializeContext(args[0]);
            } else {
                this.m_canvasElement = args[0].canvas;
                this.width = this.m_canvasElement.width;
                this.height = this.m_canvasElement.height;

                const rendererContext: IContext2D = this.provideRenderer2D(args[0]);
                this.nativeObject = GraphicsHandleTable.Default.CreateHandle(rendererContext);
                this.initializeContext(rendererContext);
            }
        } else if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
            this.m_canvasElement = createCanvasElement();
            setupCanvas(this.m_canvasElement, 0, 0, args[0], args[1], 1);
            if (!is.workerContext() && document && document.body) {
                document.body.appendChild(this.m_canvasElement);
            }
            const context = get2DCanvasContext(this.m_canvasElement);

            const rendererContext: IContext2D = this.provideRenderer2D(context);
            this.nativeObject = GraphicsHandleTable.Default.CreateHandle(rendererContext);
            this.initializeContext(rendererContext);
            this.width = args[0];
            this.height = args[1];

        } else if (args.length === 3 && is.number(args[0]) && is.number(args[1]) && is.number(args[2])) {
            const width: int = args[0];
            const height: int = args[1];
            const pixelSize: int = args[2];

            this.m_canvasElement = createCanvasElement();
            setupCanvas(this.m_canvasElement, 0, 0, width, height, pixelSize);
            if (!is.workerContext() && document && document.body) {
                document.body.appendChild(this.m_canvasElement);
            }
            const context = get2DCanvasContext(this.m_canvasElement);
            const rendererContext: IContext2D = this.provideRenderer2D(context);
            this.nativeObject = GraphicsHandleTable.Default.CreateHandle(rendererContext);
            this.initializeContext(rendererContext);
            this.width = args[0];
            this.height = args[1];

        } else if (args.length === 2 && typeof args[1] === 'boolean') {
            this.isFlipped = args[1];
            if (args[0] instanceof CGContext2D) {
                this.initializeContext(args[0]);
            } else {
                this.initializeContext(this.provideRenderer2D(args[0]));
            }
        } else if (args.length === 4) {
            this.m_canvasElement = createCanvasElement();
            setupCanvas(this.m_canvasElement, args[0], args[1], args[2], args[3], 1);
            if (document && document.body) {
                document.body.appendChild(this.m_canvasElement);
            }
            const context = get2DCanvasContext(this.m_canvasElement);
            const rendererContext: IContext2D = this.provideRenderer2D(context);
            this.nativeObject = GraphicsHandleTable.Default.CreateHandle(rendererContext);
            this.initializeContext(rendererContext);
            this.x = args[0];
            this.y = args[1];
            this.width = args[2];
            this.height = args[3];
        }
        this.init();
    }

    public abstract provideRenderer2D(): T;
    public abstract provideRenderer2D(context: CanvasRenderingContext2D): T;

    public setSize(width: int, height: int) {
        this.m_canvasElement.width = width;
        this.m_canvasElement.height = height;
        super.setSize(width, height);
    }
    public init(): void {

    }

    public getContext(): CanvasRenderingContext2D {
        return this.m_canvasElement.getContext('2d') as any;
    }
    public getCanvas(): HTMLCanvasElement {
        return this.m_canvasElement;
    }


    private getCSSValue(element, property) {
        return (document as any).defaultView.getComputedStyle(element, null).getPropertyValue(property);
    }
    public measureStringEx(textstring: string, font: Font): TextMetricsEx {
        const metrics: TextMetricsEx = <any>{};
        const self: Graphics = this as any;
        let fontFamily: string;
        let fontSize: number;
        if (font == null) {
            fontFamily = this.getCSSValue(self.getCanvas(), "font-family");
            fontSize = parseFloat(this.getCSSValue(self.getCanvas(), "font-size").replace("pt", ""));
            metrics.width = self.renderer.measureText(textstring, new Font(fontFamily, fontSize)).Width;
        } else {
            metrics.width = self.renderer.measureText(textstring, font).Width;
            fontFamily = font.Name;
            fontSize = font.Size;
        }
        const isSpace: boolean = !(/\S/.test(textstring));
        metrics.fontSize = fontSize;

        // for text lead values, we meaure a multiline text container.

        leadDiv.style.position = "absolute";
        leadDiv.style.opacity = '0';
        leadDiv.style.font = fontSize + "pt " + fontFamily;
        leadDiv.innerHTML = textstring + "<br/>" + textstring;


        // make some initial guess at the text leading (using the standard TeX ratio)
        metrics.leading = 1.2 * metrics.fontSize;

        // then we try to get the real value from the browser
        const leadDivHeight = parseFloat(this.getCSSValue(leadDiv, "height").replace("pt", ""));
        if (leadDivHeight >= metrics.fontSize * 2) {
            metrics.leading = (leadDivHeight / 2) | 0;
        }
        // document.body.removeChild(leadDiv);

        // if we're not dealing with white space, we can compute metrics
        if (!isSpace) {
            // Have characters, so measure the text

            var padding = 100;
            __canvas.width = metrics.width + padding;
            __canvas.height = 3 * metrics.fontSize;
            __canvas.style.opacity = '1';
            __canvas.style.fontFamily = fontFamily;
            __canvas.style.fontSize = fontSize + 'pt';
            const ctx: any = __canvas.getContext("2d");
            ctx.font = fontSize + "pt " + fontFamily;

            var w = __canvas.width,
                h = __canvas.height,
                baseline = h / 2;

            // Set all canvas pixeldata values to 255, with all the content
            // data being 0. This lets us scan for data[i] != 255.
            ctx.fillStyle = "white";
            ctx.fillRect(-1, -1, w + 2, h + 2);
            ctx.fillStyle = "black";
            ctx.fillText(textstring, padding / 2, baseline);
            var pixelData = ctx.getImageData(0, 0, w, h).data;

            // canvas pixel data is w*4 by h*4, because R, G, B and A are separate,
            // consecutive values in the array, rather than stored as 32 bit ints.
            var i = 0,
                w4 = w * 4,
                len = pixelData.length;

            // Finding the ascent uses a normal, forward scanline
            while (++i < len && pixelData[i] === 255) { }
            var ascent = (i / w4) | 0;

            // Finding the descent uses a reverse scanline
            i = len - 1;
            while (--i > 0 && pixelData[i] === 255) { }
            var descent = (i / w4) | 0;

            // find the min-x coordinate
            for (i = 0; i < len && pixelData[i] === 255;) {
                i += w4;
                if (i >= len) { i = (i - len) + 4; }
            }
            var minx = ((i % w4) / 4) | 0;

            // find the max-x coordinate
            var step = 1;
            for (i = len - 3; i >= 0 && pixelData[i] === 255;) {
                i -= w4;
                if (i < 0) { i = (len - 3) - (step++) * 4; }
            }
            var maxx = ((i % w4) / 4) + 1 | 0;

            // set font metrics
            metrics.ascent = (baseline - ascent);
            metrics.descent = (descent - baseline);
            metrics.bounds = {
                minx: minx - (padding / 2),
                maxx: maxx - (padding / 2),
                miny: 0,
                maxy: descent - ascent
            };
            metrics.height = 1 + (descent - ascent);
        }

        // if we ARE dealing with whitespace, most values will just be zero.
        else {
            // Only whitespace, so we can't measure the text
            metrics.ascent = 0;
            metrics.descent = 0;
            metrics.bounds = {
                minx: 0,
                maxx: metrics.width, // Best guess
                miny: 0,
                maxy: 0
            };
            metrics.height = 0;
        }
        return metrics;


    }
    public static fromCurrentContext(): Graphics {
        return new Graphics(undefined as any);
    }
}

export interface IDeviceContext {
    GetHdc(): IntPtr;
    ReleaseHdc(): void;
}
export class Graphics extends CanvasGraphics<CGContext2D> implements IDeviceContext {
    public static FromImage(image: Image): Graphics {
        const graphics: Out<IntPtr> = New.Out();

        if (image == null)
            throw new ArgumentNullException("image");

        if ((image.PixelFormat & PixelFormat.Indexed) != 0)
            throw new Exception(Locale.GetText("Cannot create Graphics from an indexed bitmap."));

        const status: Status = GDIPlus.GdipGetImageGraphicsContext(image.nativeObject, graphics);
        GDIPlus.CheckStatus(status);
        const result: Graphics = new Graphics(graphics.value);

        /* if (GDIPlus.RunningOnUnix ()) {
            Rectangle rect  = new Rectangle (0,0, image.Width, image.Height);
            GDIPlus.GdipSetVisibleClip_linux (result.NativeObject, ref rect);
        } */

        return result;
    }
    public GetHdc(): IntPtr {
        return this.nativeObject;
    }

    public static FromHwnd(handle: IntPtr): Graphics {
        if (handle == null) {
            throw 'Kernel object handle is null.'
        }

        const kernelObject = Runtime.GetKernelObject(handle);
        if (kernelObject != null && kernelObject.type === 'window') {
            if (kernelObject.hDC instanceof IntPtr) {
                const contextObject = Runtime.GetKernelObject(kernelObject.hDC);
                if (contextObject != null && contextObject.context instanceof CGContext2D) {
                    return new Graphics(contextObject.context);
                }
            } else {
                const canvasContext = Browser.CreateRenderingContext(kernelObject.nWidth, kernelObject.nHeight);
                kernelObject.GraphicsContext = new CGContext2D(canvasContext);
                return new Graphics(kernelObject.GraphicsContext);
            }
        } else if (kernelObject == null) {
            throw 'Kernel object not found for given handle.'
        } else {
            throw 'Kernel object not window for graphics context.'
        }

        throw 'Graphics object can not created.'
    }

    public ReleaseHdc(): void {
        throw new Error('Method not implemented.');
    }
    public init(): void {

    }
    public provideRenderer2D(): CGContext2D;
    public provideRenderer2D(canvasContext: CanvasRenderingContext2D): CGContext2D;
    public provideRenderer2D(...args: any[]): CGContext2D {
        if (args.length === 1) {
            const canvasContext: CanvasRenderingContext2D = args[0];
            return new CGContext2D(canvasContext);
        } else {
            throw new ArgumentException('');
        }

    }
    public static fromCurrentContext(): Graphics {
        return new Graphics(undefined as any);
    }
}
export class CommandGraphics extends GraphicsBase<CGCommandContext2D> {
    public constructor() {
        super();
        this.renderer = this.provideRenderer2D();
        this.init();
    }
    protected measureStringEx(textstring: string, font: Font): TextMetricsEx {
        throw new Error('Method not implemented.');
    }
    public provideRenderer2D(): CGCommandContext2D {
        return new CGCommandContext2D(null as any);
    }
    public init(): void {

    }
}
export class OffScreenGraphics extends GraphicsBase<CGContext2D> {
    private m_OffScreenCanvas: any = null as any;
    private m_Context: any = null as any;
    public constructor(width: int, height: int) {
        super();
        this.m_OffScreenCanvas = new OffscreenCanvas(width, height);
        this.renderer = this.provideRenderer2D(this.m_OffScreenCanvas.getContext('2d') as any);
    }
    protected measureStringEx(textstring: string, font: Font): TextMetricsEx {
        throw new Error('Method not implemented.');
    }
    public provideRenderer2D(): CGContext2D;
    public provideRenderer2D(canvasContext: any /*OffscreenCanvasRenderingContext2D*/): CGContext2D;
    public provideRenderer2D(...args: any[]): CGContext2D {
        if (args.length === 1) {
            const canvasContext: any/*OffscreenCanvasRenderingContext2D*/ = args[0];
            return new CGContext2D(canvasContext as any);
        } else {
            throw new ArgumentException('');
        }
    }

    public init(): void {
    }
    public TrasferToImageBitmap(): ImageBitmap {
        return this.m_OffScreenCanvas.transferToImageBitmap();
    }
}

/*  (<any>document).getElementById = function (canvas: any) {
     let _canvas: HTMLCanvasElement
     if (typeof canvas === 'string') {
         _canvas = <HTMLCanvasElement>document.getElementById(canvas);
     } else {
         _canvas = canvas;
     }
     if (_canvas != null) {
         const context: CanvasRenderingContext2D = _canvas.getContext('2d');
         if (context != null) {
             return new Graphics(context);
         }
     }

 } */
/* console.log('registering createGraphics');
(<any>document).originalFunc = document.getElementById;
(<any>document).getElementById = function (elementId: string): HTMLElement {
    const element: HTMLElement = (<any>document).originalFunc(elementId);
    if (element && element.tagName === 'DIV') {
        (<any>element).createGraphics = function (): Graphics {
            const canvas = createCanvasElement();
            if (element && element.clientWidth && element.clientHeight) {
                canvas.setAttribute('width', element.clientWidth + 'px');
                canvas.setAttribute('height', element.clientHeight + 'px');
            } else {
                canvas.setAttribute('width', '200px');
                canvas.setAttribute('height', '200px');
            }

            element.appendChild(canvas);
            return new Graphics(get2DCanvasContext(canvas));
        }
    }
    return element;

}; */

/* (<any>document).originalCreateElementFunc = document.createElement;
(<any>document).createElement = function (tagName: string): HTMLElement {
    const element: HTMLElement = (<any>document).originalCreateElementFunc(tagName);
    if (element && element.tagName === 'DIV' || element.tagName === 'div') {
        (<any>element).createGraphics = function (): Graphics {
            const canvas = createCanvasElement();
            if (element && element.clientWidth && element.clientHeight) {
                canvas.setAttribute('width', element.clientWidth + 'px');
                canvas.setAttribute('height', element.clientHeight + 'px');
            } else {
                canvas.setAttribute('width', '200px');
                canvas.setAttribute('height', '200px');
            }
            element.appendChild(canvas);
            return new Graphics(get2DCanvasContext(canvas));
        }
    }
    return element;
} */


EventBus.Default.on('KSM_OBJECT_CREATED', (eventInfo) => {
    console.log(eventInfo.KernelObject);
    const kernelObject = eventInfo.KernelObject;
    if (kernelObject != null && kernelObject.type === 'window') {
        const htmlCanvasContext = Browser.CreateRenderingContext(kernelObject.nWidth, kernelObject.nHeight);
        const cgContext = new CGContext2D(htmlCanvasContext);
        const hDC = Runtime.CreateKernelHandle();
        Runtime.AddKernelObject(hDC, {
            type: 'dc',
            context: cgContext
        });
        kernelObject.hDC = hDC;
    }
});