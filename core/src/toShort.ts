import { long, short } from "./float";

const buffer: Int16Array = new Int16Array(1);
export function toShort(value: number): short {
    buffer[0] = value;
    return buffer[0];
}