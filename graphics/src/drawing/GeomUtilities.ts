import { CGRectangle, CGPoint, CGSize ,CGAffineTransform} from '@tuval/cg';
import { float, Out, newOutEmpty } from '@tuval/core';
import { Blend } from './drawing2D/Blend';
import { Matrix } from './drawing2D/Matrix';
import { CurveType } from './drawing2D/GraphicsPath';

export class GeomUtilities {
    /*
           * The angle of the orientation line determines which corners the starting and ending lines pass through.
           * For example, if the angle is between 0 and 90 degrees, the starting line passes through the upper-left corner,
           * and the ending line passes through the lower-right corner.
           *
           * Mac NSGradient drawInRect angle Documentation:
           *
           * https://developer.apple.com/library/mac/#documentation/Cocoa/Reference/NSGradient_class/Reference/Reference.html
           *
           * Linear gradient starting points.
           *   Mac osx coordinates
           * 	Rotation angle		Start corner
           * 	0-89 degrees		Lower-left
           * 	90-179 degrees		Lower-right
           * 	180-269 degrees		Upper-right
           * 	270-359 degrees		Upper-left
           *
           *  Think of a rectangle within a circle.  start from one of the quadrants above and find the point on the
           *  circumference of the circle
           *
           * http://msdn.microsoft.com/en-us/library/ms142563.aspx
           * All points along any line perpendicular to the orientation line are the same color.
           * The starting line is perpendicular to the orientation line and passes through one of the corners of
           * the rectangle. All points on the starting line are the starting color. Then ending line is perpendicular
           * to the orientation line and passes through one of the corners of the rectangle. All points on the
           * ending line are the ending color.
           *
           */
    public static ComputeOrientationLine(rect: CGRectangle, angle: float, start: Out<CGPoint>, end: Out<CGPoint>): void {
        start.value = CGPoint.Empty;
        end.value = CGPoint.Empty;

        let tanSize: CGSize = CGSize.Empty;

        // Clamp to 360 degrees
        angle = angle % 360;

        // We start by breaking the angle up into quadrants
        // as per table in comments
        if (angle < 90) {
            start.value.X = rect.Location.X;
            start.value.Y = rect.Location.Y;
            tanSize.Width = rect.Size.Width;
            tanSize.Height = rect.Size.Height;
        } else if (angle < 180) {
            start.value.X = rect.Location.X + rect.Size.Width;
            start.value.Y = rect.Location.Y;

            tanSize.Width = -rect.Size.Width;
            tanSize.Height = rect.Size.Height;
        } else if (angle < 270) {
            start.value.X = rect.Location.X + rect.Size.Width;
            start.value.Y = rect.Location.Y + rect.Size.Height;

            tanSize.Width = -rect.Size.Width;
            tanSize.Height = -rect.Size.Height;
        } else {
            start.value.X = rect.Location.X;
            start.value.Y = rect.Location.Y + rect.Size.Height;

            tanSize.Width = rect.Size.Width;
            tanSize.Height = -rect.Size.Height;
        }

        const radAngle: float = GeomUtilities.ToRadians(angle);
        // Distance formula to get the circle radius - http://en.wikipedia.org/wiki/Distance
        const radius: float = Math.sqrt(rect.Size.Width * rect.Size.Width + rect.Size.Height * rect.Size.Height);
        // get the slope angle
        const slopeAngle: float = Math.atan2(tanSize.Height, tanSize.Width);
        //  Compute the distance
        const distance: float = Math.cos(slopeAngle - radAngle) * radius;

        // Parametric Equation for a circle
        // a = angle in radians
        // ( cos(a) * d + x, sin(a) * d + y)
        end.value.X = Math.cos(radAngle) * distance + start.value.X;
        end.value.Y = Math.sin(radAngle) * distance + start.value.Y;
    }

    public static ToRadians(degrees: float): float {
        return (degrees * Math.PI) / 180;
    }

    /*
           * Linear Interpoloation helper function
           */
    public static Lerp(value1: float, value2: float, amount: float): float {
        return value1 + (value2 - value1) * amount;
    }

    /*
           * Based on libgdiplus lineargradientbrush.c implementation with a couple of small modifications
           * for calculating the Normal Distribution.  The reason for this change comes
           * from “The Art of Scientific Computing” by Press et al…
           * —–
           * We assume that you know enough never to evaluate a polynomial this way:
           * p=c[0]+c[1]*x+c[2]*x*x+c[3]*x*x*x+c[4]*x*x*x*x;
           * or (even worse!),
           * p=c[0]+c[1]*x+c[2]*pow(x,2.0)+c[3]*pow(x,3.0)+c[4]*pow(x,4.0);
           *
           * Come the (computer) revolution, all persons found guilty of such criminal behavior will be
           * summarily executed, and their programs won’t be! It is a matter of taste, however, whether to write
           * p=c[0]+x*(c[1]+x*(c[2]+x*(c[3]+x*c[4])));
           * or
           * p=(((c[4]*x+c[3])*x+c[2])*x+c[1])*x+c[0];
           * If the number of coefficients c[0..n-1] is large, one writes
           * p=c[n-1];
           * for(j=n-2;j>=0;j–) p=p*x+c[j];
           * or
           * p=c[j=n-1];
           * while (j>0) p=p*x+c[--j];
           *
           * where the original routine was using Math.Pow to evaluate the polinomials so with the Phi function
           * we should have a little speed increase.  Not verified though so revert this implementaion if need be.
           * It is just a funtion that I have used before for CDF.
           * .
           */
    public static SigmaBellShape(focus: float, scale: float): Blend {
        let blend: Blend = new Blend();

        let pos: float = 0.0;
        let count: number = 511; /* total no of samples */
        let index: number;
        let sigma: float;
        let mean: float;
        const fall_off_len: float = 2.0; /* curve fall off length in terms of SIGMA */
        let delta: float; /* distance between two samples */

        let phi: float; /* variable to hold the value of Phi - Normal Distribution - CFD etc... */

        /* we get a curve not starting from 0 and not ending at 1.
                 * so we subtract the starting value and divide by the curve
                 * height to make it fit in the 0 to scale range
                 */
        let curve_bottom: float;
        let curve_top: float;
        let curve_height: float;

        if (focus === 0 || focus === 1) {
            count = 256;
        }

        if (blend.Positions.length !== count) {
            blend = new Blend();
        }

        /* Set the blend colors. We use integral of the Normal Distribution,
                 * i.e. Cumulative Distribution Function (CDF).
                 *
                 * Normal distribution:
                 *
                 * y (x) = (1 / sqrt (2 * PI * sq (sigma))) * exp (-sq (x - mu)/ (2 * sq (sigma)))
                 *
                 * where, y = height of normal curve,
                 *        sigma = standard deviation
                 *        mu = mean
                 * OR
                 * y (x) = peak * exp ( - z * z / 2)
                 * where, z = (x - mu) / sigma
                 *
                 * In this curve, peak would occur at mean i.e. for x = mu. This results in
                 * a peak value of peak = (1 / sqrt (2 * PI * sq (sigma))).
                 *
                 * Cumulative distribution function:
                 * Ref: http://mathworld.wolfram.com/NormalDistribution.html
                 * see function Phi(x) below - Φ(x)
                 *
                 * D (x) = Phi(z)
                 * where, z = (x - mu) / sigma
                 *
                 */
        if (focus === 0) {
            /* right part of the curve with a complete fall in fall_off_len * SIGMAs */
            sigma = 1.0 / fall_off_len;
            mean = 0.5;
            delta = 1.0 / 255.0;

            curve_bottom = GeomUtilities.Phi((1.0 - mean) / sigma);
            curve_top = GeomUtilities.Phi((focus - mean) / sigma);
            curve_height = curve_top - curve_bottom;

            /* set the start */
            blend.Positions[0] = focus;
            blend.Factors[0] = scale;

            for (index = 1, pos = delta; index < 255; index++ , pos += delta) {
                blend.Positions[index] = pos;
                phi = GeomUtilities.Phi((pos - mean) / sigma);
                blend.Factors[index] = (scale / curve_height) * (phi - curve_bottom);
            }

            /* set the end */
            blend.Positions[count - 1] = 1.0;
            blend.Factors[count - 1] = 0.0;
        } else if (focus === 1) {
            /* left part of the curve with a complete rise in fall_off_len * SIGMAs */
            sigma = 1.0 / fall_off_len;
            mean = 0.5;
            delta = 1.0 / 255.0;

            curve_bottom = GeomUtilities.Phi((0.0 - mean) / sigma);
            curve_top = GeomUtilities.Phi((focus - mean) / sigma);
            curve_height = curve_top - curve_bottom;

            /* set the start */
            blend.Positions[0] = 0.0;
            blend.Factors[0] = 0.0;

            for (index = 1, pos = delta; index < 255; index++ , pos += delta) {
                blend.Positions[index] = pos;
                phi = GeomUtilities.Phi((pos - mean) / sigma);
                blend.Factors[index] = (scale / curve_height) * (pos - curve_bottom);
            }

            /* set the end */
            blend.Positions[count - 1] = focus;
            blend.Factors[count - 1] = scale;
        } else {
            /* left part of the curve with a complete fall in fall_off_len * SIGMAs */
            sigma = focus / (2 * fall_off_len);
            mean = focus / 2.0;
            delta = focus / 255.0;

            /* set the start */
            blend.Positions[0] = 0.0;
            blend.Factors[0] = 0.0;

            curve_bottom = GeomUtilities.Phi((0.0 - mean) / sigma);
            curve_top = GeomUtilities.Phi((focus - mean) / sigma);
            curve_height = curve_top - curve_bottom;

            for (index = 1, pos = delta; index < 255; index++ , pos += delta) {
                blend.Positions[index] = pos;
                phi = GeomUtilities.Phi((pos - mean) / sigma);
                blend.Factors[index] = (scale / curve_height) * (phi - curve_bottom);
            }

            blend.Positions[index] = focus;
            blend.Factors[index] = scale;

            /* right part of the curve with a complete fall in fall_off_len * SIGMAs */
            sigma = (1.0 - focus) / (2 * fall_off_len);
            mean = (1.0 + focus) / 2.0;
            delta = (1.0 - focus) / 255.0;

            curve_bottom = GeomUtilities.Phi((1.0 - mean) / sigma);
            curve_top = GeomUtilities.Phi((focus - mean) / sigma);

            curve_height = curve_top - curve_bottom;

            index++;
            pos = focus + delta;

            for (; index < 510; index++ , pos += delta) {
                blend.Positions[index] = pos;
                phi = GeomUtilities.Phi((pos - mean) / sigma);
                blend.Factors[index] = (scale / curve_height) * (phi - curve_bottom);
            }

            /* set the end */
            blend.Positions[count - 1] = 1.0;
            blend.Factors[count - 1] = 0.0;
        }

        return blend;
    }

