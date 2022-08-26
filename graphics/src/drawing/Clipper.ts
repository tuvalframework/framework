import { List, foreach , is, System} from '@tuval/core';
export type Path = List<ClipPoint>;
export type Paths = List<List<ClipPoint>>;

const Horizontal: number = -3.4E+38;
const Skip: number = -2;
const Unassigned: number = -1;
const Tolerance: number = 1.0E-20;
const ioReverseSolution: number = 1;
const ioStrictlySimple: number = 2;
const ioPreserveCollinear: number = 4;
const TwoPI = Math.PI * 2;
const DefArcTolerance = 0.25;

function fltEquals(a: number, b: number): boolean {
    return Math.abs(a - b) < Tolerance;
}

export enum ClipType {
    ctIntersection,
    ctUnion,
    ctDifference,
    ctXor
}

export enum PolyType {
    ptSubject,
    ptClip
}

export enum JoinType {
    jtSquare,
    jtRound,
    jtMiter
}

//By far the most widely used winding rules for polygon filling are
//EvenOdd & NonZero (GDI, GDI+, XLib, OpenGL, Cairo, AGG, Quartz, SVG, Gr32)
//Others rules include Positive, Negative and ABS_GTR_EQ_TWO (only in OpenGL)
//see http://glprogramming.com/red/chapter11.html
export enum PolyFillType {
    pftEvenOdd,
    pftNonZero,
    pftPositive,
    pftNegative
}

export enum EndType {
    etClosedPolygon,
    etClosedLine,
    etOpenButt,
    etOpenSquare,
    etOpenRound
}

enum EdgeSide {
    esLeft,
    esRight
}

enum Direction {
    dRightToLeft,
    dLeftToRight
}

enum NodeType {
    ntAny,
    ntOpen,
    ntClosed
}

export class ClipPoint {
    constructor(readonly x: number, readonly y: number) {
    }

    public equals(other: ClipPoint): boolean {
        return fltEquals(this.x, other.x)
            && fltEquals(this.y, other.y);
    }

    public notEquals(other: ClipPoint): boolean {
        return !fltEquals(this.x, other.x)
            || !fltEquals(this.y, other.y);
    }

    public static copy(other: ClipPoint): ClipPoint {
        return new ClipPoint(other.x, other.y);
    }
}

export class ClipRect {
    constructor(
        readonly left: number,
        readonly top: number,
        readonly right: number,
        readonly bottom: number) {
    }

    public static copy(other: ClipRect): ClipRect {
        return new ClipRect(other.left, other.top, other.right, other.bottom);
    }
}

export class PolyNode {
    public parent: PolyNode = null as any;
    public polygon: Path = new List<ClipPoint>();
    public index: number = 0;
    public joinType: JoinType = undefined as any;
    public endType: EndType = undefined as any;
    public children: Array<PolyNode> = new Array<PolyNode>();
    public isOpen: boolean = false;

    public get isHole(): boolean {
        let result = true;
        let node = this.parent;
        while (node != null) {
            result = !result;
            node = node.parent;
        }
        return result;
    }

    public get childCount(): number {
        return this.children.length;
    }

    public get contour(): Path {
        return this.polygon;
    }

    public addChild(child: PolyNode): void {
        child.parent = this;
        child.index = this.children.length;
        this.children.push(child);
    }

    public get next(): PolyNode {
        if (this.children.length > 0) {
            return this.children[0];
        }
        return this.nextSiblingUp;
    }

    public get nextSiblingUp(): PolyNode {
        if (this.parent == null) {
            return null as any;
        }
        if (this.index == this.parent.children.length - 1) {
            return this.parent.nextSiblingUp;
        }
        return this.parent.children[this.index + 1];
    }
}

export class PolyTree extends PolyNode {
    public allPolys: Array<PolyNode> = new Array<PolyNode>();

    public clear(): void {
        this.allPolys.length = 0;
        this.children.length = 0;
    }

    public get first(): PolyNode {
        if (this.children.length > 0) {
            return this.children[0];
        }
        return null as any;
    }

    public get total(): number {
        let result = this.allPolys.length;
        //with negative offsets, ignore the hidden outer polygon ...
        if (result > 0 && this.children[0] != this.allPolys[0]) {
            result--;
        }
        return result;
    }
}

class TEdge {
    public bot: ClipPoint = undefined as any;
    public curr: ClipPoint = undefined as any;; //current (updated for every new scanbeam)
    public top: ClipPoint = undefined as any;;
    public delta: ClipPoint = undefined as any;;

    public dx: number = 0;
    public polyTyp: PolyType = undefined as any;
    public side: EdgeSide = undefined as any; //side only refers to current side of solution poly
    public windDelta: number = 0; //1 or -1 depending on winding direction
    public windCnt: number = 0;
    public windCnt2: number = 0; //winding count of the opposite polytype
    public outIdx: number = 0;

    public next: TEdge = null as any;
    public prev: TEdge = null as any;

    public nextInLML: TEdge = null as any;

    public nextInAEL: TEdge = null as any;
    public prevInAEL: TEdge = null as any;

    public nextInSEL: TEdge = null as any;
    public prevInSEL: TEdge = null as any;
}

class IntersectNode {
    constructor(readonly edge1: TEdge,
        readonly edge2: TEdge,
        readonly pt: ClipPoint) {
    }
}

class LocalMinima {
    public next: LocalMinima;

    constructor(
        readonly y: number,
        public leftBound: TEdge,
        public rightBound: TEdge) {
        this.next = null as any;
    }

    public clearLeftBound(): void {
        this.leftBound = null as any;
    }

    public clearRightBound(): void {
        this.rightBound = null as any;
    }
}

class Scanbeam {
    public next: Scanbeam;
    constructor(
        readonly y: number) {
        this.next = null as any;
    }
}

class Maxima {
    public next: Maxima = null as any;
    public prev: Maxima = null as any;

    constructor(readonly x: number) {
        this.next = null as any;
        this.prev = null as any;
    }
}

class OutPt {
    public idx: number = 0;
    public pt: ClipPoint = undefined as any;

    public next: OutPt = null as any;
    public prev: OutPt = null as any;
}

//OutRec: contains a path in the clipping solution. Edges in the AEL will
//carry a pointer to an OutRec when they are part of the clipping solution.
class OutRec {
    idx: number;
    isHole: boolean;
    isOpen: boolean;
    firstLeft: OutRec; //see comments in clipper.pas
    pts: OutPt;
    bottomPt: OutPt;
    polyNode: PolyNode;

    constructor() {
        this.idx = Unassigned;
        this.isHole = false;
        this.isOpen = false;
        this.firstLeft = null as any;
        this.pts = null as any;
        this.bottomPt = null as any;
        this.polyNode = null as any;
    }
}

class Join {
    constructor(
        public outPt1: OutPt,
        public outPt2: OutPt,
        public offPt: ClipPoint) {
    }
}

function MyIntersectNodeSort(node1: IntersectNode, node2: IntersectNode): number {
    return node2.pt.y - node1.pt.y;
}

function NearZero(val: number): boolean {
    return Math.abs(val) < Tolerance;
}

function IsHorizontal(e: TEdge): boolean {
    return NearZero(e.delta.y);
}

function PointIsVertex(pt: ClipPoint, pp: OutPt): boolean {
    let pp2 = pp;
    do {
        if (pp2.pt.equals(pt)) {
            return true;
        }
        pp2 = pp2.next;
    } while (pp2 != pp);
    return false;
}

function PointOnLineSegment(
    pt: ClipPoint,
    linePt1: ClipPoint,
    linePt2: ClipPoint): boolean {

    return (fltEquals(pt.x, linePt1.x) && fltEquals(pt.y, linePt1.y))
        || (fltEquals(pt.x, linePt2.x) && fltEquals(pt.y, linePt2.y))
        || ((pt.x > linePt1.x) == (pt.x < linePt2.x)
            && (pt.y > linePt1.y) == (pt.y < linePt2.y)
            && fltEquals((pt.x - linePt1.x) * (linePt2.y - linePt1.y),
                (linePt2.x - linePt1.x) * (pt.y - linePt1.y)));
}

function PointOnPolygon(pt: ClipPoint, pp: OutPt): boolean {
    let pp2 = pp;
    do {
        if (PointOnLineSegment(pt, pp2.pt, pp2.next.pt)) {
            return true;
        }
        pp2 = pp2.next;
    } while (pp2 != pp);
    return false;
}

function SlopesEqual2E(e1: TEdge, e2: TEdge): boolean {
    return fltEquals(e1.delta.y * e2.delta.x,
        e1.delta.x * e2.delta.y);
}

function SlopesEqual3P(pt1: ClipPoint, pt2: ClipPoint, pt3: ClipPoint): boolean {
    return fltEquals((pt1.y - pt2.y) * (pt2.x - pt3.x),
        (pt1.x - pt2.x) * (pt2.y - pt3.y));
}

function SlopesEqual4P(
    pt1: ClipPoint, pt2: ClipPoint,
    pt3: ClipPoint, pt4: ClipPoint): boolean {
    return fltEquals((pt1.y - pt2.y) * (pt3.x - pt4.x),
        (pt1.x - pt2.x) * (pt3.y - pt4.y));
}

function SetDx(e: TEdge): void {
    let dx = e.top.x - e.bot.x;
    let dy = e.top.y - e.bot.y;
    e.delta = new ClipPoint(dx, dy);
    if (NearZero(dy)) {
        e.dx = Horizontal;
    } else {
        e.dx = e.delta.x / e.delta.y;
    }
}

function InitEdge(
    e: TEdge, eNext: TEdge, ePrev: TEdge, pt: ClipPoint): void {
    e.next = eNext;
    e.prev = ePrev;
    e.curr = new ClipPoint(pt.x, pt.y);
    e.outIdx = Unassigned;
}

function InitEdge2(e: TEdge, polyType: PolyType): void {
    if (e.curr.y >= e.next.curr.y) {
        e.bot = new ClipPoint(e.curr.x, e.curr.y);
        e.top = new ClipPoint(e.next.curr.x, e.next.curr.y);
    } else {
        e.top = new ClipPoint(e.curr.x, e.curr.y);
        e.bot = new ClipPoint(e.next.curr.x, e.next.curr.y);
    }
    SetDx(e);
    e.polyTyp = polyType;
}

function FindNextLocMin(e: TEdge): TEdge {
    let e2: TEdge;
    for (; ;) {
        while (e.bot.notEquals(e.prev.bot) || e.curr.equals(e.top)) {
            e = e.next;
        }
        if (e.dx != Horizontal && e.prev.dx != Horizontal) {
            break;
        }
        while (e.prev.dx == Horizontal) {
            e = e.prev;
        }
        e2 = e;
        while (e.dx == Horizontal) {
            e = e.next;
        }
        if (fltEquals(e.top.y, e.prev.bot.y)) {
            continue; //ie just an intermediate horz.
        }
        if (e2.prev.bot.x < e.bot.x) {
            e = e2;
        }
        break;
    }
    return e;
}

function Pt2IsBetweenPt1AndPt3(pt1: ClipPoint, pt2: ClipPoint, pt3: ClipPoint): boolean {
    if (pt1.equals(pt3) || pt1.equals(pt2) || pt3.equals(pt2)) {
        return false;
    }
    if (!fltEquals(pt1.x, pt3.x)) {
        return (pt2.x > pt1.x) == (pt2.x < pt3.x);
    }
    return (pt2.y > pt1.y) == (pt2.y < pt3.y);
}

function RemoveEdge(e: TEdge): TEdge {
    //removes e from double_linked_list (but without removing from memory)
    e.prev.next = e.next;
    e.next.prev = e.prev;
    let result = e.next;
    e.prev = null as any; //flag as removed (see ClipperBase.Clear)
    return result;
}

function ReverseHorizontal(e: TEdge): void {
    //swap horizontal edges' top and bottom x's so they follow the natural
    //progression of the bounds - ie so their xbots will align with the
    //adjoining lower edge. [Helpful in the ProcessHorizontal() method.]
    let top = new ClipPoint(e.bot.x, e.top.y);
    let bot = new ClipPoint(e.top.x, e.bot.y);
    e.top = top;
    e.bot = bot;
}

function TopX(edge: TEdge, currentY: number): number {
    if (fltEquals(currentY, edge.top.y)) {
        return edge.top.x;
    }
    return edge.bot.x + edge.dx * (currentY - edge.bot.y);
}

function E2InsertsBeforeE1(e1: TEdge, e2: TEdge): boolean {
    if (fltEquals(e2.curr.x, e1.curr.x)) {
        if (e2.top.y > e1.top.y) {
            return e2.top.x < TopX(e1, e2.top.y);
        }
        return e1.top.x > TopX(e2, e1.top.y);
    }
    return e2.curr.x < e1.curr.x;
}

function HorzSegmentsOverlap(
    s1a: number, s1b: number, s2a: number, s2b: number): boolean {
    if (s1a > s1b) {
        let t = s1b;
        s1b = s1a;
        s1a = t;
    }
    if (s2a > s2b) {
        let t = s2b;
        s2b = s2a;
        s2a = t;
    }
    return (s1a < s2b) && (s2a < s1b);
}

function GetDx(pt1: ClipPoint, pt2: ClipPoint): number {
    if (fltEquals(pt1.y, pt2.y)) {
        return Horizontal;
    }
    return (pt2.x - pt1.x) / (pt2.y - pt1.y);
}

function FirstIsBottomPt(btmPt1: OutPt, btmPt2: OutPt): boolean {
    let p = btmPt1.prev;
    while (p.pt.equals(btmPt1.pt) && p != btmPt1) {
        p = p.prev;
    }
    let dx1p = Math.abs(GetDx(btmPt1.pt, p.pt));
    p = btmPt1.next;
    while (p.pt.equals(btmPt1.pt) && p != btmPt1) {
        p = p.next;
    }
    let dx1n = Math.abs(GetDx(btmPt1.pt, p.pt));

    p = btmPt2.prev;
    while (p.pt.equals(btmPt2.pt) && p != btmPt2) {
        p = p.prev;
    }
    let dx2p = Math.abs(GetDx(btmPt2.pt, p.pt));
    p = btmPt2.next;
    while (p.pt.equals(btmPt2.pt) && p != btmPt2) {
        p = p.next;
    }
    let dx2n = Math.abs(GetDx(btmPt2.pt, p.pt));

    if (Math.max(dx1p, dx1n) == Math.max(dx2p, dx2n)
        && Math.min(dx1p, dx1n) == Math.min(dx2p, dx2n)) {
        return this.Area(btmPt1) > 0; //if otherwise identical use orientation
    }
    return (dx1p >= dx2p && dx1p >= dx2n) || (dx1n >= dx2p && dx1n >= dx2n);
}

function GetBottomPt(pp: OutPt): OutPt {
    let dups: OutPt = null as any;
    let p = pp.next;
    while (p != pp) {
        if (p.pt.y > pp.pt.y) {
            pp = p;
            dups = null as any;
        } else if (fltEquals(p.pt.y, pp.pt.y) && p.pt.x <= pp.pt.x) {
            if (p.pt.x < pp.pt.x) {
                dups = null as any;
                pp = p;
            } else {
                if (p.next != pp && p.prev != pp) {
                    dups = p;
                }
            }
        }
        p = p.next;
    }
    if (dups != null) {
        //there appears to be at least 2 vertices at bottomPt so ...
        while (dups != p) {
            if (!FirstIsBottomPt(p, dups)) {
                pp = dups;
            }
            dups = dups.next;
            while (dups.pt.notEquals(pp.pt)) {
                dups = dups.next;
            }
        }
    }
    return pp;
}

function GetLowermostRec(outRec1: OutRec, outRec2: OutRec): OutRec {
    //work out which polygon fragment has the correct hole state ...
    if (outRec1.bottomPt == null) {
        outRec1.bottomPt = GetBottomPt(outRec1.pts);
    }
    if (outRec2.bottomPt == null) {
        outRec2.bottomPt = GetBottomPt(outRec2.pts);
    }
    let bPt1 = outRec1.bottomPt;
    let bPt2 = outRec2.bottomPt;
    if (bPt1.pt.y > bPt2.pt.y) {
        return outRec1;
    } else if (bPt1.pt.y < bPt2.pt.y) {
        return outRec2;
    } else if (bPt1.pt.x < bPt2.pt.x) {
        return outRec1;
    } else if (bPt1.pt.x > bPt2.pt.x) {
        return outRec2;
    } else if (bPt1.next == bPt1) {
        return outRec2;
    } else if (bPt2.next == bPt2) {
        return outRec1;
    } else if (FirstIsBottomPt(bPt1, bPt2)) {
        return outRec1;
    }
    return outRec2;
}

function OutRec1RightOfOutRec2(outRec1: OutRec, outRec2: OutRec): boolean {
    do {
        outRec1 = outRec1.firstLeft;
        if (outRec1 == outRec2) {
            return true;
        }
    } while (outRec1 != null);
    return false;
}

function ReversePolyPtLinks(pp: OutPt): void {
    if (pp == null) {
        return;
    }
    let pp1: OutPt;
    let pp2: OutPt;
    pp1 = pp;
    do {
        pp2 = pp1.next;
        pp1.next = pp1.prev;
        pp1.prev = pp2;
        pp1 = pp2;
    } while (pp1 != pp);
}

function SwapSides(edge1: TEdge, edge2: TEdge): void {
    let side = edge1.side;
    edge1.side = edge2.side;
    edge2.side = side;
}

function SwapPolyIndexes(edge1: TEdge, edge2: TEdge): void {
    let outIdx = edge1.outIdx;
    edge1.outIdx = edge2.outIdx;
    edge2.outIdx = outIdx;
}

function GetHorzDirection(horzEdge: TEdge): { Dir: Direction, Left: number, Right: number } {
    if (horzEdge.bot.x < horzEdge.top.x) {
        return {
            Left: horzEdge.bot.x,
            Right: horzEdge.top.x,
            Dir: Direction.dLeftToRight
        };
    } else {
        return {
            Left: horzEdge.top.x,
            Right: horzEdge.bot.x,
            Dir: Direction.dRightToLeft
        };
    }
}

function GetNextInAEL(e: TEdge, direction: Direction): TEdge {
    return direction == Direction.dLeftToRight ? e.nextInAEL : e.prevInAEL;
}

function IsMinima(e: TEdge): boolean {
    return e != null
        && e.prev.nextInLML != e
        && e.next.nextInLML != e;
}

function IsMaxima(e: TEdge, y: number): boolean {
    return e != null
        && fltEquals(e.top.y, y)
        && e.nextInLML == null;
}

function IsIntermediate(e: TEdge, y: number): boolean {
    return fltEquals(e.top.y, y)
        && e.nextInLML != null;
}

function GetMaximaPair(e: TEdge): TEdge {
    if (e.next.top.equals(e.top) && e.next.nextInLML == null) {
        return e.next;
    } else if (e.prev.top.equals(e.top) && e.prev.nextInLML == null) {
        return e.prev;
    }
    return null as any;
}

function GetMaximaPairEx(e: TEdge): TEdge {
    //as above but returns null if MaxPair isn't in AEL (unless it's horizontal)
    let result = GetMaximaPair(e);
    if (result == null
        || result.outIdx == Skip
        || (result.nextInAEL == result.prevInAEL && !IsHorizontal(result))) {
        return null as any;
    }
    return result;
}

