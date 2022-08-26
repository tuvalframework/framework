import { float } from "./float";

const buffer: Float32Array = new Float32Array(1);
export function toFloat(value: number): float {
    buffer[0] = value;
    return buffer[0];
}