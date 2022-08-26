import { CGRectangle } from '@tuval/cg';
import { CGPoint } from '@tuval/cg';
import { ICloneable } from '../ICloneable';
import { PathData } from './PathData';
import { FillMode } from './FillMode';
import { PathPointType } from '../PathPointType';
import { GeomUtilities } from '../GeomUtilities';
import { Matrix } from './Matrix';
import { Pen } from '../Pen';
import { Graphics } from '../Graphics';
import { Region } from '../Region';
import { GraphicTypes } from '../../GDITypes';
import { ClassInfo, List, IDisposable, ArgumentNullException, ArgumentException, foreach, float, Out, CONTINUE, newOutEmpty } from '@tuval/core';

export enum CurveType {
  Open,
  Close
}

type byte = number;
export const CURVE_MIN_TERMS: number = 1;
export const CURVE_MAX_TERMS: number = 7;
const FLATTEN_RECURSION_LIMIT: number = 10;
const scale: number = 10000;

@ClassInfo({
  fullName: GraphicTypes.GraphicsPath,
  instanceof: [
    GraphicTypes.GraphicsPath
  ]
})
export class GraphicsPath implements ICloneable<GraphicsPath>, IDisposable {
  public points: List<CGPoint>;
  public types: List<byte>;
  private fillMode: FillMode;
  private start_new_fig: boolean = true;
  public isReverseWindingOnFill: boolean = false;

  public get PathPoints(): CGPoint[] {
    return this.points.ToArray();
  }

  public get PathTypes(): byte[] {
    return this.types.ToArray();
  }

  public get PointCount(): number {
    return this.points.Count;
  }

  public get PathData(): PathData {
    return new PathData(this.points.ToArray(), this.types.ToArray());
  }

  public get FillMode(): FillMode {
    return this.fillMode;
  }
  public set FillMode(value: FillMode) {
    this.fillMode = value;
  }

  public get IsEmpty(): boolean {
    return this.points.Count === 0;
  }

  public constructor();
  public constructor(fillMode: FillMode);
  public constructor(pts: CGPoint[], types: byte[], fillMode: FillMode);
  public constructor(pts?: CGPoint[] | FillMode, types?: byte[], fillMode?: FillMode) {
    if (pts == null) {
      this.fillMode = FillMode.Alternate;
      this.points = new List<CGPoint>();
      this.types = new List<byte>();
    } else if (Array.isArray(pts)) {
      if (pts == null) throw new ArgumentNullException('pts');
      if (types == null) throw new ArgumentNullException('types');
      if (pts.length !== types.length) {
        throw new ArgumentException('Invalid parameter passed. Number of points and types must be same.');
      }
      this.fillMode = fillMode as any;

      foreach(types, (type: byte) => {
        if (type === 0 || type === 1 || type === 3 || type === 16 || type === 32 || type === 128 || type === 129 || type === 131) return CONTINUE;
        throw new ArgumentException('The pts array contains an invalid value for PathPointType: ' + type);
      });

      this.points = new List<CGPoint>(pts);
      this.types = new List<byte>(types);
    } else {
      this.fillMode = pts;
      this.points = new List<CGPoint>();
      this.types = new List<byte>();
    }
  }

  private append(x: float, y: float, type: PathPointType, compress: boolean): void {
    let t: byte = type;
    const pt: CGPoint = CGPoint.Empty;

    /* in some case we're allowed to compress identical points */
    if (compress && this.points.Count > 0) {
      /* points (X, Y) must be identical */
      const lastPoint: CGPoint = this.points.Get(this.points.Count - 1);
      if (lastPoint.X === x && lastPoint.Y === y) {
        /* types need not be identical but must handle closed subpaths */
        const last_type: PathPointType = this.types.Get(this.types.Count - 1);
        if ((last_type & PathPointType.CloseSubpath) !== PathPointType.CloseSubpath) return;
      }
    }

    if (this.start_new_fig) t = PathPointType.Start;
    /* if we closed a subpath, then start new figure and append */ else if (this.points.Count > 0) {
      type = this.types.Get(this.types.Count - 1);
      if ((type & PathPointType.CloseSubpath) !== 0) t = PathPointType.Start;
    }

    pt.X = x;
    pt.Y = y;

    this.points.Add(pt);
    this.types.Add(t);
    this.start_new_fig = false;
  }

  private appendBezier(x1: float, y1: float, x2: float, y2: float, x3: float, y3: float): void {
    if (this.isReverseWindingOnFill) {
      this.append(y1, x1, PathPointType.Bezier3, false);
      this.append(y2, x2, PathPointType.Bezier3, false);
      this.append(y3, x3, PathPointType.Bezier3, false);
    } else {
      this.append(x1, y1, PathPointType.Bezier3, false);
      this.append(x2, y2, PathPointType.Bezier3, false);
      this.append(x3, y3, PathPointType.Bezier3, false);
    }
  }

