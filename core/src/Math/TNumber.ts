import { Exception } from "../Exception";
import { float, int } from "../float";
import { is } from "../is";
import { NumberFormatter } from "../NumberFormatter";

export class TNumber {
    public static Precision(value: float): int {
        if (!isFinite(value)) return 0;
        var e = 1, p = 0;
        while (Math.round(value * e) / e !== value) { e *= 10; p++; }
        return p;
    }
    public static ToString(format: string, value: int): string {
        if (is.float(value)) {
            return NumberFormatter.FloatToString(format, value, null as any);
        } else if (is.int(value)) {
            return NumberFormatter.IntToString(format, value, null as any);
        }
        throw new Exception('Not Supported Data Type.');
    }
}

Number.prototype.ToString = function (format: string): string {
    return TNumber.ToString(format, this);
}