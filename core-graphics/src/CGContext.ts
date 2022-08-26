import { FontStyle } from './FontStyle';
import { CGRectangle } from "./CGRectangle";
import { ArgumentNullException, float, NotImplementedException, is, byte, ClassInfo, ByteArray } from "@tuval/core";
import { IContext2D } from "./IContext2D";
import { CGAffineTransform } from "./CGAffineTransform";
import { CGLineCap } from "./CGLineCap";
import { CGLineJoin } from "./CGLineJoin";
import { CGBlendMode } from "./CGBlendMode";
import { CGPoint } from "./CGPoint";
import { CGPath } from "./CGPath/CGPath";
import { CGPathDrawingMode } from "./CGPath/CGPathDrawingMode";
import { CGColor } from "./CGColor/CGColor";
import { CGPattern } from "./CGPattern";
import { WrapMode } from "./WrapMode";
import { CGSize } from "./CGSize";
import { CGInterpolationQuality } from "./CGInterpolationQuality";
import { CGTextDrawingMode } from "./CGTextDrawingMode";
import { StringAlignment } from "./StringAlignment";
import { CGTextEncoding } from './CGTextEncoding';
import { FontFamily } from './CGFont/FontFamily';
import { CGFont } from './CGFont/CGFont';
import { CoreGraphicTypes } from './types';

@ClassInfo({
    fullName: CoreGraphicTypes.CGContext2D,
    instanceof: [
        CoreGraphicTypes.CGContext2D
    ]
})
export class CGContext2D implements IContext2D {
    private clipArea: CGRectangle = undefined as any;
    public drawingContext: CanvasRenderingContext2D;
    constructor(context: CanvasRenderingContext2D) {
        if (context == null) {
            throw new ArgumentNullException("Invalid parameters to context creation");
        }
        this.drawingContext = context;
    }
    public transferToImageBitmap(): ImageBitmap {
        if (is.workerContext()) {
            return (this.drawingContext.canvas as any).transferToImageBitmap();
        } else {
            throw new Error("For use transferToImageBitmap, you must use offlinecanvas.");
        }
    }

    public scaleCTM(sx: float, sy: float): void {
        this.drawingContext.scale(sx, sy);
    }

    public translateCTM(tx: float, ty: float): void {
        // throw new NotImplementedException('CGContext.translateCTM');
        this.drawingContext.translate(tx, ty);
    }

    public rotateCTM(angle: float): void {
        this.drawingContext.rotate(angle);
    }

    public concatCTM(transform: CGAffineTransform): void {
        // throw new NotImplementedException('CGContext.concatCTM');
        const matrix = transform.getMatrix();
        this.drawingContext.transform(matrix[0], matrix[1],
            matrix[2], matrix[3], matrix[4], matrix[5]);
    }


    public saveState(): void {
        this.drawingContext.save();
    }

    public restoreState(): void {
        // throw new NotImplementedException('CGContext.restoreState');
        this.drawingContext.restore();
    }

    public setLineWidth(w: float): void {
        // throw new NotImplementedException('CGContext.setLineWidth');
        this.drawingContext.lineWidth = w;
    }

    public setLineCap(cap: CGLineCap) {
        // throw new NotImplementedException('CGContext.setLineCap');
        switch (cap) {
            case CGLineCap.Round:
                this.drawingContext.lineCap = 'round';
                break;
            case CGLineCap.Butt:
                this.drawingContext.lineCap = 'butt';
                break;
            default:
                this.drawingContext.lineCap = 'square';
                break;
        }
    }

    public setLineJoin(join: CGLineJoin): void {
        throw new NotImplementedException('CGContext.setLineJoin');
    }

    public setMiterLimit(limit: float): void {
        throw new NotImplementedException('CGContext.setMiterLimit');
    }

    public setLineDash(phase: float, lengths: float[]): void;
    public setLineDash(phase: float, lengths: float[], n: number): void;
    public setLineDash(phase: float, lengths: float[], n?: number): void {
        // throw new NotImplementedException('CGContext.setLineDash');
        const dashOffset: number = (phase != null ? (phase >= 0 ? phase : 1) : 1);
        this.drawingContext.lineDashOffset = dashOffset;
        this.drawingContext.setLineDash(lengths);
    }

