
type Arrayable = Array<any> | Int16Array | Int32Array | Float64Array | Int8Array | Float32Array | string;
/* interface IComparer<T> {
    Compare(x: T, y: T): number;
} */

/* interface Array<T> {
    getUpperBound(index: number): number;
    equals(array: Array<T>): boolean;
    clone(): Array<T>;
    size(): number;
    get(index: number): T;
    add(item: T): void;
    addAll(item: T[]): void;
    addAll(items: T[], offset: number, length: number): void;
    clear(): void;
    ensureCapacity(additionalCapacity: number): T[];
    Rank:number;
} */
/* interface ArrayConstructor {
    Copy(sourceArray: Arrayable, destArray: Arrayable, length: number): void;
    Copy(sourceArray: Arrayable, sourceIndex: number, destArray: Arrayable, destIndex: number, length: number): void;
    //Sort<T>(sourceArray: Array<T>, index: number, length: number, comparer: IComparer<T>): void;
    Reverse(sourceArray: Array<any>, index?: number, length?: number, ): void;
    Fill<T>(sourceArray: Array<T>, value: T): void;
} */


function arraysEqual(a: Array<any>, b: Array<any>) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}/*
Array.prototype.equals = function <T>(array: Array<T>): boolean {
    return arraysEqual(this, array);
}
Array.prototype.clone = function <T>(): Array<T> {
    return Array.prototype.slice.call(this);
}

Array.prototype.size = function <T>(): number {
    return this.length;
}

Array.prototype.clear = function <T>(): void {
    const size = this.length;
    for (let i = 0; i < size; i++) {
        delete this[i];
    }
    this.length = 0;
}

Array.prototype.get = function <T>(index: number): T {
    return this[index];
}

Array.prototype.add = function <T>(item: T): void {
    return this.push(item);
}

Array.prototype.addAll = function <T>(...args: any[]): void {
    if (args.length === 1 && Array.isArray(args[0])) {
        const items: T[] = args[0];
        const size = items.length;
        for (let i = 0; i < size; i++) {
            this.push(items[i]);
        }
    } else if (args.length === 3 && Array.isArray(args[0]) && typeof args[1] === 'number' && typeof args[2] === 'number') {
        const items: T[] = args[0];
        const offset: number = args[1];
        const length: number = args[2];
        for (let i = offset; i < offset + length; i++) {
            if (i < items.length) {
                this.push(items[i]);
            }
        }
    }
}

Array.prototype.ensureCapacity = function <T>(additionalCapacity: number): T[] {

    if (additionalCapacity < 0) {
        throw new Error("additionalCapacity must be >= 0: " + additionalCapacity);
    }

    for (let i = 0; i < additionalCapacity; i++) {
        this.push(undefined);
    }

    return this;
}

Array.prototype.getUpperBound = function (index: number): number {
    let array: Array<any> = undefined as any;
    for (let i = 0; i <= index; i++) {
        if (array == null) {
            array = this;
        } else {
            array = array[i];
        }
    }
    return array.length - 1;
}
Array.Copy = function (...args: any[]): void {
    if (args.length === 3) {
        Array.Copy(args[0], 0, args[1], 0, args[2]);
    } else if (args.length === 5) {
        if (args[0] == null) {
            throw new Error('Source array can not be undefined or null.');
        }

        if (args[2] == null) {
            throw new Error('Destination array can not be undefined or null.');
        }

        if (args[0].length === 0 || args[4] === 0) {
            return;
        }

        for (let i = args[1]; i < args[4]; i++) {
            if (args[0][i]['clone']) {
                args[2][args[3] + i] = args[0][i].clone();
            } else {
                args[2][args[3] + i] = args[0][i];
            }

        }
    }

}

Array.Reverse = function (sourceArray: Array<any>, index?: number, length?: number): void {
    const _index: number = index || 0;
    const _length: number = length || sourceArray.length;
    const array = sourceArray.slice(_index, _index + _length);
    array.reverse();

    for (let i = 0; i < array.length; i++) {
        sourceArray[_index + i] = array[i];
    }
}
 */
/* Array.Sort = function <T>(sourceArray: Array<T>, index: number, length: number, comparer: IComparer<T>): void {
    const array = sourceArray.slice(index, index + length);
    Array.prototype.sort.call(array, comparer.Compare);
    for (let i = 0; i < array.length; i++) {
        sourceArray[index + i] = array[i];
    }
} */

/* Array.Fill = function <T>(sourceArray: Array<T>, value: T): void {
    for (let i = 0; i < sourceArray.length; i++) {
        sourceArray[i] = value;
    }
} */

function dim(mat) {
    if (mat instanceof Array) {
        return [mat.length].concat(dim(mat[0]));
    } else {
        return [];
    }
}
// Makes a validator function for a given matrix structure d.
function validator(d) {
    return function (mat) {
        if (mat instanceof Array) {
            return d.length > 0
                && d[0] === mat.length
                && every(mat, validator(d.slice(1)));
        } else {
            return d.length === 0;
        }
    };
}

// Combines dim and validator to get the required function.
function getdim(mat) {
    var d = dim(mat);
    return validator(d)(mat) ? d : false;
}

// Checks whether predicate applies to every element of array arr.
// This ought to be built into JS some day!
function every(arr, predicate) {
    var i, N;
    for (i = 0, N = arr.length; i < N; ++i) {
        if (!predicate(arr[i])) {
            return false;
        }
    }

    return true;
}

/* Object.defineProperty(Array.prototype, 'Rank', {

    get() {
        const rank = getdim(this);
        if (Array.isArray(rank)) {
            return rank[0];
        }
        throw new Error('Can not find rank.');
     }
  }); */