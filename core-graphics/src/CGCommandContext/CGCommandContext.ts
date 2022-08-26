import { CoreGraphicTypes } from '../types';
import { ArgumentNullException, ByteArray, float, is, NotImplementedException, UMP, LONG, UMO, Marshal, ClassInfo, Exception, free } from "@tuval/core";
import { CGAffineTransform } from "../CGAffineTransform";
import { CGBlendMode } from "../CGBlendMode";
import { CGColor } from "../CGColor/CGColor";
import { CGContext2D } from "../CGContext";
import { CGFont } from "../CGFont/CGFont";
import { FontFamily } from "../CGFont/FontFamily";
import { FontStyle } from "../CGFont/FontStyle";
import { CGInterpolationQuality } from "../CGInterpolationQuality";
import { CGLineCap } from "../CGLineCap";
import { CGLineJoin } from "../CGLineJoin";
import { CGPath } from "../CGPath/CGPath";
import { CGPathDrawingMode } from "../CGPath/CGPathDrawingMode";
import { CGPattern } from "../CGPattern";
import { CGPoint } from "../CGPoint";
import { CGRectangle } from "../CGRectangle";
import { CGSize } from "../CGSize";
import { CGTextDrawingMode } from "../CGTextDrawingMode";
import { CGTextEncoding } from "../CGTextEncoding";
import { IContext2D } from "../IContext2D";
import { StringAlignment } from "../StringAlignment";
import { WrapMode } from "../WrapMode";
import { StartCommand } from './Commands/StartCommand';
import { EndCommand } from './Commands/EndCommand';
import { ScaleCommand } from './Commands/ScaleCommand';
import { TranslateCommand } from './Commands/TranslateCommand';
import { RotateCommand } from './Commands/RotateCommand';
import { TransformCommand } from './Commands/TransformCommand';
import { ClearRectCommand, ICommand } from './Commands';
import { SaveStateCommand } from './Commands/SaveStateCommand';
import { RestoreStateCommand } from './Commands/RestoreStateCommand';
import { SetLineWidthCommand } from './Commands/SetLineWidthCommand';
import { SetLineCapCommand } from './Commands/SetLineCapCommand';
import { BeginPathCommand } from './Commands/BeginPathCommand';
import { MoveToCommand } from './Commands/MoveToCommand';
import { AddLineToPointCommand } from './Commands/AddLineToPointCommand';
import { SetShadowWithColorCommand } from './Commands/SetShadowWithColorCommand';
import { SetStrokeColor } from './Commands/SetStrokeColor';
import { SetLineDashCommand } from './Commands/SetLineDashCommand';
import { DrawPathCommand } from './Commands/DrawPathCommand';
import { SetFillColorCommand } from './Commands/SetFillColorCommand';
import { AddArcToPointCommand } from './Commands/AddArcToPointCommand';
import { ClosePathCommand } from './Commands/ClosePathCommand';
import { EOFillPathCommand } from './Commands/EOFillPathCommand';
import { AddCurveToPointCommand } from './Commands/AddCurveToPointCommand';

class POINT extends UMO {
    @LONG X;
    @LONG Y;
}


/* export class Command extends UMO {
    @LONG CommandType;
    @LONG NextCommandPointer;
} */

export class CGCommandContext2D implements IContext2D {
    private m_AddressTable: number[] = [];
    private clipArea: CGRectangle = undefined as any;
    private m_StartPointer: number = 0;
    private m_LastCommand: ICommand = null as any;
    public drawingContext: CanvasRenderingContext2D;
    public IsOpened: boolean = false;
    public IsClosed: boolean = false;
    constructor(context: CanvasRenderingContext2D) {
        if (context == null) {
            // throw new ArgumentNullException("Invalid parameters to context creation");
        }
        this.drawingContext = context;

    }
    public Begin() {
        this.m_LastCommand = new StartCommand();
        this.m_StartPointer = (this.m_LastCommand as any).pointer;
        this.m_AddressTable.push(this.m_StartPointer);
        this.IsOpened = true;
    }