function IntersectPoint(edge1: TEdge, edge2: TEdge): ClipPoint {
    let b1: number;
    let b2: number;
    let ipx: number;
    let ipy: number;

    //nb: with very large coordinate values, it's possible for SlopesEqual() to
    //return false but for the edge.Dx value be equal due to double precision rounding.
    if (edge1.dx == edge2.dx) {
        ipy = edge1.curr.y;
        ipx = TopX(edge1, ipy);
        return new ClipPoint(ipx, ipy);
    }

    if (NearZero(edge1.delta.x)) {
        ipx = edge1.bot.x;
        if (IsHorizontal(edge2)) {
            ipy = edge2.bot.y;
        } else {
            b2 = edge2.bot.y - edge2.bot.x / edge2.dx;
            ipy = ipx / edge2.dx + b2;
        }
    } else if (NearZero(edge2.delta.x)) {
        ipx = edge2.bot.x;
        if (IsHorizontal(edge1)) {
            ipy = edge1.bot.y;
        } else {
            b1 = edge1.bot.y - edge1.bot.x / edge1.dx;
            ipy = ipx / edge1.dx + b1;
        }
    } else {
        b1 = edge1.bot.x - edge1.bot.y * edge1.dx;
        b2 = edge2.bot.x - edge2.bot.y * edge2.dx;
        let q = (b2 - b1) / (edge1.dx - edge2.dx);
        ipy = q;
        if (Math.abs(edge1.dx) < Math.abs(edge2.dx)) {
            ipx = edge1.dx * q + b1;
        } else {
            ipx = edge2.dx * q + b2;
        }
    }

    if (ipy < edge1.top.y || ipy < edge2.top.y) {
        if (edge1.top.y > edge2.top.y) {
            ipy = edge1.top.y;
        } else {
            ipy = edge2.top.y;
        }
        if (Math.abs(edge1.dx) < Math.abs(edge2.dx)) {
            ipx = TopX(edge1, ipy);
        } else {
            ipx = TopX(edge2, ipy);
        }
    }
    //finally, don't allow 'ip' to be BELOW curr.Y (ie bottom of scanbeam) ...
    if (ipy > edge1.curr.y) {
        ipy = edge1.curr.y;
        //better to use the more vertical edge to derive X ...
        if (Math.abs(edge1.dx) > Math.abs(edge2.dx)) {
            ipx = TopX(edge2, ipy);
        } else {
            ipx = TopX(edge1, ipy);
        }
    }
    return new ClipPoint(ipx, ipy);
}

function EdgesAdjacent(inode: IntersectNode): boolean {
    return (inode.edge1.nextInSEL == inode.edge2) ||
        (inode.edge1.prevInSEL == inode.edge2);
}

function IntersectNodeSort(node1: IntersectNode, node2: IntersectNode): number {
    //the following typecast is safe because the differences in Pt.Y will
    //be limited to the height of the scanbeam.
    return node2.pt.y - node1.pt.y;
}

function ReversePaths(polys: Paths): void {
    foreach(polys, (poly: List<ClipPoint>) => {
        poly.Reverse();
    });
}

function AreaPoly(poly: Path): number {
    let cnt = poly.Count;
    if (cnt < 3) {
        return 0;
    }
    let a = 0;
    for (let i = 0, j = cnt - 1; i < cnt; ++i) {
        a += (poly[j].x + poly[i].x) * (poly[j].y - poly[i].y);
        j = i;
    }
    return -a * 0.5;
}

function AreaOutRec(outRec: OutRec): number {
    return AreaOutPt(outRec.pts);
}

function AreaOutPt(op: OutPt): number {
    let opFirst = op;
    if (op == null) {
        return 0;
    }
    let a = 0;
    do {
        a += (op.prev.pt.x + op.pt.x) * (op.prev.pt.y - op.pt.y);
        op = op.next;
    } while (op != opFirst);
    return a * 0.5;
}

function Area(shape: OutPt | OutRec | Path): number {
    if (shape instanceof OutPt) {
        return AreaOutPt(shape);
    }
    if (shape instanceof OutRec) {
        return AreaOutRec(shape);
    }
    return AreaPoly(shape);
}

function Orientation(poly: Path): boolean {
    return Area(poly) >= 0;
}

function PointCount(pts: OutPt): number {
    if (pts == null) {
        return 0;
    }
    let result = 0;
    let p = pts;
    do {
        result++;
        p = p.next;
    } while (p != pts);
    return result;
}

function DupOutPt(outPt: OutPt, insertAfter: boolean): OutPt {
    let result = new OutPt();
    result.pt = new ClipPoint(outPt.pt.x, outPt.pt.y);
    result.idx = outPt.idx;
    if (insertAfter) {
        result.next = outPt.next;
        result.prev = outPt;
        outPt.next.prev = result;
        outPt.next = result;
    } else {
        result.prev = outPt.prev;
        result.next = outPt;
        outPt.prev.next = result;
        outPt.prev = result;
    }
    return result;
}

function GetOverlap(a1: number, a2: number, b1: number, b2: number): { r: boolean, Left: number, Right: number } {
    let Left: number;
    let Right: number;

    if (a1 < a2) {
        if (b1 < b2) {
            Left = Math.max(a1, b1);
            Right = Math.min(a2, b2);
        } else {
            Left = Math.max(a1, b2);
            Right = Math.min(a2, b1);
        }
    } else {
        if (b1 < b2) {
            Left = Math.max(a2, b1);
            Right = Math.min(a1, b2);
        } else {
            Left = Math.max(a2, b2);
            Right = Math.min(a1, b1);
        }
    }
    return {
        r: Left < Right,
        Left: Left,
        Right: Right
    };
}

function PointInPolygonPath(pt: ClipPoint, path: Path): number {
    //returns 0 if false, +1 if true, -1 if pt ON polygon boundary
    //See "The Point in Polygon Problem for Arbitrary Polygons" by Hormann & Agathos
    //http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.88.5498&rep=rep1&type=pdf
    let result = 0;
    let cnt = path.Count;
    if (cnt < 3) {
        return 0;
    }
    let ip = path[0];
    for (let i = 1; i <= cnt; ++i) {
        let ipNext = (i == cnt ? path[0] : path[i]);
        if (fltEquals(ipNext.y, pt.y)) {
            if (fltEquals(ipNext.x, pt.x)
                || (fltEquals(ip.y, pt.y)
                    && ((ipNext.x > pt.x) == (ip.x < pt.x)))) {
                return -1;
            }
        }

        if ((ip.y < pt.y) != (ipNext.y < pt.y)) {
            if (ip.x >= pt.x) {
                if (ipNext.x > pt.x) {
                    result = 1 - result;
                } else {
                    let d = (ip.x - pt.x) * (ipNext.y - pt.y) -
                        (ipNext.x - pt.x) * (ip.y - pt.y);
                    if (NearZero(d)) {
                        return -1;
                    }
                    if ((d > 0) == (ipNext.y > ip.y)) {
                        result = 1 - result;
                    }
                }
            } else {
                if (ipNext.x > pt.x) {
                    let d = (ip.x - pt.x) * (ipNext.y - pt.y) -
                        (ipNext.x - pt.x) * (ip.y - pt.y);
                    if (NearZero(d)) {
                        return -1;
                    }
                    if ((d > 0) == (ipNext.y > ip.y)) {
                        result = 1 - result;
                    }
                }
            }
        }
        ip = ipNext;
    }
    return result;
}

//See "The Point in Polygon Problem for Arbitrary Polygons" by Hormann & Agathos
//http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.88.5498&rep=rep1&type=pdf
function PointInPolygonOutPt(pt: ClipPoint, op: OutPt): number {
    //returns 0 if false, +1 if true, -1 if pt ON polygon boundary
    let result = 0;
    let startOp = op;
    let ptx = pt.x;
    let pty = pt.y;
    let poly0x = op.pt.x;
    let poly0y = op.pt.y;
    do {
        op = op.next;
        let poly1x = op.pt.x;
        let poly1y = op.pt.y;

        if (fltEquals(poly1y, pty)) {
            if (fltEquals(poly1x, ptx)
                || (fltEquals(poly0y, pty) && ((poly1x > ptx) == (poly0x < ptx)))) {
                return -1;
            }
        }
        if ((poly0y < pty) != (poly1y < pty)) {
            if (poly0x >= ptx) {
                if (poly1x > ptx) {
                    result = 1 - result;
                } else {
                    let d = (poly0x - ptx) * (poly1y - pty) -
                        (poly1x - ptx) * (poly0y - pty);
                    if (d == 0) {
                        return -1;
                    }
                    if ((d > 0) == (poly1y > poly0y)) {
                        result = 1 - result;
                    }
                }
            } else {
                if (poly1x > ptx) {
                    let d = (poly0x - ptx) * (poly1y - pty) -
                        (poly1x - ptx) * (poly0y - pty);
                    if (d == 0) {
                        return -1;
                    }
                    if ((d > 0) == (poly1y > poly0y)) {
                        result = 1 - result;
                    }
                }
            }
        }
        poly0x = poly1x;
        poly0y = poly1y;
    } while (startOp != op);
    return result;
}

function PointInPolygon(pt: ClipPoint, shape: OutPt | Path): number {
    if (shape instanceof OutPt) {
        return PointInPolygonOutPt(pt, shape);
    }
    return PointInPolygonPath(pt, shape);
}

function Poly2ContainsPoly1(outPt1: OutPt, outPt2: OutPt): boolean {
    let op = outPt1;
    do {
        //nb: PointInPolygon returns 0 if false, +1 if true, -1 if pt on polygon
        let res = PointInPolygon(op.pt, outPt2);
        if (res >= 0) {
            return res > 0;
        }
        op = op.next;
    } while (op != outPt1);
    return true;
}

function ParseFirstLeft(firstLeft: OutRec): OutRec {
    while (firstLeft != null && firstLeft.pts == null) {
        firstLeft = firstLeft.firstLeft;
    }
    return firstLeft;
}

function UpdateOutPtIdxs(outrec: OutRec): void {
    let op = outrec.pts;
    do {
        op.idx = outrec.idx;
        op = op.prev;
    } while (op != outrec.pts);
}

function DistanceSqrd(pt1: ClipPoint, pt2: ClipPoint): number {
    let dx = pt1.x - pt2.x;
    let dy = pt1.y - pt2.y;
    return dx * dx + dy * dy;
}

function DistanceFromLineSqrd(pt: ClipPoint, ln1: ClipPoint, ln2: ClipPoint): number {
    //The equation of a line in general form (Ax + By + C = 0)
    //given 2 points (x¹,y¹) & (x²,y²) is ...
    //(y¹ - y²)x + (x² - x¹)y + (y² - y¹)x¹ - (x² - x¹)y¹ = 0
    //A = (y¹ - y²); B = (x² - x¹); C = (y² - y¹)x¹ - (x² - x¹)y¹
    //perpendicular distance of point (x³,y³) = (Ax³ + By³ + C)/Sqrt(A² + B²)
    //see http://en.wikipedia.org/wiki/Perpendicular_distance
    let A = ln1.y - ln2.y;
    let B = ln2.x - ln1.x;
    let C = A * ln1.x + B * ln1.y;
    C = A * pt.x + B * pt.y - C;
    return (C * C) / (A * A + B * B);
}

function SlopesNearCollinear(pt1: ClipPoint, pt2: ClipPoint, pt3: ClipPoint, distSqrd: number): boolean {
    //this function is more accurate when the point that's GEOMETRICALLY
    //between the other 2 points is the one that's tested for distance.
    //nb: with 'spikes', either pt1 or pt3 is geometrically between the other pts
    if (Math.abs(pt1.x - pt2.x) > Math.abs(pt1.y - pt2.y)) {
        if ((pt1.x > pt2.x) == (pt1.x < pt3.x)) {
            return DistanceFromLineSqrd(pt1, pt2, pt3) < distSqrd;
        } else if ((pt2.x > pt1.x) == (pt2.x < pt3.x)) {
            return DistanceFromLineSqrd(pt2, pt1, pt3) < distSqrd;
        }
        return DistanceFromLineSqrd(pt3, pt1, pt2) < distSqrd;
    }
    if ((pt1.y > pt2.y) == (pt1.y < pt3.y)) {
        return DistanceFromLineSqrd(pt1, pt2, pt3) < distSqrd;
    } else if ((pt2.y > pt1.y) == (pt2.y < pt3.y)) {
        return DistanceFromLineSqrd(pt2, pt1, pt3) < distSqrd;
    }
    return DistanceFromLineSqrd(pt3, pt1, pt2) < distSqrd;
}

function PointsAreClose(pt1: ClipPoint, pt2: ClipPoint, distSqrd: number): boolean {
    return DistanceSqrd(pt1, pt2) <= distSqrd;
}

function ExcludeOp(op: OutPt): OutPt {
    let result = op.prev;
    result.next = op.next;
    op.next.prev = result;
    result.idx = 0;
    return result;
}

function XOR(a: boolean, b: boolean): boolean {
    return (a || b) && !(a && b);
}

function GetUnitNormal(pt1: ClipPoint, pt2: ClipPoint): ClipPoint {
    let dx = pt2.x - pt1.x;
    let dy = pt2.y - pt1.y;
    if (dx == 0 && dy == 0) {
        return new ClipPoint(0, 0);
    }

    let f = 1 * 1.0 / Math.sqrt(dx * dx + dy * dy);
    dx *= f;
    dy *= f;

    return new ClipPoint(dy, -dx);
}

class ClipperBase {
    m_MinimaList: LocalMinima;
    m_CurrentLM: LocalMinima;
    m_edges: Array<Array<TEdge>> = new Array<Array<TEdge>>();
    m_Scanbeam: Scanbeam = undefined as any;
    m_PolyOuts: Array<OutRec> = undefined as any;
    m_ActiveEdges: TEdge = undefined as any;
    m_HasOpenPaths: boolean = false;
    PreserveCollinear: boolean = false;

    constructor() {
        this.m_MinimaList = null as any;
        this.m_CurrentLM = null as any;
        this.m_HasOpenPaths = false;
    }

    protected Clear(): void {
        this.DisposeLocalMinimaList();
        this.m_edges.length = 0;
        this.m_HasOpenPaths = false;
    }

    private DisposeLocalMinimaList(): void {
        this.m_MinimaList = null as any;
        this.m_CurrentLM = null as any;
    }

    private InsertLocalMinima(newLm: LocalMinima): void {
        if (this.m_MinimaList == null) {
            this.m_MinimaList = newLm;
        } else if (newLm.y >= this.m_MinimaList.y) {
            newLm.next = this.m_MinimaList;
            this.m_MinimaList = newLm;
        } else {
            let tmpLm = this.m_MinimaList;
            while (tmpLm.next != null && newLm.y < tmpLm.next.y) {
                tmpLm = tmpLm.next;
            }
            newLm.next = tmpLm.next;
            tmpLm.next = newLm;
        }
    }

    protected PopLocalMinima(Y: number): LocalMinima {
        let current = this.m_CurrentLM;
        if (this.m_CurrentLM != null && fltEquals(this.m_CurrentLM.y, Y)) {
            this.m_CurrentLM = this.m_CurrentLM.next;
            return current;
        }
        return null as any;
    }

    private ProcessBound(E: TEdge, LeftBoundIsForward: boolean): TEdge {
        let EStart: TEdge;
        let Result = E;
        let Horz: TEdge;

        if (Result.outIdx == Skip) {
            //check if there are edges beyond the skip edge in the bound and if so
            //create another LocMin and calling ProcessBound once more ...
            E = Result;
            if (LeftBoundIsForward) {
                while (fltEquals(E.top.y, E.next.bot.y)) {
                    E = E.next;
                }
                while (E != Result && E.dx == Horizontal) {
                    E = E.prev;
                }
            } else {
                while (fltEquals(E.top.y, E.prev.bot.y)) {
                    E = E.prev;
                }
                while (E != Result && E.dx == Horizontal) {
                    E = E.next;
                }
            }
            if (E == Result) {
                Result = LeftBoundIsForward ? E.next : E.prev;
            } else {
                //there are more edges in the bound beyond result starting with E
                E = LeftBoundIsForward ? Result.next : Result.prev;
                let locMin = new LocalMinima(E.bot.y, null as any, E);
                E.windDelta = 0;
                Result = this.ProcessBound(E, LeftBoundIsForward);
                this.InsertLocalMinima(locMin);
            }
            return Result;
        }

        if (E.dx == Horizontal) {
            //We need to be careful with open paths because this may not be a
            //true local minima (ie E may be following a skip edge).
            //Also, consecutive horz. edges may start heading left before going right.
            EStart = LeftBoundIsForward ? E.prev : E.next;
            if (EStart.dx == Horizontal) {//ie an adjoining horizontal skip edge
                if (!fltEquals(EStart.bot.x, E.bot.x)
                    && !fltEquals(EStart.top.x, E.bot.x)) {
                    ReverseHorizontal(E);
                }
            } else if (!fltEquals(EStart.bot.x, E.bot.x)) {
                ReverseHorizontal(E);
            }
        }

        EStart = E;
        if (LeftBoundIsForward) {
            while (fltEquals(Result.top.y, Result.next.bot.y)
                && Result.next.outIdx != Skip) {
                Result = Result.next;
            }

            if (Result.dx == Horizontal && Result.next.outIdx != Skip) {
                //nb: at the top of a bound, horizontals are added to the bound
                //only when the preceding edge attaches to the horizontal's left vertex
                //unless a Skip edge is encountered when that becomes the top divide
                Horz = Result;
                while (Horz.prev.dx == Horizontal) {
                    Horz = Horz.prev;
                }
                if (Horz.prev.top.x > Result.next.top.x) {
                    Result = Horz.prev;
                }
            }

            while (E != Result) {
                E.nextInLML = E.next;
                if (E.dx == Horizontal && E != EStart && !fltEquals(E.bot.x, E.prev.top.x)) {
                    ReverseHorizontal(E);
                }
                E = E.next;
            }

            if (E.dx == Horizontal && E != EStart && !fltEquals(E.bot.x, E.prev.top.x)) {
                ReverseHorizontal(E);
            }
            Result = Result.next; //move to the edge just beyond current bound
        } else {
            while (fltEquals(Result.top.y, Result.prev.bot.y)
                && Result.prev.outIdx != Skip) {
                Result = Result.prev;
            }

            if (Result.dx == Horizontal && Result.prev.outIdx != Skip) {
                Horz = Result;
                while (Horz.next.dx == Horizontal) Horz = Horz.next;
                if (Horz.next.top.x >= Result.prev.top.x) {
                    Result = Horz.next;
                }
            }

            while (E != Result) {
                E.nextInLML = E.prev;
                if (E.dx == Horizontal && E != EStart && !fltEquals(E.bot.x, E.next.top.x)) {
                    ReverseHorizontal(E);
                }
                E = E.prev;
            }

            if (E.dx == Horizontal && E != EStart && !fltEquals(E.bot.x, E.next.top.x)) {
                ReverseHorizontal(E);
            }
            Result = Result.prev; //move to the edge just beyond current bound
        }
        return Result;
    }