  private appendArc(start: boolean, x: float, y: float, width: float, height: float, startAngle: float, endAngle: float): void {
    let delta: float, bcp: float;
    let sin_alpha: float, sin_beta: float, cos_alpha: float, cos_beta: float;

    const rx: float = width / 2;
    const ry: float = height / 2;

    /* center */
    const cx: float = x + rx;
    const cy: float = y + ry;

    /* angles in radians */
    let alpha: float = (startAngle * Math.PI) / 180;
    let beta: float = (endAngle * Math.PI) / 180;

    /* adjust angles for ellipses */
    alpha = Math.atan2(rx * Math.sin(alpha), ry * Math.cos(alpha));
    beta = Math.atan2(rx * Math.sin(beta), ry * Math.cos(beta));

    if (Math.abs(beta - alpha) > Math.PI) {
      if (beta > alpha) beta -= 2 * Math.PI;
      else alpha -= 2 * Math.PI;
    }

    delta = beta - alpha;
    // http://www.stillhq.com/ctpfaq/2001/comp.text.pdf-faq-2001-04.txt (section 2.13)
    bcp = ((4.0 / 3) * (1 - Math.cos(delta / 2))) / Math.sin(delta / 2);

    sin_alpha = Math.sin(alpha);
    sin_beta = Math.sin(beta);
    cos_alpha = Math.cos(alpha);
    cos_beta = Math.cos(beta);

    // move to the starting point if we're not continuing a curve
    if (start) {
      // starting point
      const sx: float = cx + rx * cos_alpha;
      const sy: float = cy + ry * sin_alpha;
      this.append(sx, sy, PathPointType.Line, false);
    }

    this.appendBezier(
      cx + rx * (cos_alpha - bcp * sin_alpha),
      cy + ry * (sin_alpha + bcp * cos_alpha),
      cx + rx * (cos_beta + bcp * sin_beta),
      cy + ry * (sin_beta - bcp * cos_beta),
      cx + rx * cos_beta,
      cy + ry * sin_beta
    );
  }

  private static NearZero(value: float): boolean {
    return value >= -0.0001 && value <= 0.0001;
  }

  private appendArcs(x: float, y: float, width: float, height: float, startAngle: float, sweepAngle: float): void {
    let drawn: float = 0;
    let increment: number;
    let endAngle: float;
    let enough: boolean = false;

    if (Math.abs(sweepAngle) >= 360) {
      this.addEllipse(x, y, width, height);
      return;
    }

    endAngle = startAngle + sweepAngle;
    increment = endAngle < startAngle ? -90 : 90;

    // i is the number of sub-arcs drawn, each sub-arc can be at most 90 degrees.
    // there can be no more then 4 subarcs, ie. 90 + 90 + 90 + (something less than 90)
    for (let i = 0; i < 4; i++) {
      const current: float = startAngle + drawn;
      let additional: float;

      if (enough) return;

      additional = endAngle - current; /* otherwise, add the remainder */
      if (Math.abs(additional) > 90) {
        additional = increment;
      } else {
        // a near zero value will introduce bad artefact in the drawing (Novell #78999)
        if (GraphicsPath.NearZero(additional)) return;

        enough = true;
      }

      /* only move to the starting pt in the 1st iteration */
      this.appendArc(i === 0, x, y, width, height /* bounding rectangle */, current, current + additional);
      drawn += additional;
    }
  }

  private appendPoint(point: CGPoint, type: PathPointType, compress: boolean): void {
    this.append(point.X, point.Y, type, compress);
  }

  private appendCurve(points: CGPoint[], tangents: CGPoint[], offset: number, length: number, type: CurveType) {
    const ptype: PathPointType = type === CurveType.Close || points.length === 0 ? PathPointType.Start : PathPointType.Line;
    let i: number;

    this.appendPoint(points[offset], ptype, true);
    for (i = offset; i < offset + length; i++) {
      const j: number = i + 1;

      const x1: float = points[i].X + tangents[i].X;
      const y1: float = points[i].Y + tangents[i].Y;

      const x2: float = points[j].X - tangents[j].X;
      const y2: float = points[j].Y - tangents[j].Y;

      const x3: float = points[j].X;
      const y3: float = points[j].Y;

      this.appendBezier(x1, y1, x2, y2, x3, y3);
    }

    /* complete (close) the curve using the first point */
    if (type === CurveType.Close) {
      const x1: float = points[i].X + tangents[i].X;
      const y1: float = points[i].Y + tangents[i].Y;

      const x2: float = points[0].X - tangents[0].X;
      const y2: float = points[0].Y - tangents[0].Y;

      const x3: float = points[0].X;
      const y3: float = points[0].Y;

      this.appendBezier(x1, y1, x2, y2, x3, y3);
      this.closeFigure();
    }
  }

  public addClosedCurve(points: CGPoint[]): void;
  public addClosedCurve(points: CGPoint[], tension: float): void;
  public addClosedCurve(points: CGPoint[], tension: float = 0.5): void {
    if (points == null) throw new ArgumentNullException('points');
    if (points.length < 3) throw new ArgumentException('number of points');

    var tangents = GeomUtilities.GetCurveTangents(CURVE_MIN_TERMS, points, points.length, tension, CurveType.Close);
    this.appendCurve(points, tangents, 0, points.length - 1, CurveType.Close);
  }