    /*
           * The function Φ(x) is the cumulative density function (CDF) of a standard normal
           * (Gaussian) random variable. It is closely related to the error function erf(x).
           *
           * http://www.johndcook.com/csharp_phi.html
           *
           * http://www.johndcook.com/erf_and_normal_cdf.pdf
           *
           * This function is used by gradient brushes
           *
           * This routine is self contained with the Erf code included in the funtion.
           * This could also be implemented by 0.5 * (1.0 + Erf(x))
           *
           * I left this double instead of implementing a float version as the Math.XXX api's are also double
           */
    static Phi(x: float): float {
        // constants
        const a1: float = 0.254829592;
        const a2: float = -0.284496736;
        const a3: float = 1.421413741;
        const a4: float = -1.453152027;
        const a5: float = 1.061405429;
        const p: float = 0.3275911;

        // Save the sign of x
        let sign: number = 1;
        if (x < 0) sign = -1;
        x = Math.abs(x) / Math.sqrt(2.0);

        // A&S refers to Handbook of Mathematical Functions by Abramowitz and Stegun.
        // See Stand-alone error function for details of the algorithm.
        // http://www.johndcook.com/blog/2009/01/19/stand-alone-error-function-erf/
        // A&S formula 7.1.26
        const t: float = 1.0 / (1.0 + p * x);
        const y: float = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return 0.5 * (1.0 + sign * y);
    }

    /*
           * Not used right now but left here just in case so it does not have to be looked up again
           *
           * http://www.johndcook.com/csharp_erf.html
           * http://www.johndcook.com/blog/2009/01/19/stand-alone-error-function-erf/
           * http://www.johndcook.com/erf_and_normal_cdf.pdf
           */
    static Erf(x: float): float {
        // constants
        const a1: float = 0.254829592;
        const a2: float = -0.284496736;
        const a3: float = 1.421413741;
        const a4: float = -1.453152027;
        const a5: float = 1.061405429;
        const p: float = 0.3275911;

        // Save the sign of x
        let sign = 1;
        if (x < 0) sign = -1;
        x = Math.abs(x);

        // A&S refers to Handbook of Mathematical Functions by Abramowitz and Stegun.
        // http://www.johndcook.com/blog/2009/01/19/stand-alone-error-function-erf/
        //
        // A&S formula 7.1.26
        const t: float = 1.0 / (1.0 + p * x);
        const y: float = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return sign * y;
    }

    /// <summary>
    /// This method initializes the new CGAffineTransform such that it represents the geometric transform that maps the rectangle
    /// specified by the rect parameter to the parallelogram defined by the three points in the plgpts parameter.
    ///
    /// The upper-left corner of the rectangle is mapped to the first point in the plgpts array, the upper-right corner
    /// is mapped to the second point, and the lower-left corner is mapped to the third point. The lower-right point of
    /// the parallelogram is implied by the first three.
    /// </summary>
    /// <returns>The affine transform.</returns>
    /// <param name="rect">Rectangle.</param>
    /// <param name="points">Points.</param>
    public static CreateGeometricTransform(rect: CGRectangle, points: CGPoint[]): CGAffineTransform {
        var p0 = points[0];
        var p1 = points[1];
        var p2 = points[2];

        var width = rect.Width;
        var height = rect.Height;

        const m11: float = (p1.X - p0.X) / width;
        const m12: float = (p1.Y - p0.Y) / width;
        const m21: float = (p2.X - p0.X) / height;
        const m22: float = (p2.Y - p0.Y) / height;

        return new CGAffineTransform(m11, m12, m21, m22, p0.X, p0.Y);
    }

    /// <summary>
    /// Creates the rotate flip transform given the input parameters
    /// </summary>
    /// <returns>The rotate flip transform.</returns>
    /// <param name="width">Width.</param>
    /// <param name="height">Height.</param>
    /// <param name="angle">Angle.</param>
    /// <param name="flipX">If set to <c>true</c> flip x.</param>
    /// <param name="flipY">If set to <c>true</c> flip y.</param>
    public static CreateRotateFlipTransform(
        width: Out<number>,
        height: Out<number>,
        angle: float,
        flipX: boolean,
        flipY: boolean
    ): CGAffineTransform {
        const rotateX: float = Math.abs(Math.cos(GeomUtilities.ToRadians(angle)));
        const rotateY: float = Math.abs(Math.sin(GeomUtilities.ToRadians(angle)));

        const deltaWidth: float = width.value * rotateX + height.value * rotateY;
        const deltaHeight: float = width.value * rotateY + height.value * rotateX;

        let rotateFlipTransform: CGAffineTransform = CGAffineTransform.MakeTranslation(flipX ? -deltaWidth : 0.0, flipY ? -deltaHeight : 0.0);
        rotateFlipTransform.multiply(CGAffineTransform.MakeScale(flipX ? -1.0 : 1.0, flipY ? -1.0 : 1.0));

        if (0.0 !== angle) {
            const rot: CGAffineTransform = CGAffineTransform.MakeTranslation(-deltaHeight * 0.5, -deltaWidth * 0.5);
            rot.rotate(GeomUtilities.ToRadians(angle));
            rot.translate(deltaWidth * 0.5, deltaHeight * 0.5);

            rotateFlipTransform = CGAffineTransform.Multiply(rot, rotateFlipTransform);
        }

        width.value = deltaWidth;
        height.value = deltaHeight;

        return rotateFlipTransform;
    }

