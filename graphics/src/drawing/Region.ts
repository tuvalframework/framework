import { CGRectangle, CGPoint ,CGAffineTransform} from '@tuval/cg';
import { List, newOutEmpty, is , System} from "@tuval/core";
import { GraphicsPath } from "./drawing2D/GraphicsPath";
import { float, as, foreach, Out, nameof } from "@tuval/core";
import { Graphics } from "./Graphics";
import { ArgumentNullException } from "@tuval/core";
import { Matrix } from "./drawing2D/Matrix";
import { GraphicTypes } from "../GDITypes";
import { PolyFillType, ClipType, Paths, Path, ClipPoint, Clipper, PolyType } from "./Clipper";

export enum RegionType {
    Rectangle = 10000,
    Infinity = 10001,
    Empty = 10002,
    Path = 10003,
}

export enum RegionClipType {
    Intersection = ClipType.ctIntersection,
    Union = ClipType.ctUnion,
    Difference = ClipType.ctDifference,
    Xor = ClipType.ctXor,
    None = -1
};

class RegionEntry {
    public regionType: RegionType = undefined as any;
    public regionObject: any;
    public regionPath: Paths = undefined as any;
    public regionClipType: RegionClipType = undefined as any;

    public constructor1(type: RegionType) {
        this.constructor(type, null, new List(), RegionClipType.None);
    }

    public constructor2(type: RegionType, obj: any) {
        this.constructor(type, obj, new List(), RegionClipType.None)
    }

    public constructor3(type: RegionType, obj: any, path: Path) {
        this.constructor(type, obj, path, RegionClipType.None);
    }

    public constructor();
    public constructor(type: RegionType, obj: any, path: Path, clipType: RegionClipType);
    public constructor ( type:RegionType,  obj: any,  path:Paths,  clipType:RegionClipType);
    public constructor(...args: any[]) {
        if (args.length === 0) {

        } else if (args.length === 4 && is.typeof<Path>(args[2], System.Types.Collections.Generics.List) && !is.typeof<Path>(args[2]?.[0], System.Types.Collections.Generics.List)) {
            const type: RegionType = args[0];
            const obj: any = args[1];
            const path: Path = args[2];
            const clipType: RegionClipType = args[3];
            this.regionType = type;
            this.regionObject = obj;
            this.regionPath = new List<List<ClipPoint>>();
            this.regionPath.Add(path);
            this.regionClipType = clipType;
        } else if (args.length === 4 && is.typeof<Paths>(args[2], System.Types.Collections.Generics.List) && is.typeof<Path>(args[2]?.[0], System.Types.Collections.Generics.List)) {
           const type:RegionType = args[0];
           const  obj: any = args[1];
           const  path:Paths = args[2];
           const  clipType:RegionClipType = args[3];
            this.regionType = type;
            this.regionObject = obj;
            this.regionPath = path;
            this.regionClipType = clipType;
        }
    }

    /*  public RegionEntry(RegionType type, object obj, Paths path, RegionClipType clipType) {

         regionType = type;
         regionObject = obj;
         regionPath = path;
         regionClipType = clipType;
     } */

    //			public RegionEntry (RegionType type, object obj, Paths path, RegionClipType clipType)
    //			{
    //
    //				regionType = type;
    //				regionObject = obj;
    //				regionPath = path;
    //				regionClipType = clipType;
    //			}
}


export class Region {
    private static readonly SUBJ_FILL_TYPE: any = PolyFillType.pftNonZero;
    private static readonly CLIP_FILL_TYPE: any = PolyFillType.pftNonZero;

    public static infinite: CGRectangle = new CGRectangle(-4194304, -4194304, 8388608, 8388608);
    public regionObject: any;
    public regionList: List<RegionEntry> = new List<RegionEntry>();
    public regionPath: GraphicsPath = undefined as any;
    public regionBounds: CGRectangle = undefined as any;

    private static scale: float = 10000; //or 1 or 10 or 10000 etc for lesser or greater precision.
    public solution: Paths = new List<List<any>>();

