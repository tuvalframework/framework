import { CGPoint } from '@tuval/cg';
import { GraphicsPath } from "./GraphicsPath";
import { PathPointType } from "../PathPointType";
import { byte, Out, ArgumentException } from "@tuval/core";

export class GraphicsPathIterator {
    private path: GraphicsPath = undefined as any;
    private markerPosition: number = 0;
    private subpathPosition: number = 0;
    private pathTypePosition: number = 0;

    public constructor(path: GraphicsPath) {
        // We do not have to have a path
        if (path == null) {
            path = new GraphicsPath();
        }
        else {
            // We will clone the path so if things change it will not effect the iterator
            this.path = path.Clone();
        }
    }

    public get Count(): number {
        return this.path.PointCount;
    }

    public get SubpathCount(): number {
        let count: number = 0;
        let current: byte;
        const start: byte = PathPointType.Start;

        for (let i = 0; i < (<any>this.path).types.Count; i++) {
            current = (<any>this.path).types[i];

            // count only the starts
            if (current == start)
                count++;
        }
        return count;
    }

    public dispose(disposing: boolean): void {
        //path.Dispose ();
    }

    public copyData(points: Out<CGPoint[]>, types: Out<byte[]>, startIndex: number, endIndex: number): number {

        // no null checks, MS throws a NullReferenceException here
        if (points.value != null && types.value != null && points.value.length !== types.value.length) {
            throw new ArgumentException("Invalid arguments passed. Both arrays should have the same length.");
        }

        let resultCount: number = 0;

        const end: number = Math.min((<any>this.path).points.Count - 1, endIndex);

        if (points.value != null && types.value != null) {
            for (let s = startIndex, i = 0; s <= end; s++ , i++) {
                points.value[i] = (<any>this.path).points[s];
                types.value[i] = (<any>this.path).types[s];
                resultCount++;
            }
        }

        return resultCount;
    }

    public enumerate(points: Out<CGPoint[]>, types: Out<byte[]>): number {
        return this.copyData(points, types, 0, this.Count - 1);
    }

    public hasCurve(): boolean {
        return GraphicsPath.PathHasCurve(this.path);
    }

    public nextMarker(path: GraphicsPath): number {
        let resultCount: number = 0;

        let index: number = 0;
        let type: byte;
        let point: CGPoint;

        // There are no paths or markers or we are done with all the markers
        if (path == null || (this.path.points.Count === 0) ||
            (this.markerPosition === this.path.points.Count)) {

            return resultCount;
        }

        // Clear the existing values from path
        if (path.points.Count > 0) {
            path.points.Clear();
            path.types.Clear();
        }

        for (index = this.markerPosition; index < this.path.points.Count; index++) {
            type = this.path.types[index];
            point = this.path.points[index];
            path.points.Add(point);
            path.types.Add(type);

            // Copy the marker and stop copying the points when we reach a marker type
            if ((type & PathPointType.PathMarker) !== 0) {
                index++;
                break;
            }
        }

        resultCount = index - this.markerPosition;
        this.markerPosition = index;

        return resultCount;
    }

    public NextMarker1(startIndex: Out<number>, endIndex: Out<number>): number {
        let resultCount: number = 0;

        // We have to assign something to the following for out parameters
        startIndex.value = 0;
        endIndex.value = 0;

        // There are no markers or we are done with all the markers
        if ((this.path.points.Count === 0) ||
            (this.markerPosition === this.path.points.Count)) {
            return resultCount;
        }

        let index = 0;
        // Check for next marker
        for (index = this.markerPosition; index < this.path.types.Count; index++) {
            const type: number = this.path.types[index];
            if ((type & PathPointType.PathMarker) !== 0) {
                index++;
                break;
            }
        }

        startIndex.value = this.markerPosition;
        endIndex.value = index - 1;
        resultCount = endIndex.value - startIndex.value + 1;;

        this.markerPosition = index;

        return resultCount;
    }

