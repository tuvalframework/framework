import { int, long } from "./float";
import { toByte } from "./toByte";
import { Base64 } from "./Encoding/Base64";

const buffer: Int32Array = new Int32Array(1);
const UInt32Buffer: Uint32Array = new Uint32Array(1);
/*
export function toLong(value: number): long {
    buffer[0] = value;
    return buffer[0];
}

export function toInt32(value: number): int {
    buffer[0] = value;
    return buffer[0];
}

export class to {
    public static UInt32(value: number): number {
        UInt32Buffer[0] = value;
        return UInt32Buffer[0];
    }
    public static int32(value: any) {
        return toInt32(value);
    }
    public static byte(value: any) {
        return toByte(value);
    }


} */