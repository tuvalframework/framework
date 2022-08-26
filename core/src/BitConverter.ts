import { ByteArray, char, double, float, int, long, New } from "./float";
import { ThrowHelper } from "./ThrowHelper";
import { ArgumentNullException } from "./Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "./Exceptions/ArgumentOutOfRangeException";
import { ArgumentException } from "./Exceptions/ArgumentException";
import { Convert } from "./convert";
import { NotImplementedException } from "./Exceptions";
import { bigInt } from "./Math/BigNumber";
import { TArray } from "./Extensions/TArray";

function bufToBn(buf: Uint8Array): long {
    var hex: string[] = [];
    const u8: Uint8Array = Uint8Array.from(buf);

    u8.forEach(function (i) {
        var h = i.toString(16);
        if (h.length % 2) { h = '0' + h; }
        hex.push(h);
    });

    return bigInt(hex.join(''), 16);
}

export class BitConverter {
    public static get IsLittleEndian():boolean {
        return true;
    }
    public static GetBooleanBytes(x: boolean): ByteArray {
        return New.ByteArray([Convert.ToByte(x ? 1 : 0)]);
    }
    public static GetCharBytes(c: char): ByteArray {
        return New.ByteArray([Convert.ToByte(c & 0xff), Convert.ToByte(c >> 8 & 0xff)])
    }
    public static GetDoubleBytes(x: float): ByteArray {
        var farr = new Float64Array(1);
        farr[0] = x;
        return new Uint8Array(farr.buffer);
    }
    public static GetIntBytes(x: int): ByteArray {
        return New.ByteArray([Convert.ToByte(x >>> 24), Convert.ToByte(x >>> 16), Convert.ToByte(x >>> 8), Convert.ToByte(x)]);
    }
    public static GetFloatBytes(x: float): ByteArray {
        var farr = new Float32Array(1);
        farr[0] = x;
        return new Uint8Array(farr.buffer);
        //console.log(barr);
        //return BitConverter.GetIntBytes(((f) => { let buf = new ArrayBuffer(4); (new Float32Array(buf))[0] = f; return (new Uint32Array(buf))[0]; })(x));
    }
    public static DoubleToInt64Bits(x: number): long {
        const bytes = BitConverter.GetDoubleBytes(x);
        return BitConverter.ToInt64(bytes);
        //return /* doubleToRawLongBits */((f) => { let buf = new ArrayBuffer(4); (new Float32Array(buf))[0]=f; return (new Uint32Array(buf))[0]; })((<any>Math).fround(x));
    }

    public static ToInt32(bytes: ByteArray, index: number): number {
        if (bytes.length !== 4) throw Object.defineProperty(new Error("The length of the byte array must be at least 4 bytes long."), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.Exception'] });
        return (<number>((<number>(255 & bytes[index]) | 0) << 56 | (<number>(255 & bytes[index + 1]) | 0) << 48 | (<number>(255 & bytes[index + 2]) | 0) << 40 | (<number>(255 & bytes[index + 3]) | 0) << 32) | 0);
    }

    public static ToSingle(bytes: ByteArray, index: number): number {
        if (bytes.length !== 4) throw Object.defineProperty(new Error("The length of the byte array must be at least 4 bytes long."), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Object', 'java.lang.Exception'] });
        return ((v) => { let buf = new ArrayBuffer(4); (new Uint32Array(buf))[0] = v; return (new Float32Array(buf))[0]; })(BitConverter.ToInt32(bytes, index));
    }

    public static ToInt64(value: Uint8Array, startIndex: int = 0): long {
        if (value == null) {
            throw new ArgumentNullException('value');
        }
        if (startIndex >= (value.length)) {
            throw new ArgumentOutOfRangeException('value', 'startIndex');
        }
        if (startIndex > value.length - 8) {
            throw new ArgumentException('');
        }
        const numPointer: Uint8Array = new Uint8Array(value.slice(startIndex, value.length));

          if (startIndex % 8 === 0) {
              TArray.Reverse(numPointer,0,numPointer.length);
            return bufToBn(numPointer);
            // return (bigInt as any).fromArray(numPointer, 10, false);
         }
        /*  if (BitConverter.IsLittleEndian) {
             int int32 = * numPointer | * (numPointer + 1) << 8 | * (numPointer + 2) << 16 | * (numPointer + 3) << 24;
             int int321 = * (numPointer + 4) | * (numPointer + 5) << 8 | * (numPointer + 6) << 16 | * (numPointer + 7) << 24;
             return (long)((ulong)int32 | (long)int321 << 32);
         } */
        const int322: int = (numPointer[0] << 24) | (numPointer[1]) << 16 | (numPointer[2]) << 8 | (numPointer[3]);
        const int323: int = (numPointer[4]) << 24 | (numPointer[5]) << 16 | (numPointer[6]) << 8 | (numPointer[7]);



        return Convert.ToLong(int323).or(Convert.ToLong(int322).shl(32));
        //}
    }
}