    public setFlatness(flatness: float): void {
        throw new NotImplementedException('CGContext.setFlatness');
    }

    public setAlpha(alpha: float): void {
        this.drawingContext.globalAlpha = alpha;
    }

    public setBlendMode(mode: CGBlendMode): void {
        throw new NotImplementedException('CGContext.setBlendMode');
    }

    public getCTM(): CGAffineTransform {
        throw new NotImplementedException('CGContext.getCTM');
    }

    public beginPath(): void {
        // throw new NotImplementedException('CGContext.beginPath');
        this.drawingContext.beginPath();
    }

    public moveTo(x: float, y: float): void {
        // throw new NotImplementedException('CGContext.moveTo');
        this.drawingContext.moveTo(x, y);
    }

    public addLineToPoint(x: float, y: float) {
        // throw new NotImplementedException('CGContext.addLineToPoint');
        this.drawingContext.lineTo(x, y);
    }

    public addCurveToPoint(cp1x: float, cp1y: float, cp2x: float, cp2y: float, x: float, y: float): void {
        // throw new NotImplementedException('CGContext.addCurveToPoint');
        this.drawingContext.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    }

    public addQuadCurveToPoint(cpx: float, cpy: float, x: float, y: float): void {
        // throw new NotImplementedException('CGContext.addQuadCurveToPoint');
        this.drawingContext.quadraticCurveTo(cpx, cpy, x, y);
    }

    public closePath(): void {
        // throw new NotImplementedException('CGContext.closePath');
        this.drawingContext.closePath();
    }

    public addRect(rect: CGRectangle): void {
        this.drawingContext.rect(rect.X, rect.Y, rect.Width, rect.Height);
    }

    public addRects(rects: CGRectangle[]): void {
        throw new NotImplementedException('CGContext.addRects');
    }

    public addLines(points: CGPoint[]): void {
        throw new NotImplementedException('CGContext.addLines');
    }

    public addEllipseInRect(rect: CGRectangle): void {
        // throw new NotImplementedException('CGContext.addEllipseInRect');
        const centerX: number = rect.X + (rect.Width / 2);
        const centerY: number = rect.Y + (rect.Height / 2);
        this.drawingContext.ellipse(centerX, centerY, rect.Width / 2, rect.Height / 2, 0, 0, 2 * Math.PI);
    }

    public addArc(x: float, y: float, radius: float, startAngle: float, endAngle: float, clockwise: boolean): void {
        this.drawingContext.arc(x, y, radius, startAngle, endAngle);
    }

    public addArcToPoint(x1: float, y1: float, x2: float, y2: float, radius: float): void {
        if (radius >= 0) {
            this.drawingContext.arcTo(x1, y1, x2, y2, radius);
        }

    }

    public addPath(path: CGPath): void {
        setTimeout(() => {
            throw new NotImplementedException('CGContext.addPath');
        }, 100);
    }

    public replacePathWithStrokedPath(): void {
        throw new NotImplementedException('CGContext.replacePathWithStrokedPath');
    }

    public getPathCurrentPoint(): CGPoint {
        throw new NotImplementedException('CGContext.getPathCurrentPoint');
    }

    public getPathBoundingBox(): CGRectangle {
        throw new NotImplementedException('CGContext.getPathCurrentPoint');
    }

    public pathContainsPoint(point: CGPoint, mode: CGPathDrawingMode): boolean {
        throw new NotImplementedException('CGContext.pathContainsPoint');
    }
    public drawPath(mode: CGPathDrawingMode) {
        // throw new NotImplementedException('CGContext.drawPath');
        if (mode === CGPathDrawingMode.Stroke) {
            this.drawingContext.stroke();
        }
    }

    public fillPath(): void {
        // throw new NotImplementedException('CGContext.fillPath');
        (<any>this.drawingContext).msFillRule = 'nonzero';
        this.drawingContext.fill();
    }

    public eOFillPath(): void {
        //throw new NotImplementedException('CGContext.eOFillPath');
        (<any>this.drawingContext).msFillRule = 'evenodd';
        this.drawingContext.fill();
    }

    public strokePath(): void {
        // throw new NotImplementedException('CGContext.strokePath');
        this.drawingContext.stroke();
    }

    public fillRect(rect: CGRectangle): void {
        // throw new NotImplementedException('CGContext.fillRect');
        this.drawingContext.fillRect(rect.X, rect.Y, rect.Width, rect.Height)
    }