    protected Reset(): void {
        this.m_CurrentLM = this.m_MinimaList;
        if (this.m_CurrentLM == null) {
            return; //ie nothing to process
        }

        //reset all edges ...
        this.m_Scanbeam = null as any;
        let lm = this.m_MinimaList;
        while (lm != null) {
            this.InsertScanbeam(lm.y);
            let e = lm.leftBound;

            if (e != null) {
                e.curr = new ClipPoint(e.bot.x, e.bot.y);
                e.outIdx = Unassigned;
            }
            e = lm.rightBound;
            if (e != null) {
                e.curr = new ClipPoint(e.bot.x, e.bot.y);
                e.outIdx = Unassigned;
            }
            lm = lm.next;
        }
        this.m_ActiveEdges = null as any;
    }

    protected InsertScanbeam(Y: number): void {
        //single-linked list: sorted descending, ignoring dups.
        if (this.m_Scanbeam == null) {
            this.m_Scanbeam = new Scanbeam(Y);
        } else if (Y > this.m_Scanbeam.y) {
            let newSb = new Scanbeam(Y);
            newSb.next = this.m_Scanbeam;
            this.m_Scanbeam = newSb;
        } else {
            let sb2 = this.m_Scanbeam;
            while (sb2.next != null && Y <= sb2.next.y) {
                sb2 = sb2.next;
            }
            if (fltEquals(Y, sb2.y)) {
                return; //ie ignores duplicates
            }
            let newSb = new Scanbeam(Y);
            newSb.next = sb2.next;
            sb2.next = newSb;
        }
    }

    public static GetBounds(paths: Paths): ClipRect {
        let i = 0;
        let cnt = paths.Count;

        while (i < cnt && paths[i].Count == 0) {
            i++;
        }
        if (i == cnt) {
            return new ClipRect(0, 0, 0, 0);
        }
        let resultLeft = paths[i][0].x;
        let resultRight = resultLeft;
        let resultTop = paths[i][0].y;
        let resultBottom = resultTop;
        for (; i < cnt; i++) {
            for (let j = 0; j < paths[i].length; j++) {
                if (paths[i][j].x < resultLeft) {
                    resultLeft = paths[i][j].x;
                } else if (paths[i][j].x > resultRight) {
                    resultRight = paths[i][j].x;
                }
                if (paths[i][j].y < resultTop) {
                    resultTop = paths[i][j].y;
                } else if (paths[i][j].y > resultBottom) {
                    resultBottom = paths[i][j].y;
                }
            }
        }
        return new ClipRect(resultLeft, resultTop, resultRight, resultBottom);
    }

    protected PopScanbeam(): { Y: number, r: boolean } {
        if (this.m_Scanbeam == null) {
            return { Y: 0, r: false };
        }
        let Y = this.m_Scanbeam.y;
        this.m_Scanbeam = this.m_Scanbeam.next;
        return { Y: Y, r: true };
    }


    get LocalMinimaPending(): boolean {
        return this.m_CurrentLM != null;
    }

    protected CreateOutRec(): OutRec {
        let result = new OutRec();
        this.m_PolyOuts.push(result);
        result.idx = this.m_PolyOuts.length - 1;
        return result;
    }

    protected DisposeOutRec(index: number): void {
        this.m_PolyOuts[index] = null as any;
    }

    protected UpdateEdgeIntoAEL(e: TEdge): TEdge {
        if (e.nextInLML == null) {
            throw new Error("UpdateEdgeIntoAEL: invalid call");
        }
        let AelPrev = e.prevInAEL;
        let AelNext = e.nextInAEL;
        e.nextInLML.outIdx = e.outIdx;
        if (AelPrev != null) {
            AelPrev.nextInAEL = e.nextInLML;
        } else {
            this.m_ActiveEdges = e.nextInLML;
        }
        if (AelNext != null) {
            AelNext.prevInAEL = e.nextInLML;
        }
        e.nextInLML.side = e.side;
        e.nextInLML.windDelta = e.windDelta;
        e.nextInLML.windCnt = e.windCnt;
        e.nextInLML.windCnt2 = e.windCnt2;
        e = e.nextInLML;
        e.curr = new ClipPoint(e.bot.x, e.bot.y);
        e.prevInAEL = AelPrev;
        e.nextInAEL = AelNext;
        if (!IsHorizontal(e)) {
            this.InsertScanbeam(e.top.y);
        }
        return e;
    }

    protected SwapPositionsInAEL(edge1: TEdge, edge2: TEdge): void {
        //check that one or other edge hasn't already been removed from AEL ...
        if (edge1.nextInAEL == edge1.prevInAEL
            || edge2.nextInAEL == edge2.prevInAEL) return;

        if (edge1.nextInAEL == edge2) {
            let next = edge2.nextInAEL;
            if (next != null)
                next.prevInAEL = edge1;
            let prev = edge1.prevInAEL;
            if (prev != null)
                prev.nextInAEL = edge2;
            edge2.prevInAEL = prev;
            edge2.nextInAEL = edge1;
            edge1.prevInAEL = edge2;
            edge1.nextInAEL = next;
        } else if (edge2.nextInAEL == edge1) {
            let next = edge1.nextInAEL;
            if (next != null)
                next.prevInAEL = edge2;
            let prev = edge2.prevInAEL;
            if (prev != null)
                prev.nextInAEL = edge1;
            edge1.prevInAEL = prev;
            edge1.nextInAEL = edge2;
            edge2.prevInAEL = edge1;
            edge2.nextInAEL = next;
        } else {
            let next = edge1.nextInAEL;
            let prev = edge1.prevInAEL;
            edge1.nextInAEL = edge2.nextInAEL;
            if (edge1.nextInAEL != null)
                edge1.nextInAEL.prevInAEL = edge1;
            edge1.prevInAEL = edge2.prevInAEL;
            if (edge1.prevInAEL != null)
                edge1.prevInAEL.nextInAEL = edge1;
            edge2.nextInAEL = next;
            if (edge2.nextInAEL != null)
                edge2.nextInAEL.prevInAEL = edge2;
            edge2.prevInAEL = prev;
            if (edge2.prevInAEL != null)
                edge2.prevInAEL.nextInAEL = edge2;
        }

        if (edge1.prevInAEL == null)
            this.m_ActiveEdges = edge1;
        else if (edge2.prevInAEL == null)
            this.m_ActiveEdges = edge2;
    }

    protected DeleteFromAEL(e: TEdge): void {
        let AelPrev = e.prevInAEL;
        let AelNext = e.nextInAEL;
        if (AelPrev == null && AelNext == null && e != this.m_ActiveEdges) {
            return; //already deleted
        }
        if (AelPrev != null) {
            AelPrev.nextInAEL = AelNext;
        } else {
            this.m_ActiveEdges = AelNext;
        }
        if (AelNext != null) {
            AelNext.prevInAEL = AelPrev;
        }
        e.nextInAEL = null as any;
        e.prevInAEL = null as any;
    }

    public AddPath(pg: Path, polyType: PolyType, Closed: boolean): boolean {
        if (!Closed && polyType == PolyType.ptClip)
            throw new Error("AddPath: Open paths must be subject.");

        let highI = pg.Count - 1;
        if (Closed) {
            while (highI > 0 && (pg[highI].equals(pg[0]))) {
                highI--;
            }
        }
        while (highI > 0 && (pg[highI].equals(pg[highI - 1]))) {
            highI--;
        }
        if ((Closed && highI < 2) || (!Closed && highI < 1)) {
            return false;
        }

        //create a new edge array ...
        let edges: TEdge[] = new Array<TEdge>(highI + 1);
        for (let i = 0; i <= highI; i++) {
            edges[i] = new TEdge();
        }

        let IsFlat = true;

        //1. Basic (first) edge initialization ...
        edges[1].curr = pg[1];
        InitEdge(edges[0], edges[1], edges[highI], pg[0]);
        InitEdge(edges[highI], edges[0], edges[highI - 1], pg[highI]);
        for (let i = highI - 1; i >= 1; --i) {
            InitEdge(edges[i], edges[i + 1], edges[i - 1], pg[i]);
        }
        let eStart = edges[0];

        //2. Remove duplicate vertices, and (when closed) collinear edges ...
        let E = eStart;
        let eLoopStop = eStart;
        for (; ;) {
            //nb: allows matching start and end points when not Closed ...
            if (E.curr.equals(E.next.curr) && (Closed || E.next != eStart)) {
                if (E == E.next) break;
                if (E == eStart) eStart = E.next;
                E = RemoveEdge(E);
                eLoopStop = E;
                continue;
            }
            if (E.prev == E.next) {
                break; //only two vertices
            } else if (Closed
                && SlopesEqual3P(E.prev.curr, E.curr, E.next.curr)
                && (!this.PreserveCollinear
                    || !Pt2IsBetweenPt1AndPt3(E.prev.curr, E.curr, E.next.curr))) {
                //Collinear edges are allowed for open paths but in closed paths
                //the default is to merge adjacent collinear edges into a single edge.
                //However, if the PreserveCollinear property is enabled, only overlapping
                //collinear edges (ie spikes) will be removed from closed paths.
                if (E == eStart) eStart = E.next;
                E = RemoveEdge(E);
                E = E.prev;
                eLoopStop = E;
                continue;
            }
            E = E.next;
            if ((E == eLoopStop) || (!Closed && E.next == eStart)) break;
        }

        if ((!Closed && (E == E.next)) || (Closed && (E.prev == E.next))) {
            return false;
        }

        if (!Closed) {
            this.m_HasOpenPaths = true;
            eStart.prev.outIdx = Skip;
        }

        //3. Do second stage of edge initialization ...
        E = eStart;
        do {
            InitEdge2(E, polyType);
            E = E.next;
            if (IsFlat && !fltEquals(E.curr.y, eStart.curr.y)) {
                IsFlat = false;
            }
        } while (E != eStart);

        //4. Finally, add edge bounds to LocalMinima list ...

        //Totally flat paths must be handled differently when adding them
        //to LocalMinima list to avoid endless loops etc ...
        if (IsFlat) {
            if (Closed) {
                return false;
            }
            E.prev.outIdx = Skip;
            let locMin = new LocalMinima(E.bot.y, null as any, E);
            locMin.rightBound.side = EdgeSide.esRight;
            locMin.rightBound.windDelta = 0;
            for (; ;) {
                if (!fltEquals(E.bot.x, E.prev.top.x)) {
                    ReverseHorizontal(E);
                }
                if (E.next.outIdx == Skip) {
                    break;
                }
                E.nextInLML = E.next;
                E = E.next;
            }
            this.InsertLocalMinima(locMin);
            this.m_edges.push(edges);
            return true;
        }

        this.m_edges.push(edges);
        let leftBoundIsForward: boolean;
        let EMin: TEdge = null as any;

        //workaround to avoid an endless loop in the while loop below when
        //open paths have matching start and end points ...
        if (E.prev.bot.equals(E.prev.top)) {
            E = E.next;
        }

        for (; ;) {
            E = FindNextLocMin(E);
            if (E == EMin) {
                break;
            }
            if (EMin == null) {
                EMin = E;
            }

            //E and E.Prev now share a local minima (left aligned if horizontal).
            //Compare their slopes to find which starts which bound ...
            let locMin: LocalMinima;
            if (E.dx < E.prev.dx) {
                locMin = new LocalMinima(E.bot.y, E.prev, E);
                leftBoundIsForward = false; //Q.nextInLML = Q.prev
            } else {
                locMin = new LocalMinima(E.bot.y, E, E.prev);
                leftBoundIsForward = true; //Q.nextInLML = Q.next
            }
            locMin.leftBound.side = EdgeSide.esLeft;
            locMin.rightBound.side = EdgeSide.esRight;

            if (!Closed) {
                locMin.leftBound.windDelta = 0;
            } else if (locMin.leftBound.next == locMin.rightBound) {
                locMin.leftBound.windDelta = -1;
            } else {
                locMin.leftBound.windDelta = 1;
            }
            locMin.rightBound.windDelta = -locMin.leftBound.windDelta;

            E = this.ProcessBound(locMin.leftBound, leftBoundIsForward);
            if (E.outIdx == Skip) {
                E = this.ProcessBound(E, leftBoundIsForward);
            }

            let E2 = this.ProcessBound(locMin.rightBound, !leftBoundIsForward);
            if (E2.outIdx == Skip) {
                E2 = this.ProcessBound(E2, !leftBoundIsForward);
            }

            if (locMin.leftBound.outIdx == Skip) {
                locMin.clearLeftBound();
            } else if (locMin.rightBound.outIdx == Skip) {
                locMin.clearRightBound();
            }
            this.InsertLocalMinima(locMin);
            if (!leftBoundIsForward) {
                E = E2;
            }
        }
        return true;
    }

    public AddPaths(ppg: Paths, polyType: PolyType, closed: boolean): boolean {
        let result = false;
        foreach(ppg, (path: Path) => {
            if (this.AddPath(path, polyType, closed)) {
                result = true;
            }
        });
        return result;
    }
} //end ClipperBase

export class Clipper extends ClipperBase {
    //InitOptions that can be passed to the constructor ...
    private m_ClipType: ClipType = undefined as any;
    private m_Maxima: Maxima;
    private m_SortedEdges: TEdge;
    private m_IntersectList: Array<IntersectNode>;
    private m_ExecuteLocked: boolean;
    private m_ClipFillType: PolyFillType = undefined as any;
    private m_SubjFillType: PolyFillType = undefined as any;
    private m_Joins: Array<Join>;
    private m_GhostJoins: Array<Join>;
    private m_UsingPolyTree: boolean;

    ReverseSolution: boolean;
    StrictlySimple: boolean;

    constructor(InitOptions: number = 0) {
        super();
        this.m_Scanbeam = null as any;
        this.m_Maxima = null as any;
        this.m_ActiveEdges = null as any;
        this.m_SortedEdges = null as any;
        this.m_IntersectList = new Array<IntersectNode>();
        this.m_ExecuteLocked = false;
        this.m_UsingPolyTree = false;
        this.m_PolyOuts = new Array<OutRec>();
        this.m_Joins = new Array<Join>();
        this.m_GhostJoins = new Array<Join>();
        this.ReverseSolution = (ioReverseSolution & InitOptions) != 0;
        this.StrictlySimple = (ioStrictlySimple & InitOptions) != 0;
        this.PreserveCollinear = (ioPreserveCollinear & InitOptions) != 0;
    }

    private InsertMaxima(X: number): void {
        //double-linked list: sorted ascending, ignoring dups.
        let newMax = new Maxima(X);
        if (this.m_Maxima == null) {
            this.m_Maxima = newMax;
            this.m_Maxima.next = null as any;
            this.m_Maxima.prev = null as any;
        } else if (X < this.m_Maxima.x) {
            newMax.next = this.m_Maxima;
            newMax.prev = null as any;
            this.m_Maxima = newMax;
        } else {
            let m = this.m_Maxima;
            while (m.next != null && X >= m.next.x) {
                m = m.next;
            }
            if (fltEquals(X, m.x)) {
                return; //ie ignores duplicates (& CG to clean up newMax)
            }
            //insert newMax between m and m.Next ...
            newMax.next = m.next;
            newMax.prev = m;
            if (m.next != null) {
                m.next.prev = newMax;
            }
            m.next = newMax;
        }
    }

    public Execute(clipType: ClipType, solution: PolyTree | Paths,
        fillType: PolyFillType = PolyFillType.pftEvenOdd): boolean {
        if (solution instanceof PolyTree) {
            return this.ExecutePolyTree(clipType, solution, fillType, fillType);
        }
        return this.ExecutePaths(clipType, solution, fillType, fillType);
    }

    public ExecutePaths(clipType: ClipType, solution: Paths,
        subjFillType: PolyFillType, clipFillType: PolyFillType): boolean {
        if (this.m_ExecuteLocked) {
            return false;
        }
        if (this.m_HasOpenPaths) {
            throw new Error("Error: PolyTree struct is needed for open path clipping.");
        }

        this.m_ExecuteLocked = true;
        solution.Clear();
        this.m_SubjFillType = subjFillType;
        this.m_ClipFillType = clipFillType;
        this.m_ClipType = clipType;
        this.m_UsingPolyTree = false;
        let succeeded: boolean;
        try {
            succeeded = this.ExecuteInternal();
            //build the return polygons ...
            if (succeeded) {
                this.BuildResult(solution);
            }
        } finally {
            this.DisposeAllPolyPts();
            this.m_ExecuteLocked = false;
        }
        return succeeded;
    }

    public ExecutePolyTree(clipType: ClipType, polytree: PolyTree,
        subjFillType: PolyFillType, clipFillType: PolyFillType): boolean {
        if (this.m_ExecuteLocked) {
            return false;
        }
        this.m_ExecuteLocked = true;
        this.m_SubjFillType = subjFillType;
        this.m_ClipFillType = clipFillType;
        this.m_ClipType = clipType;
        this.m_UsingPolyTree = true;
        let succeeded: boolean;
        try {
            succeeded = this.ExecuteInternal();
            //build the return polygons ...
            if (succeeded) {
                this.BuildResult2(polytree);
            }
        } finally {
            this.DisposeAllPolyPts();
            this.m_ExecuteLocked = false;
        }
        return succeeded;
    }

    private FixHoleLinkage(outRec: OutRec): void {
        //skip if an outermost polygon or
        //already already points to the correct FirstLeft ...
        if (outRec.firstLeft == null
            || (outRec.isHole != outRec.firstLeft.isHole
                && outRec.firstLeft.pts != null)) {
            return;
        }

        let orfl = outRec.firstLeft;
        while (orfl != null
            && (orfl.isHole == outRec.isHole || orfl.pts == null)) {
            orfl = orfl.firstLeft;
        }
        outRec.firstLeft = orfl;
    }

    private ExecuteInternal(): boolean {
        try {
            this.Reset();
            this.m_SortedEdges = null as any;
            this.m_Maxima = null as any;

            let botY: number;
            let topY: number;

            let r = this.PopScanbeam();
            if (!r.r) {
                return false;
            }
            botY = r.Y;
            this.InsertLocalMinimaIntoAEL(botY);
            r = this.PopScanbeam();
            while (r.r || this.LocalMinimaPending) {
                topY = r.Y;
                this.ProcessHorizontals();
                this.m_GhostJoins.length = 0;
                if (!this.ProcessIntersections(topY)) {
                    return false;
                }
                this.ProcessEdgesAtTopOfScanbeam(topY);
                botY = topY;
                this.InsertLocalMinimaIntoAEL(botY);
                r = this.PopScanbeam();
            }

            //fix orientations ...
            for (let outRec of this.m_PolyOuts) {
                if (outRec.pts == null || outRec.isOpen) {
                    continue;
                }
                if (XOR(outRec.isHole, this.ReverseSolution) == (Area(outRec) > 0)) {
                    ReversePolyPtLinks(outRec.pts);
                }
            }

            this.JoinCommonEdges();

            for (let outRec of this.m_PolyOuts) {
                if (outRec.pts == null) {
                    continue;
                } else if (outRec.isOpen) {
                    this.FixupOutPolyline(outRec);
                } else {
                    this.FixupOutPolygon(outRec);
                }
            }

            if (this.StrictlySimple) {
                this.DoSimplePolygons();
            }
            return true;
        } finally {
            this.m_Joins.length = 0;
            this.m_GhostJoins.length = 0;
        }
    }

