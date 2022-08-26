import { CGContext2D } from '@tuval/cg';
import { CGColor } from '@tuval/cg';
import { CGRectangle } from '@tuval/cg';
import { CGPoint } from '@tuval/cg';
import { Brush } from "../Brush";
import { WrapMode } from "./WrapMode";
import { Matrix, MatrixOrder } from "./Matrix";
import { Blend } from "./Blend";
import { ColorBlend } from "./ColorBlend";
import { FillMode } from "./FillMode";
import { GraphicsPath } from "./GraphicsPath";
import { GeomUtilities } from "../GeomUtilities";
import { Graphics } from "../Graphics";
import { GraphicTypes } from "../../GDITypes";
import { float, ClassInfo, ArgumentNullException, ArgumentException } from "@tuval/core";

    class Edge {

        // Dimensions of our pixel group
        public static readonly StepXSize: number = 1;
        public static readonly StepYSize: number = 1;

        // Step deltas
        public StepX: number;
        public StepY: number;

        // Edge function values at origin
        public EdgeOrigin: number;

        // Barycentric interpolation factor for each vertex
        public VertexFactor: float;

        // Vertex Color
        public Color: CGColor;

        public A: number;
        public B: number;
        public C: number;

        public constructor(v1: CGPoint, v2: CGPoint, v3: CGPoint, origin: CGPoint, color: CGColor) {
            const ax: number = ~~v1.X;
            const ay: number = ~~v1.Y;
            const bx: number = ~~v2.X;
            const by: number = ~~v2.Y;
            const cx: number = ~~origin.X;
            const cy: number = ~~origin.Y;

            // Edge setup
            this.A = ~~Math.floor(ay) - ~~Math.floor(by);
            this.B = ~~Math.floor(bx) - ~~Math.floor(ax);
            this.C = ax * by - ay * bx;

            // Step deltas - This is setup here in case we want to process more than 1 x 1 pixel groups
            this.StepX = this.A * Edge.StepXSize;
            this.StepY = this.B * Edge.StepYSize;
            this.VertexFactor = 1.0 / ((bx - ax) * (~~v3.Y - ay) - (by - ay) * (~~v3.X - ax));
            // x/y values for initial pixel block
            const x: number = ~~origin.X;
            const y: number = ~~origin.Y;

            this.EdgeOrigin = this.A * x + this.B * y + this.C;

            this.Color = color;
        }

    }

    @ClassInfo({
        fullName:GraphicTypes.PathGradientBrush,
        instanceof: [
            GraphicTypes.PathGradientBrush
        ]
    })
    export class PathGradientBrush extends Brush {
        private pathPoints: CGPoint[] = undefined as any;
        private wrapMode: WrapMode = WrapMode.Clamp;
        private gradientTransform: Matrix = new Matrix();
        private blend: Blend = undefined as any;
        private centerColor: CGColor = CGColor.White;
        private focusScales: CGPoint = CGPoint.Empty;
        private surroundColors: CGColor[] = [CGColor.White];
        private colorBlend: ColorBlend = new ColorBlend();
        private rectangle: CGRectangle = CGRectangle.Empty;
        private centerPoint: CGPoint = CGPoint.Empty;

        private polygonWinding: FillMode = FillMode.Winding;

        public get Blend(): Blend {
            return this.blend;
        }
        public set Blend(value: Blend) {
            if (value == null) {
                throw new ArgumentNullException("Blend");
            }
            this.blend = value;
            this.changed = true;
        }

        public get CenterColor(): CGColor {
            return this.centerColor;
        }
        public set CenterColor(value: CGColor) {
            if (value == null) {
                throw new ArgumentNullException("CenterColor");
            }
            this.centerColor = value;
        }

        public get CenterPoint(): CGPoint {
            return this.centerPoint;
        }
        public set CenterPoint(value: CGPoint) {
            if (value == null) {
                throw new ArgumentNullException("CenterPoint");
            }
            this.centerPoint = value;
        }

        public get FocusScales(): CGPoint {
            return this.focusScales;
        }
        public set FocusScales(value: CGPoint) {
            if (value == null) {
                throw new ArgumentNullException("focusScales");
            }
            this.focusScales = value;
        }

        public get InterpolationColors(): ColorBlend {
            return this.colorBlend;
        }
        public set InterpolationColors(value: ColorBlend) {
            // no null check, MS throws a NullReferenceException here
            let count: number;
            const colors: CGColor[] = value.Colors;
            const positions: float[] = value.Positions;
            count = colors.length;

            if (count === 0 || positions.length === 0) {
                throw new ArgumentException("Invalid ColorBlend object. It should have at least 2 elements in each of the colors and positions arrays.");
            }

            if (count !== positions.length) {
                throw new ArgumentException("Invalid ColorBlend object. It should contain the same number of positions and color values.");
            }

            if (positions[0] !== 0.0) {
                throw new ArgumentException("Invalid ColorBlend object. The positions array must have 0.0 as its first element.");
            }

            if (positions[count - 1] !== 1.0) {
                throw new ArgumentException("Invalid ColorBlend object. The positions array must have 1.0 as its last element.");
            }

            const blend: number[][] = new Array(colors.length);
            for (let i = 0; i < colors.length; i++)
                blend[i] = colors[i].toRgba();

            this.colorBlend = value;
        }

        public get Rectangle(): CGRectangle {
            return this.rectangle;
        }

        public get SurroundColors(): CGColor[] {
            return this.surroundColors;
        }
        public set SurroundColors(value: CGColor[]) {
            if (value == null) {
                throw new ArgumentNullException("SurroundColors");
            }
            this.surroundColors = value;
            this.changed = true;
        }

        public get Transform(): Matrix {
            return this.gradientTransform;
        }
        public set Transform(value: Matrix) {
            if (value == null) {
                throw new ArgumentNullException("Transform");
            }
            this.gradientTransform = value;
            this.changed = true;
        }

        public get WrapMode(): WrapMode {
            return this.wrapMode;
        }
        public set WrapMode(value: WrapMode) {
            if (value == null) {
                throw new ArgumentNullException("WrapMode");
            }
            this.wrapMode = value;
            this.changed = true;
        }


        public constructor(points: CGPoint[], wrapMode: WrapMode);
        public constructor(path: GraphicsPath);
        public constructor(...args: any[]) {
            super();
            if (args.length === 1 && args[0] instanceof GraphicsPath) {
                const path: GraphicsPath = args[0];

                if (path == null) {
                    throw new ArgumentNullException("path");
                }

                const pathClone: GraphicsPath = path.Clone();
                pathClone.closeAllFigures();
                pathClone.flatten();
                this.pathPoints = pathClone.PathPoints;

                // make sure we have a closed path
                if (this.pathPoints[0] !== this.pathPoints[this.pathPoints.length - 1]) {
                    const first: CGPoint = this.pathPoints[0];
                    const temps = new Array(this.pathPoints.length + 1);
                    for (let p = 0; p < this.pathPoints.length; p++)
                        temps[p] = this.pathPoints[p];

                    temps[temps.length - 1] = first;

                    this.pathPoints = temps;
                }

                this.rectangle = GeomUtilities.PolygonBoundingBox(this.pathPoints);
                this.centerPoint = GeomUtilities.PolygonCentroid(this.pathPoints);
                this.wrapMode = WrapMode.Clamp;

                // verify the winding of the polygon so that we cen calculate the
                // edges correctly
                var vt1 = this.pathPoints[0];
                var vt2 = this.centerPoint;
                var vt3 = this.pathPoints[1];

                var pWinding = vt1.X * vt2.Y - vt2.X * vt1.Y;
                pWinding += vt2.X * vt3.Y - vt3.X * vt2.Y;
                pWinding += vt3.X * vt1.Y - vt1.X * vt3.Y;

                // Positive is counter clockwise
                if (pWinding < 0)
                    this.polygonWinding = FillMode.Alternate;

                this.blend = new Blend(1);
                this.blend.Factors = [1.0];
                this.blend.Positions = [1.0];
            } else if ((args.length === 1 || args.length === 2) && Array.isArray(args[0])) {

                const points: CGPoint[] = args[0];
                const wrapMode: WrapMode = args[1] || WrapMode.Clamp;

                if (points == null) {
                    throw new ArgumentNullException("points");
                }

                if ((wrapMode < WrapMode.Tile) || (wrapMode > WrapMode.Clamp)) {
                    throw new ArgumentException("WrapMode");
                }

                this.pathPoints = points;

                // make sure we have a closed path
                if (this.pathPoints[0] !== this.pathPoints[this.pathPoints.length - 1]) {
                    const first: CGPoint = this.pathPoints[0];
                    const temps: CGPoint[] = new Array(this.pathPoints.length + 1);
                    for (let p = 0; p < this.pathPoints.length; p++)
                        temps[p] = this.pathPoints[p];

                    temps[temps.length - 1] = first;

                    this.pathPoints = temps;
                }


                this.rectangle = GeomUtilities.PolygonBoundingBox(this.pathPoints);
                this.centerPoint = GeomUtilities.PolygonCentroid(this.pathPoints);
                this.wrapMode = wrapMode;

                // verify the winding of the polygon so that we cen calculate the
                // edges correctly
                var vt1 = this.pathPoints[0];
                var vt2 = this.centerPoint;
                var vt3 = this.pathPoints[1];

                var pWinding = vt1.X * vt2.Y - vt2.X * vt1.Y;
                pWinding += vt2.X * vt3.Y - vt3.X * vt2.Y;
                pWinding += vt3.X * vt1.Y - vt1.X * vt3.Y;

                if (pWinding < 0)
                    this.polygonWinding = FillMode.Alternate;

                this.blend = new Blend(1);
                this.blend.Factors = [1.0]
                this.blend.Positions = [1.0];
            }
        }

        public multiplyTransform(matrix: Matrix): void;
        public multiplyTransform(matrix: Matrix, order: MatrixOrder): void;
        public multiplyTransform(...args: any[]): void {
            if (args.length === 1) {
                this.multiplyTransform(args[0], MatrixOrder.Prepend);
            } else if (args.length === 2) {
                if (args[0] == null) {
                    throw new ArgumentNullException("matrix");
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
                    throw new ArgumentNullException("matrix");
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
                    throw new ArgumentNullException("matrix");
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
                throw new ArgumentException("Invalid parameter passed.");
            }

            this.blend = new Blend(3);
            this.blend.Positions[1] = focus;
            this.blend.Positions[2] = 1.0;
            this.blend.Factors[1] = scale;
            this.changed = true;
        }

        public setSigmaBellShape(focus: float, scale: float = 1.0): void {
            if (focus < 0 || focus > 1 || scale < 0 || scale > 1) {
                throw new ArgumentException("Invalid parameter passed.");
            }

            this.Blend = GeomUtilities.SigmaBellShape(focus, scale);
        }

        public /*override*/ Clone(): PathGradientBrush {
            return undefined as any;
        }

        public /*internal*/ /*override*/ setup(graphics: Graphics, fill: boolean): void {

            const context: CGContext2D = graphics.renderer;

            // if fill is false then we are being called from a Pen stroke so
            // we need to setup a transparency layer
            // http://developer.apple.com/library/mac/#documentation/GraphicsImaging/Conceptual/drawingwithquartz2d/dq_shadings/dq_shadings.html#//apple_ref/doc/uid/TP30001066-CH207-BBCECJBF
            if (!fill) {
                // FIXME:
                // context.beginTransparencyLayer();
                // this.hasTransparencyLayer = true;
                // Make sure we set a color here so that the gradient shows up
                graphics.LastBrushColor = CGColor.Black;
                return;
            }

            // if this is the same as the last that was set and no changes have been made
            // then return.
            if (graphics.LastBrush != this || this.changed) {
                //setupShadingColors();
            }

            // Transform the start and end points using the brush's transformation matrix
            this.gradientTransform.transformPoints(this.pathPoints);

            this.rasterizePolygon(context, this.centerPoint, this.pathPoints, this.surroundColors, this.centerColor);

            // If we are in a Transparency layer then we need to end the transparency
            /* if (this.hasTransparencyLayer) {
                context.endTransparencyLayer();
            } */

            this.changed = false;

            graphics.LastBrush = this;
            // We will reset the last pen so that it can be setup again
            // so that we do not loose the settings after stroking the gradient
            // not sure where the setting are being reset so this may be a hack
            // and things are just not being restored correctly.
            graphics.LastPen = null as any;
            // I am setting this to be used for Text coloring in DrawString
            graphics.LastBrushColor = this.surroundColors[this.surroundColors.length - 1];
        }

        private rasterizePolygon(context: CGContext2D, center: CGPoint, pathPoints: CGPoint[], surroundColors: CGColor[], centerColor: CGColor): void {

            let last: CGPoint = pathPoints[0];

            let start: CGColor = CGColor.Empty;
            let end: CGColor = CGColor.Empty;
            const count: number = pathPoints.length - 1;
            const colorCount: number = surroundColors.length;
            let startIndex: number = 0;
            let endIndex: number = 1;

            //			// Create new stopwatch
            //			var stopwatch = new System.Diagnostics.Stopwatch ();
            //
            //			// Begin timing
            //			stopwatch.Start();

            for (let p = 1; p <= count; p++) {

                const next: CGPoint = pathPoints[p];

                if (startIndex >= colorCount) {
                    start = surroundColors[colorCount - 1];
                    end = surroundColors[colorCount - 1];
                }
                else {
                    start = surroundColors[startIndex++];
                    if (startIndex == colorCount) {
                        end = surroundColors[0];
                    }
                    else {
                        if (endIndex >= colorCount) {
                            end = surroundColors[colorCount - 1];
                        }
                        else {
                            end = surroundColors[endIndex++];
                        }
                    }
                }

                //Console.WriteLine("triangle {0} P1 {1} P2 {2} P3 {3} color {4}", p, last, next, center, start);
                if (this.polygonWinding === FillMode.Winding)
                    this.rasterizeTriangle(context, center, last, next, centerColor, start, end);
                else
                    this.rasterizeTriangle(context, last, center, next, start, centerColor, end);

                last = next;

            }

            //			// Stop timing
            //			stopwatch.Stop();
            //
            //			// Write result
            //			Console.WriteLine("Time elapsed: {0}",
            //				stopwatch.Elapsed);
        }

        private edge32Red: number = 0;
        private edge32Green: number = 0;
        private edge32Blue: number = 0;
        private edge32Alpha: number = 0;

        private edge13Red: number = 0;
        private edge13Green: number = 0;
        private edge13Blue: number = 0;
        private edge13Alpha: number = 0;

        private edge21Red: number = 0;
        private edge21Green: number = 0;
        private edge21Blue: number = 0;
        private edge21Alpha: number = 0;

        /// <summary>
        /// Rasterizes the triangle specified by the vector / points and their associated colors
        /// using barycentric coordinates.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="vt1"></param>
        /// <param name="vt2"></param>
        /// <param name="vt3"></param>
        /// <param name="colorV1"></param>
        /// <param name="colorV2"></param>
        /// <param name="colorV3"></param>
        private /*internal*/ rasterizeTriangle(context: CGContext2D, vt1: CGPoint, vt2: CGPoint, vt3: CGPoint, colorV1: CGColor, colorV2: CGColor, colorV3: CGColor): void {
            // get the bounding box of the triangle
            const maxX: number = ~~Math.max(vt1.X, Math.max(vt2.X, vt3.X));
            const minX: number = ~~Math.min(vt1.X, Math.min(vt2.X, vt3.X));
            const maxY: number = ~~Math.max(vt1.Y, Math.max(vt2.Y, vt3.Y));
            const minY = ~~Math.min(vt1.Y, Math.min(vt2.Y, vt3.Y));

            // Barycentric coordinates at minX/minY corner
            const pm: CGPoint = new CGPoint(minX, minY);

            const edge32: Edge = new Edge(vt3, vt2, vt1, pm, colorV1);
            const edge13: Edge = new Edge(vt1, vt3, vt2, pm, colorV2);
            const edge21: Edge = new Edge(vt2, vt1, vt3, pm, colorV3);


            let span32: number = edge32.EdgeOrigin;
            let span13: number = edge13.EdgeOrigin;
            let span21: number = edge21.EdgeOrigin;

            this.edge32Red = colorV1.R;
            this.edge32Green = colorV1.G;
            this.edge32Blue = colorV1.B;
            this.edge32Alpha = colorV1.A;

            this.edge13Red = colorV2.R;
            this.edge13Green = colorV2.G;
            this.edge13Blue = colorV2.B;
            this.edge13Alpha = colorV2.A;

            this.edge21Red = colorV3.R;
            this.edge21Green = colorV3.G;
            this.edge21Blue = colorV3.B;
            this.edge21Alpha = colorV3.A;

            let span32XOffset: number = 0;
            let span13XOffset: number = 0;
            let span21XOffset: number = 0;

            let inside: boolean = false;
            let mask: number = 0;
            //  Iterate over each pixel of bounding box and check if it's inside
            //  the triangle using the barycentirc approach.
            for (let y = minY; y <= maxY; y += Edge.StepYSize) {
                // Barycentric coordinates at start of row
                span32XOffset = span32;
                span13XOffset = span13;
                span21XOffset = span21;

                inside = false;
                for (let x = minX; x <= maxX; x += Edge.StepXSize) {

                    mask = span32XOffset | span13XOffset | span21XOffset;

                    // If p is on or inside all edges for any pixels,
                    // render those pixels.
                    if (mask >= 0) {
                        if (!inside) {
                            inside = true;
                        }
                        this.renderPixels(context, x, y, edge32, edge13, edge21, span32XOffset, span13XOffset, span21XOffset);
                    }

                    // Step to the right
                    span32XOffset += edge32.StepX;
                    span13XOffset += edge13.StepX;
                    span21XOffset += edge21.StepX;
                    if (mask < 0 && inside) {
                        inside = false;
                        break;
                    }
                }


                // Row step
                span32 += edge32.StepY;
                span13 += edge13.StepY;
                span21 += edge21.StepY;
            }
        }

        private pixelRect: CGRectangle = new CGRectangle(0, 0, 1, 1);
        private  colorOutput:float[] = new Array(4);
        private renderPixels(context: CGContext2D, x: number, y: number, edge32: Edge, edge13: Edge, edge21: Edge, w1: number, w2: number, w3: number): void {

            //VertexInterpoliation = A * x + B * y + C;
            //			float alpha = (edge32.A * x + edge32.B * y + edge32.C) * edge32.VertexFactor;
            //			float beta = (edge13.A * x + edge13.B * y + edge13.C)  * edge13.VertexFactor;
            //			float gamma = (edge21.A * x + edge21.B * y + edge21.C) * edge21.VertexFactor;

            // Determine barycentric coordinates
            const alpha: float = (w1 * edge32.VertexFactor);
            const beta: float = (w2 * edge13.VertexFactor);
            const gamma: float = (w3 * edge21.VertexFactor);

            this.gradientLerp3(alpha, beta, gamma);
            // Set the color
            this.colorOutput = this.colorOutput.map((item: number) => Math.round(item));
            context.setFillColor(this.colorOutput[0], this.colorOutput[1], this.colorOutput[2], this.colorOutput[3]);

            // Set our pixel location
            this.pixelRect.X = x;
            this.pixelRect.Y = y;

            // Fill the pixel
            context.fillRect(this.pixelRect);

        }


        private gradientLerp3(alpha: float, beta: float, gamma: float): void {

            var resRed = (alpha * this.edge32Red) + ((beta * this.edge13Red) + (gamma * this.edge21Red));
            var resGreen = (alpha * this.edge32Green) + ((beta * this.edge13Green) + (gamma * this.edge21Green));
            var resBlue = (alpha * this.edge32Blue) + ((beta * this.edge13Blue) + (gamma * this.edge21Blue));
            var resAlpha = (alpha * this.edge32Alpha) + ((beta * this.edge13Alpha) + (gamma * this.edge21Alpha));

            this.colorOutput[0] = resRed ;
            this.colorOutput[1] = resGreen ;
            this.colorOutput[2] = resBlue ;
            this.colorOutput[3] = resAlpha ;
        }
        public /*override*/ equals(obj: PathGradientBrush): boolean {
            return false;
            /* return (obj instanceof PathGradientBrush)
				&& this.pathPoints.Equals(b.pathPoints)
                && wrapMode.Equals(b.wrapMode)
                && gradientTransform.Equals(b.gradientTransform)
                && centerColor.Equals(b.centerColor)
                && focusScales.Equals(b.focusScales)
                && surroundColors.Equals(b.surroundColors)
                && colorBlend.Equals(b.colorBlend)
                && rectangle.Equals(b.rectangle)
                && centerPoint.Equals(b.centerPoint)
                && polygonWinding.Equals(b.polygonWinding)
                && blend.Equals(b.blend); */
        }
    }