    public contextFillRects(rects: CGRectangle[]): void {
        throw new NotImplementedException('CGContext.contextFillRects');
    }

    public strokeRect(rect: CGRectangle): void {
        throw new NotImplementedException('CGContext.strokeRect');
    }

    public strokeRectWithWidth(rect: CGRectangle, width: float): void {
        throw new NotImplementedException('CGContext.strokeRectWithWidth');
    }

    public clearRect(rect: CGRectangle): void {
        this.drawingContext.clearRect(rect.X, rect.Y, rect.Width, rect.Height);
    }

    public fillEllipseInRect(rect: CGRectangle): void {
        throw new NotImplementedException('CGContext.fillEllipseInRect');
    }

    public strokeEllipseInRect(rect: CGRectangle): void {
        throw new NotImplementedException('CGContext.strokeEllipseInRect');
    }

    public strokeLineSegments(points: CGPoint[]): void {
        throw new NotImplementedException('CGContext.strokeLineSegments');
    }

    public eOClip(): void {
        throw new NotImplementedException('CGContext.eOClip');
    }

    public clipToMask(rect: CGRectangle, mask: any /*CGImage*/): void {
        throw new NotImplementedException('CGContext.clipToMask');
    }

    public getClipBoundingBox(): CGRectangle {
        //throw new NotImplementedException('CGContext.getClipBoundingBox');
        // FIX ME:
        // return new RectangleF(-1500, -1500, 4500, 4500);
        // const domRect: DOMRect = <any>this.drawingContext.canvas.getBoundingClientRect();
        return new CGRectangle(0, 0, this.drawingContext.canvas.width, this.drawingContext.canvas.height);

    }

    public clip(): void {
        if (this.clipArea != null) {
            this.drawingContext.beginPath();
            this.drawingContext.rect(this.clipArea.X, this.clipArea.Y, this.clipArea.Width, this.clipArea.Height);
            //this.canvasContext.strokeStyle='red;'
            this.drawingContext.closePath();
            // this.canvasContext.strokeRect(this.clipArea.X, this.clipArea.Y, this.clipArea.Width, this.clipArea.Height);
            this.drawingContext.clip();
            // this.clipArea = undefined;
            /*  const ctx = this.canvasContext;
             ctx.rect(50, 20, 200, 120);
             ctx.stroke();
             ctx.clip();
             // Draw red rectangle after clip()
             ctx.fillStyle = "red";
             ctx.fillRect(0, 0, 150, 100); */
        }
    }
    public clipToRect(rect: CGRectangle, debug: boolean = true): void {
        //this.clipArea = rect;
        //this.canvasContext.save();

        this.drawingContext.beginPath();
        this.drawingContext.rect(rect.X, rect.Y, rect.Width, rect.Height);
        let oldStrokeStyle;
        if (debug) {
            oldStrokeStyle = this.drawingContext.strokeStyle;
            this.drawingContext.strokeStyle = 'red';
            this.drawingContext.strokeRect(rect.X, rect.Y, rect.Width, rect.Height);
        }

        this.drawingContext.clip();

        if (debug) {
            this.drawingContext.strokeStyle = oldStrokeStyle;
        }


        //this.canvasContext.restore();
    }

    public clipToRects(rects: CGRectangle[]): void {
        throw new NotImplementedException('CGContext.clipToRects');
    }

    public setFillColor(cyan: float, magenta: float, yellow: float, black: float, alpha: float): void;
    public setFillColor(gray: float, alpha: float): void;
    public setFillColor(components: float[]): void;
    public setFillColor(color: CGColor): void;
    public setFillColor(red: float, green: float, blue: float, alpha: float): void;
    public setFillColor(...args: any[]): void {
        // throw new NotImplementedException('CGContext.setFillColor');
        if (args.length === 4) {
            const color: CGColor = CGColor.FromRgba(args[0], args[1], args[2], args[3]);
            this.drawingContext.fillStyle = color.toString();
        } else if (args.length === 1 && args[0] instanceof CGColor) {
            this.setFillColor(args[0].R, args[0].G, args[0].B, args[0].A);
        }
    }

    public setFillColorWithColor(color: CGColor): void {
        throw new NotImplementedException('CGContext.setFillColorWithColor');
    }

