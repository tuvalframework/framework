import { ByteArray, int, Int64, long } from './float';
import { isString } from "./is";
/* import { Base64, toByteArray } from './Encoding/Base64';
import { UTF8 } from "./Encoding"; */
import { IntPtr } from './Marshal/IntPtr';
import { bigInt, BigNumber, BigInteger, NativeBigInt } from './Math/BigNumber';
import { ArgumentOutOfRangeException } from './Exceptions';
import { Integer } from './Integer';
import { Base64 } from './Encoding/Base64';
import { Exception } from './Exception';
import { Context } from './Context/Context';

/// #if NODE
import { NodeBlob as Blob } from './NodeBlob';
/// #endif

export function convert<T>(obj: any): T {
    return obj as T;
}

export type uint8_t = number; // char 8 Bits	Unsigned	0 .. 255
export type int8_t = number; //signed char 8 Bits	Signed	-128 .. 127
export type uint16_t = number; // unsigned short 16 Bits	Unsigned	0 .. 65,535
export type int16_t = number; // short 16 Bits	Signed	-32,768 .. 32,767
export type uint32_t = number; // unsigned int 32 Bits	Unsigned	0 .. 4,294,967,295
export type int32_t = number; // int 32 Bits Signed	-2,147,483,648 .. 2,147,483,647
export type uint64_t = bigint; // unsigned long long 64 Bits Unsigned	0 .. 18,446,744,073,709,551,615
export type int64_t = bigint; // long long 64 Bits	Signed	-9,223,372,036,854,775,808 .. 9,223,372,036,854,775,807

//export function i8(value: number):

//const f64buffer: Float64Array = new Float64Array(1);

const f64buffer: Float64Array = new Float64Array(1);
export function f64(value: any): number {
    f64buffer[0] = value;
    return f64buffer[0];
}


const i64buffer: BigInt64Array = new BigInt64Array(1);
export function i64(value: any): int64_t {
    i64buffer[0] = value;
    return i64buffer[0];
}

const u64buffer: BigUint64Array = new BigUint64Array(1);
export function u64(value: any): uint64_t {
    i64buffer[0] = value;
    return i64buffer[0];
}

const u8buffer: Uint8Array = new Uint8Array(1);
export function u8(value: number): uint8_t {
    u8buffer[0] = value;
    return u8buffer[0];
}
const i8buffer: Int8Array = new Int8Array(1);
export function i8(value: number): int8_t {
    i8buffer[0] = value;
    return i8buffer[0];
}

const u16buffer: Uint16Array = new Uint16Array(1);
export function u16(value: number): uint16_t {
    u16buffer[0] = value;
    return u16buffer[0];
    //return value >>> 0;
}
const i16buffer: Int16Array = new Int16Array(1);
export function i16(value: number): int16_t {
    i16buffer[0] = value;
    return i16buffer[0];
}