    private DisposeAllPolyPts(): void {
        for (let i = 0; i < this.m_PolyOuts.length; ++i) {
            this.DisposeOutRec(i);
        }
        this.m_PolyOuts.length = 0;
    }

    private AddJoin(Op1: OutPt, Op2: OutPt, OffPt: ClipPoint): void {
        let j = new Join(Op1, Op2, OffPt);
        this.m_Joins.push(j);
    }

    private AddGhostJoin(Op: OutPt, OffPt: ClipPoint): void {
        let j = new Join(Op, null as any, OffPt);
        this.m_GhostJoins.push(j);
    }

    private InsertLocalMinimaIntoAEL(botY: number): void {
        let lm: LocalMinima;
        while ((lm = this.PopLocalMinima(botY)) != null) {
            let lb = lm.leftBound;
            let rb = lm.rightBound;

            let Op1: OutPt = null as any;
            if (lb == null) {
                this.InsertEdgeIntoAEL(rb, null as any);
                this.SetWindingCount(rb);
                if (this.IsContributing(rb)) {
                    Op1 = this.AddOutPt(rb, rb.bot);
                }
            } else if (rb == null) {
                this.InsertEdgeIntoAEL(lb, null as any);
                this.SetWindingCount(lb);
                if (this.IsContributing(lb)) {
                    Op1 = this.AddOutPt(lb, lb.bot);
                }
                this.InsertScanbeam(lb.top.y);
            } else {
                this.InsertEdgeIntoAEL(lb, null as any);
                this.InsertEdgeIntoAEL(rb, lb);
                this.SetWindingCount(lb);
                rb.windCnt = lb.windCnt;
                rb.windCnt2 = lb.windCnt2;
                if (this.IsContributing(lb)) {
                    Op1 = this.AddLocalMinPoly(lb, rb, lb.bot);
                }
                this.InsertScanbeam(lb.top.y);
            }

            if (rb != null) {
                if (IsHorizontal(rb)) {
                    if (rb.nextInLML != null) {
                        this.InsertScanbeam(rb.nextInLML.top.y);
                    }
                    this.AddEdgeToSEL(rb);
                } else {
                    this.InsertScanbeam(rb.top.y);
                }
            }

            if (lb == null || rb == null) {
                continue;
            }

            //if output polygons share an Edge with a horizontal rb, they'll need joining later ...
            if (Op1 != null
                && IsHorizontal(rb)
                && this.m_GhostJoins.length > 0
                && rb.windDelta != 0) {
                for (let i = 0; i < this.m_GhostJoins.length; i++) {
                    //if the horizontal Rb and a 'ghost' horizontal overlap, then convert
                    //the 'ghost' join to a real join ready for later ...
                    let j = this.m_GhostJoins[i];
                    if (HorzSegmentsOverlap(j.outPt1.pt.x, j.offPt.x, rb.bot.x, rb.top.x)) {
                        this.AddJoin(j.outPt1, Op1, j.offPt);
                    }
                }
            }

            if (lb.outIdx >= 0
                && lb.prevInAEL != null
                && fltEquals(lb.prevInAEL.curr.x, lb.bot.x)
                && lb.prevInAEL.outIdx >= 0
                && SlopesEqual4P(lb.prevInAEL.curr, lb.prevInAEL.top, lb.curr, lb.top)
                && lb.windDelta != 0
                && lb.prevInAEL.windDelta != 0) {
                let Op2 = this.AddOutPt(lb.prevInAEL, lb.bot);
                this.AddJoin(Op1, Op2, lb.top);
            }

            if (lb.nextInAEL != rb) {
                if (rb.outIdx >= 0
                    && rb.prevInAEL.outIdx >= 0
                    && SlopesEqual4P(rb.prevInAEL.curr, rb.prevInAEL.top, rb.curr, rb.top)
                    && rb.windDelta != 0
                    && rb.prevInAEL.windDelta != 0) {
                    let Op2 = this.AddOutPt(rb.prevInAEL, rb.bot);
                    this.AddJoin(Op1, Op2, rb.top);
                }

                let e = lb.nextInAEL;
                if (e != null) {
                    while (e != rb) {
                        //nb: For calculating winding counts etc, IntersectEdges() assumes
                        //that param1 will be to the right of param2 ABOVE the intersection ...
                        this.IntersectEdges(rb, e, lb.curr); //order important here
                        e = e.nextInAEL;
                    }
                }
            }
        }
    }

    private InsertEdgeIntoAEL(edge: TEdge, startEdge: TEdge): void {
        if (this.m_ActiveEdges == null) {
            edge.prevInAEL = null as any;
            edge.nextInAEL = null as any;
            this.m_ActiveEdges = edge;
        } else if (startEdge == null
            && E2InsertsBeforeE1(this.m_ActiveEdges, edge)) {
            edge.prevInAEL = null as any;
            edge.nextInAEL = this.m_ActiveEdges;
            this.m_ActiveEdges.prevInAEL = edge;
            this.m_ActiveEdges = edge;
        } else {
            if (startEdge == null) {
                startEdge = this.m_ActiveEdges;
            }
            while (startEdge.nextInAEL != null
                && !E2InsertsBeforeE1(startEdge.nextInAEL, edge)) {
                startEdge = startEdge.nextInAEL;
            }
            edge.nextInAEL = startEdge.nextInAEL;
            if (startEdge.nextInAEL != null) {
                startEdge.nextInAEL.prevInAEL = edge;
            }
            edge.prevInAEL = startEdge;
            startEdge.nextInAEL = edge;
        }
    }

    private IsEvenOddFillType(edge: TEdge): boolean {
        if (edge.polyTyp == PolyType.ptSubject) {
            return this.m_SubjFillType == PolyFillType.pftEvenOdd;
        }
        return this.m_ClipFillType == PolyFillType.pftEvenOdd;
    }

    private IsEvenOddAltFillType(edge: TEdge): boolean {
        if (edge.polyTyp == PolyType.ptSubject) {
            return this.m_ClipFillType == PolyFillType.pftEvenOdd;
        }
        return this.m_SubjFillType == PolyFillType.pftEvenOdd;
    }

    private IsContributing(edge: TEdge): boolean {
        let pft: PolyFillType;
        let pft2: PolyFillType;

        if (edge.polyTyp == PolyType.ptSubject) {
            pft = this.m_SubjFillType;
            pft2 = this.m_ClipFillType;
        } else {
            pft = this.m_ClipFillType;
            pft2 = this.m_SubjFillType;
        }
        switch (pft) {
            case PolyFillType.pftEvenOdd:
                //return false if a subj line has been flagged as inside a subj polygon
                if (edge.windDelta == 0 && edge.windCnt != 1) {
                    return false;
                }
                break;
            case PolyFillType.pftNonZero:
                if (Math.abs(edge.windCnt) != 1) {
                    return false;
                }
                break;
            case PolyFillType.pftPositive:
                if (edge.windCnt != 1) {
                    return false;
                }
                break;
            default: //PolyFillType.pftNegative
                if (edge.windCnt != -1) {
                    return false;
                }
                break;
        }

        switch (this.m_ClipType) {
            case ClipType.ctIntersection:
                switch (pft2) {
                    case PolyFillType.pftEvenOdd:
                    case PolyFillType.pftNonZero:
                        return (edge.windCnt2 != 0);
                    case PolyFillType.pftPositive:
                        return (edge.windCnt2 > 0);
                    default:
                        return (edge.windCnt2 < 0);
                }
            case ClipType.ctUnion:
                switch (pft2) {
                    case PolyFillType.pftEvenOdd:
                    case PolyFillType.pftNonZero:
                        return (edge.windCnt2 == 0);
                    case PolyFillType.pftPositive:
                        return (edge.windCnt2 <= 0);
                    default:
                        return (edge.windCnt2 >= 0);
                }
            case ClipType.ctDifference:
                if (edge.polyTyp == PolyType.ptSubject) {
                    switch (pft2) {
                        case PolyFillType.pftEvenOdd:
                        case PolyFillType.pftNonZero:
                            return (edge.windCnt2 == 0);
                        case PolyFillType.pftPositive:
                            return (edge.windCnt2 <= 0);
                        default:
                            return (edge.windCnt2 >= 0);
                    }
                } else {
                    switch (pft2) {
                        case PolyFillType.pftEvenOdd:
                        case PolyFillType.pftNonZero:
                            return (edge.windCnt2 != 0);
                        case PolyFillType.pftPositive:
                            return (edge.windCnt2 > 0);
                        default:
                            return (edge.windCnt2 < 0);
                    }
                }
            case ClipType.ctXor:
                if (edge.windDelta == 0) {//XOr always contributing unless open
                    switch (pft2) {
                        case PolyFillType.pftEvenOdd:
                        case PolyFillType.pftNonZero:
                            return (edge.windCnt2 == 0);
                        case PolyFillType.pftPositive:
                            return (edge.windCnt2 <= 0);
                        default:
                            return (edge.windCnt2 >= 0);
                    }
                }
                return true;
        }
        return true;
    }

    private SetWindingCount(edge: TEdge): void {
        let e = edge.prevInAEL;
        //find the edge of the same polytype that immediately preceeds 'edge' in AEL
        while (e != null
            && (e.polyTyp != edge.polyTyp || e.windDelta == 0)) {
            e = e.prevInAEL;
        }
        if (e == null) {
            let pft: PolyFillType;
            pft = edge.polyTyp == PolyType.ptSubject ? this.m_SubjFillType : this.m_ClipFillType;
            if (edge.windDelta == 0) {
                edge.windCnt = pft == PolyFillType.pftNegative ? -1 : 1;
            } else {
                edge.windCnt = edge.windDelta;
            }
            edge.windCnt2 = 0;
            e = this.m_ActiveEdges; //ie get ready to calc WindCnt2
        } else if (edge.windDelta == 0 && this.m_ClipType != ClipType.ctUnion) {
            edge.windCnt = 1;
            edge.windCnt2 = e.windCnt2;
            e = e.nextInAEL; //ie get ready to calc WindCnt2
        } else if (this.IsEvenOddFillType(edge)) {
            //EvenOdd filling ...
            if (edge.windDelta == 0) {
                //are we inside a subj polygon ...
                let Inside = true;
                let e2 = e.prevInAEL;
                while (e2 != null) {
                    if (e2.polyTyp == e.polyTyp && e2.windDelta != 0) {
                        Inside = !Inside;
                    }
                    e2 = e2.prevInAEL;
                }
                edge.windCnt = Inside ? 0 : 1;
            } else {
                edge.windCnt = edge.windDelta;
            }
            edge.windCnt2 = e.windCnt2;
            e = e.nextInAEL; //ie get ready to calc WindCnt2
        } else {
            //nonZero, Positive or Negative filling ...
            if (e.windCnt * e.windDelta < 0) {
                //prev edge is 'decreasing' WindCount (WC) toward zero
                //so we're outside the previous polygon ...
                if (Math.abs(e.windCnt) > 1) {
                    //outside prev poly but still inside another.
                    //when reversing direction of prev poly use the same WC
                    if (e.windDelta * edge.windDelta < 0) {
                        edge.windCnt = e.windCnt;
                        //otherwise continue to 'decrease' WC ...
                    } else {
                        edge.windCnt = e.windCnt + edge.windDelta;
                    }
                } else {
                    //now outside all polys of same polytype so set own WC ...
                    edge.windCnt = (edge.windDelta == 0 ? 1 : edge.windDelta);
                }
            } else {
                //prev edge is 'increasing' WindCount (WC) away from zero
                //so we're inside the previous polygon ...
                if (edge.windDelta == 0) {
                    edge.windCnt = e.windCnt < 0 ? e.windCnt - 1 : e.windCnt + 1;
                    //if wind direction is reversing prev then use same WC
                } else if (e.windDelta * edge.windDelta < 0) {
                    edge.windCnt = e.windCnt;
                    //otherwise add to WC ...
                } else {
                    edge.windCnt = e.windCnt + edge.windDelta;
                }
            }
            edge.windCnt2 = e.windCnt2;
            e = e.nextInAEL; //ie get ready to calc WindCnt2
        }

        //update WindCnt2 ...
        if (this.IsEvenOddAltFillType(edge)) {
            //EvenOdd filling ...
            while (e != edge) {
                if (e.windDelta != 0) {
                    edge.windCnt2 = edge.windCnt2 == 0 ? 1 : 0;
                }
                e = e.nextInAEL;
            }
        } else {
            //nonZero, Positive or Negative filling ...
            while (e != edge) {
                edge.windCnt2 += e.windDelta;
                e = e.nextInAEL;
            }
        }
    }

    private AddEdgeToSEL(edge: TEdge): void {
        //SEL pointers in PEdge are use to build transient lists of horizontal edges.
        //However, since we don't need to worry about processing order, all additions
        //are made to the front of the list ...
        if (this.m_SortedEdges == null) {
            this.m_SortedEdges = edge;
            edge.prevInSEL = null as any;
            edge.nextInSEL = null as any;
        } else {
            edge.nextInSEL = this.m_SortedEdges;
            edge.prevInSEL = null as any;
            this.m_SortedEdges.prevInSEL = edge;
            this.m_SortedEdges = edge;
        }
    }

    private PopEdgeFromSEL(): TEdge {
        //Pop edge from front of SEL (ie SEL is a FILO list)
        if (this.m_SortedEdges == null) {
            return null as any;
        }
        let oldE = this.m_SortedEdges;
        this.m_SortedEdges = this.m_SortedEdges.nextInSEL;
        if (this.m_SortedEdges != null) {
            this.m_SortedEdges.prevInSEL = null as any;
        }
        oldE.nextInSEL = null as any;
        oldE.prevInSEL = null as any;
        return oldE;
    }

    private CopyAELToSEL(): void {
        let e = this.m_ActiveEdges;
        this.m_SortedEdges = e;
        while (e != null) {
            e.prevInSEL = e.prevInAEL;
            e.nextInSEL = e.nextInAEL;
            e = e.nextInAEL;
        }
    }

    private SwapPositionsInSEL(edge1: TEdge, edge2: TEdge): void {
        if (edge1.nextInSEL == null && edge1.prevInSEL == null) {
            return;
        }
        if (edge2.nextInSEL == null && edge2.prevInSEL == null) {
            return;
        }

        if (edge1.nextInSEL == edge2) {
            let next = edge2.nextInSEL;
            if (next != null) {
                next.prevInSEL = edge1;
            }
            let prev = edge1.prevInSEL;
            if (prev != null) {
                prev.nextInSEL = edge2;
            }
            edge2.prevInSEL = prev;
            edge2.nextInSEL = edge1;
            edge1.prevInSEL = edge2;
            edge1.nextInSEL = next;
        } else if (edge2.nextInSEL == edge1) {
            let next = edge1.nextInSEL;
            if (next != null) {
                next.prevInSEL = edge2;
            }
            let prev = edge2.prevInSEL;
            if (prev != null) {
                prev.nextInSEL = edge1;
            }
            edge1.prevInSEL = prev;
            edge1.nextInSEL = edge2;
            edge2.prevInSEL = edge1;
            edge2.nextInSEL = next;
        } else {
            let next = edge1.nextInSEL;
            let prev = edge1.prevInSEL;
            edge1.nextInSEL = edge2.nextInSEL;
            if (edge1.nextInSEL != null) {
                edge1.nextInSEL.prevInSEL = edge1;
            }
            edge1.prevInSEL = edge2.prevInSEL;
            if (edge1.prevInSEL != null) {
                edge1.prevInSEL.nextInSEL = edge1;
            }
            edge2.nextInSEL = next;
            if (edge2.nextInSEL != null) {
                edge2.nextInSEL.prevInSEL = edge2;
            }
            edge2.prevInSEL = prev;
            if (edge2.prevInSEL != null) {
                edge2.prevInSEL.nextInSEL = edge2;
            }
        }

        if (edge1.prevInSEL == null) {
            this.m_SortedEdges = edge1;
        } else if (edge2.prevInSEL == null) {
            this.m_SortedEdges = edge2;
        }
    }

    private AddLocalMaxPoly(e1: TEdge, e2: TEdge, pt: ClipPoint): void {
        this.AddOutPt(e1, pt);
        if (e2.windDelta == 0) {
            this.AddOutPt(e2, pt);
        }
        if (e1.outIdx == e2.outIdx) {
            e1.outIdx = Unassigned;
            e2.outIdx = Unassigned;
        } else if (e1.outIdx < e2.outIdx) {
            this.AppendPolygon(e1, e2);
        } else {
            this.AppendPolygon(e2, e1);
        }
    }

    private AddLocalMinPoly(e1: TEdge, e2: TEdge, pt: ClipPoint): OutPt {
        let result: OutPt;
        let e: TEdge;
        let prevE: TEdge;

        if (IsHorizontal(e2) || e1.dx > e2.dx) {
            result = this.AddOutPt(e1, pt);
            e2.outIdx = e1.outIdx;
            e1.side = EdgeSide.esLeft;
            e2.side = EdgeSide.esRight;
            e = e1;
            if (e.prevInAEL == e2) {
                prevE = e2.prevInAEL;
            } else {
                prevE = e.prevInAEL;
            }
        } else {
            result = this.AddOutPt(e2, pt);
            e1.outIdx = e2.outIdx;
            e1.side = EdgeSide.esRight;
            e2.side = EdgeSide.esLeft;
            e = e2;
            if (e.prevInAEL == e1)
                prevE = e1.prevInAEL;
            else
                prevE = e.prevInAEL;
        }

        if (prevE != null
            && prevE.outIdx >= 0
            && prevE.top.y < pt.y
            && e.top.y < pt.y) {
            let xPrev = TopX(prevE, pt.y);
            let xE = TopX(e, pt.y);
            if (fltEquals(xPrev, xE)
                && e.windDelta != 0
                && prevE.windDelta != 0
                && SlopesEqual4P(new ClipPoint(xPrev, pt.y), prevE.top, new ClipPoint(xE, pt.y), e.top)) {
                let outPt = this.AddOutPt(prevE, pt);
                this.AddJoin(result, outPt, e.top);
            }
        }
        return result;
    }


    private AddOutPt(e: TEdge, pt: ClipPoint): OutPt {
        if (e.outIdx < 0) {
            let outRec = this.CreateOutRec();
            outRec.isOpen = (e.windDelta == 0);
            let newOp = new OutPt();
            outRec.pts = newOp;
            newOp.idx = outRec.idx;
            newOp.pt = new ClipPoint(pt.x, pt.y);
            newOp.next = newOp;
            newOp.prev = newOp;
            if (!outRec.isOpen) {
                this.SetHoleState(e, outRec);
            }
            e.outIdx = outRec.idx; //nb: do this after SetZ !
            return newOp;
        } else {
            let outRec = this.m_PolyOuts[e.outIdx];
            //OutRec.Pts is the 'Left-most' point & OutRec.Pts.Prev is the 'Right-most'
            let op = outRec.pts;
            let ToFront = (e.side == EdgeSide.esLeft);
            if (ToFront && pt.equals(op.pt)) {
                return op;
            } else if (!ToFront && pt.equals(op.prev.pt)) {
                return op.prev;
            }

            let newOp = new OutPt();
            newOp.idx = outRec.idx;
            newOp.pt = new ClipPoint(pt.x, pt.y);
            newOp.next = op;
            newOp.prev = op.prev;
            newOp.prev.next = newOp;
            op.prev = newOp;
            if (ToFront) {
                outRec.pts = newOp;
            }
            return newOp;
        }
    }

