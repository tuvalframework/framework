import { CGColor, CGSize, CGLineCap, CoreGraphicTypes } from '@tuval/cg';
import { IDisposable, int } from "@tuval/core";
import { ICloneable } from "./ICloneable";
import { Brush } from "./Brush";
import { float, as, Enum, is } from "@tuval/core";
import { Matrix } from "./drawing2D/Matrix";
import { LineCap } from "./drawing2D/LineCap";
import { DashStyle } from "./drawing2D/DashStyle";
import { LineJoin } from "./drawing2D/LineJoin";
import { PenAlignment } from "./PenAlignment";
import { ArgumentNullException, ArgumentException } from "@tuval/core";
import { SolidBrush } from "./SolidBrush";
import { DashCap } from "./DashCap";
import { Graphics } from "./Graphics";
import { Shadow } from "./Shadow";
import { ClassInfo } from "@tuval/core";
import { PenTypes } from "./PenTypes";
import { GraphicTypes } from './../GDITypes';

@ClassInfo({
    fullName: GraphicTypes.Pen,
    instanceof: [
        GraphicTypes.Pen
    ]
})
export class Pen implements IDisposable, ICloneable<Pen> {
    private brush: Brush = undefined as any;
    private color: CGColor = undefined as any;
    private changed: boolean = true;
    private isModifiable: boolean = false;
    private width: float = 1;
    private transform: Matrix = undefined as any;
    private startCap: LineCap = LineCap.Flat;
    private endCap: LineCap = LineCap.Flat;
    private dashStyle: DashStyle = DashStyle.Solid;
    private dashOffset: number = 0;
    private dashPattern: float[] = undefined as any;
    private lineJoin: LineJoin = LineJoin.Miter;
    private miterLimit: float = 10;
    private alignment: PenAlignment = undefined as any;
    private penType: PenTypes = PenTypes.SolidColor;

    private static readonly Dot: float[] = [1, 1];
    private static readonly Dash: float[] = [3, 1];
    private static readonly DashDot: float[] = [3, 1, 1, 1];
    private static readonly DashDotDot: float[] = [3, 1, 1, 1, 1, 1];

    public constructor(brush: Brush);
    public constructor(color: CGColor);
    public constructor(brush: Brush, width: float);
    public constructor(color: CGColor, width: float);
    public constructor(...args: any[]) {
        if (args.length === 1 && is.typeof<Brush>(args[0], GraphicTypes.Brush)) {
            const brush: Brush = args[0];
            if (brush == null) {
                throw new ArgumentNullException("brush");
            }
            this.brush = brush.Clone();
            const sb: SolidBrush = as(brush, GraphicTypes.SolidBrush);
            if (sb != null) {
                this.color = sb.Color;
            } else {
                this.color = CGColor.Black;
            }
        } else if (args.length === 1 &&  is.typeof<CGColor>(args[0], CoreGraphicTypes.CGColor)) {
            const color: CGColor = args[0];
            this.brush = new SolidBrush(color);
            this.color = color;
        } else if (args.length === 2 &&  is.typeof<Brush>(args[0], GraphicTypes.Brush) && is.number(args[1])) {
            const brush: Brush = args[0];
            const width: int = args[1];
            if (brush == null) {
                throw new ArgumentNullException("brush");
            }
            this.brush = brush.Clone();
            const sb: SolidBrush = as(brush, GraphicTypes.SolidBrush);
            if (sb != null) {
                this.color = sb.Color;
            } else {
                this.color = CGColor.Black;
            }
            this.width = width;
        } else if (args.length === 2 &&  is.typeof<CGColor>(args[0], CoreGraphicTypes.CGColor) && is.number(args[1])) {
            const color: CGColor = args[0];
            const width: int = args[1];
            this.brush = new SolidBrush(color);
            this.color = color;
            this.width = width;
        } else {
            console.log('Can not create pen correctly.');
        }
    }

    private myDashCap: DashCap = DashCap.Flat;
    public get DashCap(): DashCap {
        return this.myDashCap;
    }
    public set DashCap(value: DashCap) {
        this.myDashCap = value;
        this.changed = true;
    }

    public get Brush(): Brush {
        return this.brush;
    }
    public set Brush(value: Brush) {
        this.brush = value.Clone();
        var sb: SolidBrush = as(this.brush, GraphicTypes.SolidBrush);
        if (sb != null)
            this.color = sb.Color;
        else
            this.color = CGColor.Black;
        this.changed = true;
    }

    public get Color(): CGColor {
        return this.color;
    }
    public set Color(value: CGColor) {
        if (value !== this.color) {
            this.color = value;
            this.brush = new SolidBrush(this.color);
            this.changed = true;
        }
    }

    public Dispose(): void;
    public Dispose(disposing: boolean): void;
    public Dispose(disposing: boolean = true): void {

    }
    public Clone(): Pen {
        if (this.brush != null)
            return new Pen(this.brush, this.width);
        else
            return new Pen(this.color, this.width);
    }

    public get Width(): float {

        return this.width;
    }

    public set Width(value: float) {
        this.width = value;
        this.changed = true;
    }

    public get Transform(): Matrix {

        return this.transform;
    }
    public set Transform(value: Matrix) {
        this.transform = value;
        this.changed = true;

    }

    public get StartCap(): LineCap {
        return this.startCap;
    }
    public set StartCap(value: LineCap) {
        if (Enum.IsDefined(LineCap, value)) {
            this.startCap = value;
            this.changed = true;

        }
        else {
            throw new ArgumentException("Pen StartCap Argument Error.");
        }
    }