  public addCurve(points: CGPoint[]): void;
  public addCurve(points: CGPoint[], tension: float): void;
  public addCurve(points: CGPoint[], offset: number, numberOfSegments: number, tension: float): void;
  public addCurve(param1: CGPoint[], param2?: number, param3?: number, param4?: float): void {
    if (arguments.length === 1 || arguments.length === 2) {
      const points: CGPoint[] = param1;
      const tension: float = param2 == null ? 0.5 : param2;

      if (points == null) throw new ArgumentNullException('points');
      if (points.length < 2) throw new ArgumentException('not enough points for polygon', 'points');

      var tangents = GeomUtilities.GetCurveTangents(CURVE_MIN_TERMS, points, points.length, tension, CurveType.Open);
      this.appendCurve(points, tangents, 0, points.length - 1, CurveType.Open);
    } else if (arguments.length > 2) {
      const points: CGPoint[] = param1;
      const numberOfSegments: number = param3 as any;
      const offset: number = param2 as any;
      const tension: float = param4 == null ? 0.5 : param4;

      if (points == null) {
        throw new ArgumentNullException('points');
      }
      if (numberOfSegments < 1) throw new ArgumentException('numberOfSegments');

      const count = points.length;
      // we need 3 points for the first curve, 2 more for each curves
      // and it's possible to use a point prior to the offset (to calculate)
      if (offset === 0 && numberOfSegments === 1 && count < 3) throw new ArgumentException('invalid parameters');
      if (numberOfSegments >= points.length - offset) {
        throw new ArgumentException('offset');
      }

      var tangents = GeomUtilities.GetCurveTangents(CURVE_MIN_TERMS, points, count, tension, CurveType.Open);
      this.appendCurve(points, tangents, offset, numberOfSegments, CurveType.Open);
    }
  }

  public addPolygon(points: CGPoint[]): void {
    if (points == null) {
      throw new ArgumentNullException('points');
    }
    if (points.length < 3) {
      throw new ArgumentException('not enough points for polygon', 'points');
    }

    this.appendPoint(points[0], PathPointType.Start, false);
    for (let i = 1; i < points.length; i++) {
      this.appendPoint(points[i], PathPointType.Line, false);
    }
    // Add a line from the last point back to the first point if
    // they're not the same
    const last: CGPoint = points[points.length - 1];
    if (points[0] !== last) {
      this.appendPoint(points[0], PathPointType.Line, false);
    }
    /* close the path */
    this.closeFigure();
  }

  public startFigure(): void {
    this.start_new_fig = true;
  }

  public closeFigure(): void {
    if (this.points.Count > 0) {
      this.types.Set(this.types.Count - 1,  this.types.Get(this.types.Count - 1) | PathPointType.CloseSubpath);
    }
    this.start_new_fig = true;
  }

  public addEllipse(rect: CGRectangle): void;
  public addEllipse(x: float, y: float, width: float, height: float): void;
  public addEllipse(rect: float | CGRectangle, y?: float, width?: float, height?: float): void {
    if (typeof rect === 'number' && typeof y === 'number' && typeof width === 'number' && typeof height === 'number') {
      this.addEllipse(new CGRectangle(rect, y, width, height));
    } else if (rect instanceof CGRectangle) {
      const C1: float = 0.552285;
      //const float C2 = 0.552285f;
      const rx: float = rect.Width / 2;
      const ry: float = rect.Height / 2;
      const cx: float = rect.X + rx;
      const cy: float = rect.Y + ry;

      if (!this.isReverseWindingOnFill) {
        /* origin */
        this.append(cx + rx, cy, PathPointType.Start, false);

        /* quadrant I */
        this.appendBezier(cx + rx, cy - C1 * ry, cx + C1 * rx, cy - ry, cx, cy - ry);

        /* quadrant II */
        this.appendBezier(cx - C1 * rx, cy - ry, cx - rx, cy - C1 * ry, cx - rx, cy);

        /* quadrant III */
        this.appendBezier(cx - rx, cy + C1 * ry, cx - C1 * rx, cy + ry, cx, cy + ry);

        /* quadrant IV */
        this.appendBezier(cx + C1 * rx, cy + ry, cx + rx, cy + C1 * ry, cx + rx, cy);
      } else {
        // We need to reverse the drawing of the ellipse so that the
        // winding is taken into account to not leave holes.

        /* origin */
        this.append(cx + rx, cy, PathPointType.Start, false);

        /* quadrant IV */
        this.appendBezier(cx + C1 * rx, cy + ry, cx + rx, cy + C1 * ry, cx + rx, cy);

        /* quadrant I */
        this.appendBezier(cx + rx, cy - C1 * ry, cx + C1 * rx, cy - ry, cx, cy - ry);

        /* quadrant II */
        this.appendBezier(cx - C1 * rx, cy - ry, cx - rx, cy - C1 * ry, cx - rx, cy);

        /* quadrant III */
        this.appendBezier(cx - rx, cy + C1 * ry, cx - C1 * rx, cy + ry, cx, cy + ry);
      }
      this.closeFigure();
    }
  }

  public addLine(pt1: CGPoint, pt2: CGPoint): void;
  public addLine(x1: float, y1: float, x2: float, y2: float): void;
  public addLine(param1: float | CGPoint, param2: float | CGPoint, param3?: float, param4?: float): void {
    if (param1 instanceof CGPoint && param2 instanceof CGPoint) {
      this.append(param1.X, param1.Y, PathPointType.Line, true);
      this.append(param2.X, param2.Y, PathPointType.Line, false);
    }

    if (typeof param1 === 'number' && typeof param2 === 'number' && typeof param3 === 'number' && typeof param4 === 'number') {
      this.append(param1, param2, PathPointType.Line, true);
      this.append(param3, param4, PathPointType.Line, false);
    }
  }

  public addLines(points: CGPoint[]): void {
    if (points == null) {
      throw new ArgumentNullException('points');
    }
    if (points.length === 0) {
      throw new ArgumentException('points');
    }

    /* only the first point can be compressed (i.e. removed if identical to previous) */
    for (let i = 0, count = points.length; i < count; i++) {
      this.append(points[i].X, points[i].Y, PathPointType.Line, i === 0);
    }
  }

