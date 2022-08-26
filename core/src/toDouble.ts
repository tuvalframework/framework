import { float } from "./float";

const buffer: Float64Array = new Float64Array(1);
export function toDouble(value: number): float {
    buffer[0] = value;
    return buffer[0];
}