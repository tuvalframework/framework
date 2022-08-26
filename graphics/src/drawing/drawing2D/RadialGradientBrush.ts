import { LinearGradientBrush } from "./LinearGradientBrush";
import { GeomUtilities } from "../GeomUtilities";
import { CGRectangle, CGPoint, CGColor, CGContext2D, CGImage } from "@tuval/cg";
import { Brush } from "../Brush";
import { Matrix, MatrixOrder } from "./Matrix";
import { Blend } from "./Blend";
import { ColorBlend } from "./ColorBlend";
import { Graphics } from "../Graphics";
import { CGAffineTransform, CGPattern, CGPatternTiling } from "@tuval/cg";
import { WrapMode } from "./WrapMode";
import { GraphicTypes } from "../../GDITypes";
import { ClassInfo, float, ArgumentNullException, ArgumentException } from "@tuval/core";


@ClassInfo({
    fullName: GraphicTypes.RadialGradientBrush,
    instanceof: [
        GraphicTypes.RadialGradientBrush
    ]
})
export class RadialGradientBrush extends Brush {
    private x1: number = 0;
    private y1: number = 0;
    private outerRadius: number = 0;
    private x2: number = 0;
    private y2: number = 0;
    private innerRadius: number = 0;
    private isRectangleMode: boolean = false;
    private angle: float = 0;

    // Fields
    protected interpolationColorsWasSet: boolean = false;
    protected gammaCorrection: boolean = false;
    //bool changed;
    protected gradientTransform: Matrix = new Matrix();

    protected startPoint: CGPoint = undefined as any;
    protected endPoint: CGPoint = undefined as any;
    protected colors: CGColor[] = new Array(2);
    protected blend: Blend;
    protected colorBlend: ColorBlend = undefined as any;
    protected rectangle: CGRectangle = CGRectangle.Empty;

    protected positions: float[] = [0, 0.5, 1];
    protected factors: float[] = undefined as any;

    // Everything I have read on the internet shows Microsoft
    // using a 2.2 gamma correction for colors.
    // for instance: http://msdn.microsoft.com/en-gb/library/windows/desktop/hh972627(v=vs.85).aspx
    protected gamma: float = 1.0 / 2.2;

    // Shading
    protected shadingColors: float[][] = undefined as any;

    // When stroking with a gradient we have to use Transparency Layers.
    protected hasTransparencyLayer: boolean = false;

    public get Blend(): Blend {
        return this.blend;
    }
    public set Blend(value: Blend) {
        if (value == null) {
            throw new ArgumentNullException('Blend');
        }
        this.blend = value;
        this.changed = true;
    }

    public get GammaCorrection(): boolean {
        return this.gammaCorrection;
    }
    public set GammaCorrection(value: boolean) {
        if (this.gammaCorrection !== value) {
            this.gammaCorrection = value;
            this.changed = true;
        }
    }

    public get InterpolationColors(): ColorBlend {
        return this.colorBlend;
    }
    public set InterpolationColors(value: ColorBlend) {
        if (value == null) {
            throw new ArgumentNullException('ColorBlend');
        }
        this.colorBlend = value;
        this.interpolationColorsWasSet = true;
        this.changed = true;
    }

    public get LinearColors(): CGColor[] {
        return [this.colors[0], this.colors[1]];
    }
    public set LinearColors(value: CGColor[]) {
        // TODO: do some sanity tests?
        if (value == null || value[0] == null || value[1] == null) {
            throw new ArgumentNullException('LinearColors');
        }

        this.colors[0] = value[0];
        this.colors[1] = value[1];
        this.changed = true;
    }

    public get Rectangle(): CGRectangle {
        return this.rectangle;
    }

    public get Transform(): Matrix {
        return this.gradientTransform;
    }
    public set Transform(value: Matrix) {
        if (value == null) {
            throw new ArgumentNullException('Transform');
        }
        this.gradientTransform = value.clone();
        this.changed = true;
    }

    public constructor(x1: number, y1: number, innerRadius: number, x2: number, y2: number, outerRadius: number, startColor: CGColor, endColor: CGColor);
    public constructor(rect: CGRectangle, startColor: CGColor, endColor: CGColor);
    public constructor(...args: any[]) {
        super();
        if (args.length === 8 && typeof args[0] === 'number') {
            this.x1 = args[0];
            this.y1 = args[1];
            this.innerRadius = args[2];
            this.x2 = args[3];
            this.y2 = args[4];
            this.outerRadius = args[5];
            this.colors[0] = args[6];
            this.colors[1] = args[7]
            this.rectangle = new CGRectangle(0, 0, this.outerRadius * 2, this.outerRadius * 2);
        } else if (args.length === 3) {
            this.rectangle = args[0];
            this.colors[0] = args[1];
            this.colors[1] = args[2];
            this.isRectangleMode = true;
        }

        this.blend = new Blend(1);
        this.blend.Factors = [1.0];
        this.blend.Positions = [1.0];
    }

