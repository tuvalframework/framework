import { CGColor } from '@tuval/cg';
import { CGRectangle,CGSize } from '@tuval/cg';
import { CGPoint } from '@tuval/cg';
import { Brush } from '../Brush';
import { WrapMode } from './WrapMode';
import { Matrix, MatrixOrder } from './Matrix';
import { Blend } from './Blend';
import { ColorBlend } from './ColorBlend';
import { LinearGradientMode } from './LinearGradientMode';
import { GeomUtilities } from '../GeomUtilities';
import { Graphics } from '../Graphics';
import { CGContext2D,CGImage } from '@tuval/cg';
import { CGAffineTransform } from '@tuval/cg';
import { CGPattern, CGPatternTiling } from '@tuval/cg';
import { GraphicTypes } from '../../GDITypes';
import { ClassInfo, float, ArgumentNullException, Out, newOutEmpty, ArgumentException } from '@tuval/core';

function isNullOrUndefined(value: any): boolean {
    return value == null;
}

@ClassInfo({
    fullName: GraphicTypes.LinearGradientBrush,
    instanceof: [
        GraphicTypes.LinearGradientBrush
    ]
})
export class LinearGradientBrush extends Brush {
    // Fields
    protected interpolationColorsWasSet: boolean = false;
    protected wrapMode: WrapMode = WrapMode.Tile;
    protected gammaCorrection: boolean = undefined as any;
    //bool changed;
    protected gradientTransform: Matrix = new Matrix();

    protected startPoint: CGPoint = undefined as any;
    protected endPoint: CGPoint = undefined as any;
    protected colors: CGColor[] = new Array(2);
    protected blend: Blend;
    protected colorBlend: ColorBlend = undefined as any;
    protected rectangle: CGRectangle = CGRectangle.Empty;
    protected angle: float = 0;
    protected angleIsScalable: boolean = false;