const u32buffer: Uint32Array = new Uint32Array(1);
export function u32(value: number): uint32_t {
    u32buffer[0] = value;
    return u32buffer[0];
    //return value >>> 0; // fast way
}
const i32buffer: Int32Array = new Int32Array(1);
export function i32(value: number): int32_t {
    value = Math.floor(value);
    if (value > 2147483647) {
        let t = value - 2147483648;
        console.log(t);
        if (value >= 0) {
            return (2147483648 - t) * -1;
        }
    }
    if (value < -2147483648) {
        let t = value + 2147483648;
        console.log(t);
        if (value <= 0) {
            return (2147483648 + t);
        }
    }
    return value;
}
//
/* export function _i32(value: number): number {
    if (Native.Convert?.ToInt32) {
        return Native.Convert.ToInt32(value);
    } else {
        i32buffer[0] = value;
        return i32buffer[0];
    }
} */
/*
export class int32_t {
    private value: int = 0;
    private ensureI32(v: int): int {
        i32buffer[0] = v;
        return i32buffer[0];
    }
    constructor(v: int) {
        this.value = this.ensureI32(v);
    }
    public inc() {
        this.value = this.ensureI32(++this.value);
    }
    public dec() {
        this.value = this.ensureI32(--this.value);
    }
    public add(v: int);
    public add(v: int32_t);
    public add(...args: any[]) {
        if (typeof args[0] === 'number') {
            return new int32_t(this.value + this.ensureI32(args[0]));
        } else {
            return new int32_t(this.value + args[0].value);
        }
    }
    public sub(v: int);
    public sub(v: int32_t);
    public sub(...args: any[]) {
        if (typeof args[0] === 'number') {
            return new int32_t(this.value - this.ensureI32(args[0]));
        } else {
            return new int32_t(this.value - args[0].value);
        }
    }
    public mul(v: int);
    public mul(v: int32_t);
    public mul(...args: any[]) {
        if (typeof args[0] === 'number') {
            return new int32_t(this.value * this.ensureI32(args[0]));
        } else {
            return new int32_t(this.value * args[0].value);
        }
    }
    public div(v: int);
    public div(v: int32_t);
    public div(...args: any[]) {
        if (typeof args[0] === 'number') {
            return new int32_t(this.value / this.ensureI32(args[0]));
        } else {
            return new int32_t(this.value / args[0].value);
        }
    }
    public equal(v: int): boolean;
    public equal(v: int32_t): boolean;
    public equal(...args: any[]): boolean {
        if (typeof args[0] === 'number') {
            return this.value === this.ensureI32(args[0]);
        } else {
            return this.value === args[0].value;
        }
    }
    public notEqual(v: int): boolean;
    public notEqual(v: int32_t): boolean;
    public notEqual(...args: any[]): boolean {
        if (typeof args[0] === 'number') {
            return this.value !== this.ensureI32(args[0]);
        } else {
            return this.value !== args[0].value;
        }
    }

    public greater(v: int): boolean;
    public greater(v: int32_t): boolean;
    public greater(...args: any[]): boolean {
        if (typeof args[0] === 'number') {
            return this.value > this.ensureI32(args[0]);
        } else {
            return this.value > args[0].value;
        }
    }
    public greaterEqual(v: int): boolean;
    public greaterEqual(v: int32_t): boolean;
    public greaterEqual(...args: any[]): boolean {
        if (typeof args[0] === 'number') {
            return this.value >= this.ensureI32(args[0]);
        } else {
            return this.value >= args[0].value;
        }
    }

    public less(v: int): boolean;
    public less(v: int32_t): boolean;
    public less(...args: any[]): boolean {
        if (typeof args[0] === 'number') {
            return this.value < this.ensureI32(args[0]);
        } else {
            return this.value < args[0].value;
        }
    }
    public lessEqual(v: int): boolean;
    public lessEqual(v: int32_t): boolean;
    public lessEqual(...args: any[]): boolean {
        if (typeof args[0] === 'number') {
            return this.value <= this.ensureI32(args[0]);
        } else {
            return this.value <= args[0].value;
        }
    }
} */

export class Convert {

    public static ToInt32Array(array: Int8Array | Uint8Array | Int16Array | Uint16Array | Int16Array | Uint16Array | Int32Array | Uint32Array, offset?: number, length?: number) {
        if (offset === undefined) {
            offset = 0;
        }
        const originalOffset = offset;
        //we convert offet to byte offset,
        if (array instanceof Int8Array || array instanceof Uint8Array) {
            offset = offset; // offset already byte offset
        } else if (array instanceof Int16Array || array instanceof Uint16Array) {
            offset *= 2;
        } else if (array instanceof Int32Array || array instanceof Uint32Array) {
            offset *= 4;
        } else {
            throw new Exception('Invalid offset.');
        }

        if (length === undefined) {
            length = array.length - originalOffset;
        }

        return new Int32Array(array.buffer, offset, length);
    }