    public /*override*/ Clone(): LinearGradientBrush {
        var clone = new LinearGradientBrush(this.rectangle, this.colors[0], this.colors[1], this.angle/* , this.angleIsScalable */);
        clone.Blend = this.blend;
        if (this.interpolationColorsWasSet) {
            clone.InterpolationColors = this.colorBlend;
        }
        clone.Transform = this.gradientTransform;
        clone.GammaCorrection = this.gammaCorrection;

        return clone;
    }

    public multiplyTransform(matrix: Matrix): void;
    public multiplyTransform(matrix: Matrix, order: MatrixOrder): void;
    public multiplyTransform(...args: any[]): void {
        if (args.length === 1) {
            this.multiplyTransform(args[0], MatrixOrder.Prepend);
        } else if (args.length === 2) {
            if (args[0] == null) {
                throw new ArgumentNullException('matrix');
            }
            this.gradientTransform.multiply(args[0], args[1]);
            this.changed = true;
        }
    }

    public resetTransform(): void {
        this.gradientTransform.reset();
        this.changed = true;
    }

    public rotateTransform(angle: float): void;
    public rotateTransform(angle: float, order: MatrixOrder): void;
    public rotateTransform(...args: any[]): void {
        if (args.length === 1) {
            this.rotateTransform(args[0], MatrixOrder.Prepend);
        } else if (args.length === 2) {
            if (args[0] == null) {
                throw new ArgumentNullException('matrix');
            }
            this.gradientTransform.rotate(args[0], args[1]);
            this.changed = true;
        }
    }

    public scaleTransform(sx: float, sy: float): void;
    public scaleTransform(sx: float, sy: float, order: MatrixOrder): void;
    public scaleTransform(...args: any[]): void {
        if (args.length === 1) {
            this.scaleTransform(args[0], args[1], MatrixOrder.Prepend);
        } else if (args.length === 2) {
            if (args[0] == null) {
                throw new ArgumentNullException('matrix');
            }
            this.gradientTransform.scale(args[0], args[1], args[2]);
            this.changed = true;
        }
    }

    public translateTransform(dx: float, dy: float): void;
    public translateTransform(dx: float, dy: float, order: MatrixOrder): void;
    public translateTransform(...args: any[]): void {
        if (args.length === 1) {
            this.translateTransform(args[0], args[1], MatrixOrder.Prepend);
        } else if (args.length === 2) {
            this.gradientTransform.translate(args[0], args[1], args[2]);
            this.changed = true;
        }
    }

    public setBlendTriangularShape(focus: float, scale: float = 1.0): void {
        if (focus < 0 || focus > 1 || scale < 0 || scale > 1) {
            throw new ArgumentException('Invalid parameter passed.');
        }

        this.blend = new Blend(3);
        this.blend.Positions[1] = focus;
        this.blend.Positions[2] = 1.0;
        this.blend.Factors[1] = scale;
        this.changed = true;
    }

    public setSigmaBellShape(focus: float, scale: float = 1.0): void {
        if (focus < 0 || focus > 1 || scale < 0 || scale > 1) {
            throw new ArgumentException('Invalid parameter passed.');
        }

        this.Blend = GeomUtilities.SigmaBellShape(focus, scale);
    }

