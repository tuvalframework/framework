export type byte = number;

/* export function toByte(n: number | string | boolean): byte | undefined {
    var nn = int(n, 10);
    if (typeof nn === 'number') {
        return (nn + 128) % 256 - 128;
    }
    return undefined;
} */

/* function int(n: string | number | boolean, radix: number): number | undefined {
    radix = radix || 10;
    if (typeof n === 'string') {
        return parseInt(n, radix);
    } else if (typeof n === 'number') {
        return n | 0;
    } else if (typeof n === 'boolean') {
        return n ? 1 : 0;
    }

    return undefined;
} */

export class Byte {
    public static MaxValue: number = 255;
    public static MinValue: number = 0;
}