    constructor(region: Region);
    constructor(path: GraphicsPath);
    constructor(rect: CGRectangle);
    constructor();
    constructor(...args: any[]) {
        if (args.length === 0) {
            this.regionObject = Region.infinite;

            const path: Path = Region.RectangleToPath(Region.infinite);
            this.solution.Add(path);

            this.regionList.Add(new RegionEntry(RegionType.Infinity, Region.infinite, path, RegionClipType.None));

            this.regionPath = new GraphicsPath();
            this.regionPath.addLines(
                [
                    new CGPoint(Region.infinite.Left, Region.infinite.Top),
                    new CGPoint(Region.infinite.Right, Region.infinite.Top),
                    new CGPoint(Region.infinite.Right, Region.infinite.Bottom),
                    new CGPoint(Region.infinite.Left, Region.infinite.Bottom)
                ]);
            this.regionBounds = Region.infinite;
        } else if (args.length === 1 && args[0] instanceof CGRectangle) {
            const rect = args[0];
            this.regionObject = rect;
            const path: Path = Region.RectangleToPath(rect);
            this.solution.Add(path);
            this.regionList.Add(new RegionEntry(RegionType.Rectangle, rect, path, RegionClipType.None));
            this.regionPath = new GraphicsPath();
            this.regionPath.addLines([
                new CGPoint(rect.Left, rect.Top),
                new CGPoint(rect.Right, rect.Top),
                new CGPoint(rect.Right, rect.Bottom),
                new CGPoint(rect.Left, rect.Bottom),
            ]);
            this.regionBounds = rect;
        } else if (args.length === 1 && args[0] instanceof GraphicsPath) {
            const clonePath: GraphicsPath = as<GraphicsPath>(args[0], GraphicTypes.GraphicsPath).Clone();
            this.regionObject = clonePath;
            this.regionPath = new GraphicsPath();

            // this.plotPath(clonePath);

            clonePath.flatten();
            const flatPath: Path = Region.PointFArrayToIntArray(clonePath.PathPoints, Region.scale);
            this.solution.Add(flatPath);
            this.regionList.Add(new RegionEntry(RegionType.Path, clonePath, flatPath, RegionClipType.None));
            this.regionBounds = this.regionPath.getBounds();
        } else if (args.length === 1 && args[0] instanceof Region) {
            const region: Region = args[0];
            this.solution = Region.Copy(region.solution);
            this.regionPath = region.regionPath.Clone();
            this.regionList = Region.Copy1(region.regionList);
            this.regionBounds = region.regionBounds;
            this.regionObject = Region.CopyRegionObject(region.regionObject);
        }
    }
    public static PointFArrayToIntArray(points: CGPoint[], scale: float): Path {
        const result: Path = new List<any>();
        for (let i = 0; i < points.length; ++i) {
            result.Add(new ClipPoint(Math.round(points[i].X) * scale, Math.round(points[i].Y) * scale));
        }
        return result;
    }
    public static PathToPointFArray(pg: Path, scale: float): CGPoint[] {
        const result: CGPoint[] = [];
        for (let i = 0; i < pg.Count; ++i) {
            result[i].X = (pg[i] as any).X / scale;
            result[i].Y = (pg[i] as any).Y / scale;
        }
        return result;
    }

    /* private plotPath ( path:GraphicsPath): void
    {
        let x1: float = 0, y1: float = 0, x2: float = 0, y2: float = 0, x3: float = 0, y3: float = 0;
        const points: PointF[] = path.PathPoints;
        const types: numbers[] = path.PathTypes;
        const bidx: number = 0;

        for (let i = 0; i < points.Length; i++){
            const point: PointF = points[i];
            const type:PathPointType = types[i];

            switch (type & PathPointType.PathTypeMask){
            case PathPointType.Start:
                this.regionPath.moveToPoint (point.ToCGPoint ());
                break;

            case PathPointType.Line:
                regionPath.AddLineToPoint (point.ToCGPoint ());
                break;

            case PathPointType.Bezier3:
                // collect 3 points
                switch (bidx++){
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
                if (bidx == 3){
                    regionPath.AddCurveToPoint (x1, y1, x2, y2, x3, y3);
                    bidx = 0;
                }
                break;
                default:
                throw new Exception ("Inconsistent internal state, path type=" + type);
            }
            if ((type & PathPointType.CloseSubpath) != 0)
                regionPath.CloseSubpath ();
        }
    } */