    private setColorsUsingBlend(): void {
        const size: number = this.blend.Positions.length;

        if (size == 1) {
            this.shadingColors = new Array(2);
            for (let i = 0; i < this.shadingColors.length; i++) {
                this.shadingColors[i] = [];
            }
            this.factors = new Array(2);
            for (let i = 0; i < this.factors.length; i++) {
                this.factors[i] = 0;
            }
            this.positions = new Array(2);
            for (let i = 0; i < this.positions.length; i++) {
                this.positions[i] = 0;
            }

            // check for default Blend to setup the shading colors
            // appropriately.
            if (this.blend.Factors[0] === 1 && this.blend.Positions[0] === 1) {
                this.factors[0] = 0;
                this.positions[0] = 0;
            }
            else {
                // This is a special case where a blend was set
                // with a factor.  It still does not give exact
                // results with windows.  Need to look at this as
                // still not sure what it should do.
                // Example:
                //	float[] myFactors = { 0.2f };
                //	float[] myPositions = { 0.0f };
                //	Blend myBlend = new Blend();
                //	myBlend.Factors = myFactors;
                //	myBlend.Positions = myPositions;
                //	lgBrush2.Blend = myBlend;
                this.factors[0] = this.blend.Factors[0];
                this.positions[0] = 1.0;
            }

            // Close off the color shadings
            this.factors[1] = 1.0;
            this.positions[1] = 1.0;

        }
        else {
            this.shadingColors = new Array(size);
            for (let i = 0; i < this.shadingColors.length; i++) {
                this.shadingColors[i] = [];
            }
            this.factors = this.blend.Factors;
            this.positions = this.blend.Positions;
        }

        const sc: float[] = [this.colors[0].R / 255, this.colors[0].G / 255, this.colors[0].B / 255, this.colors[0].A / 255];
        const ec: float[] = [this.colors[1].R / 255, this.colors[1].G / 255, this.colors[1].B / 255, this.colors[1].A / 255];

        let factor: float = 0;
        for (let s = 0; s < this.positions.length; s++) {
            this.shadingColors[s] = new Array(4);
            for (let i = 0; i < this.shadingColors[s].length; i++) {
                this.shadingColors[s][i] = 0;
            }
            factor = this.factors[s];
            //Console.WriteLine("shadingIndex {0} position {1} factor {2}",s, positions[s], factor);

            for (let c = 0; c < 4; c++) {
                this.shadingColors[s][c] = GeomUtilities.Lerp(sc[c], ec[c], factor);
            }
        }
    }

    protected /*override*/ drawGradient(context: CGContext2D): void {
        const startColor: string = '#' + CGColor.RgbToHex(this.colors[0].R, this.colors[0].G, this.colors[0].B);
        const endColor: string = '#' + CGColor.RgbToHex(this.colors[1].R, this.colors[1].G, this.colors[1].B);

        //const points = GeomUtilities.GetSurroundingRectangle(this.angle, this.rectangle);

        //grd = context.canvasContext.createLinearGradient(this.startPoint.X, this.startPoint.Y, this.endPoint.X, this.endPoint.Y);
        if (this.isRectangleMode) {
            var rx = this.rectangle.Width / Math.sqrt(2);
            var ry = this.rectangle.Height / Math.sqrt(2);
            var cx = this.rectangle.Width / 2;
            var cy = this.rectangle.Height / 2;

            var scaleX;
            var scaleY;
            var invScaleX;
            var invScaleY;
            var grad;
            rx = (rx == 0) ? 0.25 : rx;
            ry = (ry == 0) ? 0.25 : ry;
            let grd;
            if (rx >= ry) {
                scaleX = 1;
                invScaleX = 1;
                scaleY = ry / rx;
                invScaleY = rx / ry;
                grd = context.drawingContext.createRadialGradient(cx, cy * invScaleY, 0, cx, cy * invScaleY, rx);
            }
            else {
                scaleY = 1;
                invScaleY = 1;
                scaleX = rx / ry;
                invScaleX = ry / rx;
                grd = context.drawingContext.createRadialGradient(cx * invScaleX, cy, 0, cx * invScaleX, cy, ry);
            }



            if (this.interpolationColorsWasSet) {
                for (let i = 0; i < this.InterpolationColors.Colors.length; i++) {
                    grd.addColorStop(this.InterpolationColors.Positions[i], this.InterpolationColors.Colors[i].toString());
                }
            } else if (this.blend) {
                for (let i = 0; i < this.shadingColors.length; i++) {
                    grd.addColorStop(this.positions[i], new CGColor(this.shadingColors[i][0] * 255, this.shadingColors[i][1] * 255, this.shadingColors[i][2] * 255, this.shadingColors[i][3] * 255).toString());
                }
            } else {
                grd.addColorStop(0, this.colors[0].toString());
                grd.addColorStop(1, this.colors[1].toString());
            }

            context.drawingContext.fillStyle = grd;
            context.drawingContext.setTransform(scaleX, 0, 0, scaleY, 0, 0);
            context.drawingContext.rect(0, 0, this.rectangle.Width * invScaleX, this.rectangle.Height * invScaleY);
            context.drawingContext.fill();
        } else {
            const grd = context.drawingContext.createRadialGradient(this.x1, this.y1, this.innerRadius, this.x2, this.y2, this.outerRadius);
            if (this.interpolationColorsWasSet) {
                for (let i = 0; i < this.InterpolationColors.Colors.length; i++) {
                    grd.addColorStop(this.InterpolationColors.Positions[i], this.InterpolationColors.Colors[i].toString());
                }
            } else if (this.blend) {
                for (let i = 0; i < this.shadingColors.length; i++) {
                    grd.addColorStop(this.positions[i], new CGColor(this.shadingColors[i][0] * 255, this.shadingColors[i][1] * 255, this.shadingColors[i][2] * 255, this.shadingColors[i][3] * 255).toString());
                }
            } else {
                grd.addColorStop(0, this.colors[0].toString());
                grd.addColorStop(1, this.colors[1].toString());
            }

            context.drawingContext.fillStyle = grd;
            context.drawingContext.rect(0, 0, this.rectangle.Width, this.rectangle.Height);
            context.drawingContext.fill();
        }
    }