    public setStrokeColor(cyan: float, magenta: float, yellow: float, black: float, alpha: float): void;
    public setStrokeColor(red: float, green: float, blue: float, alpha: float): void;
    public setStrokeColor(gray: float, alpha: float): void;
    public setStrokeColor(components: float[]): void;
    public setStrokeColor(color: CGColor): void;
    public setStrokeColor(...args: any[]): void {
        // throw new NotImplementedException('CGContext.setStrokeColor');
        if (args.length === 1 && args[0] instanceof CGColor) {
            const color: CGColor = args[0];
            const colorString: string = CGColor.RgbToHex(color.R, color.G, color.B);
            this.drawingContext.strokeStyle = '#' + colorString;
        } else if (args.length === 4) {
            const color: string = CGColor.RgbToHex(args[0], args[1], args[2]);
            this.drawingContext.strokeStyle = '#' + color;
        }
    }

    public setStrokeColorWithColor(color: CGColor): void {
        throw new NotImplementedException('CGContext.setStrokeColorWithColor');
    }

    public setFillColorSpace(space: any): void {
        throw new NotImplementedException('CGContext.setFillColorSpace');
    }

    public setStrokeColorSpace(space: any): void {
        throw new NotImplementedException('CGContext.setStrokeColorSpace');
    }

    public setFillPattern(pattern: CGPattern, components: float[]): void {
        // throw new NotImplementedException('CGContext.setFillPattern');
        const canvasPattern: HTMLCanvasElement = document.createElement("canvas");
        canvasPattern.width = pattern.bounds.Width;
        canvasPattern.height = pattern.bounds.Height;
        const contextPattern: CanvasRenderingContext2D = canvasPattern.getContext("2d") as any;
        const coreContext = new CGContext2D(contextPattern);


        coreContext.concatCTM(pattern.matrix);
        // coreContext.canvasContext.fillStyle = 'rgb(0,0,0)';
        // coreContext.canvasContext.fillRect(0, 0, 80, 80);
        if (pattern.drawPattern != null && is.function(pattern.drawPattern)) {
            pattern.drawPattern(coreContext);
        }

        //console.log(coreContext.canvasContext.canvas.toDataURL('image/jpeg', 1.0));
        coreContext.concatCTM(pattern.matrix.invert());

        if (pattern.processImageFunc != null) {
            pattern.processImageFunc(coreContext);
        }

        /*  contextPattern.strokeStyle='rgb(255,255,255)';
         contextPattern.arc(5.5, 5.5, 3, 0, Math.PI);
         contextPattern.rect(3, 3, 1, 1);
         contextPattern.rect(7, 3, 1, 1);
         contextPattern.stroke(); */

        let fillPattern: any;
        switch (pattern.wrapMode) {
            case WrapMode.Tile:
                fillPattern = contextPattern.createPattern(canvasPattern, "repeat");
                break;
            case WrapMode.TileFlipX:
                fillPattern = contextPattern.createPattern(canvasPattern, "repeat-x");
                break;
            case WrapMode.TileFlipY:
                fillPattern = contextPattern.createPattern(canvasPattern, "repeat-y");
                break;
            case WrapMode.Clamp:
                fillPattern = contextPattern.createPattern(canvasPattern, "no-repeat");
                break;
        }

        this.drawingContext.fillStyle = fillPattern;
    }

    public setStrokePattern(pattern: any, components: float[]): void {
        //throw new NotImplementedException('CGContext.setStrokePattern');

        const canvasPattern: HTMLCanvasElement = document.createElement("canvas");
        canvasPattern.width = pattern.bounds.Width;
        canvasPattern.height = pattern.bounds.Height;
        const contextPattern: CanvasRenderingContext2D = canvasPattern.getContext("2d") as any;
        const coreContext = new CGContext2D(contextPattern);
        if (pattern.drawPattern != null && is.function(pattern.drawPattern)) {
            pattern.drawPattern(coreContext);
        }
        const strokePattern: any = contextPattern.createPattern(canvasPattern, "repeat");
        this.drawingContext.strokeStyle = strokePattern;
    }

    public setPatternPhase(phase: CGSize): void {
        setTimeout(() => {
            throw new NotImplementedException('CGContext.setPatternPhase');
        }, 100);
    }