    public nextPathType(pathType: Out<byte>, startIndex: Out<byte>, endIndex: Out<number>): number {
        let resultCount: number = 0;

        // We need to initialize out parameters
        pathType.value = 0;
        startIndex.value = 0;
        endIndex.value = 0;


        let index: number;
        let currentType: byte;
        let lastTypeSeen: byte;

        // There are no subpaths or we are done with all the subpaths
        if ((this.path.points.Count === 0) || (this.subpathPosition == 0)) {
            return resultCount;
        }

        // Pathtype position lags behind subpath position
        else if (this.pathTypePosition < this.subpathPosition) {
            lastTypeSeen = this.path.types[this.pathTypePosition + 1];
            // Mask the flags
            lastTypeSeen &= PathPointType.PathTypeMask;

            // Check for the change in type
            for (index = this.pathTypePosition + 2; index < this.subpathPosition; index++) {
                currentType = this.path.types[index];
                currentType &= PathPointType.PathTypeMask;

                if (currentType !== lastTypeSeen)
                    break;
            }

            startIndex.value = this.pathTypePosition;
            endIndex.value = index - 1;
            resultCount = endIndex.value - startIndex.value + 1;
            pathType.value = lastTypeSeen;

            // If lastTypeSeen is a line, it becomes the starting point for the next
            // path type. We get this when we have connected figures. We need to step
            // back in that case. We don't need to step back if we are finished with
            // current subpath.
            if ((lastTypeSeen == PathPointType.Line) && (index !== this.subpathPosition))
                this.pathTypePosition = index - 1;
            else
                this.pathTypePosition = index;
        }

        // If pathtype position and subpath position coincide we return the resultCount = 0
        else
            resultCount = 0;

        return resultCount;
    }

    public nextSubpath(path: GraphicsPath, isClosed: Out<boolean>): number {
        let resultCount: number = 0;

        // We have to initialize all out parameters
        isClosed.value = false;


        let index: number = 0;
        let point: CGPoint;
        let currentType: byte;

        // There are no subpaths or we are done with all the subpaths
        if (path == null || this.path.points.Count === 0 ||
            (this.subpathPosition === this.path.points.Count)) {
            isClosed.value = true;
            return resultCount;
        }

        // Clear the existing values from path
        if (this.path.points.Count > 0) {
            path.points.Clear();
            path.types.Clear();
        }

        // Copy the starting point
        currentType = this.path.types[this.subpathPosition];
        point = this.path.points[this.subpathPosition];
        path.points.Add(point);
        path.types.Add(currentType);

        // Check for next start point
        for (index = this.subpathPosition + 1; index < this.path.points.Count; index++) {
            currentType = this.path.types[index];

            // Copy the start point till next start point
            if (currentType === PathPointType.Start) {
                break;
            }

            point = this.path.points[index];
            path.points.Add(point);
            path.types.Add(currentType);
        }

        resultCount = index - this.subpathPosition;
        // set positions for next iteration
        this.pathTypePosition = this.subpathPosition;
        this.subpathPosition = index;

        // Check if last subpath was closed
        currentType = this.path.types[index - 1];
        if ((currentType & PathPointType.CloseSubpath) !== 0) {
            isClosed.value = true;
        }
        else {
            isClosed.value = false;
        }
        return resultCount;
    }

    public nextSubpath1(startIndex: Out<number>, endIndex: Out<number>, isClosed: Out<boolean>): number {
        let resultCount: number = 0;

        // We have to initialize the out parameters
        startIndex.value = 0;
        endIndex.value = 0;
        isClosed.value = false;


        let index: number = 0;
        let currentType: byte;

        // There are no subpaths or we are done with all the subpaths
        if ((this.path.types.Count === 0) ||
            (this.subpathPosition === this.path.types.Count)) {
            // we don't touch startIndex and endIndex in this case
            isClosed.value = true;
            return resultCount;
        }

        // Check for next start point
        for (index = this.subpathPosition + 1; index < this.path.types.Count; index++) {
            currentType = this.path.types[index];
            if (currentType === PathPointType.Start) {
                break;
            }
        }

        startIndex.value = this.subpathPosition;
        endIndex.value = index - 1;
        resultCount = endIndex.value - startIndex.value + 1;
        // set positions for next iteration
        this.pathTypePosition = this.subpathPosition;
        this.subpathPosition = index;

        // check if last subpath was closed
        currentType = this.path.types[index - 1];
        if ((currentType & PathPointType.CloseSubpath) !== 0) {
            isClosed.value = true;
        }
        else {
            isClosed.value = false;
        }
        return resultCount;
    }

    public rewind(): void {
        this.subpathPosition = 0;
        this.pathTypePosition = 0;
        this.markerPosition = 0;
    }

}