  public addRectangle(rect: CGRectangle): void {
    if (rect.Width === 0 || rect.Height === 0) {
      return;
    }

    this.append(rect.X, rect.Y, PathPointType.Start, false);
    this.append(rect.Right, rect.Y, PathPointType.Line, false);
    this.append(rect.Right, rect.Bottom, PathPointType.Line, false);
    this.append(rect.X, rect.Bottom, PathPointType.Line | PathPointType.CloseSubpath, false);
  }

  public addRectangles(rects: CGRectangle[]): void {
    if (rects == null) {
      throw new ArgumentNullException('rects');
    }

    foreach(rects, (rect: CGRectangle) => {
      this.addRectangle(rect);
    });
  }

  public addPie(x: float, y: float, width: float, height: float, startAngle: float, sweepAngle: float): void {
    let sin_alpha: float, cos_alpha: float;

    const rx: float = width / 2;
    const ry: float = height / 2;

    /* center */
    const cx: float = x + rx;
    const cy: float = y + ry;

    /* angles in radians */
    let alpha: float = (startAngle * Math.PI) / 180;

    /* adjust angle for ellipses */
    alpha = Math.atan2(rx * Math.sin(alpha), ry * Math.cos(alpha));

    sin_alpha = Math.sin(alpha);
    cos_alpha = Math.cos(alpha);

    /* move to center */
    this.append(cx, cy, PathPointType.Start, false);

    /* draw pie edge */
    if (Math.abs(sweepAngle) < 360) this.append(cx + rx * cos_alpha, cy + ry * sin_alpha, PathPointType.Line, false);

    /* draw the arcs */
    this.appendArcs(x, y, width, height, startAngle, sweepAngle);

    /* draw pie edge */
    if (Math.abs(sweepAngle) < 360) this.append(cx, cy, PathPointType.Line, false);

    this.closeFigure();
  }

  public addArc(rect: CGRectangle, start_angle: float, sweep_angle: float): void;
  public addArc(x: float, y: float, width: float, height: float, start_angle: float, sweep_angle: float): void;
  public addArc(param1: float | CGRectangle, param2: float, param3: float, param4?: float, param5?: float, param6?: float): void {
    if (param1 instanceof CGRectangle) {
      const rect: CGRectangle = param1;
      const start_angle: float = param2;
      const sweep_angle: float = param3;
      this.appendArcs(rect.X, rect.Y, rect.Width, rect.Height, start_angle, sweep_angle);
    } else if (typeof param1 === 'number') {
      const x: float = param1;
      const y: float = param2;
      const width: float = param3;
      const height: float = param4 as any;
      const start_angle: float = param5 as any;
      const sweep_angle: float = param6 as any;
      this.appendArcs(x, y, width, height, start_angle, sweep_angle);
    }
  }

  public addBezier(pt1: CGPoint, pt2: CGPoint, pt3: CGPoint, pt4: CGPoint): void;
  public addBezier(x1: float, y1: float, x2: float, y2: float, x3: float, y3: float, x4: float, y4: float): void;
  public addBezier(
    param1: float | CGPoint,
    param2: float | CGPoint,
    param3: float | CGPoint,
    param4: float | CGPoint,
    param5?: float,
    param6?: float,
    param7?: float,
    param8?: float
  ): void {
    if (param1 instanceof CGPoint && param2 instanceof CGPoint && param3 instanceof CGPoint &&
      param4 instanceof CGPoint) {
      const pt1: CGPoint = param1;
      const pt2: CGPoint = param2;
      const pt3: CGPoint = param3;
      const pt4: CGPoint = param4;
      this.append(pt1.X, pt1.Y, PathPointType.Line, true);
      this.appendBezier(pt2.X, pt2.Y, pt3.X, pt3.Y, pt4.X, pt4.Y);
    } else if (typeof param1 === 'number' && typeof param2 === 'number' && typeof param3 === 'number' && typeof param4 === 'number') {
      const x1: float = param1;
      const y1: float = param2;
      const x2: float = param3;
      const y2: float = param4;
      const x3: float = param5 as any;
      const y3: float = param6 as any;
      const x4: float = param7 as any;
      const y4: float = param8 as any;
      this.append(x1, y1, PathPointType.Line, true);
      this.appendBezier(x2, y2, x3, y3, x4, y4);
    }
  }

  public addBeziers(points: CGPoint[]): void {
    if (points == null) {
      throw new ArgumentNullException('points');
    }

    const count: number = points.length;

    /* first bezier requires 4 points, other 3 more points */
    if (count < 4 || count % 3 !== 1) {
      throw new ArgumentException('points');
    }

    this.appendPoint(points[0], PathPointType.Line, true);

    for (let i = 1; i < count; i++) {
      this.appendPoint(points[i], PathPointType.Bezier3, false);
    }
  }

  public addPath(addingPath: GraphicsPath, connect: boolean): void {
    if (addingPath == null) {
      throw new ArgumentNullException('addingPath');
    }

    const length: number = addingPath.PointCount;

    if (length < 1) return;

    const pts: CGPoint[] = addingPath.PathPoints;
    const types: byte[] = addingPath.PathTypes;

    // We can connect only open figures. If first figure is closed
    // it can't be connected.
    const first: PathPointType = connect ? this.getFirstPointType() : PathPointType.Start;

    this.appendPoint(pts[0], first, false);

    for (let i = 1; i < length; i++) {
      this.appendPoint(pts[i], types[i], false);
    }
  }