    public static TransformRectangle(rectangle: Out<CGRectangle>, matrix: Matrix): void {
        const transform: CGAffineTransform = matrix.transform;
        var x = rectangle.value.X;
        var y = rectangle.value.Y;

        rectangle.value.X = transform.m[0] * x + transform.m[1] * y + transform.m[4];
        rectangle.value.Y = transform.m[1] * x + transform.m[3] * y + transform.m[5];

        x = rectangle.value.Width;
        y = rectangle.value.Height;

        rectangle.value.Width = transform.m[0] * x + transform.m[2] * y + transform.m[4];
        rectangle.value.Height = transform.m[1] * x + transform.m[3] * y + transform.m[5];
    }

    /// <summary>
    /// Transform the specified Rectangle by the matrix that is passed.
    /// </summary>
    /// <param name="matrix">Matrix.</param>

    public static GetCurveTangents(terms: number, points: CGPoint[], count: number, tension: float, type: CurveType): CGPoint[] {
        const coefficient: float = tension / 3;
        const tangents: CGPoint[] = new Array(count);
        for (let i = 0; i < count; i++) {
            tangents[i] = CGPoint.Empty;
        }

        if (count <= 2) return tangents;

        for (let i = 0; i < count; i++) {
            let r: number = i + 1;
            let s: number = i - 1;

            if (r >= count) r = count - 1;
            if (type === CurveType.Open) {
                if (s < 0) s = 0;
            } else {
                if (s < 0) s += count;
            }

            tangents[i].X += coefficient * (points[r].X - points[s].X);
            tangents[i].Y += coefficient * (points[r].Y - points[s].Y);
        }

        return tangents;
    }

    private static quadCubeCoeff: float = 2.0 / 3.0;
    // from http://fontforge.org/bezier.html
    //  Formula for converting qudratic to cubic
    //
    // Any quadratic spline can be expressed as a cubic (where the cubic term is zero).
    // The end points of the cubic will be the same as the quadratic's.
    //
    // CP0 = QP0
    // CP3 = QP2
    // The two control points for the cubic are:
    //
    // CP1 = QP0 + 2/3 *(QP1-QP0)
    // CP2 = QP2 + 2/3 *(QP1-QP2)
    public static QuadraticToCubic(start: CGPoint, controlPoint: CGPoint, end: CGPoint, controlPoint1: Out<CGPoint>, controlPoint2: Out<CGPoint>) {
        controlPoint1.value = CGPoint.Empty;
        controlPoint2.value = CGPoint.Empty;

        controlPoint1.value.X = start.X + GeomUtilities.quadCubeCoeff * (controlPoint.X - start.X);
        controlPoint2.value.X = end.X + GeomUtilities.quadCubeCoeff * (controlPoint.X - end.X);

        controlPoint1.value.Y = start.Y + GeomUtilities.quadCubeCoeff * (controlPoint.Y - start.Y);
        controlPoint2.value.Y = end.Y + GeomUtilities.quadCubeCoeff * (controlPoint.Y - end.Y);
    }

    //#region PathGradientBrush

    public static DotProduct(u: CGPoint, v: CGPoint): float {
        return u.X * v.X + u.Y * v.Y; // + (u).z * (v).z)
    }

    public static Normal(v: CGPoint): float {
        return Math.sqrt(GeomUtilities.DotProduct(v, v)); // normal = length of  vector
    }

    /*
           * Calculates crossProduct of two 2D vectors / points.
           * @param p1 first point used as vector
           * @param p2 second point used as vector
           * @return crossProduct of vectors
           */
    public static CrossProduct(v1: CGPoint, v2: CGPoint): float {
        return v1.X * v2.Y - v1.Y * v2.X;
    }

    // Basic bounding box implementation getting min X, min Y, max X and max Y
    // from the array of PointF's only the first three will be used.
    public static TriangleBoundingBox(points: CGPoint[]): CGRectangle {
        /* get the bounding box of the triangle */
        const maxX: number = Math.max(points[0].X, Math.max(points[1].X, points[2].X));
        const minX: number = Math.min(points[0].X, Math.min(points[1].X, points[2].X));
        const maxY: number = Math.max(points[0].Y, Math.max(points[1].Y, points[2].Y));
        const minY: number = Math.min(points[0].Y, Math.min(points[1].Y, points[2].Y));

        var bb = new CGRectangle(minX, minY, maxX - minX, maxY - minY);

        return bb;
    }

    // Basic bounding box implementation getting min X, min Y, max X and max Y
    // from the array of PointF's
    public static PolygonBoundingBox(points: CGPoint[]): CGRectangle {
        let minX: number = Number.MAX_VALUE;
        let minY: number = Number.MAX_VALUE;
        let maxX: number = Number.MIN_VALUE;
        let maxY: number = Number.MIN_VALUE;

        /* get the bounding box of the polygon */
        for (let m = 0; m < points.length; m++) {
            minX = Math.min(points[m].X, minX);
            minY = Math.min(points[m].Y, minY);

            maxX = Math.max(points[m].X, maxX);
            maxY = Math.max(points[m].Y, maxY);
        }

        var bb = new CGRectangle(minX, minY, maxX - minX, maxY - minY);

        return bb;
    }

    // http://en.wikipedia.org/wiki/Centroid
    //
    // NOTE: this algorithm doesn`t apply to complex polygons. If this is causing problems
    // we may have to change this.
    public static PolygonCentroid(points: CGPoint[]): CGPoint {
        const C = CGPoint.Empty;
        let area = 0;

        //var A6 = 6.0f * (float)PolygonArea(points);

        const first = points[0];
        let last = points[points.length - 1];
        // make sure we have a closed path
        if (last !== first) last = first;

        last = first;

        let dotProd = 0;

        for (let i = 1; i < points.length; i++) {
            var next = points[i];
            dotProd = last.X * next.Y - next.X * last.Y;
            area += dotProd;
            C.X += (last.X + next.X) * dotProd;
            C.Y += (last.Y + next.Y) * dotProd;

            last = next;
        }

        dotProd = last.X * first.Y - first.X * last.Y;
        area += dotProd;

        C.X += (last.X + first.X) * dotProd;
        C.Y += (last.Y + first.Y) * dotProd;

        const aaa = GeomUtilities.PolygonArea(points);
        // Note: The result is positive if the polygon is clockwise for our coordinate system in
        // which increasing Y goes downward.
        // Positive - clockwise
        // Negative - counterclockwise
        //
        // We want to keep the area positive so we do not get negative numbers
        // depending on the polygon winding. This may not be right though.
        //
        const A6 = 6.0 * (area / 2);
        const reciprocal = 1.0 / A6;

        // We need make sure we are positive here.
        C.X = C.X * reciprocal;
        C.Y = C.Y * reciprocal;

        return C;
    }