    public setGrayFillColor(gray: float, alpha: float) {
        setTimeout(() => {
            throw new NotImplementedException('CGContext.setGrayFillColor');
        }, 100);
    }



    public setGrayStrokeColor(gray: float, alpha: float) {
        setTimeout(() => {
            throw new NotImplementedException('CGContext.setGrayStrokeColor');
        }, 100);
    }



    public setRGBFillColor(red: float, green: float, blue: float, alpha: float): void {
        setTimeout(() => {
            throw new NotImplementedException('CGContext.setRGBFillColor');
        }, 100);
    }


    public setRGBStrokeColor(red: float, green: float, blue: float, alpha: float): void {
        setTimeout(() => {
            throw new NotImplementedException('CGContext.setRGBStrokeColor');
        }, 100);
    }

    public setCMYKFillColor(cyan: float, magenta: float, yellow: float, black: float, alpha: float): void {
        setTimeout(() => {
            throw new NotImplementedException('CGContext.setCMYKFillColor');
        }, 100);
    }

    public setCMYKStrokeColor(cyan: float, magenta: float, yellow: float, black: float, alpha: float): void {
        setTimeout(() => {
            throw new NotImplementedException('CGContext.setCMYKStrokeColor');
        }, 100);
    }

    public setRenderingIntent(intent: any /*CGColorRenderingIntent*/) {
        throw new NotImplementedException('CGContext.setRenderingIntent');
    }