    public End() {
        const endCommand = new EndCommand();
        endCommand.NextCommandPointer = 0;
        this.setLastCommand(endCommand);
        this.IsClosed = true;
    }
    public GetStartPointer(): number {
        return this.m_StartPointer;
    }

    public transferToImageBitmap(): ImageBitmap {
        if (is.workerContext()) {
            return (this.drawingContext.canvas as any).transferToImageBitmap();
        } else {
            throw new Error("For use transferToImageBitmap, you must use offlinecanvas.");
        }
    }

    private forceToBegin() {
        if (!this.IsOpened) {
            this.Begin();
        }
    }
    private forceToEnd() {
        if (!this.IsClosed) {
            this.End();
        }
    }

    public scaleCTM(sx: float, sy: float): void {
        const scaleCommand = new ScaleCommand();
        scaleCommand.SX = sx;
        scaleCommand.SY = sy;
        this.setLastCommand(scaleCommand);
    }

    public translateCTM(tx: float, ty: float): void {
        const translateCommand = new TranslateCommand();
        translateCommand.TX = tx;
        translateCommand.TY = ty;
        this.setLastCommand(translateCommand);

    }
    private setLastCommand(command: ICommand) {
        if (!this.IsOpened) {
            this.forceToBegin();
        }
        this.m_LastCommand.NextCommandType = command.CommandType;
        this.m_LastCommand.NextCommandPointer = (command as any).pointer;
        this.m_LastCommand = command;
        this.m_AddressTable.push((command as any).pointer);
    }

    public rotateCTM(angle: float): void {
        //this.drawingContext.rotate(angle);
        const rotateCommand = new RotateCommand();
        rotateCommand.Angle = angle;
        this.setLastCommand(rotateCommand);
    }

    public concatCTM(transform: CGAffineTransform): void {
        const matrix = transform.getMatrix();
        const transformCommand = new TransformCommand();
        transformCommand.A = matrix[0];
        transformCommand.B = matrix[1];
        transformCommand.C = matrix[2];
        transformCommand.D = matrix[3];
        transformCommand.F = matrix[4];
        transformCommand.E = matrix[5];
        this.setLastCommand(transformCommand);
    }

    public saveState(): void {
        // this.drawingContext.save();
        const saveStateCommand = new SaveStateCommand();
        this.setLastCommand(saveStateCommand);
    }

    public restoreState(): void {
        // throw new NotImplementedException('CGContext.restoreState');
        //this.drawingContext.restore();
        const restoreStateCommand = new RestoreStateCommand();
        this.setLastCommand(restoreStateCommand);
    }

    public setLineWidth(w: float): void {

        const setLineWidthCommand = new SetLineWidthCommand();
        setLineWidthCommand.WIDTH = w;
        this.setLastCommand(setLineWidthCommand);
    }

    public setLineCap(cap: CGLineCap) {
        // throw new NotImplementedException('CGContext.setLineCap');
        const setLineCapCommand = new SetLineCapCommand();
        setLineCapCommand.CAP = cap;
        this.setLastCommand(setLineCapCommand);
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
        /* this.drawingContext.lineDashOffset = dashOffset;
        this.drawingContext.setLineDash(lengths); */
        const setLineDashCommand = new SetLineDashCommand();
        setLineDashCommand.DASHOFFSET = dashOffset;
        setLineDashCommand.DASH_COUNT = lengths.length;
        if (lengths.length > 0) {
            setLineDashCommand.DASH1 = lengths[0];
        }
        if (lengths.length > 1) {
            setLineDashCommand.DASH2 = lengths[1];
        }
        if (lengths.length > 2) {
            setLineDashCommand.DASH2 = lengths[2];
        }
        if (lengths.length > 3) {
            setLineDashCommand.DASH2 = lengths[3];
        }
        this.setLastCommand(setLineDashCommand);
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
        this.forceToBegin();
        const beginPathCommand = new BeginPathCommand();
        this.setLastCommand(beginPathCommand);
    }

    public moveTo(x: float, y: float): void {
        // throw new NotImplementedException('CGContext.moveTo');
        //this.drawingContext.moveTo(x, y);
        const moveToCommand = new MoveToCommand();
        moveToCommand.X = x;
        moveToCommand.Y = y;
        this.setLastCommand(moveToCommand);
    }