    public equals(region: Region, g: Graphics): boolean {
        if (region == null) {
            throw new ArgumentNullException("region");
        }
        if (g == null) {
            throw new ArgumentNullException("g");
        }

        // Region.NotImplemented (MethodBase.GetCurrentMethod ());
        return this === region;  //ReferenceEquals (this, region);
    }

    public clone(): Region {
        return new Region(this);
    }

    public static Copy(src: Paths): Paths {
        const dst = new List<List<any>>(/*src.Capacity*/);
        foreach(src, (path: Path) => {
            dst.Add(new List<any>(path));
        });
        return dst;
    }

    public static Copy1(src: List<RegionEntry>): List<RegionEntry> {
        const dst = new List<RegionEntry>(/*src.Capacity*/);
        foreach(src, (r: RegionEntry) => {
            const re: RegionEntry = new RegionEntry();
            re.regionType = r.regionType,
                re.regionClipType = r.regionClipType,
                re.regionPath = Region.Copy(r.regionPath),
                re.regionObject = Region.CopyRegionObject(r.regionObject)
            dst.Add(re);
        });
        return dst;
    }

    public static CopyRegionObject(src: CGRectangle | GraphicsPath): CGRectangle | GraphicsPath {
        if (src instanceof CGRectangle)
            return src;
        if (src instanceof GraphicsPath)
            return src.Clone();

        console.log("Unexpected type of regionObject ({src.GetType().Name})");
        return src;
    }

    public getBounds(): CGRectangle
    public getBounds(g: Graphics): CGRectangle
    public getBounds(g?: Graphics): CGRectangle {
        if (arguments.length === 1) {
            if (g == null) {
                throw new ArgumentNullException('graphics is null');
            }
            Region.NotImplemented('getBounds');
            return this.getBounds();
        } else {
            return this.regionBounds;
        }
    }

    public makeInfinite(): void {
        this.regionObject = Region.infinite;

        const path: Path = Region.RectangleToPath(Region.infinite);

        // clear out our containers.
        this.regionList.Clear();
        this.solution.Clear();

        this.solution.Add(path);
        this.regionList.Add(new RegionEntry(RegionType.Infinity, Region.infinite, path,RegionClipType.None));

        this.regionPath = new GraphicsPath();
        this.regionPath.addLines([
            new CGPoint(Region.infinite.Left, Region.infinite.Top),
            new CGPoint(Region.infinite.Right, Region.infinite.Top),
            new CGPoint(Region.infinite.Right, Region.infinite.Bottom),
            new CGPoint(Region.infinite.Left, Region.infinite.Bottom)
        ]);
        this.regionBounds = this.regionPath.getBounds();
    }

    public makeEmpty(): void {
        this.regionObject = CGRectangle.Empty;

        const path: Path = Region.RectangleToPath(CGRectangle.Empty);

        // clear out our containers.
        this.regionList.Clear();
        this.solution.Clear();

        this.solution.Add(path);
        this.regionList.Add(new RegionEntry(RegionType.Empty, CGRectangle.Empty, path,RegionClipType.None));

        this.regionPath = new GraphicsPath();

        this.regionBounds = CGRectangle.Empty;
    }

