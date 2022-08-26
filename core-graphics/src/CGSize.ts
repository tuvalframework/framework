import { Convert, float, IEquatable } from '@tuval/core';
import { CGPoint } from './CGPoint';
import { ClassInfo } from '@tuval/core';
import { CoreGraphicTypes } from './types';

export interface ISizeF {
    width: float;
    height: float;
}

@ClassInfo({
    fullName: CoreGraphicTypes.CGSize,
    instanceof: [
        CoreGraphicTypes.CGSize
    ]
})
export class CGSize implements IEquatable<CGSize> {
    public static readonly Empty: CGSize = new CGSize();
    private width: float = 0;
    private height: float = 0;

    public get IsEmpty(): boolean {
        return this.width === 0 && this.height === 0;
    }

    public get Width(): float {
        return this.width;
    }

    public set Width(value: float) {
        this.width = value;
    }

    public get Height(): float {
        return this.height;
    }

    public set Height(value: float) {
        this.height = value;
    }

    public constructor(pt: CGPoint);
    public constructor(size: CGSize);
    public constructor(width?: float, height?: float);
    public constructor(obj: ISizeF);
    public constructor(sizeOrPoint?: CGPoint | CGSize | float | ISizeF, height?: float) {
        function isSize(val: any): val is ISizeF {
            if (val) {
                return val.width !== undefined && val.height !== undefined;
            } else {
                return false;
            }
        }

        if (sizeOrPoint instanceof CGSize) {
            this.width = sizeOrPoint.Width;
            this.height = sizeOrPoint.Height;
        } else if (sizeOrPoint instanceof CGPoint) {
            this.width = sizeOrPoint.X;
            this.height = sizeOrPoint.Y;
        } else if (typeof sizeOrPoint === 'number' && typeof height === 'number') {
            this.width = sizeOrPoint;
            this.height = height;
        } else if (isSize(sizeOrPoint)) {
            this.width = sizeOrPoint.width;
            this.height = sizeOrPoint.height;
        }
    }
    public Add(size: CGSize): CGSize {
        this.Width += size.Width;
        this.Height += size.Height;
        return this;
    }
    public Substruct(size: CGSize) {
        this.Width -= size.Width;
        this.Height -= size.Height;
    }
    public Clone(): CGSize {
        return new CGSize(this.width, this.height);
    }
    public Equals = (pt: CGSize): boolean => this.width === pt.width && this.height === pt.height;
    public NotEquals = (pt: CGSize): boolean => this.width !== pt.width || this.height !== pt.height;
    public static Add(sz1: CGSize, sz2: CGSize): CGSize {
        return new CGSize(sz1.Width + sz2.Width, sz1.Height + sz2.Height);
    }
    public static Subtract(sz1: CGSize, sz2: CGSize): CGSize {
        return new CGSize(sz1.Width - sz2.Width, sz1.Height - sz2.Height);
    }
    public static Ceiling(value: CGSize): CGSize {
        return new CGSize(Convert.ToInt32(Math.ceil(value.Width), Convert.ToInt32(Math.ceil(value.Height))));
    }
}
