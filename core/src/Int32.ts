import { int } from "./float";

export class Int32 {
    public static MaxValue: number = 2147483647;
    public static MinValue: number = -2147483648;
    public static GetHashCode(value:int): int {
        return value;
    }
}

export class UInt32 {
    public static MaxValue: number = 4294967295;
    public static MinValue: number = 0;
    public static GetHashCode(value:int): int {
        return value;
    }
}