    public transform(matrix: Matrix): void {
        if (!this.regionPath.IsEmpty && !this.regionBounds.Equals(Region.infinite)) {
            foreach(this.solution, (path: Path) => {
                for (let p = 0; p < path.Count; p++) {
                    const point: Out<any> = newOutEmpty();
                    point.value = path[p];
                    Region.TransformIntPoint(point, matrix);
                    path[p] = point.value;
                }
            });


            this.pathsToInternalPath(this.solution);

        }
    }
    private static TransformIntPoint(point: Out<any>, matrix: Matrix): void {
        const transform: CGAffineTransform = matrix.transform;
        const x: number = point.value.X / Region.scale;
        const y: number = point.value.Y / Region.scale;

        point.value.X = Math.round(((transform.m[0] * x + transform.m[2] * y + transform.m[4]) * Region.scale));
        point.value.Y = Math.round(((transform.m[1] * x + transform.m[3] * y + transform.m[5]) * Region.scale));

    }

    public translate(dx: float, dy: float): void {
        const translateMatrix: Matrix = new Matrix(CGAffineTransform.MakeTranslation(dx, dy));
        this.transform(translateMatrix);

    }

    public intersect(path: GraphicsPath): void;
    public intersect(region: Region): void;
    public intersect(rect: CGRectangle): void;
    public intersect(...args: any[]): void {

        if (args.length === 1 && args[0] instanceof CGRectangle) {
            const rect: CGRectangle = args[0];
            this.regionList.Add(new RegionEntry(RegionType.Rectangle, rect, Region.RectangleToPath(rect), RegionClipType.Intersection));
            this.calculateRegionPath(ClipType.ctIntersection);
        } else if (args.length === 1 && args[0] instanceof Region) {
            const region: Region = args[0];
            this.regionList.Add(new RegionEntry(RegionType.Rectangle, region.solution, region.solution, RegionClipType.Intersection));
            this.calculateRegionPath(ClipType.ctIntersection);
        } else if (args.length === 1 && args[0] instanceof GraphicsPath) {
            const path: GraphicsPath = args[0];
            const region: Region = new Region(path);
            this.intersect(region);
            region.dispose();
        }
    }

    public dispose(): void {

    }

    public union(rect: CGRectangle): void;
    public union(region: Region): void;
    public union(path: GraphicsPath): void;
    public union(...args: any[]): void {
        if (args.length === 1 && args[0] instanceof CGRectangle) {
            const rect: CGRectangle = args[0];
            this.regionList.Add(new RegionEntry(RegionType.Rectangle, rect, Region.RectangleToPath(rect), RegionClipType.Union));
            this.calculateRegionPath(ClipType.ctUnion);
        } else if (args.length === 1 && args[0] instanceof Region) {
            const region: Region = args[0];
            this.regionList.Add(new RegionEntry(RegionType.Path, region.solution, region.solution, RegionClipType.Union));
            this.calculateRegionPath(ClipType.ctUnion);
        } else if (args.length === 1 && args[0] instanceof GraphicsPath) {
            const path: GraphicsPath = args[0];
            const region: Region = new Region(path);
            this.union(region);
            region.dispose();
        }
    }

    public xor(rect: CGRectangle): void;
    public xor(region: Region): void;
    public xor(path: GraphicsPath): void;
    public xor(...args: any[]): void {
        if (args.length === 1 && args[0] instanceof CGRectangle) {
            const rect: CGRectangle = args[0];
            this.regionList.Add(new RegionEntry(RegionType.Rectangle, rect, Region.RectangleToPath(rect), RegionClipType.Xor));
            this.calculateRegionPath(ClipType.ctXor);
        } else if (args.length === 1 && args[0] instanceof Region) {
            const region: Region = args[0];
            this.regionList.Add(new RegionEntry(RegionType.Path, region.solution, region.solution, RegionClipType.Xor));
            this.calculateRegionPath(ClipType.ctXor);
        } else if (args.length === 1 && args[0] instanceof GraphicsPath) {
            const path: GraphicsPath = args[0];
            const region: Region = new Region(path);
            this.union(region);
            region.dispose();
        }
    }

