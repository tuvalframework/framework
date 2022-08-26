import { CGPoint } from '@tuval/cg';
import { createCanvasElement } from "../createCanvasElement";
import { GraphicsPath } from "./GraphicsPath";
import { PathPointType } from "../PathPointType";
import { float, byte } from "@tuval/core";

const tempCanvas: HTMLCanvasElement = createCanvasElement();
const context: CanvasRenderingContext2D  = tempCanvas.getContext('2d') as any;

export class HitTester {
    private myGraphicsPath: GraphicsPath;
    constructor(graphicsPath: GraphicsPath) {
        this.myGraphicsPath = graphicsPath;
    }

    private plotPath(path: GraphicsPath): void {
        let x1: float = 0, y1: float = 0, x2: float = 0, y2: float = 0, x3: float = 0, y3: float = 0;
        const points: CGPoint[] = path.PathPoints;
        const types: byte[] = path.PathTypes;
        let bidx: number = 0;

        context.beginPath();
        for (let i = 0; i < points.length; i++) {
            var point = points[i];
            var type = types[i];

            switch (type & PathPointType.PathTypeMask) {
                case PathPointType.Start:
                    context.moveTo(point.X, point.Y);
                    break;

                case PathPointType.Line:
                    context.lineTo(point.X, point.Y);
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
                        context.bezierCurveTo(x1, y1, x2, y2, x3, y3);
                        bidx = 0;
                    }
                    break;
                default:
                    throw new Error("Inconsistent internal state, path type=" + type);
            }
            if ((type & PathPointType.CloseSubpath) !== 0)
                context.closePath();
        }
    }
    public test(point: CGPoint) {
        //context.save();
        this.plotPath(this.myGraphicsPath);
        const result = context.isPointInPath(point.X, point.Y);
        //context.restore();
        return result;
    }
}