    public addLineToPoint(x: float, y: float) {
        this.forceToBegin();
        const addLineToPointCommand = new AddLineToPointCommand();
        addLineToPointCommand.X = x;
        addLineToPointCommand.Y = y;
        this.setLastCommand(addLineToPointCommand);
    }

    public addCurveToPoint(cp1x: float, cp1y: float, cp2x: float, cp2y: float, x: float, y: float): void {
        const addCurveToPoint = new AddCurveToPointCommand();
        addCurveToPoint.CP1X = cp1x;
        addCurveToPoint.CP1Y = cp1y;
        addCurveToPoint.CP2X = cp2x;
        addCurveToPoint.CP2Y = cp2y;
        addCurveToPoint.X = x;
        addCurveToPoint.Y = y;
        this.setLastCommand(addCurveToPoint);
    }

    public addQuadCurveToPoint(cpx: float, cpy: float, x: float, y: float): void {
        // throw new NotImplementedException('CGContext.addQuadCurveToPoint');
        this.drawingContext.quadraticCurveTo(cpx, cpy, x, y);
    }

    public closePath(): void {
        const closePathCommand = new ClosePathCommand();
        this.setLastCommand(closePathCommand);
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
            const addArcToPointCommand = new AddArcToPointCommand();
            addArcToPointCommand.X1 = x1;
            addArcToPointCommand.Y1 = y1;
            addArcToPointCommand.X2 = x2;
            addArcToPointCommand.Y2 = y2;
            addArcToPointCommand.RADIUS = radius;
            this.setLastCommand(addArcToPointCommand);
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
        /* if (mode === CGPathDrawingMode.Stroke) {
            this.drawingContext.stroke();
        } */
        const drawPathCommand = new DrawPathCommand();
        drawPathCommand.MODE = mode;
        this.setLastCommand(drawPathCommand);
    }

    public fillPath(): void {
        // throw new NotImplementedException('CGContext.fillPath');
        (<any>this.drawingContext).msFillRule = 'nonzero';
        this.drawingContext.fill();
    }

    public eOFillPath(): void {
        const eOFillPathCommand = new EOFillPathCommand();
        this.setLastCommand(eOFillPathCommand);

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
        const clearRectCommand = new ClearRectCommand();
        clearRectCommand.X = rect.X;
        clearRectCommand.Y = rect.Y;
        clearRectCommand.Width = rect.Width;
        clearRectCommand.Height = rect.Height;
        this.setLastCommand(clearRectCommand);
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
            const setFillColorCommand = new SetFillColorCommand();
            setFillColorCommand.COLOR = color.toString();
            this.setLastCommand(setFillColorCommand);
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
        const setStrokeColor = new SetStrokeColor();
        if (args.length === 1 && args[0] instanceof CGColor) {
            const color: CGColor = args[0];
            const colorString: string = CGColor.RgbToHex(color.R, color.G, color.B);
            setStrokeColor.COLOR = '#' + colorString;
        } else if (args.length === 4) {
            const color: string = CGColor.RgbToHex(args[0], args[1], args[2]);
            setStrokeColor.COLOR = '#' + color;
        }
        this.setLastCommand(setStrokeColor);
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
        const setShadowWithColorCommand = new SetShadowWithColorCommand();
        setShadowWithColorCommand.WIDTH = offset.Width;
        setShadowWithColorCommand.HEIGHT = offset.Height;
        setShadowWithColorCommand.BLUR = blur;
        setShadowWithColorCommand.COLOR = color.toString()
        this.setLastCommand(setShadowWithColorCommand);
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
        throw new NotImplementedException('CGContext.drawImageBitmap');
    }

    public Reset() {
        this.m_AddressTable.forEach((address: number)=>{
            free(address);
        });
        this.m_AddressTable = [];
        this.IsOpened = false;
        this.IsClosed = false;
        this.m_StartPointer = 0;
        this.m_LastCommand = null as any
     /*    const rect = new CGRectangle(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
        canvasContext.clearRect(rect.X, rect.Y, rect.Width, rect.Height); */
    }
}