    private applyGammaCorrection(ctx: CGContext2D): void {
        if (this.GammaCorrection) {
            const image: CGImage = new CGImage(ctx.drawingContext);
            image.loadPixels();
            for (let x = 0; x < image.Width; x++) {
                for (let y = 0; y < image.Height; y++) {
                    const pixelColor: CGColor = image.getPixelColor(x, y);
                    const newRed = 255 * Math.pow((pixelColor.R / 255), this.gamma);
                    const newGreen = 255 * Math.pow((pixelColor.G / 255), this.gamma);
                    const newBlue = 255 * Math.pow((pixelColor.B / 255), this.gamma);
                    const newAlpha = pixelColor.A;
                    image.set(x, y, new CGColor(Math.round(newRed), Math.round(newGreen), Math.round(newBlue), newAlpha));
                }
            }
            image.updatePixels();
        }

    }

    // TODO: Implement setup method
    public /*internal*/ /*override*/ setup(graphics: Graphics, fill: boolean): void {
        if (graphics.LastBrush === this)
            return;

        this.setColorsUsingBlend();
        /*  const startColor: string = '#' + Color.RgbToHex(this.colors[0].R, this.colors[0].G, this.colors[0].B);
         const endColor: string = '#' + Color.RgbToHex(this.colors[1].R, this.colors[1].G, this.colors[1].B);

         let grd;
         if (this.mode === LinearGradientMode.Horizontal) {
             grd = graphics.context.canvasContext.createLinearGradient(this.rectangle.Left, this.rectangle.Top, this.rectangle.Right, this.rectangle.Top);
         } else if (this.mode === LinearGradientMode.Vertical) {
             grd = graphics.context.canvasContext.createLinearGradient(this.rectangle.Left, this.rectangle.Top, this.rectangle.Left, this.rectangle.Bottom);
         } else if (this.mode === LinearGradientMode.ForwardDiagonal) {
             grd = graphics.context.canvasContext.createLinearGradient(this.rectangle.Left, this.rectangle.Top, this.rectangle.Right, this.rectangle.Bottom);
         } else if (this.mode === LinearGradientMode.BackwardDiagonal) {
             grd = graphics.context.canvasContext.createLinearGradient(this.rectangle.Right, this.rectangle.Top, this.rectangle.Left, this.rectangle.Bottom);
         }

         grd.addColorStop(0, startColor);
         grd.addColorStop(1, endColor);

         graphics.context.canvasContext.fillStyle = grd; */

        //let drawPattern: (context: CGContext) => void;

        const patternTransform = CGAffineTransform.MakeIdentity();
        patternTransform.multiply(this.gradientTransform.transform);

        const points = GeomUtilities.GetSurroundingRectangle(30, this.rectangle);

        const transform = CGAffineTransform.MakeIdentity();
        transform.rotate((360 - 30) * Math.PI / 180);
        const point1 = transform.point(points[0]);
        const point2 = transform.point(points[1]);
        const point3 = transform.point(points[2]);
        const point4 = transform.point(points[3]);
        //this.rectangle = new RectangleF(point1, new SizeF(point4.X - point1.X, point2.Y - point1.Y));

        //patternTransform.translate( 0, -this.rectangle.Height / 2);

        /*  patternTransform.translate(this.rectangle.X + this.rectangle.Width / 2, this.rectangle.Y + this.rectangle.Height / 2);
         patternTransform.rotate(30 * Math.PI / 180);
         patternTransform.translate(-(this.rectangle.X + this.rectangle.Width / 2), -(this.rectangle.Y + this.rectangle.Height / 2)); */

        var pattern = new CGPattern(this.rectangle,
            patternTransform,
            this.rectangle.Width, this.rectangle.Height,
            CGPatternTiling.NoDistortion,
            true, this.drawGradient.bind(this) as any,
            WrapMode.Tile,
            this.applyGammaCorrection.bind(this) as any);
        //we dont need to set any color, as the pattern cell itself has chosen its own color
        const aone: float[] = [1];
        graphics.renderer.setFillPattern(pattern, aone);
        graphics.renderer.setStrokePattern(pattern, aone);
        graphics.LastBrush = this;

    }
}
