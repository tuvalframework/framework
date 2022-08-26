import { ArgumentOutOfRangeException } from './Exceptions/ArgumentOutOfRangeException';
import { is } from './is';
import { byte } from "./byte";
import { Out } from './Out';
import { BigNumber, bigInt } from './Math/BigNumber';

export type float = number;
export type Integer = number;
export type int = number;
export type uint = number;
export type uint16 = number;
export type double = BigNumber;
export type decimal = BigNumber;
export type UInt64 = BigNumber;
export type Int64 = BigNumber;
export type long = BigNumber;
export type ulong = BigNumber;
export type short = number;
export type ushort = number;
export type char = number;
export type sbyte = number;
//export type Int64 = bigint;
//export type UInt64 = bigint;
export const  UInt64MaxValue: BigNumber = bigInt('18446744073709551615');
export const  UInt64MinValue:BigNumber = bigInt(0);
export const  Int64MaxValue: BigNumber = bigInt('9223372036854775807');
export const  Int64MinValue:BigNumber = bigInt(0);
export const  UInt32MaxValue: uint = 4294967295;
export const  UInt32MinValue:uint = 0;

export type CharArray = Uint16Array;
export type ByteArray = Uint8Array;
export type IntArray = Int32Array;
export type UIntArray = Uint32Array;
export type UInt16Array = Uint16Array;
export type ShortArray = Int16Array;
export type FloatArray = Float32Array;
export type DoubleArray = Float64Array;
export type LongArray = BigNumber[];
export type StringArray = Array<string>;

export type TypedArray = Uint8Array | Int8Array | Uint16Array | Int16Array | Int32Array | Uint32Array | Float32Array | Float64Array;

const OutEmpty: Out<any> = {
    value: undefined
};

export class New {
    public static StringArray(l: int): string[];
    public static StringArray(...params: string[]): string[];
    public static StringArray(...args: any[]): string[] {
        if (args.length === 1 && typeof args[0] === 'number') {
            return new Array<string>(args[0]);
        } else {
            return args;
        }
    }
    public static IntArray(l: int | ArrayLike<byte>): IntArray {
        return new Int32Array(l as any);
    }
    public static UIntArray(l: int | ArrayLike<byte>): Uint32Array {
        return new Uint32Array(l as any);
    }
    public static UInt16Array(l: int | ArrayLike<byte>): Uint16Array {
        return new Uint16Array(l as any);
    }
    public static ShortArray(l: int | ArrayLike<byte>): ShortArray {
        return new Int16Array(l as any);
    }
    public static FloatArray(l: int | ArrayLike<byte>): FloatArray {
        return new Float32Array(l as any);
    }
    public static DoubleArray(l: int | ArrayLike<byte>): DoubleArray {
        return new Float64Array(l as any);
    }
 public static LongArray(l: int | ArrayLike<byte>): LongArray {
        return New.Array(l as any);
    }

    public static ByteArray(l: int | ArrayLike<byte>): ByteArray {
        return new Uint8Array(l as any);
    }
    public static CharArray<T>(init: ArrayLike<T>): CharArray;
    public static CharArray(l: int): CharArray;
    public static CharArray(...args: any[]): CharArray {
        if (args.length === 1 && typeof args[0] === 'number') {
            return new Uint16Array(args[0]);
        } else if (args.length === 1 && Array.isArray(args[0])) {
            return new Uint16Array(args[0]);
        } else {
            throw new ArgumentOutOfRangeException('');
        }
    }

    public static Array<T>(length: int): T[] {
        return new Array(length);
    }

    public static Array2D<T>(rows: int, cols: int): T[][] {
        let arr: T[][] = new Array(rows);
        // creating two dimensional array
        for (let i = 0; i < rows; i++) {
            arr[i] = new Array(cols);
        }
        return arr;
    }
    public static Out<T>(): Out<T>;
    public static Out<T>(defaultValue: T): Out<T>;
    public static Out<T>(...args: any[]): Out<T> {
        if (args.length === 0) {
            return Object.create(OutEmpty);
        } else if (args.length === 1) {
            const obj: Out<T> = Object.create(OutEmpty);
            obj.value = args[0];
            return obj;
        }
        return null as any;
    }
}