    protected mode: LinearGradientMode = LinearGradientMode.Horizontal;
    protected modeWasSet: boolean = false;
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
        if (isNullOrUndefined(value)) {
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
        if (isNullOrUndefined(value)) {
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
        if (isNullOrUndefined(value) || isNullOrUndefined(value[0]) || isNullOrUndefined(value[1])) {
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
        if (isNullOrUndefined(value)) {
            throw new ArgumentNullException('Transform');
        }
        this.gradientTransform = value.clone();
        this.changed = true;
    }

    public get WrapMode(): WrapMode {
        return this.wrapMode;
    }
    public set WrapMode(value: WrapMode) {
        if (isNullOrUndefined(value)) {
            throw new ArgumentNullException('WrapMode');
        }
        this.wrapMode = value;
        this.changed = true;
    }

    public constructor(rect: CGRectangle, color1: CGColor, color2: CGColor);
    public constructor(rect: CGRectangle, color1: CGColor, color2: CGColor, mode: LinearGradientMode);
    public constructor(rect: CGRectangle, color1: CGColor, color2: CGColor, angle: float);
    //public constructor(rect: RectangleF, color1: Color, color2: Color, angle: float, isAngleScaleable: boolean);
    public constructor(startPoint: CGPoint, endPoint: CGPoint, startColor: CGColor, endColor: CGColor);
    public constructor(...args: any[]) {
        super();
        if (args.length === 3 && args[0] instanceof CGRectangle) {
            this.rectangle = args[0];
            this.colors[0] = args[1];
            this.colors[1] = args[2];

        } else if (args.length === 4 && args[0] instanceof CGRectangle && typeof args[3] === 'string') {
            this.rectangle = args[0];
            this.colors[0] = args[1];
            this.colors[1] = args[2];
            this.mode = args[3] as any;
            this.modeWasSet = true;
        } else if (args.length === 4 && args[0] instanceof CGRectangle && typeof args[3] === 'number') {
            /*  this.rectangle = args[0];
             this.colors[0] = args[1];
             this.colors[1] = args[2];
             this.angle = args[3]; */
            const outStartPoint: Out<CGPoint> = newOutEmpty();
            const outEndPoint: Out<CGPoint> = newOutEmpty();
            GeomUtilities.ComputeOrientationLine(args[0], args[3], outStartPoint, outEndPoint);
            this.startPoint = outStartPoint.value as any;
            this.endPoint = outEndPoint.value as any;
            this.angle = args[3];
            this.colors[0] = args[1];
            this.colors[1] = args[2];

            this.rectangle = args[0];

        } else if (args.length === 4) {
            this.startPoint = args[0];
            this.endPoint = args[1];

            this.colors[0] = args[2];
            this.colors[1] = args[3];

            this.rectangle.Size = new CGSize(this.endPoint.X - this.startPoint.X, this.endPoint.Y - this.startPoint.Y);
            this.rectangle.X = this.rectangle.Width < 0 ? this.endPoint.X : this.startPoint.X;
            this.rectangle.Y = this.rectangle.Height < 0 ? this.endPoint.Y : this.startPoint.Y;

            if (this.rectangle.Width < 0) {
                this.rectangle.Width = -this.rectangle.Width;
            }

            if (this.rectangle.Height < 0) {
                this.rectangle.Height = -this.rectangle.Height;
            }

            if (this.rectangle.Height === 0) {
                this.rectangle.Height = this.rectangle.Width;
                this.rectangle.Y = this.rectangle.Y - this.rectangle.Height / 2.0;
            } else if (this.rectangle.Width === 0) {
                this.rectangle.Width = this.rectangle.Height;
                this.rectangle.X = this.rectangle.X - this.rectangle.Width / 2.0;
            }
        } else if (args.length === 5) {
            const outStartPoint: Out<CGPoint> = newOutEmpty();
            const outEndPoint: Out<CGPoint> = newOutEmpty();
            GeomUtilities.ComputeOrientationLine(args[0], args[3], outStartPoint, outEndPoint);
            this.startPoint = outStartPoint.value as any;
            this.endPoint = outEndPoint.value as any;
            this.angle = args[3];
            this.angleIsScalable = args[4];
            this.colors[0] = args[1];
            this.colors[1] = args[2];

            this.rectangle = args[0];
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
            if (isNullOrUndefined(args[0])) {
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
            if (isNullOrUndefined(args[0])) {
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
            if (isNullOrUndefined(args[0])) {
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

    private gradientLerp(data: float, outData: Out<float[]>): void {
        let lerpDist: float = data;

        let i: number = 0;

        let numPositions: number = this.positions.length;

        // Make sure we put the linear distance value back into the 0.0 .. 1.0 range
        // depending on the wrap mode
        if (this.wrapMode === WrapMode.Tile || this.wrapMode === WrapMode.TileFlipY) {
            // Repeat
            lerpDist = lerpDist - Math.floor(lerpDist);
        } else {
            // Reflect
            lerpDist = Math.abs(lerpDist) % 2.0;
            if (lerpDist > 1.0) {
                lerpDist = 2.0 - lerpDist;
            }
        }

        for (i = 0; i < numPositions; i++) {
            if (this.positions[i] > lerpDist)
                break;
        }

        let prevPosition: float = 0;
        let dist: float = 0;
        let normalized: float = 0;

        if (i == 0 || i == numPositions) {
            if (i == numPositions)
                --i;

            // When we have multiple positions we need to interpolate the colors
            // between the two positions.
            // normalized will be the normalized [0,1] amount
            // of the gradiant area between the two positions.
            //
            // The shading colors have already
            // been setup with the color factors taken into account.

            // Get the distance between current position and last position
            dist = this.factors[i] - prevPosition;
            // normalized value between the two shading colors
            normalized = (lerpDist - prevPosition) / dist;
            for (let ctr = 0; ctr < 4; ctr++) {
                outData[ctr] = GeomUtilities.Lerp(this.shadingColors[0][ctr],
                    this.shadingColors[1][ctr],
                    normalized);
            }
        } else {
            // When we have multiple positions we need to interpolate the colors
            // between the two positions.
            // normalized will be the normalized [0,1] amount
            // of the gradiant area between the two positions.
            //
            // The shading colors have already
            // been setup with the color factors taken into account.
            prevPosition = this.positions[i - 1];
            // Get the distance between current position and last position
            dist = this.positions[i] - prevPosition;
            // normalized value between the two shading colors
            normalized = (lerpDist - prevPosition) / dist;

            for (let ctr = 0; ctr < 4; ctr++) {

                outData[ctr] = GeomUtilities.Lerp(this.shadingColors[i - 1][ctr],
                    this.shadingColors[i][ctr],
                    normalized);
            }
        }


        if (this.GammaCorrection) {
            // * NOTE * Here I am only computing the gamma correction for RGB values not alpha
            // I am really not sure if this is correct or not but from my reading on this topic
            // it is really never mentioned that alpha is included.
            for (let ctr = 0; ctr < 3; ctr++) {

                outData[ctr] = Math.pow(outData[ctr], this.gamma);
            }

        }
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

    protected /* virtual */ drawGradient(context: CGContext2D): void {
        const startColor: string = '#' + CGColor.RgbToHex(this.colors[0].R, this.colors[0].G, this.colors[0].B);
        const endColor: string = '#' + CGColor.RgbToHex(this.colors[1].R, this.colors[1].G, this.colors[1].B);

        if (this.modeWasSet) {
            switch (this.mode) {
                case LinearGradientMode.Horizontal:
                    this.angle = 0;
                    break;
                case LinearGradientMode.Vertical:
                    this.angle = 90;
                    break;
                case LinearGradientMode.ForwardDiagonal:
                    this.angle = 45;
                    break;
                case LinearGradientMode.BackwardDiagonal:
                    this.angle = 315;
                    break;
            }
        }

        if (this.angle === 90) {
            this.angle = 91;
        }
        if (this.angle === 180) {
            this.angle = 181;
        }
        if (this.angle === 270) {
            this.angle = 271;
        }
        if (this.angle === 360) {
            this.angle = 1;
        }

        const points = GeomUtilities.GetSurroundingRectangle(this.angle, this.rectangle);

        //grd = context.canvasContext.createLinearGradient(this.startPoint.X, this.startPoint.Y, this.endPoint.X, this.endPoint.Y);
        const grd = (<any>context).canvasContext.createLinearGradient((points[1].X + points[0].X) / 2, (points[1].Y + points[0].Y) / 2, (points[2].X + points[3].X) / 2, (points[2].Y + points[3].Y) / 2);


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

        (<any>context).canvasContext.fillStyle = grd;
        (<any>context).canvasContext.rect(0, 0, this.rectangle.Width, this.rectangle.Height);
        (<any>context).canvasContext.fill()
    }

    private applyGammaCorrection(ctx: CGContext2D): void {
        if (this.GammaCorrection) {
            const image: CGImage = new CGImage((<any>ctx).canvasContext);
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
            this.WrapMode,
            this.applyGammaCorrection.bind(this) as any);
        //we dont need to set any color, as the pattern cell itself has chosen its own color
        const aone: float[] = [1];
        graphics.renderer.setFillPattern(pattern, aone);
        graphics.renderer.setStrokePattern(pattern, aone);
        graphics.LastBrush = this;

    }
}