  public closeAllFigures(): void {
    let index = 0;
    let currentType: byte;
    let lastType: byte;
    let oldTypes: byte[];

    /* first point is not closed */
    if (this.points.Count <= 1) return;

    oldTypes = this.types.ToArray();
    this.types = new List<byte>();

    lastType = oldTypes[index];
    index++;

    for (index = 1; index < this.points.Count; index++) {
      currentType = oldTypes[index];
      /* we dont close on the first point */
      if (currentType === PathPointType.Start && index > 1) {
        lastType |= PathPointType.CloseSubpath;
        this.types.Add(lastType);
      } else this.types.Add(lastType);

      lastType = currentType;
    }

    /* close at the end */
    lastType |= PathPointType.CloseSubpath;
    this.types.Add(lastType);

    this.start_new_fig = true;
  }

  public getLastPoint(): CGPoint {
    if (this.points.Count <= 0) throw new ArgumentException('Parameter is not valid');

    var lastPoint: CGPoint = this.points.Get(this.points.Count - 1);
    return lastPoint;
  }

  public getBounds(): CGRectangle;
  public getBounds(matrix: Matrix): CGRectangle;
  public getBounds(matrix: Matrix, pen: Pen): CGRectangle;
  public getBounds(matrix?: Matrix, pen?: Pen): CGRectangle {
    const bounds: CGRectangle = CGRectangle.Empty;

    if (this.points.Count < 1) {
      return bounds;
    }

    const workPath: GraphicsPath = this.Clone();

    // We don't need a very precise flat value to get the bounds (GDI+ isn't, big time) -
    // however flattening helps by removing curves, making the rest of the algorithm a
    // lot simpler.
    // note: only the matrix is applied if no curves are present in the path
    var status = GraphicsPath.FlattenPath(workPath, matrix as any, 25.0);

    if (status === 0) {
      let i: number;
      let boundaryPoints: CGPoint;

      boundaryPoints = workPath.points.Get(0); //g_array_index (workpath->points, GpPointF, 0);
      bounds.X = boundaryPoints.X; // keep minimum X here
      bounds.Y = boundaryPoints.Y; // keep minimum Y here
      if (workPath.points.Count === 1) {
        // special case #2 - Only one element
        bounds.Width = 0.0;
        bounds.Height = 0.0;
        return bounds;
      }

      bounds.Width = boundaryPoints.X; // keep maximum X here
      bounds.Height = boundaryPoints.Y; // keep maximum Y here

      for (i = 1; i < workPath.points.Count; i++) {
        boundaryPoints = workPath.points.Get(i);
        if (boundaryPoints.X < bounds.X) bounds.X = boundaryPoints.X;
        if (boundaryPoints.Y < bounds.Y) bounds.Y = boundaryPoints.Y;
        if (boundaryPoints.X > bounds.Width) bounds.Width = boundaryPoints.X;
        if (boundaryPoints.Y > bounds.Height) bounds.Height = boundaryPoints.Y;
      }

      // convert maximum values (width/height) as length
      bounds.Width -= bounds.X;
      bounds.Height -= bounds.Y;

      if (pen != null) {
        /* in calculation the pen's width is at least 1.0 */
        const width: float = pen.Width < 1.0 ? 1.0 : pen.Width;
        const halfw: float = width / 2;

        bounds.X -= halfw;
        bounds.Y -= halfw;
        bounds.Width += width;
        bounds.Height += width;
      }
    }
    return bounds;
  }

  public static PathHasCurve(path: GraphicsPath): boolean {
    if (path == null) {
      return false;
    }

    var types = path.PathTypes;
    for (let i = 0; i < types.length; i++) {
      if (types[i] === PathPointType.Bezier) return true;
    }

    return false;
  }

