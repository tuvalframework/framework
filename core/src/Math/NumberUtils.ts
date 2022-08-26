import { Convert } from "../convert";
import { float, int, double, long } from "../float";


export class NumberUtils {
    public static floatToIntBits(value: float): int {
        return (function (f) { var buf = new ArrayBuffer(4); (new Float32Array(buf))[0] = f; return (new Uint32Array(buf))[0]; })(value);

    }

    public static floatToRawIntBits(value: float): int {
        return (function (f) {
            var buf = new ArrayBuffer(4);
            (new Float32Array(buf))[0] = f;
            return (new Uint32Array(buf))[0];
        })(value);
    }

    /** Converts the color from a float ABGR encoding to an int ABGR encoding. The alpha is expanded from 0-254 in the float
     * encoding (see {@link #intToFloatColor(int)}) to 0-255, which means converting from int to float and back to int can be
     * lossy. */
    public static floatToIntColor(value: float): int {
        var intBits = (function (f) { var buf = new ArrayBuffer(4); (new Float32Array(buf))[0] = f; return (new Uint32Array(buf))[0]; })(value);
        intBits |= Convert.ToInt32((intBits >>> 24) * (255 / 254)) << 24;
        return intBits;
    }

    /** Encodes the ABGR int color as a float. The alpha is compressed to 0-254 to avoid using bits in the NaN range (see
     * {@link Float#intBitsToFloat(int)} javadocs). Rendering which uses colors encoded as floats should expand the 0-254 back to
     * 0-255. */
    public static intToFloatColor(value: int): float {
        return (function (v) { var buf = new ArrayBuffer(4); (new Uint32Array(buf))[0] = v; return (new Float32Array(buf))[0]; })(value & 0xfeffffff);
    }

    public static intBitsToFloat(value: int): float {
        return (function (v) { var buf = new ArrayBuffer(4); (new Uint32Array(buf))[0] = v; return (new Float32Array(buf))[0]; })(value);
    }

    public static doubleToLongBits(value: double): int {
        return (
            function (f) {
                var buf = new ArrayBuffer(4);
                (new Float32Array(buf))[0] = f;
                return (new Uint32Array(buf))[0];
            })(Math.fround(value.toNumber()));
    }

    public static longBitsToDouble(value: int): int {
        return (function (v) { var buf = new ArrayBuffer(4); (new Uint32Array(buf))[0] = v; return (new Float32Array(buf))[0]; })(value);
    }
}
