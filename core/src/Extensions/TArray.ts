import { IEnumerator } from "../Collections";
import { int, TypedArray, ByteArray, New } from '../float';
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { is } from "../is";
import { System } from "../SystemTypes";
import { IEquatable } from "../IEquatable";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArraySortHelper } from "../Collections/Generic/ArraySortHelper";
import { Environment } from "../Environment";
import { ArrayEnumerator } from "./ArrayEnumerator";
import { Exception } from "../Exception";
import { Type } from "../Reflection";
import { SorterObjectArray } from "../Collections/Sorting/SorterObjectArray";
import { IComparer } from "../Collections/IComparer";

const nativeToString = Object.prototype.toString;
const nativeHasOwnProperty = Object.prototype.hasOwnProperty;

function toMatcher(matcher) {
    return is.function(matcher) ? matcher : (e) => {
        return e === matcher;
    };
}
function toExtractor(extractor) {
    return is.function(extractor) ? extractor : (e) => {
        return e[extractor];
    };
}

function identity(arg) {
    return arg;
}

function toNum(arg) {
    return Number(arg);
}

function ensureArray(obj) {
    if (is.array(obj)) {
        return;
    }
    throw new Error('must supply array');
}
export function has(target, key) {
    return nativeHasOwnProperty.call(target, key);
}
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
}


export class TArray {
    public static readonly MaxArrayLength: int = 0X7FEFFFFF;
    public static readonly MaxByteArrayLength: int = 0x7FFFFFC7;
    public static Resize<T>(newEras: T[] | Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array, newSize: int): T[] | Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array {
        if (newEras instanceof Int8Array) {
            const newArray: Int8Array = new Int8Array(newSize);
            newEras.forEach((value, i) => newArray[i] = value);
            return newEras;
        }
        if (newEras instanceof Uint8Array) {
            const newArray: Uint8Array = new Uint8Array(newSize);
            newEras.forEach((value, i) => newArray[i] = value);
            return newEras;
        }
        if (newEras instanceof Int16Array) {
            const newArray: Int16Array = new Int16Array(newSize);
            newEras.forEach((value, i) => newArray[i] = value);
            return newEras;
        }
        if (newEras instanceof Uint16Array) {
            const newArray: Uint16Array = new Uint16Array(newSize);
            newEras.forEach((value, i) => newArray[i] = value);
            return newEras;
        }
        if (newEras instanceof Int32Array) {
            const newArray: Int32Array = new Int32Array(newSize);
            newEras.forEach((value, i) => newArray[i] = value);
            return newEras;
        }
        if (newEras instanceof Uint32Array) {
            const newArray: Uint32Array = new Uint32Array(newSize);
            newEras.forEach((value, i) => newArray[i] = value);
            return newEras;
        }
        if (newEras instanceof Float32Array) {
            const newArray: Float32Array = new Float32Array(newSize);
            newEras.forEach((value, i) => newArray[i] = value);
            return newEras;
        }
        if (newEras instanceof Float64Array) {
            const newArray: Float64Array = new Float64Array(newSize);
            newEras.forEach((value, i) => newArray[i] = value);
            return newEras;
        }
        return newEras;

    }
    public static CreateInstance<T>(type: Type, length: number): Array<T> {
        return new Array<T>(length);
    }
    public static LastIndexOf<T>(array: Array<T>, value: T, startIndex: int, count: int): int {
        let int32: int;
        if (array == null) {
            throw new ArgumentNullException("array");
        }
        const lowerBound: int = TArray.GetLowerBound(array, 0);
        if (array.length === 0) {
            return lowerBound - 1;
        }
        if (startIndex < lowerBound || startIndex >= array.length + lowerBound) {
            throw new ArgumentOutOfRangeException("startIndex", "ArgumentOutOfRange_Index");
        }
        if (count < 0) {
            throw new ArgumentOutOfRangeException("count", "ArgumentOutOfRange_Count");
        }
        if (count > startIndex - lowerBound + 1) {
            throw new ArgumentOutOfRangeException("endIndex", "ArgumentOutOfRange_EndIndexStartIndex");
        }


        const objArray: any[] = array as any[];
        const int321: int = startIndex - count + 1;
        if (objArray == null) {
            for (let i = startIndex; i >= int321; i--) {
                const obj: any = array[i];
                if (obj == null) {
                    if (value == null) {
                        return i;
                    }
                }
                else if (is.typeof<IEquatable<T>>(obj, System.Types.IEquatable) && obj.Equals(value)) {
                    return i;
                } else if (obj === value) {
                    return i;
                }
            }
        }
        else if (value != null) {
            for (let j = startIndex; j >= int321; j--) {
                const obj1: any = objArray[j];
                if (obj1 != null) {
                    if (is.typeof<IEquatable<T>>(obj1, System.Types.IEquatable) && obj1.Equals(value)) {
                        return j;
                    } else if (obj1 === value) {
                        return j;
                    }
                }
            }
        }
        else {
            for (let k = startIndex; k >= int321; k--) {
                if (objArray[k] == null) {
                    return k;
                }
            }
        }
        return lowerBound - 1;
    }