  // nr_curve_flatten comes from Sodipodi's libnr (public domain) available from http://www.sodipodi.com/
  // Mono changes: converted to float (from double), added recursion limit, use List<PointF>
  private static nr_curve_flatten(
    x0: float,
    y0: float,
    x1: float,
    y1: float,
    x2: float,
    y2: float,
    x3: float,
    y3: float,
    flatness: float,
    level: number,
    points: List<CGPoint>
  ): boolean {
    let dx1_0: float, dy1_0: float, dx2_0: float, dy2_0: float, dx3_0: float, dy3_0: float, dx2_3: float, dy2_3: float, d3_0_2: float;
    let s1_q: float, t1_q: float, s2_q: float, t2_q: float, v2_q: float;
    let f2: float, f2_q: float;
    let x00t: float, y00t: float, x0tt: float, y0tt: float, xttt: float, yttt: float, x1tt: float, y1tt: float, x11t: float, y11t: float;

    dx1_0 = x1 - x0;
    dy1_0 = y1 - y0;
    dx2_0 = x2 - x0;
    dy2_0 = y2 - y0;
    dx3_0 = x3 - x0;
    dy3_0 = y3 - y0;
    dx2_3 = x3 - x2;
    dy2_3 = y3 - y2;
    f2 = flatness;
    d3_0_2 = dx3_0 * dx3_0 + dy3_0 * dy3_0;
    if (d3_0_2 < f2) {
      let d1_0_2: float, d2_0_2: float;
      d1_0_2 = dx1_0 * dx1_0 + dy1_0 * dy1_0;
      d2_0_2 = dx2_0 * dx2_0 + dy2_0 * dy2_0;
      if (d1_0_2 < f2 && d2_0_2 < f2) {
        return nosubdivide();
      } else {
        return subdivide();
      }
    }
    f2_q = f2 * d3_0_2;
    s1_q = dx1_0 * dx3_0 + dy1_0 * dy3_0;
    t1_q = dy1_0 * dx3_0 - dx1_0 * dy3_0;
    s2_q = dx2_0 * dx3_0 + dy2_0 * dy3_0;
    t2_q = dy2_0 * dx3_0 - dx2_0 * dy3_0;
    v2_q = dx2_3 * dx3_0 + dy2_3 * dy3_0;
    if (t1_q * t1_q > f2_q) {
      return subdivide();
    }
    if (t2_q * t2_q > f2_q) {
      return subdivide();
    }
    if (s1_q < 0.0 && s1_q * s1_q > f2_q) {
      return subdivide();
    }
    if (v2_q < 0.0 && v2_q * v2_q > f2_q) {
      return subdivide();
    }
    if (s1_q >= s2_q) {
      return subdivide();
    }

    function nosubdivide() {
      points.Add(new CGPoint(x3, y3));
      return true;
    }

    function subdivide() {
      // things gets *VERY* memory intensive without a limit
      if (level >= FLATTEN_RECURSION_LIMIT) return false;

      x00t = (x0 + x1) * 0.5;
      y00t = (y0 + y1) * 0.5;
      x0tt = (x0 + 2 * x1 + x2) * 0.25;
      y0tt = (y0 + 2 * y1 + y2) * 0.25;
      x1tt = (x1 + 2 * x2 + x3) * 0.25;
      y1tt = (y1 + 2 * y2 + y3) * 0.25;
      x11t = (x2 + x3) * 0.5;
      y11t = (y2 + y3) * 0.5;
      xttt = (x0tt + x1tt) * 0.5;
      yttt = (y0tt + y1tt) * 0.5;

      if (!GraphicsPath.nr_curve_flatten(x0, y0, x00t, y00t, x0tt, y0tt, xttt, yttt, flatness, level + 1, points)) return false;
      if (!GraphicsPath.nr_curve_flatten(xttt, yttt, x1tt, y1tt, x11t, y11t, x3, y3, flatness, level + 1, points)) return false;
      return true;
    }
    return false;
  }

  private static ConvertBezierToLines(
    path: GraphicsPath,
    index: number,
    flatness: float,
    flat_points: List<CGPoint>,
    flat_types: List<byte>
  ): boolean {
    let pt: CGPoint;

    // always PathPointTypeLine
    const type: byte = PathPointType.Line;

    if (index <= 0 || index + 2 >= path.points.Count) return false; // bad path data

    const start: CGPoint = path.points.Get(index - 1);
    const first: CGPoint = path.points.Get(index);
    const second: CGPoint = path.points.Get(index + 1);
    const end: CGPoint = path.points.Get(index + 2);

    // we can't add points directly to the original list as we could end up with too much recursion
    var points = new List<CGPoint>();
    if (!GraphicsPath.nr_curve_flatten(start.X, start.Y, first.X, first.Y, second.X, second.Y, end.X, end.Y, flatness, 0, points)) {
      // curved path is too complex (i.e. would result in too many points) to render as a polygon
      return false;
    }

    // recursion was within limits, append the result to the original supplied list
    if (points.Count > 0) {
      flat_points.Add(points[0]);
      flat_types.Add(type);
    }

    // always PathPointTypeLine
    for (let i = 1; i < points.Count; i++) {
      pt = points.Get(i);
      flat_points.Add(pt);
      flat_types.Add(type);
    }

    return true;
  }

  private static FlattenPath(path: GraphicsPath, matrix: Matrix, flatness: float): number {
    let status: number = 0;

    if (path == null) {
      return -1;
    }

    // apply matrix before flattening (as there's less points at this stage)
    if (matrix != null) {
      path.transform(matrix);
    }

    // if no bezier are present then the path doesn't need to be flattened
    if (!GraphicsPath.PathHasCurve(path)) {
      return status;
    }

    const points: List<CGPoint> = new List<CGPoint>();
    const types: List<byte> = new List<byte>();

    // Iterate the current path and replace each bezier with multiple lines
    for (let i = 0; i < path.points.Count; i++) {
      const point: CGPoint = path.points.Get(i);
      let type: byte = path.types.Get(i);

      // PathPointTypeBezier3 has the same value as PathPointTypeBezier
      if ((type & PathPointType.Bezier) === PathPointType.Bezier) {
        if (!GraphicsPath.ConvertBezierToLines(path, i, Math.abs(flatness), points, types)) {
          // uho, too much recursion - do not pass go, do not collect 200$
          const pt: CGPoint = CGPoint.Empty;

          // mimic MS behaviour when recursion becomes a problem */
          // note: it's not really an empty rectangle as the last point isn't closing
          points.Clear();
          types.Clear();

          type = PathPointType.Start;
          points.Add(pt);
          types.Add(type);

          type = PathPointType.Line;
          points.Add(pt);
          types.Add(type);

          points.Add(pt);
          types.Add(type);
          break;
        }
        // beziers have 4 points: the previous one, the current and the next two
        i += 2;
      } else {
        // no change required, just copy the point
        points.Add(point);
        types.Add(type);
      }
    }

    // transfer new path informations
    path.points = points;
    path.types = types;

    // note: no error code is given for excessive recursion
    return 0;
  }

