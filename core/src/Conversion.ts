import { byte } from "./byte";

export class Conversion {
    public static Float(str: string | Array<any>) {
        if (str instanceof Array) {
            return str.map(x => parseFloat(x));
        }
        return parseFloat(str);
    }

    public static Int(n: string | number | boolean, radix: number): number {
        radix = radix || 10;
        if (typeof n === 'string') {
            return parseInt(n, radix);
        } else if (typeof n === 'number') {
            return n | 0;
        } else if (typeof n === 'boolean') {
            return n ? 1 : 0;
        }
        return Number.NaN;
    }

    public static Str(n: string): string {
        return String(n);

    }

    public static Boolean(n: number | string | boolean): boolean {
        if (typeof n === 'number') {
            return n !== 0;
        } else if (typeof n === 'string') {
            return n.toLowerCase() === 'true';
        } else if (typeof n === 'boolean') {
            return n;
        }
        return false;
    }

    public static Byte(n: number | string | boolean): byte {
        var nn = Conversion.Int(n, 10);
        if (typeof nn === 'number') {
            return (nn + 128) % 256 - 128;
        }
        return null as any;
    }

    public static Char(n: number | string): string {
        if (typeof n === 'number' && !isNaN(n)) {
            return String.fromCharCode(n);
        } else if (typeof n === 'string') {
            return Conversion.Char(parseInt(n, 10));
        }
        return undefined as any;
    }
}