    public static ToByteArray(array: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, byteIndex: int = 0) {
        return new Uint8Array(array.buffer, byteIndex);
    }
    public static ToCharArray(array: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, charIndex: int = 0) {
        return new Uint16Array(array.buffer, charIndex * 2);
    }
    public static ToShortArray(array: Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array, charIndex: int = 0) {
        return new Int16Array(array.buffer, charIndex * 2);
    }
    public static ToIntPtr(value: number): IntPtr {
        return new IntPtr(value);
    }
    public static ToLong(value: any): long {
        return bigInt(value);
    }
    public static ToULong(value: number): uint64_t {
        return u64(value);
    }
    public static ToFloat(value: number): number {
        return f64(value);
    }
    public static ToDouble(value: number): BigNumber {
        return bigInt(value);
    }
    public static ToDecimal(value: number): bigint {
        return i64(value);
    }
    public static ToByte(value: number): number {
        return Convert.ToUInt8(value);
    }
    public static ToSByte(value: number): number {
        return Convert.ToInt8(value);
    }
    public static ToUInt8(value: number): number {
        return u8(value);
    }
    public static ToInt8(value: number): number {
        return i8(value);
    }

    public static ToInt64(value: number | Int64 | BigNumber): BigNumber {
        if (typeof value === 'number') {
            return Convert.ToLong(value);
        } else if (value instanceof Integer) {
            return value;
        } else if (value instanceof NativeBigInt) {
            return value;
        } else if (value instanceof BigInteger) {
            return value;
        }
        throw new ArgumentOutOfRangeException('');
    }

    /*  public static ToUInt64(value: number | Int64 | Double): UInt64 {
         if (typeof value === 'number') {
             return UInt64.fromNumber(value);
         } else {
             return new UInt64(value.low, value.high);
         }
     } */

    public static ToShort(value: number): number {
        return i16(value);
    }

    public static ToChar(value: number): number {
        return u16(value);
    }
    public static ToUShort(value: number): number {
        return u16(value);
    }
    public static ToInt32(value: string | number | BigNumber, fromBase?: int): int {
        if (value === undefined) {
            return Number.NaN;
        }
        if (typeof value === 'number') {
            return i32(value);
        } else if (value instanceof BigInteger) {
            return i32(value.toJSNumber());
        } else if (value instanceof NativeBigInt) {
            return i32(value.toJSNumber());
        } else if (isString(value)) {
            return i32(parseInt(value as any, fromBase));
        } else {
            throw new Error(value + 'can not convert to Int32');
        }
    }
    public static ToUInt32(value: any, fromBase?: int): int {
        if (typeof value === 'number') {
            return u32(value);
        } else if (value instanceof BigInteger) {
            return u32(value.toJSNumber());
        } else if (value instanceof NativeBigInt) {
            return u32(value.toJSNumber());
        } else if (isString(value)) {
            return u32(parseInt(value, fromBase));
        } else {
            throw new Error(value + 'can not convert to UInt32');
        }
    }
    public static ToUInt16(value: any, fromBase?: int): int {
        if (typeof value === 'number') {
            return u16(value);
        } else if (value instanceof BigInteger) {
            return u16(value.toJSNumber());
        } else if (value instanceof NativeBigInt) {
            return u16(value.toJSNumber());
        } else if (isString(value)) {
            return u16(parseInt(value, fromBase));
        } else {
            throw new Error(value + 'can not convert to UInt16');
        }
    }

    public static ToString(value: any, toBase?: number): string {
        if (value != null && toBase === undefined) {
            return value.toString();
        } else if (value != null && typeof value === 'number' && typeof toBase === 'number') {
            const ParseNumbers = Context.Current.get('ParseNumbers');
            return ParseNumbers.IntToString(value, toBase, -1, ' '.charCodeAt(0), ParseNumbers.PrintAsI1);
        }

        return '';
    }
    public static ToBase64String(bytes: ByteArray): string {
        // const bytes: Uint8Array = UTF8.GetBytes(text);
        return Base64.FromByteArray(bytes);
    }
    public static FromBase64String(text: string): ByteArray {
        //const bytes: Uint8Array = Base64.ToByteArray(text);
        return Base64.ToByteArray(text);
    }
    public static ToBlobUrl(buffer: ArrayBuffer, type: string): string {
        try {
        const blob = new Blob([buffer] , { type: type } );
        return URL.createObjectURL(blob as any);
        }
        catch {
            return 'URL can not created.'
        }
    }
}