  public isVisible(point: CGPoint): boolean;
  public isVisible(point: CGPoint, graphics: Graphics): boolean;
  public isVisible(x: float, y: float): boolean;
  public isVisible(param1: float | CGPoint, param2?: float | Graphics, param3?: Graphics): boolean {
    if (arguments.length === 1 && param1 instanceof CGPoint) {
      this.isVisible(param1, undefined as any);
    } else if (arguments.length === 2 && param1 instanceof CGPoint && (param2 instanceof Graphics || typeof param2 === 'undefined')) {
      const region: Region = new Region(this);
      return region.isVisible(param1);
    } else if (arguments.length === 2 && typeof param1 === 'number' && typeof param2 === 'number') {
      this.isVisible(new CGPoint(param1, param2), undefined as any);
    } else if (arguments.length === 3 && typeof param1 === 'number' && typeof param2 === 'number' && param3 instanceof Graphics) {
      this.isVisible(new CGPoint(param1, param2), param3);
    }
    return false;
  }

  public isOutlineVisible(pt: CGPoint, pen: Pen, graphics: Graphics): boolean {
    const outlinePath: GraphicsPath = this.Clone();
    if (graphics != null) {
      outlinePath.transform(graphics.Transform);
    }

    // TODO: Fix below
    // outlinePath.widen(pen);
    var outlineRegion = new Region(outlinePath);
    return outlineRegion.isVisible(pt);
  }

  public flatten(): void;
  public flatten(matrix: Matrix): void;
  public flatten(matrix: Matrix, flatness: float): void;
  public flatten(matrix?: Matrix, flatness: float = 0.25): void {
    GraphicsPath.FlattenPath(this, matrix as any, flatness);
  }

  public reset(): void {
    this.points.Clear();
    this.types.Clear();
    this.fillMode = FillMode.Alternate;
    this.start_new_fig = true;
  }

  private static ReverseSubpathAndAdjustFlags(
    start: number,
    end: number,
    old_types: List<byte>,
    new_types: List<byte>,
    isPrevHadMarker: Out<boolean>
  ): void {
    // Copy all but PathPointTypeStart
    if (end !== start) new_types.AddRange(old_types.GetRange(start + 1, end - start));

    // Append PathPointTypeStart
    new_types.Add(PathPointType.Start);

    console.debug(new_types.Count === end + 1);

    const prev_first: number = old_types[start];
    const prev_last: number = old_types[end];

    // Remove potential flags from our future start point
    if (end !== start) new_types[end - 1] &= PathPointType.PathTypeMask;

    // Set the flags on our to-be-last point
    if ((prev_last & PathPointType.DashMode) !== 0) new_types[start] |= PathPointType.DashMode;

    if ((prev_last & PathPointType.CloseSubpath) !== 0) new_types[start] |= PathPointType.CloseSubpath;

    //
    // Swap markers
    //
    for (let i = start + 1; i < end; i++) {
      if ((old_types[i - 1] & PathPointType.PathMarker) !== 0) new_types[i] |= PathPointType.PathMarker;
      //new_types[i] &= ~PathPointType.PathMarker;
      // Can not take compliment for negative numbers so we XOR
      else new_types[i] &= PathPointType.PathMarker ^ 0xff;
    }

    // If the last point of the previous subpath had a marker, we inherit it
    if (isPrevHadMarker) new_types[start] |= PathPointType.PathMarker;
    //new_types[start] &= ~PathPointType.PathMarker;
    // Can not take compliment for negative numbers so we XOR
    else new_types[start] &= PathPointType.PathMarker ^ 0xff;

    isPrevHadMarker.value = (prev_last & PathPointType.PathMarker) === PathPointType.PathMarker;
  }

  public reverse(): void {
    const length: number = this.points.Count;
    let start: number = 0;
    const isPrevHadMarker: Out<boolean> = { value: false };

    // shortcut
    if (length <= 1) return;

    // PathTypes reversal

    // First adjust the flags for each subpath
    const newTypes: List<byte> = new List<byte> /*length*/();

    for (let i = 1; i < length; i++) {
      const t: byte = this.types.Get(i);
      if ((t & PathPointType.PathTypeMask) === PathPointType.Start) {
        GraphicsPath.ReverseSubpathAndAdjustFlags(start, i - 1, this.types, newTypes, isPrevHadMarker);
        start = i;
      }
    }

    if (start < length - 1) GraphicsPath.ReverseSubpathAndAdjustFlags(start, length - 1, this.types, newTypes, isPrevHadMarker);

    /* Then reverse the resulting array */
    for (let i = 0; i < length >> 1; i++) {
      const a: byte = newTypes.Get(i);
      const b: byte = newTypes.Get(length - i - 1);
      const temp: byte = a;
      newTypes.Set(i, b);
      newTypes.Set(length - i - 1,  temp);
    }

    this.types = newTypes;

    // PathPoints reversal
    // note: if length is odd then the middle point doesn't need to switch side
    //
    for (let i = 0; i < length >> 1; i++) {
      const first: CGPoint = this.points.Get(i);
      const last: CGPoint = this.points.Get(length - i - 1);

      const temp: CGPoint = CGPoint.Empty;
      temp.X = first.X;
      temp.Y = first.Y;
      this.points.Set(i, last);
      this.points.Set(length - i - 1, temp);
    }
  }