    public static GetUpperBound<T>(array: Array<T>, index: number): number {
        let _array: Array<T> = undefined as any;
        for (let i = 0; i <= index; i++) {
            if (_array == null) {
                _array = array;
            } else {
                _array = _array[i] as any;
            }
        }
        return _array.length - 1;
    }
    public static GetLowerBound<T>(array: Array<T>, index: number): number {
        return 0;
    }

    public static IndexOf<T>(array: Array<T>, value: T): int;
    public static IndexOf<T>(array: Array<T>, value: T, startIndex: int, count: int): int
    public static IndexOf<T>(...args: any[]): int {
        if (args.length === 2 && is.array(args[0])) {
            const arr: Array<any> = args[0];
            const value: any = args[1];
            return TArray.IndexOf(arr, value, 0, arr.length);
        } else if (args.length === 4 && is.array(args[0]) && is.int(args[2]) && is.int(args[3])) {
            const array: Array<T> = args[0];
            const value: T = args[1];
            const startIndex: int = args[2];
            const count: int = args[3];
            let int32: int;
            if (array == null) {
                throw new ArgumentNullException("array");
            }

            const lowerBound: int = TArray.GetLowerBound(array, 0);
            if (startIndex < lowerBound || startIndex > array.length + lowerBound) {
                throw new ArgumentOutOfRangeException("startIndex", "ArgumentOutOfRange_Index");
            }
            if (count < 0 || count > array.length - startIndex + lowerBound) {
                throw new ArgumentOutOfRangeException("count", "ArgumentOutOfRange_Count");
            }

            const objArray: any[] = array as any[];
            const int321: int = startIndex + count;
            if (objArray == null) {
                for (let i = startIndex; i < int321; i++) {
                    const obj: any = array[i];
                    if (obj == null) {
                        if (value == null) {
                            return i;
                        }
                    }
                    else if (is.typeof<IEquatable<T>>(obj, System.Types.IEquatable) && obj.Equals(value)) {
                        return i;
                    } else if (obj === value) {
                        return i;
                    }
                }
            }
            else if (value != null) {
                for (let j = startIndex; j < int321; j++) {
                    const obj1: any = objArray[j];
                    if (is.typeof<IEquatable<T>>(obj1, System.Types.IEquatable) && obj1.Equals(value)) {
                        return j;
                    } else if (obj1 === value) {
                        return j;
                    }
                }
            }
            else {
                for (let k = startIndex; k < int321; k++) {
                    if (objArray[k] == null) {
                        return k;
                    }
                }
            }
            return lowerBound - 1;
        }
        throw new ArgumentException('');
    }
    public static Clear<T>(array: Array<T> | TypedArray, start: int, end: int) {
        for (let i = start; i < end; i++) {
            array[i] = undefined as any;
        }
    }

    /**
     *
     * @param args
     */
    public static Copy<T extends ArrayLike<any>>(source: T, dest: T, count: int): void;
    public static Copy<T extends ArrayLike<any>>(source: T, index: int, dest: T, destIndex: int): void;
    public static Copy<T extends ArrayLike<any>>(source: T, index: int, dest: T, destIndex: int, count: int): void;
    public static Copy(...args: any[]): void {
        if (args.length === 3) {
            const source: any[] = args[0];
            const dest: any[] = args[1];
            const count: int = args[2];
            TArray.Copy(source, 0, dest, 0, count);
        } if (args.length === 4) {
            const source: any[] = args[0];
            const index: int = args[1];
            const dest: any[] = args[2];
            const destIndex: int = args[3];
            TArray.Copy(source, index, dest, destIndex, source.length - index);
        } else if (args.length === 5) {
            const source: any[] = TArray.Clone(args[0]);
            const index: int = args[1];
            const dest: any[] = args[2];
            const destIndex: int = args[3];
            const count: int = args[4];
            if (source == null) {
                throw new Error('Source array can not be undefined or null.');
            }

            if (dest == null) {
                throw new Error('Destination array can not be undefined or null.');
            }

            if (source.length === 0 || count === 0) {
                return;
            }

            for (let i = 0; i < count; i++) {
                if (source[i] != null && source[i]['clone']) {
                    dest[destIndex + i] = source[i + index].clone();
                } else {
                    dest[destIndex + i] = source[i + index];
                }
            }
        }
    }
    public static Reverse(sourceArray: Array<any> | Uint8Array, index?: number, length?: number): void {
        const _index: number = index || 0;
        const _length: number = length || sourceArray.length;
        const array = sourceArray.slice(_index, _index + _length);
        array.reverse();

        for (let i = 0; i < array.length; i++) {
            sourceArray[_index + i] = array[i];
        }
    }