    private GetLastOutPt(e: TEdge): OutPt {
        let outRec = this.m_PolyOuts[e.outIdx];
        if (e.side == EdgeSide.esLeft) {
            return outRec.pts;
        }
        return outRec.pts.prev;
    }

    private SetHoleState(e: TEdge, outRec: OutRec): void {
        let e2 = e.prevInAEL;
        let eTmp: TEdge = null as any;
        while (e2 != null) {
            if (e2.outIdx >= 0 && e2.windDelta != 0) {
                if (eTmp == null) {
                    eTmp = e2;
                } else if (eTmp.outIdx == e2.outIdx) {
                    eTmp = null as any; //paired
                }
            }
            e2 = e2.prevInAEL;
        }

        if (eTmp == null) {
            outRec.firstLeft = null as any;
            outRec.isHole = false;
        } else {
            outRec.firstLeft = this.m_PolyOuts[eTmp.outIdx];
            outRec.isHole = !outRec.firstLeft.isHole;
        }
    }

    private GetOutRec(idx: number): OutRec {
        let outrec = this.m_PolyOuts[idx];
        while (outrec != this.m_PolyOuts[outrec.idx]) {
            outrec = this.m_PolyOuts[outrec.idx];
        }
        return outrec;
    }

    private AppendPolygon(e1: TEdge, e2: TEdge): void {
        let outRec1 = this.m_PolyOuts[e1.outIdx];
        let outRec2 = this.m_PolyOuts[e2.outIdx];

        let holeStateRec: OutRec;
        if (OutRec1RightOfOutRec2(outRec1, outRec2)) {
            holeStateRec = outRec2;
        } else if (OutRec1RightOfOutRec2(outRec2, outRec1)) {
            holeStateRec = outRec1;
        } else {
            holeStateRec = GetLowermostRec(outRec1, outRec2);
        }

        //get the start and ends of both output polygons and
        //join E2 poly onto E1 poly and delete pointers to E2 ...
        let p1_lft = outRec1.pts;
        let p1_rt = p1_lft.prev;
        let p2_lft = outRec2.pts;
        let p2_rt = p2_lft.prev;

        //join e2 poly onto e1 poly and delete pointers to e2 ...
        if (e1.side == EdgeSide.esLeft) {
            if (e2.side == EdgeSide.esLeft) {
                //z y x a b c
                ReversePolyPtLinks(p2_lft);
                p2_lft.next = p1_lft;
                p1_lft.prev = p2_lft;
                p1_rt.next = p2_rt;
                p2_rt.prev = p1_rt;
                outRec1.pts = p2_rt;
            } else {
                //x y z a b c
                p2_rt.next = p1_lft;
                p1_lft.prev = p2_rt;
                p2_lft.prev = p1_rt;
                p1_rt.next = p2_lft;
                outRec1.pts = p2_lft;
            }
        } else {
            if (e2.side == EdgeSide.esRight) {
                //a b c z y x
                ReversePolyPtLinks(p2_lft);
                p1_rt.next = p2_rt;
                p2_rt.prev = p1_rt;
                p2_lft.next = p1_lft;
                p1_lft.prev = p2_lft;
            } else {
                //a b c x y z
                p1_rt.next = p2_lft;
                p2_lft.prev = p1_rt;
                p1_lft.prev = p2_rt;
                p2_rt.next = p1_lft;
            }
        }

        outRec1.bottomPt = null as any;
        if (holeStateRec == outRec2) {
            if (outRec2.firstLeft != outRec1) {
                outRec1.firstLeft = outRec2.firstLeft;
            }
            outRec1.isHole = outRec2.isHole;
        }
        outRec2.pts = null as any;
        outRec2.bottomPt = null as any;

        outRec2.firstLeft = outRec1;

        let OKIdx = e1.outIdx;
        let ObsoleteIdx = e2.outIdx;

        e1.outIdx = Unassigned; //nb: safe because we only get here via AddLocalMaxPoly
        e2.outIdx = Unassigned;

        let e = this.m_ActiveEdges;
        while (e != null) {
            if (e.outIdx == ObsoleteIdx) {
                e.outIdx = OKIdx;
                e.side = e1.side;
                break;
            }
            e = e.nextInAEL;
        }
        outRec2.idx = outRec1.idx;
    }

    private IntersectEdges(e1: TEdge, e2: TEdge, pt: ClipPoint): void {
        //e1 will be to the left of e2 BELOW the intersection. Therefore e1 is before
        //e2 in AEL except when e1 is being inserted at the intersection point ...

        let e1Contributing = (e1.outIdx >= 0);
        let e2Contributing = (e2.outIdx >= 0);

        //if either edge is on an OPEN path ...
        if (e1.windDelta == 0 || e2.windDelta == 0) {
            //ignore subject-subject open path intersections UNLESS they
            //are both open paths, AND they are both 'contributing maximas' ...
            if (e1.windDelta == 0 && e2.windDelta == 0) {
                return;

            } else if (e1.polyTyp == e2.polyTyp
                && e1.windDelta != e2.windDelta
                && this.m_ClipType == ClipType.ctUnion) {//if intersecting a subj line with a subj poly ...
                if (e1.windDelta == 0) {
                    if (e2Contributing) {
                        this.AddOutPt(e1, pt);
                        if (e1Contributing) {
                            e1.outIdx = Unassigned;
                        }
                    }
                } else {
                    if (e1Contributing) {
                        this.AddOutPt(e2, pt);
                        if (e2Contributing) {
                            e2.outIdx = Unassigned;
                        }
                    }
                }
            } else if (e1.polyTyp != e2.polyTyp) {
                if (e1.windDelta == 0
                    && Math.abs(e2.windCnt) == 1
                    && (this.m_ClipType != ClipType.ctUnion || e2.windCnt2 == 0)) {
                    this.AddOutPt(e1, pt);
                    if (e1Contributing) {
                        e1.outIdx = Unassigned;
                    }
                }
                else if (e2.windDelta == 0
                    && Math.abs(e1.windCnt) == 1
                    && (this.m_ClipType != ClipType.ctUnion || e1.windCnt2 == 0)) {
                    this.AddOutPt(e2, pt);
                    if (e2Contributing) {
                        e2.outIdx = Unassigned;
                    }
                }
            }
            return;
        }

        //update winding counts...
        //assumes that e1 will be to the Right of e2 ABOVE the intersection
        if (e1.polyTyp == e2.polyTyp) {
            if (this.IsEvenOddFillType(e1)) {
                let oldE1WindCnt = e1.windCnt;
                e1.windCnt = e2.windCnt;
                e2.windCnt = oldE1WindCnt;
            } else {
                if (e1.windCnt + e2.windDelta == 0) {
                    e1.windCnt = -e1.windCnt;
                } else {
                    e1.windCnt += e2.windDelta;
                }
                if (e2.windCnt - e1.windDelta == 0) {
                    e2.windCnt = -e2.windCnt;
                } else {
                    e2.windCnt -= e1.windDelta;
                }
            }
        } else {
            if (!this.IsEvenOddFillType(e2)) {
                e1.windCnt2 += e2.windDelta;
            } else {
                e1.windCnt2 = (e1.windCnt2 == 0) ? 1 : 0;
            }
            if (!this.IsEvenOddFillType(e1)) {
                e2.windCnt2 -= e1.windDelta;
            } else {
                e2.windCnt2 = (e2.windCnt2 == 0) ? 1 : 0;
            }
        }

        let e1FillType: PolyFillType;
        let e2FillType: PolyFillType;
        let e1FillType2: PolyFillType;
        let e2FillType2: PolyFillType;

        if (e1.polyTyp == PolyType.ptSubject) {
            e1FillType = this.m_SubjFillType;
            e1FillType2 = this.m_ClipFillType;
        } else {
            e1FillType = this.m_ClipFillType;
            e1FillType2 = this.m_SubjFillType;
        }
        if (e2.polyTyp == PolyType.ptSubject) {
            e2FillType = this.m_SubjFillType;
            e2FillType2 = this.m_ClipFillType;
        } else {
            e2FillType = this.m_ClipFillType;
            e2FillType2 = this.m_SubjFillType;
        }

        let e1Wc: number;
        let e2Wc: number;
        switch (e1FillType) {
            case PolyFillType.pftPositive:
                e1Wc = e1.windCnt;
                break;
            case PolyFillType.pftNegative:
                e1Wc = -e1.windCnt;
                break;
            default:
                e1Wc = Math.abs(e1.windCnt);
                break;
        }
        switch (e2FillType) {
            case PolyFillType.pftPositive:
                e2Wc = e2.windCnt;
                break;
            case PolyFillType.pftNegative:
                e2Wc = -e2.windCnt;
                break;
            default:
                e2Wc = Math.abs(e2.windCnt);
                break;
        }

        if (e1Contributing && e2Contributing) {
            if ((e1Wc != 0 && e1Wc != 1)
                || (e2Wc != 0 && e2Wc != 1)
                || (e1.polyTyp != e2.polyTyp && this.m_ClipType != ClipType.ctXor)) {
                this.AddLocalMaxPoly(e1, e2, pt);
            } else {
                this.AddOutPt(e1, pt);
                this.AddOutPt(e2, pt);
                SwapSides(e1, e2);
                SwapPolyIndexes(e1, e2);
            }
        } else if (e1Contributing) {
            if (e2Wc == 0 || e2Wc == 1) {
                this.AddOutPt(e1, pt);
                SwapSides(e1, e2);
                SwapPolyIndexes(e1, e2);
            }
        } else if (e2Contributing) {
            if (e1Wc == 0 || e1Wc == 1) {
                this.AddOutPt(e2, pt);
                SwapSides(e1, e2);
                SwapPolyIndexes(e1, e2);
            }
        } else if ((e1Wc == 0 || e1Wc == 1) && (e2Wc == 0 || e2Wc == 1)) {
            //neither edge is currently contributing ...
            let e1Wc2: number;
            let e2Wc2: number;
            switch (e1FillType2) {
                case PolyFillType.pftPositive:
                    e1Wc2 = e1.windCnt2;
                    break;
                case PolyFillType.pftNegative:
                    e1Wc2 = -e1.windCnt2;
                    break;
                default:
                    e1Wc2 = Math.abs(e1.windCnt2);
                    break;
            }
            switch (e2FillType2) {
                case PolyFillType.pftPositive:
                    e2Wc2 = e2.windCnt2;
                    break;
                case PolyFillType.pftNegative:
                    e2Wc2 = -e2.windCnt2;
                    break;
                default:
                    e2Wc2 = Math.abs(e2.windCnt2);
                    break;
            }

            if (e1.polyTyp != e2.polyTyp) {
                this.AddLocalMinPoly(e1, e2, pt);
            } else if (e1Wc == 1 && e2Wc == 1) {
                switch (this.m_ClipType) {
                    case ClipType.ctIntersection:
                        if (e1Wc2 > 0 && e2Wc2 > 0) {
                            this.AddLocalMinPoly(e1, e2, pt);
                        }
                        break;
                    case ClipType.ctUnion:
                        if (e1Wc2 <= 0 && e2Wc2 <= 0) {
                            this.AddLocalMinPoly(e1, e2, pt);
                        }
                        break;
                    case ClipType.ctDifference:
                        if ((e1.polyTyp == PolyType.ptClip && e1Wc2 > 0 && e2Wc2 > 0)
                            || (e1.polyTyp == PolyType.ptSubject && e1Wc2 <= 0 && e2Wc2 <= 0)) {
                            this.AddLocalMinPoly(e1, e2, pt);
                        }
                        break;
                    case ClipType.ctXor:
                        this.AddLocalMinPoly(e1, e2, pt);
                        break;
                }
            } else {
                SwapSides(e1, e2);
            }
        }
    }

    private DeleteFromSEL(e: TEdge): void {
        let SelPrev = e.prevInSEL;
        let SelNext = e.nextInSEL;
        if (SelPrev == null && SelNext == null && (e != this.m_SortedEdges)) {
            return; //already deleted
        }
        if (SelPrev != null) {
            SelPrev.nextInSEL = SelNext;
        } else {
            this.m_SortedEdges = SelNext;
        }
        if (SelNext != null) {
            SelNext.prevInSEL = SelPrev;
        }
        e.nextInSEL = null as any;
        e.prevInSEL = null as any;
    }

    private ProcessHorizontals(): void {
        let horzEdge: TEdge; //m_SortedEdges;
        while ((horzEdge = this.PopEdgeFromSEL()) != null) {
            this.ProcessHorizontal(horzEdge);
        }
    }

    private ProcessHorizontal(horzEdge: TEdge): void {
        let dir: Direction;
        let horzLeft: number;
        let horzRight: number;
        let IsOpen = horzEdge.windDelta == 0;

        let r = GetHorzDirection(horzEdge);
        dir = r.Dir;
        horzLeft = r.Left;
        horzRight = r.Right;

        let eLastHorz = horzEdge;
        let eMaxPair: TEdge = null as any;
        while (eLastHorz.nextInLML != null
            && IsHorizontal(eLastHorz.nextInLML)) {
            eLastHorz = eLastHorz.nextInLML;
        }
        if (eLastHorz.nextInLML == null) {
            eMaxPair = GetMaximaPair(eLastHorz);
        }

        let currMax = this.m_Maxima;
        if (currMax != null) {
            //get the first maxima in range (X) ...
            if (dir == Direction.dLeftToRight) {
                while (currMax != null && currMax.x < horzEdge.bot.x) {
                    currMax = currMax.next;
                }
                if (currMax != null && currMax.x >= eLastHorz.top.x) {
                    currMax = null as any;
                }
            } else {
                while (currMax.next != null && currMax.next.x < horzEdge.bot.x) {
                    currMax = currMax.next;
                }
                if (currMax.x <= eLastHorz.top.x) {
                    currMax = null as any;
                }
            }
        }

        let op1: OutPt = null as any;
        for (; ;) {//loop through consec. horizontal edges
            let IsLastHorz = (horzEdge == eLastHorz);
            let e = GetNextInAEL(horzEdge, dir);
            while (e != null) {
                //this code block inserts extra coords into horizontal edges (in output
                //polygons) whereever maxima touch these horizontal edges. This helps
                //'simplifying' polygons (ie if the Simplify property is set).
                if (currMax != null) {
                    if (dir == Direction.dLeftToRight) {
                        while (currMax != null && currMax.x < e.curr.x) {
                            if (horzEdge.outIdx >= 0 && !IsOpen) {
                                this.AddOutPt(horzEdge, new ClipPoint(currMax.x, horzEdge.bot.y));
                            }
                            currMax = currMax.next;
                        }
                    } else {
                        while (currMax != null && currMax.x > e.curr.x) {
                            if (horzEdge.outIdx >= 0 && !IsOpen) {
                                this.AddOutPt(horzEdge, new ClipPoint(currMax.x, horzEdge.bot.y));
                            }
                            currMax = currMax.prev;
                        }
                    }
                }

                if ((dir == Direction.dLeftToRight && e.curr.x > horzRight)
                    || (dir == Direction.dRightToLeft && e.curr.x < horzLeft)) {
                    break;
                }

                //Also break if we've got to the end of an intermediate horizontal edge ...
                //nb: Smaller Dx's are to the right of larger Dx's ABOVE the horizontal.
                if (fltEquals(e.curr.x, horzEdge.top.x)
                    && horzEdge.nextInLML != null
                    && e.dx < horzEdge.nextInLML.dx) {
                    break;
                }

                if (horzEdge.outIdx >= 0 && !IsOpen) {//note: may be done multiple times
                    op1 = this.AddOutPt(horzEdge, e.curr);
                    let eNextHorz = this.m_SortedEdges;
                    while (eNextHorz != null) {
                        if (eNextHorz.outIdx >= 0 &&
                            HorzSegmentsOverlap(horzEdge.bot.x, horzEdge.top.x, eNextHorz.bot.x, eNextHorz.top.x)) {
                            let op2 = this.GetLastOutPt(eNextHorz);
                            this.AddJoin(op2, op1, eNextHorz.top);
                        }
                        eNextHorz = eNextHorz.nextInSEL;
                    }
                    this.AddGhostJoin(op1, horzEdge.bot);
                }

                //OK, so far we're still in range of the horizontal Edge  but make sure
                //we're at the last of consec. horizontals when matching with eMaxPair
                if (e == eMaxPair && IsLastHorz) {
                    if (horzEdge.outIdx >= 0) {
                        this.AddLocalMaxPoly(horzEdge, eMaxPair, horzEdge.top);
                    }
                    this.DeleteFromAEL(horzEdge);
                    this.DeleteFromAEL(eMaxPair);
                    return;
                }

                if (dir == Direction.dLeftToRight) {
                    let Pt = new ClipPoint(e.curr.x, horzEdge.curr.y);
                    this.IntersectEdges(horzEdge, e, Pt);
                } else {
                    let Pt = new ClipPoint(e.curr.x, horzEdge.curr.y);
                    this.IntersectEdges(e, horzEdge, Pt);
                }
                let eNext = GetNextInAEL(e, dir);
                this.SwapPositionsInAEL(horzEdge, e);
                e = eNext;
            } //end while(e != null)

            //Break out of loop if HorzEdge.NextInLML is not also horizontal ...
            if (horzEdge.nextInLML == null || !IsHorizontal(horzEdge.nextInLML)) {
                break;
            }

            horzEdge = this.UpdateEdgeIntoAEL(horzEdge);
            if (horzEdge.outIdx >= 0) {
                this.AddOutPt(horzEdge, horzEdge.bot);
            }
            r = GetHorzDirection(horzEdge);
            dir = r.Dir;
            horzLeft = r.Left;
            horzRight = r.Right;
        } //end for (;;)

        if (horzEdge.outIdx >= 0 && op1 == null) {
            op1 = this.GetLastOutPt(horzEdge);
            let eNextHorz = this.m_SortedEdges;
            while (eNextHorz != null) {
                if (eNextHorz.outIdx >= 0
                    && HorzSegmentsOverlap(horzEdge.bot.x, horzEdge.top.x, eNextHorz.bot.x, eNextHorz.top.x)) {
                    let op2 = this.GetLastOutPt(eNextHorz);
                    this.AddJoin(op2, op1, eNextHorz.top);
                }
                eNextHorz = eNextHorz.nextInSEL;
            }
            this.AddGhostJoin(op1, horzEdge.top);
        }

        if (horzEdge.nextInLML != null) {
            if (horzEdge.outIdx >= 0) {
                op1 = this.AddOutPt(horzEdge, horzEdge.top);

                horzEdge = this.UpdateEdgeIntoAEL(horzEdge);
                if (horzEdge.windDelta == 0) {
                    return;
                }
                //nb: HorzEdge is no longer horizontal here
                let ePrev = horzEdge.prevInAEL;
                let eNext = horzEdge.nextInAEL;
                if (ePrev != null
                    && fltEquals(ePrev.curr.x, horzEdge.bot.x)
                    && fltEquals(ePrev.curr.y, horzEdge.bot.y)
                    && ePrev.windDelta != 0
                    && ePrev.outIdx >= 0
                    && ePrev.curr.y > ePrev.top.y
                    && SlopesEqual2E(horzEdge, ePrev)) {
                    let op2 = this.AddOutPt(ePrev, horzEdge.bot);
                    this.AddJoin(op1, op2, horzEdge.top);
                } else if (eNext != null
                    && fltEquals(eNext.curr.x, horzEdge.bot.x)
                    && fltEquals(eNext.curr.y, horzEdge.bot.y)
                    && eNext.windDelta != 0
                    && eNext.outIdx >= 0
                    && eNext.curr.y > eNext.top.y
                    && SlopesEqual2E(horzEdge, eNext)) {
                    let op2 = this.AddOutPt(eNext, horzEdge.bot);
                    this.AddJoin(op1, op2, horzEdge.top);
                }
            } else {
                horzEdge = this.UpdateEdgeIntoAEL(horzEdge);
            }
        } else {
            if (horzEdge.outIdx >= 0) {
                this.AddOutPt(horzEdge, horzEdge.top);
            }
            this.DeleteFromAEL(horzEdge);
        }
    }