  public setMarkers(): void {
    if (this.points.Count === 0) return;

    let current: number = this.types.Get(this.points.Count - 1);

    this.types.RemoveAt(this.points.Count - 1);

    current |= PathPointType.PathMarker;

    this.types.Add(current);
  }

  public clearMarkers(): void {
    // shortcut to avoid allocations
    if (this.types.Count === 0) return;

    const cleared: List<byte> = new List<byte>();
    let current: byte = 0;

    for (let i = 0; i < this.types.Count; i++) {
      current = this.types.Get(i);

      /* take out the marker if there is one */
      if ((current & PathPointType.PathMarker) != 0)
        //current &= ~PathPointType.PathMarker;
        current &= PathPointType.PathMarker ^ 0xff;

      cleared.Add(current);
    }

    /* replace the existing with the cleared array */
    this.types = cleared;
  }

  private getFirstPointType(): PathPointType {
    /* check for a new figure flag or an empty path */
    if (this.start_new_fig || this.points.Count === 0) {
      return PathPointType.Start;
    }

    /* check if the previous point is a closure */
    const type = this.types.Get(this.types.Count - 1);
    if ((type & PathPointType.CloseSubpath) !== 0) return PathPointType.Start;
    else return PathPointType.Line;
  }

  public transform(matrix: Matrix): void {
    matrix.transformPoints(this.points.ToArray());
  }

  public widen(pen: Pen, matrix: Matrix, flatness: float = 0.25): void {
    if (pen == null) {
      throw new ArgumentNullException('pen');
    }

    if (this.points.Count <= 1) {
      return;
    }

    const flat_path: GraphicsPath = this.Clone();

    flat_path.flatten(matrix, flatness);
    let widePoints: Out<List<CGPoint>> = newOutEmpty();
    let wideTypes: Out<List<byte>> = newOutEmpty();

    // TODO: Fix below
    // GraphicsPath.WidenPath(flat_path, pen, widePoints, wideTypes);

    this.points = widePoints.value as any;
    this.types = wideTypes.value as any;
    this.start_new_fig = true;

    this.isReverseWindingOnFill = true;
  }

  /* private static WidenPath (path: GraphicsPath,  pen:Pen,   widePoints: Out<Collection<PointF>>,  wideTypes: Out<Collection<byte>): void
		{

			widePoints.out = new Collection<PointF> ();
			wideTypes.out = new Collection<byte> ();

			const pathData: PathData = path.PathData;

			const iterator = new GraphicsPathIterator(path);
			var subPaths = iterator.SubpathCount;

			int startIndex = 0;
			int endIndex = 0;
			bool isClosed = false;

			var flattenedSubpath = new Paths();
			var offsetPaths = new Paths();

			var width = (pen.Width / 2) * scale;
			var miterLimit = pen.MiterLimit * scale;

			var joinType = JoinType.jtMiter;
			switch (pen.LineJoin)
			{
			case LineJoin.Round:
				joinType = JoinType.jtRound;
				break;
			case LineJoin.Bevel:
				joinType = JoinType.jtSquare;
				break;
			}


			for (int sp = 0; sp < subPaths; sp++)
			{

				var numOfPoints = iterator.NextSubpath(out startIndex, out endIndex, out isClosed);
				//Console.WriteLine("subPath {0} - from {1} to {2} closed {3}", sp+1, startIndex, endIndex, isClosed);

				var subPoints = pathData.Points.Skip(startIndex).Take(numOfPoints).ToArray();

				//for (int pp = startIndex; pp <= endIndex; pp++)
				//{
				//    Console.WriteLine("         {0} - {1}", pathData.Points[pp], (PathPointType)pathData.Types[pp]);
				//}


				// Load our Figure Subpath
				flattenedSubpath.Clear();
				flattenedSubpath.Add(Region.PointFArrayToIntArray(subPoints, scale));

				// Calculate the outter offset region
				var outerOffsets = Clipper.OffsetPaths(flattenedSubpath, width, joinType, ClipperLib.EndType.etClosed, miterLimit);
				// Calculate the inner offset region
				var innerOffsets = Clipper.OffsetPaths(flattenedSubpath, -width, joinType, ClipperLib.EndType.etClosed, miterLimit);

				// Add the offsets to our paths
				offsetPaths.AddRange(outerOffsets);

				// revers our innerOffsets so that they create a hole when filling
				Clipper.ReversePaths (innerOffsets);
				offsetPaths.AddRange(innerOffsets);

			}

			foreach (var offPath in offsetPaths)
			{
				if (offPath.Count < 1)
					continue;

				var pointArray = Region.PathToPointFArray(offPath, scale);

				var type = (byte)PathPointType.Start;
				widePoints.Add (pointArray [0]);
				wideTypes.Add (type);

				type = (byte)PathPointType.Line;
				for (int i = 1; i < offPath.Count; i++)
				{
					widePoints.Add (pointArray [i]);
					wideTypes.Add (type);

				}

				if (widePoints.Count > 0)
					wideTypes [wideTypes.Count-1] = (byte) (wideTypes [wideTypes.Count-1] | (byte) PathPointType.CloseSubpath);

			}

		} */

  public Dispose(): void { }

  public Clone(): GraphicsPath {
    var copy = new GraphicsPath(this.fillMode);
    copy.points = new List<CGPoint>(this.points.ToArray());
    copy.types = new List<byte>(this.types.ToArray());
    copy.start_new_fig = this.start_new_fig;

    return copy;
  }
}