    public exclude(rect: CGRectangle): void;
    public exclude(region: Region): void;
    public exclude(path: GraphicsPath): void;
    public exclude(...args: any[]): void {
        if (args.length === 1 && args[0] instanceof CGRectangle) {
            const rect: CGRectangle = args[0];
            this.regionList.Add(new RegionEntry(RegionType.Rectangle, rect, Region.RectangleToPath(rect), RegionClipType.Difference));
            this.calculateRegionPath(ClipType.ctDifference);
        } else if (args.length === 1 && args[0] instanceof Region) {
            const region: Region = args[0];
            this.regionList.Add(new RegionEntry(RegionType.Path, region.solution, region.solution, RegionClipType.Difference));
            this.calculateRegionPath(ClipType.ctDifference);
        } else if (args.length === 1 && args[0] instanceof GraphicsPath) {
            const path: GraphicsPath = args[0];
            const region: Region = new Region(path);
            this.union(region);
            region.dispose();
        }
    }

    private calculateRegionPath(clipType: any): void {
        const c: any = new Clipper();

        const subjects: Paths = this.solution;
        //subjects.Add (solution);

        const clips: Paths = new List<List<ClipPoint>>();

        foreach(this.regionList[this.regionList.Count - 1].regionPath, (path: Path) => {
            clips.Add(path);
        });

        c.AddPolygons(subjects, PolyType.ptSubject);
        c.AddPolygons(clips, PolyType.ptClip);

        this.solution.Clear();

        const succeeded: boolean = c.Execute(clipType, this.solution, Region.SUBJ_FILL_TYPE, Region.CLIP_FILL_TYPE);

        if (succeeded) {
            this.pathsToInternalPath(this.solution);

            // Not sure what this is returning
            //				var bounds = c.GetBounds ();
            //				regionBounds.X = bounds.left / scale;
            //				regionBounds.Y = bounds.top / scale;
            //				regionBounds.Width = (bounds.right - bounds.left) / scale;
            //				regionBounds.Height = (bounds.bottom - bounds.top) / scale;

            if (this.regionPath.IsEmpty)
                this.regionBounds = CGRectangle.Empty;
            else
                this.regionBounds = this.regionPath.getBounds();
        }

    }

    private pathsToInternalPath(paths: Paths): void {

        this.regionPath = new GraphicsPath();

        foreach(this.solution, (poly: Path) => {
            const points: CGPoint[] = [];

            for (let p = 0; p < poly.Count; p++) {
                points.push(Region.IntPointToPointF(poly[p]));
            }

            this.regionPath.addLines(points);
        });
    }

    public isInfinite(g: Graphics): boolean {
        return this.regionBounds.Equals(Region.infinite);
    }

    public isVisible(x: float, y: float): boolean;
    public isVisible(point: CGPoint): boolean;
    public isVisible(...args: any[]): boolean {
        // TODO: implement pointInPolygon algoritm

        // eoFill - A Boolean value that, if true, specifies to use the even-odd fill rule to evaluate
        // the painted region of the path. If false, the winding fill rule is used.
        //return regionPath.ContainsPoint (point.ToCGPoint (), EVEN_ODD_FILL);

        return false;
    }

    public isEmpty(g: Graphics): boolean {
        // TODO :
        return this.regionPath.IsEmpty;
    }

    private static RectangleToPath(rect: CGRectangle): Path {
        const path: Path = new List<any>();

        path.Add(new ClipPoint(rect.Left * Region.scale, rect.Top * Region.scale));
        path.Add(new ClipPoint(rect.Right * Region.scale, rect.Top * Region.scale));
        path.Add(new ClipPoint(rect.Right * Region.scale, rect.Bottom * Region.scale));
        path.Add(new ClipPoint(rect.Left * Region.scale, rect.Bottom * Region.scale));
        path.Add(new ClipPoint(rect.Left * Region.scale, rect.Top * Region.scale));

        return path;
    }

    private static IntPointToPointF(point: any): CGPoint {
        return new CGPoint(point.X / Region.scale, point.Y / Region.scale);
    }

    public getRegionScans(matrix: Matrix): CGRectangle[] {
        if (matrix == null) {
            throw new ArgumentNullException(nameof(matrix));
        }
        Region.NotImplemented('getRegionScans');
        return [this.getBounds()];
    }

    private static NotImplemented(methodBase: string) {
        console.log("Not implemented:" + methodBase);
    }


}