    private ProcessIntersections(topY: number): boolean {
        if (this.m_ActiveEdges == null) {
            return true;
        }
        try {
            this.BuildIntersectList(topY);
            if (this.m_IntersectList.length == 0) {
                return true;
            }
            if (this.m_IntersectList.length == 1
                || this.FixupIntersectionOrder()) {
                this.ProcessIntersectList();
            } else {
                return false;
            }
        } catch (e) {
            this.m_SortedEdges = null as any;
            this.m_IntersectList.length = 0;
            throw new Error("ProcessIntersections error");
        }
        this.m_SortedEdges = null as any;
        return true;
    }

    private BuildIntersectList(topY: number): void {
        if (this.m_ActiveEdges == null) {
            return;
        }

        //prepare for sorting ...
        let e = this.m_ActiveEdges;
        this.m_SortedEdges = e;
        while (e != null) {
            e.prevInSEL = e.prevInAEL;
            e.nextInSEL = e.nextInAEL;
            e.curr = new ClipPoint(TopX(e, topY), e.curr.y);
            e = e.nextInAEL;
        }

        //bubblesort ...
        let isModified = true;
        while (isModified && this.m_SortedEdges != null) {
            isModified = false;
            e = this.m_SortedEdges;
            while (e.nextInSEL != null) {
                let eNext = e.nextInSEL;
                let pt: ClipPoint;
                if (e.curr.x > eNext.curr.x) {
                    pt = IntersectPoint(e, eNext);
                    if (pt.y < topY) {
                        pt = new ClipPoint(TopX(e, topY), topY);
                    }
                    this.m_IntersectList.push(new IntersectNode(e, eNext, pt));

                    this.SwapPositionsInSEL(e, eNext);
                    isModified = true;
                } else {
                    e = eNext;
                }
            }
            if (e.prevInSEL != null) {
                e.prevInSEL.nextInSEL = null as any;
            } else {
                break;
            }
        }
        this.m_SortedEdges = null as any;
    }

    private FixupIntersectionOrder(): boolean {
        //pre-condition: intersections are sorted bottom-most first.
        //Now it's crucial that intersections are made only between adjacent edges,
        //so to ensure this the order of intersections may need adjusting ...
        this.m_IntersectList.sort(MyIntersectNodeSort);

        this.CopyAELToSEL();
        let cnt = this.m_IntersectList.length;
        for (let i = 0; i < cnt; i++) {
            if (!EdgesAdjacent(this.m_IntersectList[i])) {
                let j = i + 1;
                while (j < cnt && !EdgesAdjacent(this.m_IntersectList[j])) {
                    j++;
                }
                if (j == cnt) {
                    return false;
                }

                let tmp = this.m_IntersectList[i];
                this.m_IntersectList[i] = this.m_IntersectList[j];
                this.m_IntersectList[j] = tmp;
            }
            this.SwapPositionsInSEL(this.m_IntersectList[i].edge1, this.m_IntersectList[i].edge2);
        }
        return true;
    }

    private ProcessIntersectList(): void {
        for (let iNode of this.m_IntersectList) {
            this.IntersectEdges(iNode.edge1, iNode.edge2, iNode.pt);
            this.SwapPositionsInAEL(iNode.edge1, iNode.edge2);
        }
        this.m_IntersectList.length = 0;
    }

    private ProcessEdgesAtTopOfScanbeam(topY: number): void {
        let e = this.m_ActiveEdges;
        while (e != null) {
            //1. process maxima, treating them as if they're 'bent' horizontal edges,
            //   but exclude maxima with horizontal edges. nb: e can't be a horizontal.
            let IsMaximaEdge = IsMaxima(e, topY);

            if (IsMaximaEdge) {
                let eMaxPair = GetMaximaPairEx(e);
                IsMaximaEdge = (eMaxPair == null || !IsHorizontal(eMaxPair));
            }

            if (IsMaximaEdge) {
                if (this.StrictlySimple) {
                    this.InsertMaxima(e.top.x);
                }
                let ePrev = e.prevInAEL;
                this.DoMaxima(e);
                if (ePrev == null) {
                    e = this.m_ActiveEdges;
                } else {
                    e = ePrev.nextInAEL;
                }
            } else {
                //2. promote horizontal edges, otherwise update Curr.X and Curr.Y ...
                if (IsIntermediate(e, topY) && IsHorizontal(e.nextInLML)) {
                    e = this.UpdateEdgeIntoAEL(e);
                    if (e.outIdx >= 0) {
                        this.AddOutPt(e, e.bot);
                    }
                    this.AddEdgeToSEL(e);
                } else {
                    e.curr = new ClipPoint(TopX(e, topY), topY);
                }
                //When StrictlySimple and 'e' is being touched by another edge, then
                //make sure both edges have a vertex here ...
                if (this.StrictlySimple) {
                    let ePrev = e.prevInAEL;
                    if (e.outIdx >= 0
                        && e.windDelta != 0
                        && ePrev != null
                        && ePrev.outIdx >= 0
                        && fltEquals(ePrev.curr.x, e.curr.x)
                        && ePrev.windDelta != 0) {
                        let ip = new ClipPoint(e.curr.x, e.curr.y);
                        let op = this.AddOutPt(ePrev, ip);
                        let op2 = this.AddOutPt(e, ip);
                        this.AddJoin(op, op2, ip); //StrictlySimple (type-3) join
                    }
                }

                e = e.nextInAEL;
            }
        }

        //3. Process horizontals at the Top of the scanbeam ...
        this.ProcessHorizontals();
        this.m_Maxima = null as any;

        //4. Promote intermediate vertices ...
        e = this.m_ActiveEdges;
        while (e != null) {
            if (IsIntermediate(e, topY)) {
                let op: OutPt = null as any;
                if (e.outIdx >= 0) {
                    op = this.AddOutPt(e, e.top);
                }
                e = this.UpdateEdgeIntoAEL(e);

                //if output polygons share an edge, they'll need joining later ...
                let ePrev = e.prevInAEL;
                let eNext = e.nextInAEL;
                if (ePrev != null
                    && fltEquals(ePrev.curr.x, e.bot.x)
                    && fltEquals(ePrev.curr.y, e.bot.y)
                    && op != null
                    && ePrev.outIdx >= 0
                    && ePrev.curr.y > ePrev.top.y
                    && SlopesEqual4P(e.curr, e.top, ePrev.curr, ePrev.top)
                    && e.windDelta != 0
                    && ePrev.windDelta != 0) {
                    let op2 = this.AddOutPt(ePrev, e.bot);
                    this.AddJoin(op, op2, e.top);
                } else if (eNext != null
                    && fltEquals(eNext.curr.x, e.bot.x)
                    && fltEquals(eNext.curr.y, e.bot.y)
                    && op != null
                    && eNext.outIdx >= 0
                    && eNext.curr.y > eNext.top.y
                    && SlopesEqual4P(e.curr, e.top, eNext.curr, eNext.top)
                    && e.windDelta != 0
                    && eNext.windDelta != 0) {
                    let op2 = this.AddOutPt(eNext, e.bot);
                    this.AddJoin(op, op2, e.top);
                }
            }
            e = e.nextInAEL;
        }
    }

    private DoMaxima(e: TEdge): void {
        let eMaxPair = GetMaximaPairEx(e);
        if (eMaxPair == null) {
            if (e.outIdx >= 0) {
                this.AddOutPt(e, e.top);
            }
            this.DeleteFromAEL(e);
            return;
        }

        let eNext = e.nextInAEL;
        while (eNext != null && eNext != eMaxPair) {
            this.IntersectEdges(e, eNext, e.top);
            this.SwapPositionsInAEL(e, eNext);
            eNext = e.nextInAEL;
        }

        if (e.outIdx == Unassigned && eMaxPair.outIdx == Unassigned) {
            this.DeleteFromAEL(e);
            this.DeleteFromAEL(eMaxPair);
        } else if (e.outIdx >= 0 && eMaxPair.outIdx >= 0) {
            if (e.outIdx >= 0) {
                this.AddLocalMaxPoly(e, eMaxPair, e.top);
            }
            this.DeleteFromAEL(e);
            this.DeleteFromAEL(eMaxPair);
        } else if (e.windDelta == 0) {
            if (e.outIdx >= 0) {
                this.AddOutPt(e, e.top);
                e.outIdx = Unassigned;
            }
            this.DeleteFromAEL(e);

            if (eMaxPair.outIdx >= 0) {
                this.AddOutPt(eMaxPair, e.top);
                eMaxPair.outIdx = Unassigned;
            }
            this.DeleteFromAEL(eMaxPair);
        } else {
            throw new Error("DoMaxima error");
        }
    }

    private BuildResult(polyg: Paths): void {
        polyg.Clear();
        //polyg.length = this.m_PolyOuts.length;
        for (let outRec of this.m_PolyOuts) {
            if (outRec.pts == null) {
                continue;
            }
            let p = outRec.pts.prev;
            let cnt = PointCount(p);
            if (cnt < 2) {
                continue;
            }
            let pg = new Array<ClipPoint>();
            for (let j = 0; j < cnt; j++) {
                pg.push(p.pt);
                p = p.prev;
            }
            const list = new List<ClipPoint>();
            for (let j = 0; j < pg.length; j++) {
                list.Add(pg[j]);
            }
            polyg.Add(list);

        }
    }

    private BuildResult2(polytree: PolyTree): void {
        polytree.clear();

        //add each output polygon/contour to polytree ...
        //polytree.m_AllPolys.length = this.m_PolyOuts.length;
        for (let outRec of this.m_PolyOuts) {
            let cnt = PointCount(outRec.pts);
            if ((outRec.isOpen && cnt < 2)
                || (!outRec.isOpen && cnt < 3)) {
                continue;
            }
            this.FixHoleLinkage(outRec);
            let pn = new PolyNode();
            polytree.allPolys.push(pn);
            outRec.polyNode = pn;
            //pn.m_polygon.length = cnt;
            let op = outRec.pts.prev;
            for (let j = 0; j < cnt; j++) {
                pn.polygon.Add(op.pt);
                op = op.prev;
            }
        }

        //fixup PolyNode links etc ...
        //polytree.m_Childs.length = m_PolyOuts.length;
        for (let outRec of this.m_PolyOuts) {
            if (outRec.polyNode == null) {
                continue;
            } else if (outRec.isOpen) {
                outRec.polyNode.isOpen = true;
                polytree.addChild(outRec.polyNode);
            } else if (outRec.firstLeft != null
                && outRec.firstLeft.polyNode != null) {
                outRec.firstLeft.polyNode.addChild(outRec.polyNode);
            } else {
                polytree.addChild(outRec.polyNode);
            }
        }
    }

    private FixupOutPolyline(outrec: OutRec): void {
        let pp = outrec.pts;
        let lastPP = pp.prev;
        while (pp !== lastPP) {
            pp = pp.next;
            if (pp.pt.equals(pp.prev.pt)) {
                if (pp === lastPP) {
                    lastPP = pp.prev;
                }
                let tmpPP = pp.prev;
                tmpPP.next = pp.next;
                pp.next.prev = tmpPP;
                pp = tmpPP;
            }
        }
        if (pp === pp.prev) {
            outrec.pts = null as any;
        }
    }

    private FixupOutPolygon(outRec: OutRec): void {
        //FixupOutPolygon() - removes duplicate points and simplifies consecutive
        //parallel edges by removing the middle vertex.
        let lastOK: OutPt = null as any;
        outRec.bottomPt = null as any;
        let pp = outRec.pts;
        let preserveCol = this.PreserveCollinear || this.StrictlySimple;
        for (; ;) {
            if (pp.prev == pp || pp.prev == pp.next) {
                outRec.pts = null as any;
                return;
            }
            //test for duplicate points and collinear edges ...
            if (pp.pt.equals(pp.next.pt)
                || pp.pt.equals(pp.prev.pt)
                || (SlopesEqual3P(pp.prev.pt, pp.pt, pp.next.pt)
                    && (!preserveCol || !Pt2IsBetweenPt1AndPt3(pp.prev.pt, pp.pt, pp.next.pt)))) {
                lastOK = null as any;
                pp.prev.next = pp.next;
                pp.next.prev = pp.prev;
                pp = pp.prev;
            } else if (pp === lastOK) {
                break;
            } else {
                if (lastOK == null) {
                    lastOK = pp;
                }
                pp = pp.next;
            }
        }
        outRec.pts = pp;
    }

    private JoinHorz(op1: OutPt, op1b: OutPt, op2: OutPt, op2b: OutPt, Pt: ClipPoint, DiscardLeft: boolean): boolean {
        let Dir1 = op1.pt.x > op1b.pt.x ?
            Direction.dRightToLeft : Direction.dLeftToRight;
        let Dir2 = op2.pt.x > op2b.pt.x ?
            Direction.dRightToLeft : Direction.dLeftToRight;
        if (Dir1 == Dir2) {
            return false;
        }

        //When DiscardLeft, we want Op1b to be on the Left of Op1, otherwise we
        //want Op1b to be on the Right. (And likewise with Op2 and Op2b.)
        //So, to facilitate this while inserting Op1b and Op2b ...
        //when DiscardLeft, make sure we're AT or RIGHT of Pt before adding Op1b,
        //otherwise make sure we're AT or LEFT of Pt. (Likewise with Op2b.)
        if (Dir1 === Direction.dLeftToRight) {
            while (op1.next.pt.x <= Pt.x
                && op1.next.pt.x >= op1.pt.x
                && fltEquals(op1.next.pt.y, Pt.y)) {
                op1 = op1.next;
            }
            if (DiscardLeft && !fltEquals(op1.pt.x, Pt.x)) {
                op1 = op1.next;
            }
            op1b = DupOutPt(op1, !DiscardLeft);
            if (op1b.pt.notEquals(Pt)) {
                op1 = op1b;
                op1.pt = new ClipPoint(Pt.x, Pt.y);
                op1b = DupOutPt(op1, !DiscardLeft);
            }
        } else {
            while (op1.next.pt.x >= Pt.x
                && op1.next.pt.x <= op1.pt.x
                && fltEquals(op1.next.pt.y, Pt.y)) {
                op1 = op1.next;
            }
            if (!DiscardLeft && !fltEquals(op1.pt.x, Pt.x)) {
                op1 = op1.next;
            }
            op1b = DupOutPt(op1, DiscardLeft);
            if (op1b.pt.notEquals(Pt)) {
                op1 = op1b;
                op1.pt = new ClipPoint(Pt.x, Pt.y);
                op1b = DupOutPt(op1, DiscardLeft);
            }
        }

        if (Dir2 === Direction.dLeftToRight) {
            while (op2.next.pt.x <= Pt.x
                && op2.next.pt.x >= op2.pt.x
                && fltEquals(op2.next.pt.y, Pt.y)) {
                op2 = op2.next;
            }
            if (DiscardLeft && !fltEquals(op2.pt.x, Pt.x)) {
                op2 = op2.next;
            }
            op2b = DupOutPt(op2, !DiscardLeft);
            if (op2b.pt.notEquals(Pt)) {
                op2 = op2b;
                op2.pt = new ClipPoint(Pt.x, Pt.y);
                op2b = DupOutPt(op2, !DiscardLeft);
            }
        } else {
            while (op2.next.pt.x >= Pt.x
                && op2.next.pt.x <= op2.pt.x
                && fltEquals(op2.next.pt.y, Pt.y)) {
                op2 = op2.next;
            }
            if (!DiscardLeft && !fltEquals(op2.pt.x, Pt.x)) {
                op2 = op2.next;
            }
            op2b = DupOutPt(op2, DiscardLeft);
            if (op2b.pt.notEquals(Pt)) {
                op2 = op2b;
                op2.pt = new ClipPoint(Pt.x, Pt.y);
                op2b = DupOutPt(op2, DiscardLeft);
            }
        }

        if ((Dir1 === Direction.dLeftToRight) === DiscardLeft) {
            op1.prev = op2;
            op2.next = op1;
            op1b.next = op2b;
            op2b.prev = op1b;
        } else {
            op1.next = op2;
            op2.prev = op1;
            op1b.prev = op2b;
            op2b.next = op1b;
        }
        return true;
    }

