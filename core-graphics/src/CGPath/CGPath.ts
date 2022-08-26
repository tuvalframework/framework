import { parse } from './parsePath';
import { int, is, ClassInfo } from '@tuval/core';
import { arcToBezier } from './arxToBezier';
import { CoreGraphicTypes } from '../types';

/**
 * Work around for https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8438884/
 * @ignore
 */
export function supportsSvgPathArgument(window) {
    is.boolean(true);
    const canvas = window.document.createElement('canvas');
    const g = canvas.getContext('2d');
    const p = new window.Path2D('M0 0 L1 1');
    g.strokeStyle = 'red';
    g.lineWidth = 1;
    g.stroke(p);
    const imgData = g.getImageData(0, 0, 1, 1);
    return imgData.data[0] === 255; // Check if pixel is red
}

function rotatePoint(point, angle) {
    const nx = (point.x * Math.cos(angle)) - (point.y * Math.sin(angle));
    const ny = (point.y * Math.cos(angle)) + (point.x * Math.sin(angle));
    point.x = nx;
    point.y = ny;
}

function translatePoint(point, dx, dy) {
    point.x += dx;
    point.y += dy;
}

function scalePoint(point, s) {
    point.x *= s;
    point.y *= s;
}

@ClassInfo({
    fullName: CoreGraphicTypes.CGPath,
    instanceof: [
        CoreGraphicTypes.CGPath
    ]
})
/**
   * Crates a Path2D polyfill object
   * @constructor
   * @ignore
   * @param {String} path
   */
export class CGPath {
    private segments: Array<any>;
    constructor(path: string | CGPath) {

        this.segments = [];
        if (path && path instanceof CGPath) {
            this.segments.push(...path.segments);
        } else if (path) {
            this.segments = parse(path);
        }
    }

    public addPath(path: CGPath) {
        if (path && path instanceof CGPath) {
            this.segments.push(...path.segments);
        }
    }

    public moveTo(x: int, y: int) {
        this.segments.push(['M', x, y]);
    }

    public lineTo(x: int, y: int) {
        this.segments.push(['L', x, y]);
    }

    public arc(x: int, y: int, r: int, start: int, end: int, ccw: int) {
        this.segments.push(['AC', x, y, r, start, end, !!ccw]);
    }

    public arcTo(x1: int, y1: int, x2: int, y2: int, r: int) {
        this.segments.push(['AT', x1, y1, x2, y2, r]);
    }

    public ellipse(x: int, y: int, rx: int, ry: int, angle: int, start: int, end: int, ccw: int) {
        this.segments.push(['E', x, y, rx, ry, angle, start, end, !!ccw]);
    }

    public losePath(): void {
        this.segments.push(['Z']);
    }

    public bezierCurveTo(cp1x: int, cp1y: int, cp2x: int, cp2y: int, x: int, y: int) {
        this.segments.push(['C', cp1x, cp1y, cp2x, cp2y, x, y]);
    }

    public quadraticCurveTo(cpx: int, cpy: int, x: int, y: int) {
        this.segments.push(['Q', cpx, cpy, x, y]);
    }