    // Note: The result is positive if the polygon is clockwise for our coordinate system in
    // which increasing Y goes downward.
    // Positive - clockwise
    // Negative - counterclockwise
    public static PolygonArea(points: CGPoint[]): float {
        const first = points[0];
        let last = points[points.length - 1];
        // make sure we have a closed path
        if (last != first) last = first;

        let area: float = 0;

        for (let p = 1; p < points.length; p++) {
            var next = points[p];
            area += last.X * next.Y - next.X * last.Y;
            last = next;
        }
        area += last.X * first.Y - first.X * last.Y;

        return area / 2;
    }

    //#endregion

    public static InflateRect(a: Out<CGRectangle>, w: float, h: float): void {
        a.value.X = a.value.X - w;
        a.value.Width = a.value.Width + w * 2;
        a.value.Y = a.value.Y - h;
        a.value.Height = a.value.Height + h * 2;
    }

    public static IntersectionRect(a: CGRectangle, b: CGRectangle): CGRectangle {
        const single: float = Math.max(a.X, b.X);
        const single1: float = Math.max(a.Y, b.Y);
        const single2: float = Math.min(a.X + a.Width, b.X + b.Width);
        const single3: float = Math.min(a.Y + a.Height, b.Y + b.Height);
        return new CGRectangle(single, single1, Math.max(0, single2 - single), Math.max(0, single3 - single1));
    }

    public  /* internal */ static ContainsRect(a: CGRectangle, b: CGPoint): boolean
    public  /* internal */ static ContainsRect(a: CGRectangle, b: CGRectangle): boolean;
    public  /* internal */ static ContainsRect(...args: any[]): boolean {
        if (args.length === 2 && args[1] instanceof CGPoint) {
            const a: CGRectangle = args[0];
            const b: CGPoint = args[1];
            if (a.X > b.X || b.X > a.X + a.Width || a.Y > b.Y) {
                return false;
            }
            return b.Y <= a.Y + a.Height;
        } else if (args.length === 2 && args[1] instanceof CGRectangle) {
            const a: CGRectangle = args[0];
            const b: CGRectangle = args[1];

            if (a.X > b.X || b.X + b.Width > a.X + a.Width || a.Y > b.Y || b.Y + b.Height > a.Y + a.Height || a.Width < 0) {
                return false;
            }
            return a.Height >= 0;
        }
        return false;
    }
    public static IntersectsLineSegment(rect: CGRectangle, p1: CGPoint, p2: CGPoint): boolean {
        if (p1.X === p2.X) {
            if (rect.Left > p1.X || p1.X > rect.Right || Math.min(p1.Y, p2.Y) > rect.Bottom) {
                return false;
            }
            return Math.max(p1.Y, p2.Y) >= rect.Top;
        }
        if (p1.Y == p2.Y) {
            if (rect.Top > p1.Y || p1.Y > rect.Bottom || Math.min(p1.X, p2.X) > rect.Right) {
                return false;
            }
            return Math.max(p1.X, p2.X) >= rect.Left;
        }
        if (GeomUtilities.ContainsRect(rect, p1)) {
            return true;
        }
        if (GeomUtilities.ContainsRect(rect, p2)) {
            return true;
        }
        if (GeomUtilities.IntersectingLines(new CGPoint(rect.Left, rect.Top), new CGPoint(rect.Right, rect.Top), p1, p2)) {
            return true;
        }
        if (GeomUtilities.IntersectingLines(new CGPoint(rect.Right, rect.Top), new CGPoint(rect.Right, rect.Bottom), p1, p2)) {
            return true;
        }
        if (GeomUtilities.IntersectingLines(new CGPoint(rect.Right, rect.Bottom), new CGPoint(rect.Left, rect.Bottom), p1, p2)) {
            return true;
        }
        if (GeomUtilities.IntersectingLines(new CGPoint(rect.Left, rect.Bottom), new CGPoint(rect.Left, rect.Top), p1, p2)) {
            return true;
        }
        return false;
    }

    public static IntersectsRect(a: CGRectangle, b: CGRectangle): boolean {
        let width: float = a.Width;
        if (width < 0) {
            return false;
        }
        let height: float = a.Height;
        if (height < 0) {
            return false;
        }
        let single: float = b.Width;
        if (single < 0) {
            return false;
        }
        let height1: float = b.Height;
        if (height1 < 0) {
            return false;
        }
        const x: float = a.X;
        const x1: float = b.X;
        width = width + x;
        single = single + x1;
        if (x > single || x1 > width) {
            return false;
        }
        const y: float = a.Y;
        const y1: float = b.Y;
        height = height + y;
        height1 = height1 + y1;
        if (y <= height1 && y1 <= height) {
            return true;
        }
        return false;
    }
    public static ComparePointWithLine(a1: CGPoint, a2: CGPoint, p: CGPoint): number {
        const x: float = a2.X - a1.X;
        const y: float = a2.Y - a1.Y;
        let single: float = p.X - a1.X;
        let y1: float = p.Y - a1.Y;
        let single1: float = single * y - y1 * x;
        if (single1 === 0) {
            single1 = single * x + y1 * y;
            if (single1 > 0) {
                single = single - x;
                y1 = y1 - y;
                single1 = single * x + y1 * y;
                if (single1 < 0) {
                    single1 = 0;
                }
            }
        }
        if (single1 < 0) {
            return -1;
        }
        if (single1 <= 0) {
            return 0;
        }
        return 1;
    }

    public static IntersectingLines(a1: CGPoint, a2: CGPoint, b1: CGPoint, b2: CGPoint): boolean {
        if ((GeomUtilities.ComparePointWithLine(a1, a2, b1) * GeomUtilities.ComparePointWithLine(a1, a2, b2)) > 0) {
            return false;
        }
        return (GeomUtilities.ComparePointWithLine(b1, b2, a1) * GeomUtilities.ComparePointWithLine(b1, b2, a2)) <= 0;
    }



    public static LineBounds(a: CGPoint, b: CGPoint): CGRectangle {
        const single: float = Math.min(a.X, b.X);
        const single1: float = Math.min(a.Y, b.Y);
        const single2: float = Math.max(a.X, b.X);
        const single3: float = Math.max(a.Y, b.Y);
        return new CGRectangle(single, single1, single2 - single, single3 - single1);
    }