    public drawImage(image: any, x: number, y: number): void
    public drawImage(image: any, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    public drawImage(...args: any[]): void {
        if (args.length === 3) {
            this.drawingContext.drawImage(args[0], args[1], args[2]);
        } else if (args.length === 9) {
            this.drawingContext.drawImage(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
        }
    }

    public drawTiledImage(rect: CGRectangle, image: any /*CGImage*/) {
        throw new NotImplementedException('CGContext.drawTiledImage');
    }

    public InterpolationQuality: CGInterpolationQuality = CGInterpolationQuality.Default;


    public setShadowWithColor(offset: CGSize, blur: float, color: CGColor): void {
        const ctx = this.drawingContext;
        ctx.shadowColor = color.toString();
        ctx.shadowOffsetX = offset.Width;
        ctx.shadowOffsetY = offset.Height;
        ctx.shadowBlur = blur;
    }

    public setShadow(offset: CGSize, blur: float): void {
        throw new NotImplementedException('CGContext.setShadow');
    }

    public drawLinearGradient(gradient: any /*CGGradient*/, startPoint: CGPoint, endPoint: CGPoint, options: any /*CGGradientDrawingOptions*/): void {
        throw new NotImplementedException('CGContext.drawLinearGradient');
    }

    public drawRadialGradient(gradient: any /*CGGradient*/, startCenter: CGPoint, startRadius: float, endCenter: CGPoint, endRadius: float, options: any /*CGGradientDrawingOptions*/): void {
        throw new NotImplementedException('CGContext.drawRadialGradient');
    }

    public setCharacterSpacing(spacing: float): void {
        throw new NotImplementedException('CGContext.setCharacterSpacing');
    }


    public TextPosition: CGPoint = undefined as any;

    public TextMatrix: CGAffineTransform = undefined as any;

    public setTextDrawingMode(mode: CGTextDrawingMode): void {
        throw new NotImplementedException('CGContext.setTextDrawingMode');
    }

    public setFont(font: CGFont /*CGFont*/): void {
        let fontName: string;
        const opentype: any = {};

        /*  if (font.FontFamily instanceof opentype.Font) {
             fontName = 'opentype';
         } else */
        if (font.FontFamily instanceof FontFamily) {
            fontName = font.FontFamily.Name;
        } else {
            fontName = font.Name;
        }
        this.drawingContext.font = (font.TextStyle || 'normal') +
            ' ' + (font.Size || 12) + 'px ' + (fontName || 'sans-serif');

        switch (font.HorizAlign) {
            case StringAlignment.Near:
                this.drawingContext.textAlign = "left";
                break;
            case StringAlignment.Center:
                this.drawingContext.textAlign = "center";
                break;
            case StringAlignment.Far:
                this.drawingContext.textAlign = "right";
                break;
        }
        switch (font.VertAlign) {
            case StringAlignment.Near:
                this.drawingContext.textBaseline = "top";
                break;
            case StringAlignment.Center:
                this.drawingContext.textBaseline = "middle";
                break;
            case StringAlignment.Far:
                this.drawingContext.textBaseline = "bottom";
                break;
        }
    }


    private _getFontStyle(font: CGFont): string {
        switch (font.TextStyle) {
            case FontStyle.Regular:
                return 'normal';
            case FontStyle.Italic:
                return 'italic';
            case FontStyle.Bold:
                return 'bold';
            case FontStyle.Underline:
                return 'underline';
        }
        return '';
    }
    private _getFontVariant(font: CGFont): string {
        return 'normal';
    }
    private _getFontSize(font: CGFont): number {
        return font.Size;
    }
    private _getFontFamily(font: CGFont): string {
        return font.Name;
    }
    private _getContextFont(font: CGFont): string {
        const PX_SPACE: string = 'px ';
        const SPACE: string = ' ';
        // IE don't want to work with usual font style
        // bold was not working
        // removing font variant will solve
        // fix for: https://github.com/konvajs/konva/issues/94
        // TODO ie desteği ekle.
        if (false) {
            return (
                this._getFontStyle(font) +
                SPACE +
                this._getFontSize(font) +
                PX_SPACE +
                this._getFontFamily(font)
            );
        }
        return (
            this._getFontStyle(font) +
            SPACE +
            this._getFontVariant(font) +
            SPACE +
            this._getFontSize(font) +
            PX_SPACE +
            this._getFontFamily(font)
        )
    }
    public measureText(text: string, font: CGFont): CGSize {

        const _context: CanvasRenderingContext2D = this.drawingContext;

        let metrics: TextMetrics;

        _context.save();
        _context.font = this._getContextFont(font);

        metrics = _context.measureText(text);
        _context.restore();
        return new CGSize({
            width: metrics.width,
            height: parseInt(font.Size.toString(), 10)
        });
    }

    public selectFont(name: string, size: float, textEncoding: CGTextEncoding): void {
        throw new NotImplementedException('CGContext.selectFont');
    }

    public showGlyphsAtPositions(glyphs: number[], positions: CGPoint[], size_t_count: number): void {
        throw new NotImplementedException('CGContext.showGlyphsAtPositions');
    }

    public setTextAlign(textAlign: string) {
        let ta: CanvasTextAlign = undefined as any;
        switch (textAlign) {
            case 'start':
                ta = 'start';
                break;
            case 'end':
                ta = 'end';
                break;
            case 'left':
                ta = 'left';
                break;
            case 'center':
                ta = 'center';
                break;
            case 'right':
                ta = 'right';
                break;
        }
        this.drawingContext.textAlign = ta;
    }
    public setTextBaseline(textAlign: string) {
        let tbl: CanvasTextBaseline = 'middle';
        switch (textAlign) {
            case 'top':
                tbl = 'top';
                break;
            case 'bottom':
                tbl = 'bottom';
                break;
            case 'middle':
                tbl = 'middle';
                break;
            case 'alphabetic':
                tbl = 'alphabetic';
                break;
            case 'hanging':
                tbl = 'hanging';
                break;
        }
        this.drawingContext.textBaseline = tbl;
    }
    /* public showText(str: string, count: number): void;
    public showText(str: string): void;
    public showText(bytes: byte[]): void;
    public showText(bytes: byte[], count: number): void;
    public showText(...args: any[]): void {
        throw new NotImplementedException('CGContext.showText');
    } */
    public showText(str: string, x: number, y: number) {
        this.drawingContext.fillText(str, x, y);
    }

    public showTextAtPoint(x: float, y: float, bytes: ByteArray): void;
    public showTextAtPoint(x: float, y: float, bytes: ByteArray, length: number): void;
    public showTextAtPoint(x: float, y: float, str: string): void;
    public showTextAtPoint(x: float, y: float, str: string, length: number): void;
    public showTextAtPoint(...args: any[]): void {
        throw new NotImplementedException('CGContext.showTextAtPoint');
    }


    public showGlyphs(glyphs: ByteArray, count: number): void;
    public showGlyphs(glyphs: ByteArray): void;
    public showGlyphs(...args: any[]): void {
        throw new NotImplementedException('CGContext.showGlyphs');
    }


    public showGlyphsAtPoint(x: float, y: float, glyphs: ByteArray): void;
    public showGlyphsAtPoint(x: float, y: float, glyphs: ByteArray, count: number): void;
    public showGlyphsAtPoint(...args: any[]) {
        throw new NotImplementedException('CGContext.showGlyphsAtPoint');
    }



    public showGlyphsWithAdvances(glyphs: ByteArray, advances: CGSize[], count: number): void {
        throw new NotImplementedException('CGContext.showGlyphsWithAdvances');
    }

    public drawPDFPage(page: any /*CGPDFPage*/): void {
        throw new NotImplementedException('CGContext.drawPDFPage');
    }

    public beginPage(rect: CGRectangle) {
        throw new NotImplementedException('CGContext.beginPage');
    }

    public endPage(): void {
        throw new NotImplementedException('CGContext.endPage');
    }

    //[DllImport (Constants.CoreGraphicsLibrary)]
    //extern static IntPtr CGContextRetain(IntPtr c);

    public flush(): void {
        throw new NotImplementedException('CGContext.flush');
    }


    public synchronize(): void {
        throw new NotImplementedException('CGContext.synchronize');
    }

    public setShouldAntialias(shouldAntialias: boolean): void {
        //throw new NotImplementedException('CGContext.setShouldAntialias');
        console.error('CGContext.setShouldAntialias');

    }

    public setAllowsAntialiasing(allowsAntialiasing: boolean) {
        throw new NotImplementedException('CGContext.setAllowsAntialiasing');
    }

    public setShouldSmoothFonts(shouldSmoothFonts: boolean): void {
        throw new NotImplementedException('CGContext.setShouldSmoothFonts');
    }


    public getUserSpaceToDeviceSpaceTransform(): CGAffineTransform {
        throw new NotImplementedException('CGContext.getUserSpaceToDeviceSpaceTransform');
    }

    public pointToDeviceSpace(point: CGPoint): CGPoint {
        throw new NotImplementedException('CGContext.pointToDeviceSpace');
    }

    public convertPointToUserSpace(point: CGPoint): CGPoint {
        throw new NotImplementedException('CGContext.convertPointToUserSpace');
    }

    public convertSizeToDeviceSpace(size: CGSize): CGSize {
        throw new NotImplementedException('CGContext.convertSizeToDeviceSpace');
    }

    public convertSizeToUserSpace(size: CGSize): CGSize {
        throw new NotImplementedException('CGContext.convertSizeToUserSpace');
    }

    public convertRectToDeviceSpace(rect: CGRectangle): CGRectangle {
        throw new NotImplementedException('CGContext.convertRectToDeviceSpace');
    }

    public convertRectToUserSpace(rect: CGRectangle): CGRectangle {
        throw new NotImplementedException('CGContext.convertRectToUserSpace');
    }


    public drawLayer(layer: any /*CGLayer*/, rect: CGRectangle): void;
    public drawLayer(layer: any /*CGLayer*/, point: CGPoint): void;
    public drawLayer(...args: any[]): void {
        throw new NotImplementedException('CGContext.drawLayer');
    }

    public copyPath(): CGPath {
        throw new NotImplementedException('CGContext.copyPath');
    }

    public setAllowsFontSmoothing(allows: boolean) {
        throw new NotImplementedException('CGContext.setAllowsFontSmoothing');
    }

    public setAllowsSubpixelPositioning(allows: boolean) {
        throw new NotImplementedException('CGContext.setAllowsSubpixelPositioning');
    }

    public setAllowsFontSubpixelQuantization(allows: boolean): void {
        throw new NotImplementedException('CGContext.setAllowsFontSubpixelQuantization');
    }

    public setShouldSubpixelPositionFonts(shouldSubpixelPositionFonts: boolean): void {
        throw new NotImplementedException('CGContext.setShouldSubpixelPositionFonts');
    }

    public shouldSubpixelQuantizeFonts(shouldSubpixelQuantizeFonts: boolean): void {
        throw new NotImplementedException('CGContext.shouldSubpixelQuantizeFonts');
    }

    // Graphics2D virtual methods
    public /**virtual */ arc(x: number, y: number, w: number, h: number, start: number, stop: number, mode: string) { }
    public drawImageBitmap(image: ImageBitmap, x: float, y: float): void {
        this.drawingContext.drawImage(image, x, y);
    }
}