    public rect(x: int, y: int, width: int, height: int) {
        this.segments.push(['R', x, y, width, height]);
    }
    public abs(): CGPath {
        var startX = 0
        var startY = 0
        var x = 0
        var y = 0

        this.segments = this.segments.map(function (seg) {
            seg = seg.slice()
            var type = seg[0]
            var command = type.toUpperCase()

            // is relative
            if (type != command) {
                seg[0] = command
                switch (type) {
                    case 'a':
                        seg[6] += x
                        seg[7] += y
                        break
                    case 'v':
                        seg[1] += y
                        break
                    case 'h':
                        seg[1] += x
                        break
                    default:
                        for (var i = 1; i < seg.length;) {
                            seg[i++] += x
                            seg[i++] += y
                        }
                }
            }

            // update cursor state
            switch (command) {
                case 'Z':
                    x = startX
                    y = startY
                    break
                case 'H':
                    x = seg[1]
                    break
                case 'V':
                    y = seg[1]
                    break
                case 'M':
                    x = startX = seg[1]
                    y = startY = seg[2]
                    break
                default:
                    x = seg[seg.length - 2]
                    y = seg[seg.length - 1]
            }

            return seg
        });
        return this;
    }
    public normalize(): CGPath {

        function line(x1, y1, x2, y2) {
            return ['C', x1, y1, x2, y2, x2, y2]
        }

        function quadratic(x1, y1, cx, cy, x2, y2) {
            return [
                'C',
                x1 / 3 + (2 / 3) * cx,
                y1 / 3 + (2 / 3) * cy,
                x2 / 3 + (2 / 3) * cx,
                y2 / 3 + (2 / 3) * cy,
                x2,
                y2
            ]
        }
        // init state
        let prev;
        let result: any[] = [];
        let bezierX: int = 0;
        let bezierY: int = 0;
        let startX: int = 0;
        let startY: int = 0;
        let quadX: int = null as any;
        let quadY: int = null as any;
        let x: int = 0;
        let y: int = 0;

        for (let i = 0, len = this.segments.length; i < len; i++) {
            var seg = this.segments[i]
            var command = seg[0]

            switch (command) {
                case 'M':
                    startX = seg[1]
                    startY = seg[2]
                    break
                case 'A':
                    var curves = arcToBezier({
                        px: x,
                        py: y,
                        cx: seg[6],
                        cy: seg[7],
                        rx: seg[1],
                        ry: seg[2],
                        xAxisRotation: seg[3],
                        largeArcFlag: seg[4],
                        sweepFlag: seg[5]
                    })

                    // null-curves
                    if (!curves.length) continue

                    for (var j = 0, c; j < curves.length; j++) {
                        c = curves[j]
                        seg = ['C', c.x1, c.y1, c.x2, c.y2, c.x, c.y]
                        if (j < curves.length - 1) result.push(seg)
                    }

                    break
                case 'S':
                    // default control point
                    var cx = x
                    var cy = y
                    if (prev == 'C' || prev == 'S') {
                        cx += cx - bezierX // reflect the previous command's control
                        cy += cy - bezierY // point relative to the current point
                    }
                    seg = ['C', cx, cy, seg[1], seg[2], seg[3], seg[4]]
                    break
                case 'T':
                    if (prev == 'Q' || prev == 'T') {
                        quadX = x * 2 - quadX // as with 'S' reflect previous control point
                        quadY = y * 2 - quadY
                    } else {
                        quadX = x
                        quadY = y
                    }
                    seg = quadratic(x, y, quadX, quadY, seg[1], seg[2])
                    break
                case 'Q':
                    quadX = seg[1]
                    quadY = seg[2]
                    seg = quadratic(x, y, seg[1], seg[2], seg[3], seg[4])
                    break
                case 'L':
                    seg = line(x, y, seg[1], seg[2])
                    break
                case 'H':
                    seg = line(x, y, seg[1], y)
                    break
                case 'V':
                    seg = line(x, y, x, seg[1])
                    break
                case 'Z':
                    seg = line(x, y, startX, startY)
                    break
            }

            // update state
            prev = command
            x = seg[seg.length - 2]
            y = seg[seg.length - 1]
            if (seg.length > 4) {
                bezierX = seg[seg.length - 4]
                bezierY = seg[seg.length - 3]
            } else {
                bezierX = x
                bezierY = y
            }
            result.push(seg)
        }

     this.segments = result;
     return this;
    }

    public bounds() {

        this.abs();
        this.normalize();

        if (!this.segments.length) {
            return [0, 0, 0, 0];
        }

        const bounds = [Infinity, Infinity, -Infinity, -Infinity];

        for (let i = 0, l = this.segments.length; i < l; i++) {
            const points = this.segments[i].slice(1);

            for (let j = 0; j < points.length; j += 2) {
                if (points[j + 0] < bounds[0]) {
                    bounds[0] = points[j + 0];
                }
                if (points[j + 1] < bounds[1]) {
                    bounds[1] = points[j + 1];
                }
                if (points[j + 0] > bounds[2]) {
                    bounds[2] = points[j + 0];
                }
                if (points[j + 1] > bounds[3]) {
                    bounds[3] = points[j + 1];
                }
            }
        }
        return bounds;
    }