    public static LineContainsPoint(a: CGPoint, b: CGPoint, fuzz: float, p: CGPoint): boolean {
        let x: float;
        let single: float;
        let y: float;
        let y1: float;
        if (a.X >= b.X) {
            single = b.X;
            x = a.X;
        }
        else {
            single = a.X;
            x = b.X;
        }
        if (a.Y >= b.Y) {
            y1 = b.Y;
            y = a.Y;
        }
        else {
            y1 = a.Y;
            y = b.Y;
        }
        if (a.X == b.X) {
            if (y1 > p.Y || p.Y > y || a.X - fuzz > p.X) {
                return false;
            }
            return p.X <= a.X + fuzz;
        }
        if (a.Y == b.Y) {
            if (single > p.X || p.X > x || a.Y - fuzz > p.Y) {
                return false;
            }
            return p.Y <= a.Y + fuzz;
        }
        let single1: float = x + fuzz;
        let single2: float = single - fuzz;
        if (single2 <= p.X && p.X <= single1) {
            const single3: float = y + fuzz;
            const single4: float = y1 - fuzz;
            if (single4 <= p.Y && p.Y <= single3) {
                if (single1 - single2 <= single3 - single4) {
                    if (a.Y - b.Y <= fuzz && b.Y - a.Y <= fuzz) {
                        return true;
                    }
                    const x1: float = (b.X - a.X) / (b.Y - a.Y) * (p.Y - a.Y) + a.X;
                    if (x1 - fuzz <= p.X && p.X <= x1 + fuzz) {
                        return true;
                    }
                }
                else {
                    if (a.X - b.X <= fuzz && b.X - a.X <= fuzz) {
                        return true;
                    }
                    const y2: float = (b.Y - a.Y) / (b.X - a.X) * (p.X - a.X) + a.Y;
                    if (y2 - fuzz <= p.Y && p.Y <= y2 + fuzz) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public static NearestIntersectionOnLine(a: CGPoint, b: CGPoint, p: CGPoint, q: CGPoint, result: Out<CGPoint>): boolean {
        const x: float = a.X;
        const y: float = a.Y;
        const single: float = b.X;
        const y1: float = b.Y;
        const x1: float = p.X;
        const single1: float = p.Y;
        const x2: float = q.X;
        const y2: float = q.Y;
        if (x1 == x2) {
            if (x == single) {
                GeomUtilities.NearestPointOnLine(a, b, p, result);
                return false;
            }
            const single2: float = (y1 - y) / (single - x) * (x1 - x) + y;
            return GeomUtilities.NearestPointOnLine(a, b, new CGPoint(x1, single2), result);
        }
        const single3: float = (y2 - single1) / (x2 - x1);
        if (x == single) {
            const single4: float = single3 * (x - x1) + single1;
            if (single4 < Math.min(y, y1)) {
                result.value = new CGPoint(x, Math.min(y, y1));
                return false;
            }
            if (single4 <= Math.max(y, y1)) {
                result.value = new CGPoint(x, single4);
                return true;
            }
            result.value = new CGPoint(x, Math.max(y, y1));
            return false;
        }
        const single5: float = (y1 - y) / (single - x);
        if (single3 == single5) {
            GeomUtilities.NearestPointOnLine(a, b, p, result);
            return false;
        }
        const single6: float = (single5 * x - single3 * x1 + single1 - y) / (single5 - single3);
        if (single5 !== 0) {
            const single7: float = single5 * (single6 - x) + y;
            return GeomUtilities.NearestPointOnLine(a, b, new CGPoint(single6, single7), result);
        }
        if (single6 < Math.min(x, single)) {
            result.value = new CGPoint(Math.min(x, single), y);
            return false;
        }
        if (single6 <= Math.max(x, single)) {
            result.value = new CGPoint(single6, y);
            return true;
        }
        result.value = new CGPoint(Math.max(x, single), y);
        return false;
    }
    public static RectFromLine(a: CGPoint, b: CGPoint, w: float): CGRectangle {
        if (a.X === b.X) {
            let y: float = a.Y;
            let single: float = b.Y;
            if (y > single) {
                y = b.Y;
                single = a.Y;
            }
            return new CGRectangle(a.X - w / 2, y, w, single - y);
        }
        if (a.Y == b.Y) {
            let x: float = a.X;
            let x1: float = b.X;
            if (x > x1) {
                x = b.X;
                x1 = a.X;
            }
            return new CGRectangle(x, a.Y - w / 2, x1 - x, w);
        }
        let y1: float = a.Y;
        let single1: float = b.Y;
        if (y1 > single1) {
            y1 = b.Y;
            single1 = a.Y;
        }
        let x2: float = a.X;
        let single2: float = b.X;
        if (x2 > single2) {
            x2 = b.X;
            single2 = a.X;
        }
        return new CGRectangle(x2, y1, single2 - x2, single1 - y1);
    }

    public static NearestPointOnLine(a: CGPoint, b: CGPoint, p: CGPoint, result: Out<CGPoint>): boolean {
        let single: float;
        let single1: float;
        let single2: float;
        let single3: float;
        let x: float = a.X;
        let y: float = a.Y;
        let x1: float = b.X;
        let y1: float = b.Y;
        let x2: float = p.X;
        let y2: float = p.Y;
        if (x === x1) {
            if (y >= y1) {
                single = y1;
                single1 = y;
            }
            else {
                single = y;
                single1 = y1;
            }
            const single4: float = y2;
            if (single4 < single) {
                result.value = new CGPoint(x, single);
                return false;
            }
            if (single4 > single1) {
                result.value = new CGPoint(x, single1);
                return false;
            }
            result.value = new CGPoint(x, single4);
            return true;
        }
        if (y === y1) {
            if (x >= x1) {
                single2 = x1;
                single3 = x;
            }
            else {
                single2 = x;
                single3 = x1;
            }
            const single5: float = x2;
            if (single5 < single2) {
                result.value = new CGPoint(single2, y);
                return false;
            }
            if (single5 > single3) {
                result.value = new CGPoint(single3, y);
                return false;
            }
            result.value = new CGPoint(single5, y);
            return true;
        }
        const single6: float = (x1 - x) * (x1 - x) + (y1 - y) * (y1 - y);
        const single7: float = ((x - x2) * (x - x1) + (y - y2) * (y - y1)) / single6;
        if (single7 < 0) {
            result.value = a;
            return false;
        }
        if (single7 > 1) {
            result.value = b;
            return false;
        }
        const single8: float = x + single7 * (x1 - x);
        const single9: float = y + single7 * (y1 - y);
        result.value = new CGPoint(single8, single9);
        return true;
    }


    public static GetNearestIntersectionPoint(rect: CGRectangle, p1: CGPoint, p2: CGPoint, result: Out<CGPoint>): boolean {
        let pointF: Out<CGPoint> = newOutEmpty();
        let pointF1: CGPoint = new CGPoint(rect.X, rect.Y);
        let pointF2: CGPoint = new CGPoint(rect.X + rect.Width, rect.Y);
        let pointF3: CGPoint = new CGPoint(rect.X, rect.Y + rect.Height);
        let pointF4: CGPoint = new CGPoint(rect.X + rect.Width, rect.Y + rect.Height);
        let x: float = p1.X;
        let y: float = p1.Y;
        let single: float = 1E+21;
        let pointF5: Out<CGPoint> = newOutEmpty();
        if (GeomUtilities.NearestIntersectionOnLine(pointF1, pointF2, p1, p2, pointF)) {
            const x1: float = (pointF.value.X - x) * (pointF.value.X - x) + (pointF.value.Y - y) * (pointF.value.Y - y);
            if (x1 < single) {
                single = x1;
                pointF5.value = pointF.value;
            }
        }
        if (GeomUtilities.NearestIntersectionOnLine(pointF2, pointF4, p1, p2, pointF)) {
            const single1: float = (pointF.value.X - x) * (pointF.value.X - x) + (pointF.value.Y - y) * (pointF.value.Y - y);
            if (single1 < single) {
                single = single1;
                pointF5 = pointF;
            }
        }
        if (GeomUtilities.NearestIntersectionOnLine(pointF4, pointF3, p1, p2, pointF)) {
            const x2: float = (pointF.value.X - x) * (pointF.value.X - x) + (pointF.value.Y - y) * (pointF.value.Y - y);
            if (x2 < single) {
                single = x2;
                pointF5 = pointF;
            }
        }
        if (GeomUtilities.NearestIntersectionOnLine(pointF3, pointF1, p1, p2, pointF)) {
            const single2: float = (pointF.value.X - x) * (pointF.value.X - x) + (pointF.value.Y - y) * (pointF.value.Y - y);
            if (single2 < single) {
                single = single2;
                pointF5 = pointF;
            }
        }
        result.value = pointF5.value;
        return single < 1E+21;
    }

    public static LargestSizeKeepingAspectRatio(target: CGSize, aspect: CGSize): CGSize {
        let single: float = Math.max(0, aspect.Width);
        let single1: float = Math.max(0, aspect.Height);
        if (single === 0 && single1 === 0) {
            single = 1;
            single1 = 1;
        }
        const single2: float = Math.max(0, target.Width);
        const single3: float = Math.max(0, target.Height);
        if (single === 0) {
            return new CGSize(0, single3);
        }
        if (single1 === 0) {
            return new CGSize(single2, 0);
        }
        if (single2 === 0 || single3 === 0) {
            return new CGSize(single2, single3);
        }
        const single4: float = single1 / single;
        if (single4 < single3 / single2) {
            return new CGSize(single2, single4 * single2);
        }
        return new CGSize(single3 / single4, single3);
    }

    public static MakeRect(x: float): CGRectangle;
    public static MakeRect(p: CGPoint): CGRectangle;
    public static MakeRect(s: CGSize): CGRectangle;
    public static MakeRect(...args: any[]): CGRectangle {
        if (typeof args[0] === 'number') {
            return new CGRectangle(args[0], 0, 0, 0);
        } else if (args[0] instanceof CGPoint) {
            return new CGRectangle(args[0].X, args[0].Y, 0, 0);
        } else if (args[0] instanceof CGSize) {
            return new CGRectangle(0, 0, args[0].Width, args[0].Height);
        }
        return CGRectangle.Empty;
    }

    public static UnionRect(a: CGRectangle, b: CGRectangle): CGRectangle;
    public static UnionRect(r: CGRectangle, p: CGPoint): CGRectangle;
    public static UnionRect(...args: any[]): CGRectangle {
        if (args.length === 2 && args[1] instanceof CGRectangle) {
            const a: CGRectangle = args[0];
            const b: CGRectangle = args[1];

            const single: float = Math.min(a.X, b.X);
            const single1: float = Math.min(a.Y, b.Y);
            const single2: float = Math.max(a.X + a.Width, b.X + b.Width);
            const single3: float = Math.max(a.Y + a.Height, b.Y + b.Height);
            return new CGRectangle(single, single1, single2 - single, single3 - single1);
        } else {
            const r: CGRectangle = args[0];
            const p: CGRectangle = args[1];
            if (p.X < r.X) {
                r.Width = r.X + r.Width - p.X;
                r.X = p.X;
            }
            else if (p.X > r.X + r.Width) {
                r.Width = p.X - r.X;
            }
            if (p.Y < r.Y) {
                r.Height = r.Y + r.Height - p.Y;
                r.Y = p.Y;
            }
            else if (p.Y > r.Y + r.Height) {
                r.Height = p.Y - r.Y;
            }
            return r;
        }
    }


    private static lineBounds(a: CGPoint, b: CGPoint): CGRectangle {
        const single = Math.min(a.X, b.X);
        const single1 = Math.min(a.Y, b.Y);
        const single2 = Math.max(a.X, b.X);
        const single3 = Math.max(a.Y, b.Y);
        return new CGRectangle({ x: single, y: single1, width: single2 - single, height: single3 - single1 });
    }

    public static BezierBounds(s: CGPoint, c1: CGPoint, c2: CGPoint, e: CGPoint, epsilon: number): CGRectangle {
        if (GeomUtilities.LineContainsPoint(s, e, epsilon, c1) && GeomUtilities.LineContainsPoint(s, e, epsilon, c2)) {
            return GeomUtilities.lineBounds(s, e);
        }
        const pointF: CGPoint = new CGPoint({ x: (s.X + c1.X) / 2, y: (s.Y + c1.Y) / 2 });
        const pointF1: CGPoint = new CGPoint({ x: (c1.X + c2.X) / 2, y: (c1.Y + c2.Y) / 2 });
        const pointF2: CGPoint = new CGPoint({ x: (c2.X + e.X) / 2, y: (c2.Y + e.Y) / 2 });
        const pointF3: CGPoint = new CGPoint({ x: (pointF.X + pointF1.X) / 2, y: (pointF.Y + pointF1.Y) / 2 });
        const pointF4: CGPoint = new CGPoint({ x: (pointF1.X + pointF2.X) / 2, y: (pointF1.Y + pointF2.Y) / 2 });
        const pointF5: CGPoint = new CGPoint({ x: (pointF3.X + pointF4.X) / 2, y: (pointF3.Y + pointF4.Y) / 2 });
        return GeomUtilities.UnionRect(GeomUtilities.BezierBounds(s, pointF, pointF3, pointF5, epsilon), GeomUtilities.BezierBounds(pointF5, pointF4, pointF2, e, epsilon));
    }

    public static BezierContainsPoint(s: CGPoint, c1: CGPoint, c2: CGPoint, e: CGPoint, epsilon: number, p: CGPoint): boolean {
        if (GeomUtilities.LineContainsPoint(s, e, epsilon, c1) && GeomUtilities.LineContainsPoint(s, e, epsilon, c2)) {
            return GeomUtilities.LineContainsPoint(s, e, epsilon, p);
        }
        const pointF: CGPoint = new CGPoint({ x: (s.X + c1.X) / 2, y: (s.Y + c1.Y) / 2 });
        const pointF1: CGPoint = new CGPoint({ x: (c1.X + c2.X) / 2, y: (c1.Y + c2.Y) / 2 });
        const pointF2: CGPoint = new CGPoint({ x: (c2.X + e.X) / 2, y: (c2.Y + e.Y) / 2 });
        const pointF3: CGPoint = new CGPoint({ x: (pointF.X + pointF1.X) / 2, y: (pointF.Y + pointF1.Y) / 2 });
        const pointF4: CGPoint = new CGPoint({ x: (pointF1.X + pointF2.X) / 2, y: (pointF1.Y + pointF2.Y) / 2 });
        const pointF5: CGPoint = new CGPoint({ x: (pointF3.X + pointF4.X) / 2, y: (pointF3.Y + pointF4.Y) / 2 });
        if (GeomUtilities.BezierContainsPoint(s, pointF, pointF3, pointF5, epsilon, p)) {
            return true;
        }
        return GeomUtilities.BezierContainsPoint(pointF5, pointF4, pointF2, e, epsilon, p);
    }

    public static BezierMidPoint(b0: CGPoint, b1: CGPoint, b2: CGPoint, b3: CGPoint, v: Out<CGPoint>, w: Out<CGPoint>): void {
        v = v || newOutEmpty();
        w = w || newOutEmpty();

        const pointF: CGPoint = new CGPoint((b0.X + b1.X) / 2, (b0.Y + b1.Y) / 2);
        const pointF1: CGPoint = new CGPoint((b1.X + b2.X) / 2, (b1.Y + b2.Y) / 2);
        const pointF2: CGPoint = new CGPoint((b2.X + b3.X) / 2, (b2.Y + b3.Y) / 2);
        v.value = new CGPoint((pointF.X + pointF1.X) / 2, (pointF.Y + pointF1.Y) / 2);
        w.value = new CGPoint((pointF1.X + pointF2.X) / 2, (pointF1.Y + pointF2.Y) / 2);
    }

    public static BezierNearestIntersectionOnLine(s: CGPoint, c1: CGPoint, c2: CGPoint, e: CGPoint,
        p1: CGPoint, p2: CGPoint, epsilon: number, /*out*/ result: Out<CGPoint>): boolean {
        result = result || newOutEmpty();
        let pointF: Out<CGPoint> = newOutEmpty();
        let single = 1E+21;
        let pointF1: CGPoint = CGPoint.Empty;
        if (!GeomUtilities.LineContainsPoint(s, e, epsilon, c1) || !GeomUtilities.LineContainsPoint(s, e, epsilon, c2)) {
            const pointF2 = new CGPoint({ x: (s.X + c1.X) / 2, y: (s.Y + c1.Y) / 2 });
            const pointF3 = new CGPoint({ x: (c1.X + c2.X) / 2, y: (c1.Y + c2.Y) / 2 });
            const pointF4 = new CGPoint({ x: (c2.X + e.X) / 2, y: (c2.Y + e.Y) / 2 });
            const pointF5 = new CGPoint({ x: (pointF2.X + pointF3.X) / 2, y: (pointF2.Y + pointF3.Y) / 2 });
            const pointF6 = new CGPoint({ x: (pointF3.X + pointF4.X) / 2, y: (pointF3.Y + pointF4.Y) / 2 });
            const pointF7 = new CGPoint({ x: (pointF5.X + pointF6.X) / 2, y: (pointF5.Y + pointF6.Y) / 2 });

            if (GeomUtilities.BezierNearestIntersectionOnLine(s, pointF2, pointF5, pointF7, p1, p2, epsilon, pointF)) {
                const x = (pointF.value.X - p1.X) * (pointF.value.X - p1.X) + (pointF.value.Y - p1.Y) * (pointF.value.Y - p1.Y);
                if (x < single) {
                    single = x;
                    pointF1 = pointF.value;
                }
            }
            if (GeomUtilities.BezierNearestIntersectionOnLine(pointF7, pointF6, pointF4, e, p1, p2, epsilon, pointF)) {
                const x1 = (pointF.value.X - p1.X) * (pointF.value.X - p1.X) + (pointF.value.Y - p1.Y) * (pointF.value.Y - p1.Y);
                if (x1 < single) {
                    single = x1;
                    pointF1 = pointF.value;
                }
            }
        }
        if (GeomUtilities.NearestIntersectionOnLine(s, e, p1, p2, pointF)) {
            const single1 = (pointF.value.X - p1.X) * (pointF.value.X - p1.X) + (pointF.value.Y - p1.Y) * (pointF.value.Y - p1.Y);
            if (single1 < single) {
                single = single1;
                pointF1 = pointF.value;
            }
        }
        result.value = pointF1;
        return single < 1E+21;
    }
    public /*internal*/ static RescalePoints(v: CGPoint[], oldr: CGRectangle, newr: CGRectangle) {
        let width = 1;
        if (oldr.Width !== 0) {
            width = newr.Width / oldr.Width;
        }
        let height = 1;
        if (oldr.Height !== 0) {
            height = newr.Height / oldr.Height;
        }
        for (let i = 0; i < v.length; i++) {
            const pointF = v[i];
            const x = newr.X + (pointF.X - oldr.X) * width;
            const y = newr.Y + (pointF.Y - oldr.Y) * height;
            v[i] = new CGPoint({ x: x, y: y });
        }
    }

    public static ExpandPointOnEdge(p: CGPoint, rect: CGRectangle, shift: float): CGPoint {
        if (p.X <= rect.X) {
            p.X = p.X - shift;
        }
        else if (p.X >= rect.X + rect.Width) {
            p.X = p.X + shift;
        }
        if (p.Y <= rect.Y) {
            p.Y = p.Y - shift;
        }
        else if (p.Y >= rect.Y + rect.Height) {
            p.Y = p.Y + shift;
        }
        return p;
    }

    public static TranslatePoints(v: CGPoint[], dx: number, dy: number) {
        for (let i = 0; i < v.length; i++) {
            if (v[i] !== undefined) {
                const x = v[i];
                x.X = x.X + dx;
                x.Y = x.Y + dy;
                v[i] = x;
            }
        }
    }

    public static GetAngle(x: number, y: number): number {
        let single: number;
        if (x === 0) {
            single = (y <= 0 ? 270 : 90);
        }
        else if (y != 0) {
            single = Math.atan(Math.abs(y / x)) * 180 / 3.14159265358979;
            if (x < 0) {
                single = (y >= 0 ? 180 - single : single + 180);
            }
            else if (y < 0) {
                single = 360 - single;
            }
        }
        else {
            single = (x <= 0 ? 180 : 0);
        }
        return single;
    }

    public static NearestIntersectionOnArc(rect: CGRectangle, p1: CGPoint, p2: CGPoint, result: Out<CGPoint>, startAngle: float, sweepAngle: float): boolean {
        let single: float;
        let single1: float;
        let single2: float;
        const width: float = rect.Width / 2;
        const height: float = rect.Height / 2;
        const x: float = rect.X + width;
        const y: float = rect.Y + height;
        if (sweepAngle >= 0) {
            single = startAngle;
            single1 = sweepAngle;
        }
        else {
            single = startAngle + sweepAngle;
            single1 = -sweepAngle;
        }
        if (p1.X == p2.X) {
            const single3: float = height;
            const single4: float = height;
            const single5: float = width;
            const single6: float = Math.sqrt((single3 * single3 - single4 * single4 / (single5 * single5) * ((p1.X - x) * (p1.X - x))));
            const single7: float = y + single6;
            const single8: float = y - single6;
            let angle: float = GeomUtilities.GetAngle(p1.X - x, single7 - y);
            let angle1: float = GeomUtilities.GetAngle(p1.X - x, single8 - y);
            if (angle < single) {
                angle += 360;
            }
            if (angle1 < single) {
                angle1 += 360;
            }
            if (angle > single + single1) {
                angle -= 360;
            }
            if (angle1 > single + single1) {
                angle1 -= 360;
            }
            const flag: boolean = (angle < single ? false : angle <= single + single1);
            const flag1: boolean = (angle1 < single ? false : angle1 <= single + single1);
            if (flag && flag1) {
                if (Math.abs(single7 - p1.Y) >= Math.abs(single8 - p1.Y)) {
                    result.value = new CGPoint(p1.X, single8);
                }
                else {
                    result.value = new CGPoint(p1.X, single7);
                }
                return true;
            }
            if (flag && !flag1) {
                result.value = new CGPoint(p1.X, single7);
                return true;
            }
            if (!(!flag && flag1)) {
                result.value = new CGPoint();
                return false;
            }
            result.value = new CGPoint(p1.X, single8);
            return true;
        }
        single2 = (p1.X <= p2.X ? (p2.Y - p1.Y) / (p2.X - p1.X) : (p1.Y - p2.Y) / (p1.X - p2.X));
        const y1: float = p1.Y - y - single2 * (p1.X - x);
        const single9: float = width;
        const single10: float = single2;
        const single11: float = height;
        const single12: float = y1;
        const single13: float = Math.sqrt((single9 * single9 * (single10 * single10) + single11 * single11 - single12 * single12));
        const single14: float = width;
        const single15: float = height;
        const single16: float = width;
        const single17: float = single2;
        const single18: float = (-(single14 * single14 * single2 * y1) + width * height * single13) / (single15 * single15 + single16 * single16 * (single17 * single17)) + x;
        const single19: float = width;
        const single20: float = height;
        const single21: float = width;
        const single22: float = single2;
        const single23: float = (-(single19 * single19 * single2 * y1) - width * height * single13) / (single20 * single20 + single21 * single21 * (single22 * single22)) + x;
        const single24: float = single2 * (single18 - x) + y1 + y;
        const single25: float = single2 * (single23 - x) + y1 + y;
        let angle2: float = GeomUtilities.GetAngle(single18 - x, single24 - y);
        let angle3: float = GeomUtilities.GetAngle(single23 - x, single25 - y);
        if (angle2 < single) {
            angle2 += 360;
        }
        if (angle3 < single) {
            angle3 += 360;
        }
        if (angle2 > single + single1) {
            angle2 -= 360;
        }
        if (angle3 > single + single1) {
            angle3 -= 360;
        }
        const flag2: boolean = (angle2 < single ? false : angle2 <= single + single1);
        const flag3: boolean = (angle3 < single ? false : angle3 <= single + single1);
        if (!(flag2 && flag3)) {
            if (flag2 && !flag3) {
                result.value = new CGPoint(single18, single24);
                return true;
            }
            if (!(!flag2 && flag3)) {
                result.value = new CGPoint();
                return false;
            }
            result.value = new CGPoint(single23, single25);
            return true;
        }
        if (Math.abs((p1.X - single18) * (p1.X - single18)) + Math.abs((p1.Y - single24) * (p1.Y - single24)) >= Math.abs((p1.X - single23) * (p1.X - single23)) + Math.abs((p1.Y - single25) * (p1.Y - single25))) {
            result.value = new CGPoint(single23, single25);
        }
        else {
            result.value = new CGPoint(single18, single24);
        }
        return true;
    }

    public static NearestIntersectionOnEllipse(rect: CGRectangle, p1: CGPoint, p2: CGPoint, result: Out<CGPoint>): boolean {
        if (rect.Width === 0) {
            return GeomUtilities.NearestIntersectionOnLine(new CGPoint(rect.X, rect.Y), new CGPoint(rect.X, rect.Y + rect.Height), p1, p2, result);
        }
        if (rect.Height === 0) {
            return GeomUtilities.NearestIntersectionOnLine(new CGPoint(rect.X, rect.Y), new CGPoint(rect.X + rect.Width, rect.Y), p1, p2, result);
        }
        const width: float = rect.Width / 2;
        const height: float = rect.Height / 2;
        const x: float = rect.X + width;
        const y: float = rect.Y + height;
        let single: float = 9999;
        if (p1.X > p2.X) {
            single = (p1.Y - p2.Y) / (p1.X - p2.X);
        }
        else if (p1.X < p2.X) {
            single = (p2.Y - p1.Y) / (p2.X - p1.X);
        }
        if (Math.abs(single) >= 9999) {
            const single1: float = height;
            const single2: float = single1 * single1;
            const single3: float = width;
            const single4: float = single3 * single3;
            const x1: float = p1.X - x;
            const single5: float = single2 - single2 / single4 * (x1 * x1);
            if (single5 < 0) {
                result.value = new CGPoint();
                return false;
            }
            const single6: float = Math.sqrt(single5);
            const single7: float = y + single6;
            const single8: float = y - single6;
            if (Math.abs(single7 - p1.Y) >= Math.abs(single8 - p1.Y)) {
                result.value = new CGPoint(p1.X, single8);
            }
            else {
                result.value = new CGPoint(p1.X, single7);
            }
        }
        else {
            const y1: float = p1.Y - y - single * (p1.X - x);
            const single9: float = width;
            const single10: float = single;
            const single11: float = height;
            const single12: float = y1;
            if (single9 * single9 * (single10 * single10) + single11 * single11 - single12 * single12 < 0) {
                result.value = new CGPoint();
                return false;
            }
            const single13: float = width;
            const single14: float = single;
            const single15: float = height;
            const single16: float = y1;
            const single17: float = Math.sqrt((single13 * single13 * (single14 * single14) + single15 * single15 - single16 * single16));
            const single18: float = width;
            const single19: float = height;
            const single20: float = width;
            const single21: float = single;
            const single22: float = (-(single18 * single18 * single * y1) + width * height * single17) / (single19 * single19 + single20 * single20 * (single21 * single21)) + x;
            const single23: float = width;
            const single24: float = height;
            const single25: float = width;
            const single26: float = single;
            const single27: float = (-(single23 * single23 * single * y1) - width * height * single17) / (single24 * single24 + single25 * single25 * (single26 * single26)) + x;
            const single28: float = single * (single22 - x) + y1 + y;
            const single29: float = single * (single27 - x) + y1 + y;
            if (Math.abs((p1.X - single22) * (p1.X - single22)) + Math.abs((p1.Y - single28) * (p1.Y - single28)) >= Math.abs((p1.X - single27) * (p1.X - single27)) + Math.abs((p1.Y - single29) * (p1.Y - single29))) {
                result.value = new CGPoint(single27, single29);
            }
            else {
                result.value = new CGPoint(single22, single28);
            }
        }
        return true;
    }

    /**
     * Get surrounding rectangle of  given rect with angle.
     * @param angleInDeg
     * @param rect
     */
    public static GetSurroundingRectangle(angleInDeg: float, rect: CGRectangle): CGPoint[] {
        var alpha = (angleInDeg % 90) * Math.PI / 180;
        var tetha = (90 - (angleInDeg % 90)) * Math.PI / 180;
        var w = rect.Width;
        var h = rect.Height;

        var x1 = Math.cos(tetha) * Math.sin(alpha) * w;
        var y1 = Math.sin(tetha) * Math.sin(alpha) * w;

        var x2 = Math.sin(alpha) * Math.sin(tetha) * h;
        var y2 = Math.cos(alpha) * Math.sin(tetha) * h;

        var x3 = Math.cos(alpha) * Math.sin(tetha) * w;
        var y3 = Math.sin(alpha) * Math.sin(tetha) * w;

        var x4 = Math.sin(alpha) * Math.cos(alpha) * h;
        var y4 = Math.cos(alpha) * Math.cos(alpha) * h;

        let point1 = CGPoint.Empty;
        let point2 = CGPoint.Empty;
        let point3 = CGPoint.Empty;
        let point4 = CGPoint.Empty;

        if (angleInDeg <= 90) {
            point1 = new CGPoint(rect.Left + x1, rect.Top - y1);
            point2 = new CGPoint(rect.Left - x2, rect.Top + y2);
            point3 = new CGPoint(rect.Left + x3, rect.Bottom + y3);
            point4 = new CGPoint(rect.Right + x4, rect.Bottom - y4);
        } else if (angleInDeg > 90 && angleInDeg <= 180) {
            point2 = new CGPoint(rect.Left + x1, rect.Top - y1);
            point3 = new CGPoint(rect.Left - x2, rect.Top + y2);
            point4 = new CGPoint(rect.Left + x3, rect.Bottom + y3);
            point1 = new CGPoint(rect.Right + x4, rect.Bottom - y4);
        } else if (angleInDeg > 180 && angleInDeg <= 270) {
            point3 = new CGPoint(rect.Left + x1, rect.Top - y1);
            point4 = new CGPoint(rect.Left - x2, rect.Top + y2);
            point1 = new CGPoint(rect.Left + x3, rect.Bottom + y3);
            point2 = new CGPoint(rect.Right + x4, rect.Bottom - y4);
        } else if (angleInDeg <= 360) {
            point4 = new CGPoint(rect.Left + x1, rect.Top - y1);
            point1 = new CGPoint(rect.Left - x2, rect.Top + y2);
            point2 = new CGPoint(rect.Left + x3, rect.Bottom + y3);
            point3 = new CGPoint(rect.Right + x4, rect.Bottom - y4);
        }
        return [point1, point2, point3, point4];
    }

    public static CheckLineIntersection(line1StartX: number, line1StartY: number, line1EndX: number, line1EndY: number, line2StartX: number, line2StartY: number, line2EndX: number, line2EndY: number) {
        // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
        var denominator, a, b, numerator1, numerator2, result: any = {
            x: null,
            y: null,
            onLine1: false,
            onLine2: false
        };
        denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
        if (denominator == 0) {
            return result;
        }
        a = line1StartY - line2StartY;
        b = line1StartX - line2StartX;
        numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
        numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
        a = numerator1 / denominator;
        b = numerator2 / denominator;

        // if we cast these lines infinitely in both directions, they intersect here:
        result.x = line1StartX + (a * (line1EndX - line1StartX));
        result.y = line1StartY + (a * (line1EndY - line1StartY));
        /*
                // it is worth noting that this should be the same as:
                x = line2StartX + (b * (line2EndX - line2StartX));
                y = line2StartX + (b * (line2EndY - line2StartY));
                */
        // if line1 is a segment and line2 is infinite, they intersect if:
        if (a > 0 && a < 1) {
            result.onLine1 = true;
        }
        // if line2 is a segment and line1 is infinite, they intersect if:
        if (b > 0 && b < 1) {
            result.onLine2 = true;
        }
        // if line1 and line2 are segments, they intersect if both of the above are true
        return result;
    }
}