    private JoinPoints(j: Join, outRec1: OutRec, outRec2: OutRec): boolean {
        let op1 = j.outPt1;
        let op1b: OutPt;
        let op2 = j.outPt2;
        let op2b: OutPt;

        //There are 3 kinds of joins for output polygons ...
        //1. Horizontal joins where Join.OutPt1 & Join.OutPt2 are vertices anywhere
        //along (horizontal) collinear edges (& Join.OffPt is on the same horizontal).
        //2. Non-horizontal joins where Join.OutPt1 & Join.OutPt2 are at the same
        //location at the Bottom of the overlapping segment (& Join.OffPt is above).
        //3. StrictlySimple joins where edges touch but are not collinear and where
        //Join.OutPt1, Join.OutPt2 & Join.OffPt all share the same point.
        let isHorizontal = fltEquals(j.outPt1.pt.y, j.offPt.y);

        if (isHorizontal
            && j.offPt.equals(j.outPt1.pt)
            && j.offPt.equals(j.outPt2.pt)) {
            //Strictly Simple join ...
            if (outRec1 !== outRec2) {
                return false;
            }
            op1b = j.outPt1.next;
            while (op1b !== op1 && op1b.pt.equals(j.offPt)) {
                op1b = op1b.next;
            }
            let reverse1 = op1b.pt.y > j.offPt.y;
            op2b = j.outPt2.next;
            while (op2b !== op2 && op2b.pt.equals(j.offPt)) {
                op2b = op2b.next;
            }
            let reverse2 = op2b.pt.y > j.offPt.y;
            if (reverse1 === reverse2) {
                return false;
            }
            if (reverse1) {
                op1b = DupOutPt(op1, false);
                op2b = DupOutPt(op2, true);
                op1.prev = op2;
                op2.next = op1;
                op1b.next = op2b;
                op2b.prev = op1b;
                j.outPt1 = op1;
                j.outPt2 = op1b;
                return true;
            } else {
                op1b = DupOutPt(op1, true);
                op2b = DupOutPt(op2, false);
                op1.next = op2;
                op2.prev = op1;
                op1b.prev = op2b;
                op2b.next = op1b;
                j.outPt1 = op1;
                j.outPt2 = op1b;
                return true;
            }
        } else if (isHorizontal) {
            //treat horizontal joins differently to non-horizontal joins since with
            //them we're not yet sure where the overlapping is. OutPt1.Pt & OutPt2.Pt
            //may be anywhere along the horizontal edge.
            op1b = op1;
            while (fltEquals(op1.prev.pt.y, op1.pt.y)
                && op1.prev !== op1b
                && op1.prev !== op2) {
                op1 = op1.prev;
            }
            while (fltEquals(op1b.next.pt.y, op1b.pt.y)
                && op1b.next !== op1
                && op1b.next !== op2) {
                op1b = op1b.next;
            }
            if (op1b.next === op1 || op1b.next === op2) {
                return false; //a flat 'polygon'
            }

            op2b = op2;
            while (fltEquals(op2.prev.pt.y, op2.pt.y)
                && op2.prev !== op2b
                && op2.prev !== op1b) {
                op2 = op2.prev;
            }
            while (fltEquals(op2b.next.pt.y, op2b.pt.y)
                && op2b.next !== op2
                && op2b.next !== op1) {
                op2b = op2b.next;
            }
            if (op2b.next === op2 || op2b.next === op1) {
                return false; //a flat 'polygon'
            }

            let r = GetOverlap(op1.pt.x, op1b.pt.x, op2.pt.x, op2b.pt.x);
            //Op1 -. Op1b & Op2 -. Op2b are the extremites of the horizontal edges
            if (!r.r) {
                return false;
            }
            let Left = r.Left;
            let Right = r.Right;

            //DiscardLeftSide: when overlapping edges are joined, a spike will created
            //which needs to be cleaned up. However, we don't want Op1 or Op2 caught up
            //on the discard Side as either may still be needed for other joins ...
            let Pt: ClipPoint;
            let DiscardLeftSide: boolean;
            if (op1.pt.x >= Left && op1.pt.x <= Right) {
                Pt = op1.pt;
                DiscardLeftSide = op1.pt.x > op1b.pt.x;
            } else if (op2.pt.x >= Left && op2.pt.x <= Right) {
                Pt = op2.pt;
                DiscardLeftSide = op2.pt.x > op2b.pt.x;
            } else if (op1b.pt.x >= Left && op1b.pt.x <= Right) {
                Pt = op1b.pt;
                DiscardLeftSide = op1b.pt.x > op1.pt.x;
            } else {
                Pt = op2b.pt;
                DiscardLeftSide = op2b.pt.x > op2.pt.x;
            }
            j.outPt1 = op1;
            j.outPt2 = op2;
            return this.JoinHorz(op1, op1b, op2, op2b, Pt, DiscardLeftSide);
        } else {
            //nb: For non-horizontal joins ...
            //    1. Jr.OutPt1.Pt.Y == Jr.OutPt2.Pt.Y
            //    2. Jr.OutPt1.Pt > Jr.OffPt.Y

            //make sure the polygons are correctly oriented ...
            op1b = op1.next;
            while (op1b.pt.equals(op1.pt) && op1b !== op1) {
                op1b = op1b.next;
            }
            let Reverse1 = op1b.pt.y > op1.pt.y
                || !SlopesEqual3P(op1.pt, op1b.pt, j.offPt);
            if (Reverse1) {
                op1b = op1.prev;
                while (op1b.pt.equals(op1.pt) && op1b !== op1) {
                    op1b = op1b.prev;
                }
                if (op1b.pt.y > op1.pt.y
                    || !SlopesEqual3P(op1.pt, op1b.pt, j.offPt)) {
                    return false;
                }
            }
            op2b = op2.next;
            while (op2b.pt.equals(op2.pt) && op2b !== op2) {
                op2b = op2b.next;
            }
            let Reverse2 = op2b.pt.y > op2.pt.y
                || !SlopesEqual3P(op2.pt, op2b.pt, j.offPt);
            if (Reverse2) {
                op2b = op2.prev;
                while (op2b.pt.equals(op2.pt) && op2b !== op2) {
                    op2b = op2b.prev;
                }
                if (op2b.pt.y > op2.pt.y
                    || !SlopesEqual3P(op2.pt, op2b.pt, j.offPt)) {
                    return false;
                }
            }

            if (op1b == op1 || op2b == op2 || op1b == op2b ||
                (outRec1 == outRec2 && Reverse1 == Reverse2)) {
                return false;
            }

            if (Reverse1) {
                op1b = DupOutPt(op1, false);
                op2b = DupOutPt(op2, true);
                op1.prev = op2;
                op2.next = op1;
                op1b.next = op2b;
                op2b.prev = op1b;
                j.outPt1 = op1;
                j.outPt2 = op1b;
                return true;
            } else {
                op1b = DupOutPt(op1, true);
                op2b = DupOutPt(op2, false);
                op1.next = op2;
                op2.prev = op1;
                op1b.prev = op2b;
                op2b.next = op1b;
                j.outPt1 = op1;
                j.outPt2 = op1b;
                return true;
            }
        }
    }

    private FixupFirstLefts1(OldOutRec: OutRec, NewOutRec: OutRec): void {
        for (let outRec of this.m_PolyOuts) {
            let firstLeft = ParseFirstLeft(outRec.firstLeft);
            if (outRec.pts != null && firstLeft == OldOutRec) {
                if (Poly2ContainsPoly1(outRec.pts, NewOutRec.pts)) {
                    outRec.firstLeft = NewOutRec;
                }
            }
        }
    }

    private FixupFirstLefts2(innerOutRec: OutRec, outerOutRec: OutRec): void {
        //A polygon has split into two such that one is now the inner of the other.
        //It's possible that these polygons now wrap around other polygons, so check
        //every polygon that's also contained by OuterOutRec's FirstLeft container
        //(including nil) to see if they've become inner to the new inner polygon ...
        let orfl = outerOutRec.firstLeft;
        for (let outRec of this.m_PolyOuts) {
            if (outRec.pts == null || outRec == outerOutRec || outRec == innerOutRec) {
                continue;
            }
            let firstLeft = ParseFirstLeft(outRec.firstLeft);
            if (firstLeft != orfl && firstLeft != innerOutRec && firstLeft != outerOutRec) {
                continue;
            }
            if (Poly2ContainsPoly1(outRec.pts, innerOutRec.pts)) {
                outRec.firstLeft = innerOutRec;
            } else if (Poly2ContainsPoly1(outRec.pts, outerOutRec.pts)) {
                outRec.firstLeft = outerOutRec;
            } else if (outRec.firstLeft == innerOutRec || outRec.firstLeft == outerOutRec) {
                outRec.firstLeft = orfl;
            }
        }
    }

    private FixupFirstLefts3(OldOutRec: OutRec, NewOutRec: OutRec): void {
        //same as FixupFirstLefts1 but doesn't call Poly2ContainsPoly1()
        for (let outRec of this.m_PolyOuts) {
            let firstLeft = ParseFirstLeft(outRec.firstLeft);
            if (outRec.pts != null && firstLeft == OldOutRec) {
                outRec.firstLeft = NewOutRec;
            }
        }
    }

    private JoinCommonEdges(): void {
        for (let join of this.m_Joins) {
            let outRec1 = this.GetOutRec(join.outPt1.idx);
            let outRec2 = this.GetOutRec(join.outPt2.idx);

            if (outRec1.pts == null || outRec2.pts == null) {
                continue;
            }
            if (outRec1.isOpen || outRec2.isOpen) {
                continue;
            }

            //get the polygon fragment with the correct hole state (FirstLeft)
            //before calling JoinPoints() ...
            let holeStateRec: OutRec;
            if (outRec1 == outRec2) {
                holeStateRec = outRec1;
            } else if (OutRec1RightOfOutRec2(outRec1, outRec2)) {
                holeStateRec = outRec2;
            } else if (OutRec1RightOfOutRec2(outRec2, outRec1)) {
                holeStateRec = outRec1;
            } else {
                holeStateRec = GetLowermostRec(outRec1, outRec2);
            }

            if (!this.JoinPoints(join, outRec1, outRec2)) {
                continue;
            }

            if (outRec1 == outRec2) {
                //instead of joining two polygons, we've just created a new one by
                //splitting one polygon into two.
                outRec1.pts = join.outPt1;
                outRec1.bottomPt = null as any;
                outRec2 = this.CreateOutRec();
                outRec2.pts = join.outPt2;

                //update all OutRec2.Pts Idx's ...
                UpdateOutPtIdxs(outRec2);

                if (Poly2ContainsPoly1(outRec2.pts, outRec1.pts)) {
                    //outRec1 contains outRec2 ...
                    outRec2.isHole = !outRec1.isHole;
                    outRec2.firstLeft = outRec1;

                    if (this.m_UsingPolyTree) {
                        this.FixupFirstLefts2(outRec2, outRec1);
                    }

                    if (XOR(outRec2.isHole, this.ReverseSolution) == (Area(outRec2) > 0)) {
                        ReversePolyPtLinks(outRec2.pts);
                    }
                } else if (Poly2ContainsPoly1(outRec1.pts, outRec2.pts)) {
                    //outRec2 contains outRec1 ...
                    outRec2.isHole = outRec1.isHole;
                    outRec1.isHole = !outRec2.isHole;
                    outRec2.firstLeft = outRec1.firstLeft;
                    outRec1.firstLeft = outRec2;

                    if (this.m_UsingPolyTree) {
                        this.FixupFirstLefts2(outRec1, outRec2);
                    }

                    if (XOR(outRec1.isHole, this.ReverseSolution) == (Area(outRec1) > 0)) {
                        ReversePolyPtLinks(outRec1.pts);
                    }
                } else {
                    //the 2 polygons are completely separate ...
                    outRec2.isHole = outRec1.isHole;
                    outRec2.firstLeft = outRec1.firstLeft;

                    //fixup FirstLeft pointers that may need reassigning to OutRec2
                    if (this.m_UsingPolyTree) {
                        this.FixupFirstLefts1(outRec1, outRec2);
                    }
                }
            } else {
                //joined 2 polygons together ...

                outRec2.pts = null as any;
                outRec2.bottomPt = null as any;
                outRec2.idx = outRec1.idx;

                outRec1.isHole = holeStateRec.isHole;
                if (holeStateRec == outRec2) {
                    outRec1.firstLeft = outRec2.firstLeft;
                }
                outRec2.firstLeft = outRec1;

                //fixup FirstLeft pointers that may need reassigning to OutRec1
                if (this.m_UsingPolyTree) {
                    this.FixupFirstLefts3(outRec2, outRec1);
                }
            }
        }
    }

    private DoSimplePolygons(): void {
        let i = 0;
        while (i < this.m_PolyOuts.length) {
            let outrec = this.m_PolyOuts[i++];
            let op = outrec.pts;
            if (op == null || outrec.isOpen) {
                continue;
            }
            do {//for each Pt in Polygon until duplicate found do ...
                let op2 = op.next;
                while (op2 != outrec.pts) {
                    if (op.pt.equals(op2.pt) && op2.next != op && op2.prev != op) {
                        //split the polygon into two ...
                        let op3 = op.prev;
                        let op4 = op2.prev;
                        op.prev = op4;
                        op4.next = op;
                        op2.prev = op3;
                        op3.next = op2;

                        outrec.pts = op;
                        let outrec2 = this.CreateOutRec();
                        outrec2.pts = op2;
                        UpdateOutPtIdxs(outrec2);
                        if (Poly2ContainsPoly1(outrec2.pts, outrec.pts)) {
                            //OutRec2 is contained by OutRec1 ...
                            outrec2.isHole = !outrec.isHole;
                            outrec2.firstLeft = outrec;
                            if (this.m_UsingPolyTree) {
                                this.FixupFirstLefts2(outrec2, outrec);
                            }
                        } else if (Poly2ContainsPoly1(outrec.pts, outrec2.pts)) {
                            //OutRec1 is contained by OutRec2 ...
                            outrec2.isHole = outrec.isHole;
                            outrec.isHole = !outrec2.isHole;
                            outrec2.firstLeft = outrec.firstLeft;
                            outrec.firstLeft = outrec2;
                            if (this.m_UsingPolyTree) {
                                this.FixupFirstLefts2(outrec, outrec2);
                            }
                        } else {
                            //the 2 polygons are separate ...
                            outrec2.isHole = outrec.isHole;
                            outrec2.firstLeft = outrec.firstLeft;
                            if (this.m_UsingPolyTree) {
                                this.FixupFirstLefts1(outrec, outrec2);
                            }
                        }
                        op2 = op; //ie get ready for the next iteration
                    }
                    op2 = op2.next;
                }
                op = op.next;
            } while (op != outrec.pts);
        }
    }

    // SimplifyPolygon functions ...
    // Convert self-intersecting polygons into simple polygons
    public static SimplifyPolygon(poly: Path, fillType: PolyFillType = PolyFillType.pftEvenOdd): Paths {
        let result = new List<Path>();
        let c = new Clipper();
        c.StrictlySimple = true;
        c.AddPath(poly, PolyType.ptSubject, true);
        c.ExecutePaths(ClipType.ctUnion, result, fillType, fillType);
        return result;
    }

    public static SimplifyPolygons(polys: Paths, fillType: PolyFillType = PolyFillType.pftEvenOdd): Paths {
        let result = new List<Path>();
        let c = new Clipper();
        c.StrictlySimple = true;
        c.AddPaths(polys, PolyType.ptSubject, true);
        c.ExecutePaths(ClipType.ctUnion, result, fillType, fillType);
        return result;
    }

    public static CleanPolygon(path: Path, distance: number = 1.415): Path {
        //distance = proximity in units/pixels below which vertices will be stripped.
        //Default ~= sqrt(2) so when adjacent vertices or semi-adjacent vertices have
        //both x & y coords within 1 unit, then the second vertex will be stripped.

        let cnt = path.Count;
        let result = new List<ClipPoint>();

        if (cnt === 0) {
            return result;
        }

        let outPts = new Array<OutPt>(cnt);
        for (let i = 0; i < cnt; ++i) {
            outPts[i] = new OutPt();
        }

        for (let i = 0; i < cnt; ++i) {
            outPts[i].pt = new ClipPoint(path[i].x, path[i].y);
            outPts[i].next = outPts[(i + 1) % cnt];
            outPts[i].next.prev = outPts[i];
            outPts[i].idx = 0;
        }

        let distSqrd = distance * distance;
        let op = outPts[0];
        while (op.idx == 0 && op.next != op.prev) {
            if (PointsAreClose(op.pt, op.prev.pt, distSqrd)) {
                op = ExcludeOp(op);
                cnt--;
            } else if (PointsAreClose(op.prev.pt, op.next.pt, distSqrd)) {
                ExcludeOp(op.next);
                op = ExcludeOp(op);
                cnt -= 2;
            } else if (SlopesNearCollinear(op.prev.pt, op.pt, op.next.pt, distSqrd)) {
                op = ExcludeOp(op);
                cnt--;
            } else {
                op.idx = 1;
                op = op.next;
            }
        }

        if (cnt < 3) {
            cnt = 0;
        }
        for (let i = 0; i < cnt; ++i) {
            result.Add(op.pt);
            op = op.next;
        }
        outPts = null as any;
        return result;
    }

    public static CleanPolygons(polys: Paths, distance: number = 1.415): Paths {
        let result = new List<Path>();
        foreach ( polys, ( poly:Path )=>{
            result.Add(Clipper.CleanPolygon(poly, distance));
        });

        return result;
    }

    private static Minkowski(pattern: Path, path: Path, IsSum: boolean, IsClosed: boolean): Paths {
        let delta = (IsClosed ? 1 : 0);
        let polyCnt = pattern.Count;
        let pathCnt = path.Count;
        let result = new List<Path>(); //(pathCnt);
        if (IsSum) {
            for (let i = 0; i < pathCnt; i++) {
                let p = new List<ClipPoint>();
                foreach ( pattern, (ip:ClipPoint)=>{
                    p.Add(new ClipPoint(path[i].x + ip.x, path[i].y + ip.y));
                }) ;
                result.Add(p);
            }
        } else {
            for (let i = 0; i < pathCnt; i++) {
                let p = new List<ClipPoint>(); //(polyCnt);
                foreach (pattern, (ip: ClipPoint )=>{
                    p.Add(new ClipPoint(path[i].x - ip.x, path[i].y - ip.y));
                });
                result.Add(p);
            }
        }
        let quads = new List<Path>();//((pathCnt + delta) * (polyCnt + 1));
        for (let i = 0; i < pathCnt - 1 + delta; i++) {
            for (let j = 0; j < polyCnt; j++) {
                let quad = new List<ClipPoint>(4);
                quad[0] = result[i % pathCnt][j % polyCnt];
                quad[1] = result[(i + 1) % pathCnt][j % polyCnt];
                quad[2] = result[(i + 1) % pathCnt][(j + 1) % polyCnt];
                quad[3] = result[i % pathCnt][(j + 1) % polyCnt];
                if (!Orientation(quad)) {
                    quad.Reverse();
                }
                quads.Add(quad);
            }
        }
        return quads;
    }

    public static MinkowskiSumPath(pattern: Path, path: Path, pathIsClosed: boolean): Paths {
        let paths = Clipper.Minkowski(pattern, path, true, pathIsClosed);
        let c = new Clipper();
        c.AddPaths(paths, PolyType.ptSubject, true);
        c.ExecutePaths(ClipType.ctUnion, paths, PolyFillType.pftNonZero, PolyFillType.pftNonZero);
        return paths;
    }

    public static TranslatePath(path: Path, delta: ClipPoint): Path {
        let outPath = new List<ClipPoint>(path.Count);
        for (let i = 0; i < path.Count; i++) {
            outPath[i] = new ClipPoint(path[i].x + delta.x, path[i].y + delta.y);
        }
        return outPath;
    }

    public static MinkowskiSumPaths(pattern: Path, paths: Paths, pathIsClosed: boolean): Paths {
        let solution = new List<Path>();
        let c = new Clipper();
        for (let i = 0; i < paths.Count; ++i) {
            let tmp = Clipper.Minkowski(pattern, paths[i], true, pathIsClosed);
            c.AddPaths(tmp, PolyType.ptSubject, true);
            if (pathIsClosed) {
                let path = Clipper.TranslatePath(paths[i], pattern[0]);
                c.AddPath(path, PolyType.ptClip, true);
            }
        }
        c.ExecutePaths(ClipType.ctUnion, solution, PolyFillType.pftNonZero, PolyFillType.pftNonZero);
        return solution;
    }

    public static MinkowskiDiff(poly1: Path, poly2: Path): Paths {
        let paths = Clipper.Minkowski(poly1, poly2, false, true);
        let c = new Clipper();
        c.AddPaths(paths, PolyType.ptSubject, true);
        c.ExecutePaths(ClipType.ctUnion, paths, PolyFillType.pftNonZero, PolyFillType.pftNonZero);
        return paths;
    }

    public static PolyTreeToPaths(polytree: PolyTree): Paths {
        let result = new List<Path>();
        //result.Capacity = polytree.Total;
        Clipper.AddPolyNodeToPaths(polytree, NodeType.ntAny, result);
        return result;
    }