    public static SortImpl(keys: Array<any>, items: Array<any>, comparer: IComparer<any>): void {
        const index: int = 0;
        const length: int = keys.length;
        const objKeys: any[] = keys as Object[];
        let objItems: any[] = null as any;
        if (objKeys != null)
            objItems = items as Object[];

        /* if (objKeys != null && (items == null || objItems != null)) {
            SorterObjectArray sorter = new SorterObjectArray(objKeys, objItems, comparer);
            sorter.Sort(index, length);
        } else { */
        const sorter: SorterObjectArray = new SorterObjectArray(keys, items, comparer);
        sorter.Sort(index, length);
        //}
    }


    //public static Sort<TKey,TValue>(keys: TKey[], values: TValue,  comparer: IComparer<TKey>): void;
    public static Sort<T>(sourceArray: T[], index: number, length: number, comparer: IComparer<T>): void {
        const array = sourceArray.slice(index, index + length);
        Array.prototype.sort.call(array, comparer.Compare);
        for (let i = 0; i < array.length; i++) {
            sourceArray[index + i] = array[i];
        }
    }

    public static Fill<T>(sourceArray: Array<T>, value: T): void {
        for (let i = 0; i < sourceArray.length; i++) {
            sourceArray[i] = value;
        }
    }

    public static Clone<T>(array: Array<T>): Array<T>;
    public static Clone(array: Int8Array): Int8Array;
    public static Clone(array: Uint8Array): Uint8Array;
    public static Clone(array: Int16Array): Int16Array;
    public static Clone(array: Uint16Array): Uint16Array;
    public static Clone(array: Int32Array): Int32Array;
    public static Clone(array: Uint32Array): Uint32Array;
    public static Clone(...args: any[]): Array<any> | Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array {
        if (args.length === 1 && Array.isArray(args[0])) {
            const array: Array<any> = args[0];
            return Array.prototype.slice.call(array);
        } else if (args.length === 1 && args[0] instanceof Int8Array) {
            const array: Int8Array = args[0];
            return Int8Array.prototype.slice.call(array);
        } else if (args.length === 1 && args[0] instanceof Uint8Array) {
            const array: Uint8Array = args[0];
            return Uint8Array.prototype.slice.call(array);
        } else if (args.length === 1 && args[0] instanceof Int16Array) {
            const array: Int16Array = args[0];
            return Int8Array.prototype.slice.call(array);
        } else if (args.length === 1 && args[0] instanceof Uint16Array) {
            const array: Uint16Array = args[0];
            return Uint8Array.prototype.slice.call(array);
        } else if (args.length === 1 && args[0] instanceof Int32Array) {
            const array: Int32Array = args[0];
            return Int32Array.prototype.slice.call(array);
        } else if (args.length === 1 && args[0] instanceof Uint32Array) {
            const array: Uint32Array = args[0];
            return Uint32Array.prototype.slice.call(array);
        } else {
            throw new ArgumentOutOfRangeException('');
        }
    }

    public static CloneInt32Array = function (array: Int32Array): Int32Array {
        return Int32Array.prototype.slice.call(array);
    }