    public pilotPath(canvas: CanvasRenderingContext2D) {
        let endAngle;
        let startAngle;
        let largeArcFlag;
        let sweepFlag;
        let endPoint;
        let midPoint;
        let angle;
        let lambda;
        let t1;
        let t2;
        let x;
        let x1;
        let y;
        let y1;
        let r;
        let rx;
        let ry;
        let w;
        let h;
        let pathType;
        let centerPoint;
        let cpx;
        let cpy;
        let qcpx;
        let qcpy;
        let ccw;
        let startPoint = { x: 0, y: 0 };
        const currentPoint = { x: 0, y: 0 };

        canvas.beginPath();
        for (let i = 0; i < this.segments.length; ++i) {
            const s = this.segments[i];
            pathType = s[0];

            // Reset control point if command is not cubic
            if (pathType !== 'S' && pathType !== 's' && pathType !== 'C' && pathType !== 'c') {
                cpx = null;
                cpy = null;
            }

            if (pathType !== 'T' && pathType !== 't' && pathType !== 'Q' && pathType !== 'q') {
                qcpx = null;
                qcpy = null;
            }

            switch (pathType) {
                case 'm':
                case 'M':
                    if (pathType === 'm') {
                        x += s[1];
                        y += s[2];
                    } else {
                        x = s[1];
                        y = s[2];
                    }

                    if (pathType === 'M' || !startPoint) {
                        startPoint = { x, y };
                    }

                    canvas.moveTo(x, y);
                    break;
                case 'l':
                    x += s[1];
                    y += s[2];
                    canvas.lineTo(x, y);
                    break;
                case 'L':
                    x = s[1];
                    y = s[2];
                    canvas.lineTo(x, y);
                    break;
                case 'H':
                    x = s[1];
                    canvas.lineTo(x, y);
                    break;
                case 'h':
                    x += s[1];
                    canvas.lineTo(x, y);
                    break;
                case 'V':
                    y = s[1];
                    canvas.lineTo(x, y);
                    break;
                case 'v':
                    y += s[1];
                    canvas.lineTo(x, y);
                    break;
                case 'a':
                case 'A':
                    if (pathType === 'a') {
                        x += s[6];
                        y += s[7];
                    } else {
                        x = s[6];
                        y = s[7];
                    }

                    rx = s[1]; // rx
                    ry = s[2]; // ry
                    angle = (s[3] * Math.PI) / 180;
                    largeArcFlag = !!s[4];
                    sweepFlag = !!s[5];
                    endPoint = { x, y };

                    // https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes

                    midPoint = {
                        x: (currentPoint.x - endPoint.x) / 2,
                        y: (currentPoint.y - endPoint.y) / 2,
                    };
                    rotatePoint(midPoint, -angle);

                    // radius correction
                    lambda = ((midPoint.x * midPoint.x) / (rx * rx))
                        + ((midPoint.y * midPoint.y) / (ry * ry));
                    if (lambda > 1) {
                        lambda = Math.sqrt(lambda);
                        rx *= lambda;
                        ry *= lambda;
                    }

                    centerPoint = {
                        x: (rx * midPoint.y) / ry,
                        y: -(ry * midPoint.x) / rx,
                    };
                    t1 = rx * rx * ry * ry;
                    t2 = (rx * rx * midPoint.y * midPoint.y)
                        + (ry * ry * midPoint.x * midPoint.x);
                    if (sweepFlag !== largeArcFlag) {
                        scalePoint(centerPoint, Math.sqrt((t1 - t2) / t2) || 0);
                    } else {
                        scalePoint(centerPoint, -Math.sqrt((t1 - t2) / t2) || 0);
                    }

                    startAngle = Math.atan2(
                        (midPoint.y - centerPoint.y) / ry,
                        (midPoint.x - centerPoint.x) / rx);
                    endAngle = Math.atan2(
                        -(midPoint.y + centerPoint.y) / ry,
                        -(midPoint.x + centerPoint.x) / rx);

                    rotatePoint(centerPoint, angle);
                    translatePoint(
                        centerPoint,
                        (endPoint.x + currentPoint.x) / 2,
                        (endPoint.y + currentPoint.y) / 2);

                    canvas.save();
                    canvas.translate(centerPoint.x, centerPoint.y);
                    canvas.rotate(angle);
                    canvas.scale(rx, ry);
                    canvas.arc(0, 0, 1, startAngle, endAngle, !sweepFlag);
                    canvas.restore();
                    break;
                case 'C':
                    cpx = s[3]; // Last control point
                    cpy = s[4];
                    x = s[5];
                    y = s[6];
                    canvas.bezierCurveTo(s[1], s[2], cpx, cpy, x, y);
                    break;
                case 'c':
                    canvas.bezierCurveTo(
                        s[1] + x,
                        s[2] + y,
                        s[3] + x,
                        s[4] + y,
                        s[5] + x,
                        s[6] + y);
                    cpx = s[3] + x; // Last control point
                    cpy = s[4] + y;
                    x += s[5];
                    y += s[6];
                    break;
                case 'S':
                    if (cpx === null || cpx === null) {
                        cpx = x;
                        cpy = y;
                    }

                    canvas.bezierCurveTo(
                        (2 * x) - cpx,
                        (2 * y) - cpy,
                        s[1],
                        s[2],
                        s[3],
                        s[4]);
                    cpx = s[1]; // last control point
                    cpy = s[2];
                    x = s[3];
                    y = s[4];
                    break;
                case 's':
                    if (cpx === null || cpx === null) {
                        cpx = x;
                        cpy = y;
                    }

                    canvas.bezierCurveTo(
                        (2 * x) - cpx,
                        (2 * y) - cpy,
                        s[1] + x,
                        s[2] + y,
                        s[3] + x,
                        s[4] + y);
                    cpx = s[1] + x; // last control point
                    cpy = s[2] + y;
                    x += s[3];
                    y += s[4];
                    break;
                case 'Q':
                    qcpx = s[1]; // last control point
                    qcpy = s[2];
                    x = s[3];
                    y = s[4];
                    canvas.quadraticCurveTo(qcpx, qcpy, x, y);
                    break;
                case 'q':
                    qcpx = s[1] + x; // last control point
                    qcpy = s[2] + y;
                    x += s[3];
                    y += s[4];
                    canvas.quadraticCurveTo(qcpx, qcpy, x, y);
                    break;
                case 'T':
                    if (qcpx === null || qcpx === null) {
                        qcpx = x;
                        qcpy = y;
                    }
                    qcpx = (2 * x) - qcpx; // last control point
                    qcpy = (2 * y) - qcpy;
                    x = s[1];
                    y = s[2];
                    canvas.quadraticCurveTo(qcpx, qcpy, x, y);
                    break;
                case 't':
                    if (qcpx === null || qcpx === null) {
                        qcpx = x;
                        qcpy = y;
                    }
                    qcpx = (2 * x) - qcpx; // last control point
                    qcpy = (2 * y) - qcpy;
                    x += s[1];
                    y += s[2];
                    canvas.quadraticCurveTo(qcpx, qcpy, x, y);
                    break;
                case 'z':
                case 'Z':
                    x = startPoint.x;
                    y = startPoint.y;
                    startPoint = undefined as any;
                    canvas.closePath();
                    break;
                case 'AC': // arc
                    x = s[1];
                    y = s[2];
                    r = s[3];
                    startAngle = s[4];
                    endAngle = s[5];
                    ccw = s[6];
                    canvas.arc(x, y, r, startAngle, endAngle, ccw);
                    break;
                case 'AT': // arcTo
                    x1 = s[1];
                    y1 = s[2];
                    x = s[3];
                    y = s[4];
                    r = s[5];
                    canvas.arcTo(x1, y1, x, y, r);
                    break;
                case 'E': // ellipse
                    x = s[1];
                    y = s[2];
                    rx = s[3];
                    ry = s[4];
                    angle = s[5];
                    startAngle = s[6];
                    endAngle = s[7];
                    ccw = s[8];
                    canvas.save();
                    canvas.translate(x, y);
                    canvas.rotate(angle);
                    canvas.scale(rx, ry);
                    canvas.arc(0, 0, 1, startAngle, endAngle, ccw);
                    canvas.restore();
                    break;
                case 'R': // rect
                    x = s[1];
                    y = s[2];
                    w = s[3];
                    h = s[4];
                    startPoint = { x, y };
                    canvas.rect(x, y, w, h);
                    break;
                default:
                // throw new Error(`${pathType} is not implemented`); ?
            }

            currentPoint.x = x;
            currentPoint.y = y;
        }

    }
}