    private static AddPolyNodeToPaths(polynode: PolyNode, nt: NodeType, paths: Paths): void {
        let match = true;
        switch (nt) {
            case NodeType.ntOpen:
                return;
            case NodeType.ntClosed:
                match = !polynode.isOpen;
                break;
            default:
                break;
        }

        if (polynode.polygon.Count > 0 && match) {
            paths.Add(polynode.polygon);
        }
        for (let pn of polynode.children) {
            Clipper.AddPolyNodeToPaths(pn, nt, paths);
        }
    }


    public static OpenPathsFromPolyTree(polytree: PolyTree): Paths {
        let result = new List<Path>();
        //result.Capacity = polytree.ChildCount;
        for (let pn of polytree.children) {
            if (pn.isOpen) {
                result.Add(pn.polygon);
            }
        }
        return result;
    }

    public static ClosedPathsFromPolyTree(polytree: PolyTree): Paths {
        let result = new List<Path>();
        //result.Capacity = polytree.Total;
        Clipper.AddPolyNodeToPaths(polytree, NodeType.ntClosed, result);
        return result;
    }
} //end Clipper

export class ClipperOffset {
    private m_destPolys: Paths = undefined as any;
    private m_srcPoly: Path= undefined as any;
    private m_destPoly: Path= undefined as any;
    private m_normals: Array<ClipPoint> = new Array<ClipPoint>();
    private m_delta: number = 0;
    private m_sinA: number = 0;
    private m_sin: number = 0;
    private m_cos: number = 0;
    private m_miterLim: number = 0;
    private m_StepsPerRad: number = 0;

    private m_lowest: { x: number, y: number } = undefined as any;
    private m_polyNodes: PolyNode = new PolyNode();

    public ArcTolerance: number;
    public MiterLimit: number;

    public constructor(miterLimit: number = 2.0, arcTolerance: number = DefArcTolerance) {
        this.MiterLimit = miterLimit;
        this.ArcTolerance = arcTolerance;
        this.m_lowest.x = -1;
    }

    public clear(): void {
        this.m_polyNodes.children.length = 0;
        this.m_lowest.x = -1;
    }

    public AddPath(path: Path, joinType: JoinType, endType: EndType): void {
        let highI = path.Count - 1;
        if (highI < 0) {
            return;
        }
        let newNode = new PolyNode();
        newNode.joinType = joinType;
        newNode.endType = endType;

        //strip duplicate points from path and also get index to the lowest point ...
        if (endType == EndType.etClosedLine || endType == EndType.etClosedPolygon) {
            while (highI > 0 && path[0] == path[highI]) {
                highI--;
            }
        }
        //newNode.polygon.Capacity = highI + 1;
        newNode.polygon.Add(path[0]);
        let j = 0, k = 0;
        for (let i = 1; i <= highI; i++) {
            if (newNode.polygon[j] != path[i]) {
                j++;
                newNode.polygon.Add(path[i]);
                if (path[i].y > newNode.polygon[k].y
                    || (fltEquals(path[i].y, newNode.polygon[k].y)
                        && path[i].x < newNode.polygon[k].x)) {
                    k = j;
                }
            }
        }
        if (endType === EndType.etClosedPolygon && j < 2) {
            return;
        }

        this.m_polyNodes.addChild(newNode);

        //if this path's lowest pt is lower than all the others then update m_lowest
        if (endType !== EndType.etClosedPolygon) {
            return;
        }
        if (this.m_lowest.x < 0) {
            this.m_lowest = { x: this.m_polyNodes.childCount - 1, y: k };
        } else {
            let ip = this.m_polyNodes.children[this.m_lowest.x].polygon[this.m_lowest.y];
            if (newNode.polygon[k].y > ip.y
                || (fltEquals(newNode.polygon[k].y, ip.y)
                    && newNode.polygon[k].x < ip.x)) {
                this.m_lowest = { x: this.m_polyNodes.childCount - 1, y: k };
            }
        }
    }

    public AddPaths(paths: Paths, joinType: JoinType, endType: EndType): void {
        foreach (  paths, (p:Path)=>{
            this.AddPath(p, joinType, endType);
        });
    }

    private FixOrientations(): void {
        //fixup orientations of all closed paths if the orientation of the
        //closed path with the lowermost vertex is wrong ...
        if (this.m_lowest.x >= 0 &&
            !Orientation(this.m_polyNodes.children[this.m_lowest.x].polygon)) {
            for (let i = 0; i < this.m_polyNodes.childCount; i++) {
                let node = this.m_polyNodes.children[i];
                if (node.endType === EndType.etClosedPolygon ||
                    (node.endType === EndType.etClosedLine && Orientation(node.polygon))) {
                    node.polygon.Reverse();
                }
            }
        } else {
            for (let i = 0; i < this.m_polyNodes.childCount; i++) {
                let node = this.m_polyNodes.children[i];
                if (node.endType === EndType.etClosedLine
                    && !Orientation(node.polygon)) {
                    node.polygon.Reverse();
                }
            }
        }
    }

    private DoOffset(delta: number): void {
        this.m_destPolys = new List<Path>();
        this.m_delta = delta;

        //if Zero offset, just copy any CLOSED polygons to m_p and return ...
        if (NearZero(delta)) {
            //this.m_destPolys.Capacity = m_polyNodes.ChildCount;
            for (let i = 0; i < this.m_polyNodes.childCount; i++) {
                let node = this.m_polyNodes.children[i];
                if (node.endType === EndType.etClosedPolygon) {
                    this.m_destPolys.Add(node.polygon);
                }
            }
            return;
        }

        //see offset_triginometry3.svg in the documentation folder ...
        if (this.MiterLimit > 2) {
            this.m_miterLim = 2 / (this.MiterLimit * this.MiterLimit);
        } else {
            this.m_miterLim = 0.5;
        }

        let y: number;
        if (this.ArcTolerance <= 0.0) {
            y = DefArcTolerance;
        } else if (this.ArcTolerance > Math.abs(delta) * DefArcTolerance) {
            y = Math.abs(delta) * DefArcTolerance;
        } else {
            y = this.ArcTolerance;
        }
        //see offset_triginometry2.svg in the documentation folder ...
        let steps = Math.PI / Math.acos(1 - y / Math.abs(delta));
        this.m_sin = Math.sin(TwoPI / steps);
        this.m_cos = Math.cos(TwoPI / steps);
        this.m_StepsPerRad = steps / TwoPI;
        if (delta < 0.0) {
            this.m_sin = -this.m_sin;
        }

        //m_destPolys.Capacity = m_polyNodes.ChildCount * 2;
        for (let i = 0; i < this.m_polyNodes.childCount; i++) {
            let node = this.m_polyNodes.children[i];
            this.m_srcPoly = node.polygon;

            let len = this.m_srcPoly.Count;

            if (len === 0
                || (delta <= 0 && (len < 3 || node.endType !== EndType.etClosedPolygon))) {
                continue;
            }

            this.m_destPoly = new List<ClipPoint>();

            if (len === 1) {
                if (node.joinType === JoinType.jtRound) {
                    let X = 1.0, Y = 0.0;
                    for (let j = 1; j <= steps; j++) {
                        this.m_destPoly.Add(
                            new ClipPoint(
                                this.m_srcPoly[0].x + X * delta,
                                this.m_srcPoly[0].y + Y * delta));
                        let X2 = X;
                        X = X * this.m_cos - this.m_sin * Y;
                        Y = X2 * this.m_sin + Y * this.m_cos;
                    }
                } else {
                    let X = -1.0, Y = -1.0;
                    for (let j = 0; j < 4; ++j) {
                        this.m_destPoly.Add(
                            new ClipPoint(
                                this.m_srcPoly[0].x + X * delta,
                                this.m_srcPoly[0].y + Y * delta));
                        if (X < 0) {
                            X = 1;
                        } else if (Y < 0) {
                            Y = 1;
                        } else {
                            X = -1;
                        }
                    }
                }
                this.m_destPolys.Add(this.m_destPoly);
                continue;
            }

            //build m_normals ...
            this.m_normals.length = 0;
            //m_normals.Capacity = len;
            for (let j = 0; j < len - 1; j++) {
                this.m_normals.push(
                    GetUnitNormal(this.m_srcPoly[j], this.m_srcPoly[j + 1]));
            }
            if (node.endType === EndType.etClosedLine
                || node.endType === EndType.etClosedPolygon) {
                this.m_normals.push(
                    GetUnitNormal(this.m_srcPoly[len - 1], this.m_srcPoly[0]));
            } else {
                this.m_normals.push(
                    new ClipPoint(this.m_normals[len - 2].x, this.m_normals[len - 2].y));
            }

            if (node.endType === EndType.etClosedPolygon) {
                let k = len - 1;
                for (let j = 0; j < len; j++) {
                    k = this.OffsetPoint(j, k, node.joinType);
                }
                this.m_destPolys.Add(this.m_destPoly);
            } else if (node.endType === EndType.etClosedLine) {
                let k = len - 1;
                for (let j = 0; j < len; j++) {
                    k = this.OffsetPoint(j, k, node.joinType);
                }
                this.m_destPolys.Add(this.m_destPoly);
                this.m_destPoly = new List<ClipPoint>();
                //re-build m_normals ...
                let n = this.m_normals[len - 1];
                for (let j = len - 1; j > 0; j--) {
                    this.m_normals[j] = new ClipPoint(-this.m_normals[j - 1].x, -this.m_normals[j - 1].y);
                }
                this.m_normals[0] = new ClipPoint(-n.x, -n.y);
                k = 0;
                for (let j = len - 1; j >= 0; j--) {
                    k = this.OffsetPoint(j, k, node.joinType);
                }
                this.m_destPolys.Add(this.m_destPoly);
            } else {
                let k = 0;
                for (let j = 1; j < len - 1; ++j) {
                    k = this.OffsetPoint(j, k, node.joinType);
                }

                let pt1: ClipPoint;
                if (node.endType === EndType.etOpenButt) {
                    let j = len - 1;
                    pt1 = new ClipPoint(
                        this.m_srcPoly[j].x + this.m_normals[j].x * delta,
                        this.m_srcPoly[j].y + this.m_normals[j].y * delta);
                    this.m_destPoly.Add(pt1);
                    pt1 = new ClipPoint(
                        this.m_srcPoly[j].x - this.m_normals[j].x * delta,
                        this.m_srcPoly[j].y - this.m_normals[j].y * delta);
                    this.m_destPoly.Add(pt1);
                } else {
                    let j = len - 1;
                    k = len - 2;
                    this.m_sinA = 0;
                    this.m_normals[j] = new ClipPoint(-this.m_normals[j].x, -this.m_normals[j].y);
                    if (node.endType === EndType.etOpenSquare) {
                        this.DoSquare(j, k);
                    } else {
                        this.DoRound(j, k);
                    }
                }

                //re-build m_normals ...
                for (let j = len - 1; j > 0; j--) {
                    this.m_normals[j] = new ClipPoint(-this.m_normals[j - 1].x, -this.m_normals[j - 1].y);
                }

                this.m_normals[0] = new ClipPoint(-this.m_normals[1].x, -this.m_normals[1].y);

                k = len - 1;
                for (let j = k - 1; j > 0; --j) {
                    k = this.OffsetPoint(j, k, node.joinType);
                }

                if (node.endType == EndType.etOpenButt) {
                    pt1 = new ClipPoint(
                        this.m_srcPoly[0].x - this.m_normals[0].x * delta,
                        this.m_srcPoly[0].y - this.m_normals[0].y * delta);
                    this.m_destPoly.Add(pt1);
                    pt1 = new ClipPoint(
                        this.m_srcPoly[0].x + this.m_normals[0].x * delta,
                        this.m_srcPoly[0].y + this.m_normals[0].y * delta);
                    this.m_destPoly.Add(pt1);
                } else {
                    k = 1;
                    this.m_sinA = 0;
                    if (node.endType === EndType.etOpenSquare) {
                        this.DoSquare(0, 1);
                    } else {
                        this.DoRound(0, 1);
                    }
                }
                this.m_destPolys.Add(this.m_destPoly);
            }
        }
    }

    public Execute(solution: Paths | PolyTree, delta: number): void {
        if (is.typeof<Paths>(solution, System.Types.Collections.Generics.List)) {
            return this.ExecutePaths(solution, delta);
        }
        return this.ExecutePolyTree(solution, delta);
    }

    private ExecutePaths(solution: Paths, delta: number): void {
        solution.Clear();
        this.FixOrientations();
        this.DoOffset(delta);
        //now clean up 'corners' ...
        let clpr = new Clipper();
        clpr.AddPaths(this.m_destPolys, PolyType.ptSubject, true);
        if (delta > 0) {
            clpr.ExecutePaths(
                ClipType.ctUnion, solution, PolyFillType.pftPositive, PolyFillType.pftPositive);
        } else {
            let r = Clipper.GetBounds(this.m_destPolys);
            let outer = new List<ClipPoint>(4);

            outer[0] = new ClipPoint(r.left - 10, r.bottom + 10);
            outer[1] = new ClipPoint(r.right + 10, r.bottom + 10);
            outer[2] = new ClipPoint(r.right + 10, r.top - 10);
            outer[3] = new ClipPoint(r.left - 10, r.top - 10);

            clpr.AddPath(outer, PolyType.ptSubject, true);
            clpr.ReverseSolution = true;
            clpr.ExecutePaths(ClipType.ctUnion, solution, PolyFillType.pftNegative, PolyFillType.pftNegative);
            if (solution.Count > 0) {
                solution.RemoveAt(0);
            }
        }
    }

    private ExecutePolyTree(solution: PolyTree, delta: number): void {
        solution.clear();
        this.FixOrientations();
        this.DoOffset(delta);

        //now clean up 'corners' ...
        let clpr = new Clipper();
        clpr.AddPaths(this.m_destPolys, PolyType.ptSubject, true);
        if (delta > 0) {
            clpr.ExecutePolyTree(
                ClipType.ctUnion, solution, PolyFillType.pftPositive, PolyFillType.pftPositive);
        } else {
            let r = Clipper.GetBounds(this.m_destPolys);
            let outer = new List<ClipPoint>(4);

            outer[0] = new ClipPoint(r.left - 10, r.bottom + 10);
            outer[1] = new ClipPoint(r.right + 10, r.bottom + 10);
            outer[2] = new ClipPoint(r.right + 10, r.top - 10);
            outer[3] = new ClipPoint(r.left - 10, r.top - 10);

            clpr.AddPath(outer, PolyType.ptSubject, true);
            clpr.ReverseSolution = true;
            clpr.ExecutePolyTree(ClipType.ctUnion, solution, PolyFillType.pftNegative, PolyFillType.pftNegative);
            //remove the outer PolyNode rectangle ...
            if (solution.childCount == 1 && solution.children[0].childCount > 0) {
                let outerNode = solution.children[0];
                //solution.children.Capacity = outerNode.ChildCount;
                solution.children[0] = outerNode.children[0];
                solution.children[0].parent = solution;
                for (let i = 1; i < outerNode.childCount; i++) {
                    solution.addChild(outerNode.children[i]);
                }
            } else {
                solution.clear();
            }
        }
    }

    private OffsetPoint(j: number, k: number, jointype: JoinType): number {
        //cross product ...
        this.m_sinA = this.m_normals[k].x * this.m_normals[j].y - this.m_normals[j].x * this.m_normals[k].y;

        if (Math.abs(this.m_sinA * this.m_delta) < 1.0) {
            //dot product ...
            let cosA = this.m_normals[k].x * this.m_normals[j].x + this.m_normals[j].y * this.m_normals[k].y;
            if (cosA > 0) {// angle ==> 0 degrees
                this.m_destPoly.Add(
                    new ClipPoint(
                        this.m_srcPoly[j].x + this.m_normals[k].x * this.m_delta,
                        this.m_srcPoly[j].y + this.m_normals[k].y * this.m_delta));
                return k;
            }
            //else angle ==> 180 degrees
        } else if (this.m_sinA > 1.0) {
            this.m_sinA = 1.0;
        } else if (this.m_sinA < -1.0) {
            this.m_sinA = -1.0;
        }

        if (this.m_sinA * this.m_delta < 0) {
            this.m_destPoly.Add(
                new ClipPoint(
                    this.m_srcPoly[j].x + this.m_normals[k].x * this.m_delta,
                    this.m_srcPoly[j].y + this.m_normals[k].y * this.m_delta));
            this.m_destPoly.Add(this.m_srcPoly[j]);
            this.m_destPoly.Add(
                new ClipPoint(
                    this.m_srcPoly[j].x + this.m_normals[j].x * this.m_delta,
                    this.m_srcPoly[j].y + this.m_normals[j].y * this.m_delta));
        } else {
            switch (jointype) {
                case JoinType.jtMiter:
                    let r = 1 + (this.m_normals[j].x * this.m_normals[k].x + this.m_normals[j].y * this.m_normals[k].y);
                    if (r >= this.m_miterLim) {
                        this.DoMiter(j, k, r);
                    } else {
                        this.DoSquare(j, k);
                    }
                    break;
                case JoinType.jtSquare:
                    this.DoSquare(j, k);
                    break;
                case JoinType.jtRound:
                    this.DoRound(j, k);
                    break;
            }
        }
        k = j;
        return k;
    }

    private DoSquare(j: number, k: number): void {
        let dx = Math.tan(
            Math.atan2(
                this.m_sinA,
                this.m_normals[k].x * this.m_normals[j].x + this.m_normals[k].y * this.m_normals[j].y)
            / 4);
        this.m_destPoly.Add(
            new ClipPoint(
                this.m_srcPoly[j].x + this.m_delta * (this.m_normals[k].x - this.m_normals[k].y * dx),
                this.m_srcPoly[j].y + this.m_delta * (this.m_normals[k].y - this.m_normals[k].x * dx)));
        this.m_destPoly.Add(
            new ClipPoint(
                this.m_srcPoly[j].x + this.m_delta * (this.m_normals[j].x - this.m_normals[j].y * dx),
                this.m_srcPoly[j].y + this.m_delta * (this.m_normals[j].y - this.m_normals[j].x * dx)));
    }

    private DoMiter(j: number, k: number, r: number): void {
        let q = this.m_delta / r;
        this.m_destPoly.Add(
            new ClipPoint(
                this.m_srcPoly[j].x + (this.m_normals[k].x + this.m_normals[j].x) * q,
                this.m_srcPoly[j].y + (this.m_normals[k].y + this.m_normals[j].y) * q));
    }

    private DoRound(j: number, k: number): void {
        let a = Math.atan2(
            this.m_sinA,
            this.m_normals[k].x * this.m_normals[j].x + this.m_normals[k].y * this.m_normals[j].y);
        let steps = Math.max(Math.round(this.m_StepsPerRad * Math.abs(a)), 1);

        let X = this.m_normals[k].x;
        let Y = this.m_normals[k].y;
        let X2: number;
        for (let i = 0; i < steps; ++i) {
            this.m_destPoly.Add(
                new ClipPoint(
                    this.m_srcPoly[j].x + X * this.m_delta,
                    this.m_srcPoly[j].y + Y * this.m_delta));
            X2 = X;
            X = X * this.m_cos - this.m_sin * Y;
            Y = X2 * this.m_sin + Y * this.m_cos;
        }
        this.m_destPoly.Add(
            new ClipPoint(
                this.m_srcPoly[j].x + this.m_normals[j].x * this.m_delta,
                this.m_srcPoly[j].y + this.m_normals[j].y * this.m_delta));
    }
} // end ClipperOffset