    public static BinarySearch<T>(array: Array<T>, value: T): int;
    public static BinarySearch<T>(array: Array<T>, index: int, length: int, value: T): int;
    public static BinarySearch<T>(array: Array<T>, value: T, comparer: IComparer<T>): int;
    public static BinarySearch<T>(array: T[], index: int, length: int, value: T, comparer: IComparer<T>): int;
    public static BinarySearch(...args: any[]): int {
        if (args.length === 2 && Array.isArray(args[0])) {
            const array: Array<any> = args[0];
            const value: any = args[1];
            if (array == null) {
                throw new ArgumentNullException("array");
            }
            const lowerBound: int = TArray.GetLowerBound(array, 0);
            return TArray.BinarySearch(array, lowerBound, array.length, value, null as any);
        } else if (args.length === 4 && Array.isArray(args[0]) && typeof args[1] === 'number' && typeof args[2] === 'number') {
            const array: Array<any> = args[0];
            const index: int = args[1];
            const length: int = args[2];
            const value: any = args[3];
            return TArray.BinarySearch(array, index, length, value, null as any);
        } else if (args.length === 3) {
            const array: Array<any> = args[0];
            const value: any = args[1];
            const comparer: IComparer<any> = args[2];
            if (array == null) {
                throw new ArgumentNullException("array");
            }
            const lowerBound: int = TArray.GetLowerBound(array, 0);
            return TArray.BinarySearch(array, lowerBound, array.length, value, comparer);
        } else if (args.length === 5) {
            const array: Array<any> = args[0];
            const index: int = args[1];
            const length: int = args[2];
            const value: any = args[3];
            const comparer: IComparer<any> = args[4];
            if (array == null) {
                throw new ArgumentNullException("array");
            }
            if (index < 0 || length < 0) {
                throw new ArgumentOutOfRangeException((index < 0 ? "index" : "length"), Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            }
            if (array.length - index < length) {
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
            }
            return ArraySortHelper.Default.BinarySearch(array, index, length, value, comparer);
        }
        throw new Exception('');
    }



    public static Flatten<T>(arr: T[]) {
        return Array.prototype.concat.apply([], arr);
    }
    public static Find<T>(collection: T[] | object, matcher: Function) {

        matcher = toMatcher(matcher);

        var match;

        TArray.ForEach(collection, function (val, key) {
            if (matcher(val, key)) {
                match = val;

                return false;
            }
        });

        return match;

    }
    public static Filter<T>(collection: T[] | object, matcher: Function) {

        let result: T[] = [];

        TArray.ForEach(collection, function (val, key) {
            if (matcher(val, key)) {
                result.push(val);
            }
        });

        return result;
    }
    public static ForEach<T>(collection: T[] | object, iterator: Function) {

        let val,
            result;

        if (is.undefined(collection)) {
            return;
        }

        const convertKey = is.array(collection) ? toNum : identity;

        for (let key in collection) {

            if (has(collection, key)) {
                val = collection[key];

                result = iterator(val, convertKey(key));

                if (result === false) {
                    return val;
                }
            }
        }
    }
    public static Without<T>(arr: T[], matcher: Function) {

        if (is.undefined(arr)) {
            return [];
        }

        ensureArray(arr);

        matcher = toMatcher(matcher);

        return arr.filter(function (el, idx) {
            return !matcher(el, idx);
        });

    }



    public static Reduce<T>(collection: T[] | object, iterator: Function, result: any) {
        TArray.ForEach(collection, function (value, idx) {
            result = iterator(result, value, idx);
        });

        return result;
    }



    public static Every<T>(collection: T[] | object, matcher) {
        return !!TArray.Reduce(collection, function (matches, val, key) {
            return matches && matcher(val, key);
        }, true);
    }


    public static Some<T>(collection: T[] | object, matcher: Function) {
        return !!TArray.Find(collection, matcher);
    }


    public static Map<T>(collection: T[] | object, fn: Function) {
        const result: T[] = [];
        TArray.ForEach(collection, function (val, key) {
            result.push(fn(val, key));
        });
        return result;
    }


    public static Keys<T>(collection: T[] | object) {
        return collection && Object.keys(collection) || [];
    }


    public static Size<T>(collection: T[] | object) {
        return TArray.Keys(collection).length;
    }

    public static Values<T>(collection: T[] | object) {
        return TArray.Map(collection, (val) => val);
    }

    public static GroupBy<T>(collection: T[] | object, extractor: Function, grouped: any = {}) {

        extractor = toExtractor(extractor);

        TArray.ForEach(collection, function (val) {
            var discriminator = extractor(val) || '_';

            var group = grouped[discriminator];

            if (!group) {
                group = grouped[discriminator] = [];
            }

            group.push(val);
        });

        return grouped;
    }


    public static UniqueBy(extractor, ...collections) {

        extractor = toExtractor(extractor);

        var grouped = {};

        TArray.ForEach(collections, (c) => TArray.GroupBy(c, extractor, grouped));

        var result = TArray.Map(grouped, function (val, key) {
            return val[0];
        });

        return result;
    }

    public static SortBy<T>(collection: T[] | object, extractor: Function) {

        extractor = toExtractor(extractor);

        const sorted: T[] = [];

        TArray.ForEach(collection, function (value, key) {
            var disc = extractor(value, key);

            var entry: any = {
                d: disc,
                v: value
            };

            for (let idx = 0; idx < sorted.length; idx++) {
                let { d } = sorted[idx] as any;

                if (disc < d) {
                    sorted.splice(idx, 0, entry);
                    return;
                }
            }
            // not inserted, append (!)
            sorted.push(entry);
        });

        return TArray.Map(sorted, (e) => e.v);
    }

    public static MatchPattern(pattern: any): Function {
        return function (el) {

            return TArray.Every(pattern, function (val, key) {
                return el[key] === val;
            });
        };
    }
    public static GetEnumerator<T>(array: ArrayLike<T>): IEnumerator<T> {
        return new ArrayEnumerator(array);
    }
    public static Equals<T>(array1: Array<T>, array2: Array<T>): boolean {
        return arraysEqual(array1, array2);
    }



}