    public get EndCap(): LineCap {
        return this.endCap;
    }
    public set EndCap(value: LineCap) {
        if (Enum.IsDefined(LineCap, value)) {
            this.endCap = value;
            this.changed = true;

        }
        else {
            throw new ArgumentException("Pen EndCap Argument Error.");
        }
    }

    public get DashStyle(): DashStyle {

        return this.dashStyle;
    }
    public set DashStyle(value: DashStyle) {
        if (Enum.IsDefined(DashStyle, value)) {
            this.dashStyle = value;
            this.changed = true;
            if (this.dashStyle !== DashStyle.Custom)
                this.dashPattern = undefined as any;
        }
        else {
            throw new ArgumentException("Pen DashStyle Argument Error.");
        }
    }

    public get DashOffset(): number {

        return this.dashOffset;
    }
    public set DashOffset(value: number) {
        // fixme for error checking and range
        this.dashOffset = value;
        this.changed = true;
    }

    public get DashPattern(): float[] {

        return this.dashPattern;
    }
    public set DashPattern(value: float[]) {
        if (value != null) {
            this.dashStyle = DashStyle.Custom;
            this.dashPattern = value;
            this.changed = true;
        } else {
            this.dashStyle = DashStyle.Solid;
            this.dashPattern = undefined as any;
            this.changed = true;
        }
    }

    public setLineCap(startCap: LineCap, endCap: LineCap, dashCap: DashCap): void {
        this.StartCap = startCap;
    }

    public get LineJoin(): LineJoin {
        return this.lineJoin;
    }
    public set LineJoin(value: LineJoin) {
        this.lineJoin = value;
        this.changed = true;
    }

    public get MiterLimit(): float {
        return this.miterLimit;
    }
    public set MiterLimit(value: float) {
        this.miterLimit = value;
        this.changed = true;
    }

    public get Alignment(): PenAlignment {
        return this.alignment;
    }
    public set Alignment(value: PenAlignment) {
        this.alignment = value;
        this.changed = true;
    }

    public get PenType(): PenTypes {
        let penType = PenTypes.Custom;
        if (is.typeof(this.brush, GraphicTypes.SolidBrush)) {
            penType = PenTypes.SolidColor;
        } else if (is.typeof(this.brush, GraphicTypes.HatchBrush)) {
            penType = PenTypes.HatchFill;
        } else if (is.typeof(this.brush, GraphicTypes.LinearGradientBrush)) {
            penType = PenTypes.LinearGradient;
        } else if (is.typeof(this.brush, GraphicTypes.PathGradientBrush)) {
            penType = PenTypes.PathGradient;
        } else if (is.typeof(this.brush, GraphicTypes.TextureBrush)) {
            penType = PenTypes.TextureFill;
        } else if (is.typeof(this.brush, GraphicTypes.RadialGradientBrush)) {
            penType = PenTypes.RadialGradient;
        }
        return penType;
    }

    public Shadow: Shadow = Shadow.identity.clone();

    private setup(graphics: Graphics, fill: boolean): void {

        this.brush.setup(graphics, fill);
        // TODO: apply matrix

        if (graphics.LastPen === this && !this.changed)
            return;

        graphics.renderer.setShadowWithColor(new CGSize(this.Shadow.offsetX, this.Shadow.offsetY), this.Shadow.blur, this.Shadow.color);
        //  A Width of 0 will result in the Pen drawing as if the Width were 1.
        this.width = this.width === 0 ? 1 : this.width;
        //width = graphics.GraphicsUnitConvertFloat (width);

        graphics.renderer.setLineWidth(this.width);

        switch (this.startCap) {
            case LineCap.Flat:
                graphics.renderer.setLineCap(this.width > 1 || this.dashStyle !== DashStyle.Solid ? CGLineCap.Butt : CGLineCap.Square);
                break;
            case LineCap.Square:
                graphics.renderer.setLineCap(CGLineCap.Square);
                break;
            case LineCap.Round:
                graphics.renderer.setLineCap(CGLineCap.Round);
                break;
            //			case LineCap.Triangle:
            //			case LineCap.NoAnchor:
            //			case LineCap.SquareAnchor:
            //			case LineCap.RoundAnchor:
            //			case LineCap.DiamondAnchor:
            //			case LineCap.ArrowAnchor:
            //			case LineCap.AnchorMask:
            //			case LineCap.Custom:
            default:
                graphics.renderer.setLineCap(CGLineCap.Butt);
                break;

        }

        switch (this.dashStyle) {
            case DashStyle.Custom:
                graphics.renderer.setLineDash(this.dashOffset, this.setupMorseCode(this.dashPattern));
                break;
            case DashStyle.Dash:
                graphics.renderer.setLineDash(this.dashOffset, this.setupMorseCode(Pen.Dash));
                break;
            case DashStyle.Dot:
                graphics.renderer.setLineDash(this.dashOffset, this.setupMorseCode(Pen.Dot));
                break;
            case DashStyle.DashDot:
                graphics.renderer.setLineDash(this.dashOffset, this.setupMorseCode(Pen.DashDot));
                break;
            case DashStyle.DashDotDot:
                graphics.renderer.setLineDash(this.dashOffset, this.setupMorseCode(Pen.DashDotDot));
                break;
            default:
                graphics.renderer.setLineDash(0, []);
                break;
        }
        // miter limit
        // join
        // cap
        // dashes

        this.changed = false;
        graphics.LastPen = this;
    }

    private setupMorseCode(morse: float[]): float[] {
        const dashdots: float[] = new Array(morse.length);
        for (let x = 0; x < dashdots.length; x++) {
            dashdots[x] = morse[x] * this.width;
        }
        return dashdots;
    }
}
