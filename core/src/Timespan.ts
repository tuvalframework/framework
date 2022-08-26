import { double, long, int } from "./float";
import { IComparable } from "./IComparable";
import { IEquatable } from "./IEquatable";
import { IFormattable } from "./IFormattable";
import { TObject } from './Extensions/TObject';
import { Convert } from "./convert";
import { ArgumentOutOfRangeException } from "./Exceptions/ArgumentOutOfRangeException";
import { Environment } from "./Environment";
import { is } from "./is";
import { Override } from "./Reflection/Decorators/ClassInfo";
//import { TimeSpanParse, TimeSpanStyles } from "./Globalization/TimeSpanParse";
import { IFormatProvider } from "./IFormatProvider";
import { Out } from "./Out";
//import { TimeSpanFormat } from "./Globalization/TimeSpanFormat";
import { OverflowException } from "./Extensions/OverflowException";
import { ArgumentException } from "./Exceptions/ArgumentException";
import { SR } from "./SR";
import { System } from "./SystemTypes";

type TimeSpanStyles = any;
declare var CompatibilitySwitches, TimeSpanParse, TimeSpanFormat;
const Int64MaxValue: long = Convert.ToLong(9223372036854775807);
const Int64MinValue: long = Convert.ToLong(0);
export class TimeSpan extends TObject implements IComparable<TimeSpan>, IEquatable<TimeSpan>, IFormattable {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }

    public static readonly TicksPerMillisecond: long = Convert.ToLong(10000);
    private static readonly MillisecondsPerTick: double = Convert.ToLong(1.0).div(TimeSpan.TicksPerMillisecond);

    public static readonly TicksPerSecond: long = TimeSpan.TicksPerMillisecond.mul(1000);   // 10,000,000
    private static readonly SecondsPerTick: double = Convert.ToLong(1.0).div(TimeSpan.TicksPerSecond);         // 0.0001

    public static readonly TicksPerMinute: long = TimeSpan.TicksPerSecond.mul(60);         // 600,000,000
    private static readonly MinutesPerTick: double = Convert.ToLong(1.0).div(TimeSpan.TicksPerMinute); // 1.6666666666667e-9

    public static readonly TicksPerHour: long = TimeSpan.TicksPerMinute.mul(60);        // 36,000,000,000
    private static readonly HoursPerTick: double = Convert.ToLong(1.0).div(TimeSpan.TicksPerHour); // 2.77777777777777778e-11

    public static readonly TicksPerDay: long = TimeSpan.TicksPerHour.mul(24);          // 864,000,000,000
    private static readonly DaysPerTick: double = Convert.ToDouble(1.0).div(TimeSpan.TicksPerDay); // 1.1574074074074074074e-12

    private static readonly MillisPerSecond: int = 1000;
    private static readonly MillisPerMinute: int = TimeSpan.MillisPerSecond * 60; //     60,000
    private static readonly MillisPerHour: int = TimeSpan.MillisPerMinute * 60;   //  3,600,000
    private static readonly MillisPerDay: int = TimeSpan.MillisPerHour * 24;      // 86,400,000

    public /* internal */ static readonly MaxSeconds: long = Int64MaxValue.div(TimeSpan.TicksPerSecond);
    public /* internal */ static readonly MinSeconds: long = Int64MinValue.div(TimeSpan.TicksPerSecond);

    public /* internal */ static readonly MaxMilliSeconds: long = Int64MaxValue.div(TimeSpan.TicksPerMillisecond);
    public /* internal */ static readonly MinMilliSeconds: long = Int64MinValue.div(TimeSpan.TicksPerMillisecond);

    public /* internal */ static readonly TicksPerTenthSecond: long = TimeSpan.TicksPerMillisecond.mul(100);

    public static readonly Zero: TimeSpan = new TimeSpan(Convert.ToLong(0));

    public static readonly MaxValue: TimeSpan = new TimeSpan(Int64MaxValue);
    public static readonly MinValue: TimeSpan = new TimeSpan(Int64MinValue);

    // internal so that DateTime doesn't have to call an extra get
    // method for some arithmetic operations.
    public /* internal */  _ticks: long = Convert.ToLong(0);

    //public TimeSpan() {
    //    _ticks = 0;
    //}

    public constructor(); //struct constructor
    public constructor(ticks: long);
    public constructor(hours: int, minutes: int, seconds: int)
    public constructor(...args: any[]) {
        super();
        if (args.length === 0) {

        } else if (args.length === 1 && is.long(args[0])) {
            const ticks: long = args[0];
            this.constructor1(ticks);
        } else if (args.length === 3 && is.int(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const hours: int = args[0];
            const minutes: int = args[1];
            const seconds: int = args[2];
            this.constructor2(hours, minutes, seconds);
        } else if (args.length === 4 && is.int(args[0]) && is.int(args[1]) && is.int(args[2]) && is.int(args[3])) {
            const days: int = args[0];
            const hours: int = args[1];
            const minutes: int = args[2];
            const seconds: int = args[3];
            this.constructor3(days, hours, minutes, seconds);
        } else if (args.length === 5 && is.int(args[0]) && is.int(args[1]) && is.int(args[2]) && is.int(args[3]) && is.int(args[4])) {
            const days: int = args[0];
            const hours: int = args[1];
            const minutes: int = args[2];
            const seconds: int = args[3];
            const milliseconds: int = args[4];
            this.constructor4(days, days, hours, minutes, seconds);
        }
    }

    public constructor1(ticks: long) {
        this._ticks = ticks;
    }

    public constructor2(hours: int, minutes: int, seconds: int) {
        this._ticks = TimeSpan.TimeToTicks(hours, minutes, seconds);
    }

    public constructor3(days: int, hours: int, minutes: int, seconds: int) {
        this.constructor4(days, hours, minutes, seconds, 0)
    }

    public constructor4(days: int, hours: int, minutes: int, seconds: int, milliseconds: int) {
        const totalMilliSeconds: long = Convert.ToLong((days * 3600 * 24 + hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds);
        if (totalMilliSeconds > TimeSpan.MaxMilliSeconds || totalMilliSeconds < TimeSpan.MinMilliSeconds)
            throw new ArgumentOutOfRangeException(null as any, Environment.GetResourceString("Overflow_TimeSpanTooLong"));
        this._ticks = totalMilliSeconds.mul(TimeSpan.TicksPerMillisecond);
    }

    public get Ticks(): long {
        return this._ticks;
    }

    public get Days(): int {
        return Convert.ToInt32(this._ticks.div(TimeSpan.TicksPerDay));
    }

    public get Hours(): int {
        return Convert.ToInt32((this._ticks.div(TimeSpan.TicksPerHour)).mod(24));
    }


    public get Milliseconds(): int {
        return Convert.ToInt32((this._ticks.div(TimeSpan.TicksPerMillisecond)).mod(1000));
    }


    public get Minutes(): int {
        return Convert.ToInt32((this._ticks.div(TimeSpan.TicksPerMinute)).mod(60));
    }

    public get Seconds(): int {
        return Convert.ToInt32((this._ticks.div(TimeSpan.TicksPerSecond)).mod(60));
    }


    public get TotalDays(): double {
        return this._ticks.mul(TimeSpan.DaysPerTick);
    }

    public get TotalHours(): double {
        return this._ticks.mul(TimeSpan.HoursPerTick);
    }

    public get TotalMilliseconds(): double {
        const temp: double = this._ticks.mul(TimeSpan.MillisecondsPerTick);
        if (temp.greaterThan(TimeSpan.MaxMilliSeconds))
            return TimeSpan.MaxMilliSeconds;

        if (temp.lessThan(TimeSpan.MinMilliSeconds))
            return TimeSpan.MinMilliSeconds;

        return temp;
    }

    public get TotalMinutes(): double {
        return this._ticks.mul(TimeSpan.MinutesPerTick);
    }

    public get TotalSeconds(): double {
        return this._ticks.mul(TimeSpan.SecondsPerTick);
    }

    public Add(ts: TimeSpan): TimeSpan {
        const result: long = this._ticks.add(ts._ticks);
        // Overflow if signs of operands was identical and result's
        // sign was opposite.
        // >> 63 gives the sign bit (either 64 1's or 64 0's).
        if ((this._ticks.shr(63).equals(ts._ticks.shr(63)) && (this._ticks.shr(63).notEquals(result.shr(63))))) {
            throw new OverflowException(Environment.GetResourceString("Overflow_TimeSpanTooLong"));
        }
        return new TimeSpan(result);
    }


    // Compares two TimeSpan values, returning an integer that indicates their
    // relationship.
    //
    public static Compare(t1: TimeSpan, t2: TimeSpan): int {
        if (t1._ticks > t2._ticks) return 1;
        if (t1._ticks < t2._ticks) return -1;
        return 0;
    }


    public CompareTo(value: TimeSpan): int {
        const t: long = value._ticks;
        if (this._ticks.greaterThan(t))
            return 1;
        if (this._ticks.lessThan(t))
            return -1;
        return 0;
    }


    public static FromDays(value: double): TimeSpan {
        return TimeSpan.Interval(value, TimeSpan.MillisPerDay);
    }

    public Duration(): TimeSpan {
        /*  if (this.Ticks.equals(TimeSpan.MinValue.Ticks))
             throw new OverflowException(Environment.GetResourceString("Overflow_Duration"));
         Contract.EndContractBlock(); */
        return new TimeSpan(this._ticks.greaterThanOrEqual(0) ? this._ticks : this._ticks.neg());
    }

    /* public override bool Equals(Object value) {
        if (value is TimeSpan) {
            return _ticks == ((TimeSpan)value)._ticks;
        }
        return false;
    } */

    public Equals<TimeSpan>(obj: TimeSpan): boolean {
        return this._ticks.equals((obj as any)._ticks);
    }

    public static Equals(t1: TimeSpan, t2: TimeSpan): boolean {
        return t1._ticks.equals(t2._ticks);
    }

    @Override
    public GetHashCode(): int {
        return this._ticks.toNumber() ^ Convert.ToInt32(this._ticks.shr(32));
    }

    public static FromHours(value: double): TimeSpan {
        return TimeSpan.Interval(value, TimeSpan.MillisPerHour);
    }

    private static Interval(value: double, scale: int): TimeSpan {
        const tmp: double = value.mul(scale);
        const millis: double = tmp.add(value.greaterThanOrEqual(0) ? 0.5 : -0.5);
        if ((millis.greaterThan(Int64MaxValue.div(TimeSpan.TicksPerMillisecond))) || (millis.lessThan(Int64MinValue.div(TimeSpan.TicksPerMillisecond))))
            throw new OverflowException(Environment.GetResourceString("Overflow_TimeSpanTooLong"));
        return new TimeSpan(millis.mul(TimeSpan.TicksPerMillisecond));
    }

    public static FromMilliseconds(value: double): TimeSpan {
        return TimeSpan.Interval(value, 1);
    }

    public static FromMinutes(value: double): TimeSpan {
        return TimeSpan.Interval(value, TimeSpan.MillisPerMinute);
    }

    public Negate(): TimeSpan {
        /* if (Ticks == TimeSpan.MinValue.Ticks)
            throw new OverflowException(Environment.GetResourceString("Overflow_NegateTwosCompNum"));
        Contract.EndContractBlock(); */
        return new TimeSpan(this._ticks.neg());
    }

    public static FromSeconds(value: double): TimeSpan {
        return TimeSpan.Interval(value, TimeSpan.MillisPerSecond);
    }

    public Subtract(ts: TimeSpan): TimeSpan {
        const result: long = this._ticks.sub(ts._ticks);
        // Overflow if signs of operands was different and result's
        // sign was opposite from the first argument's sign.
        // >> 63 gives the sign bit (either 64 1's or 64 0's).
        if ((this._ticks.shr(63).notEquals(ts._ticks.shr(63)) && (this._ticks.shr(63).notEquals(result.shr(63)))))
            throw new OverflowException(Environment.GetResourceString("Overflow_TimeSpanTooLong"));
        return new TimeSpan(result);
    }

    public static FromTicks(value: long): TimeSpan {
        return new TimeSpan(value);
    }

    public /* internal */ static TimeToTicks(hour: int, minute: int, second: int): long {
        // totalSeconds is bounded by 2^31 * 2^12 + 2^31 * 2^8 + 2^31,
        // which is less than 2^44, meaning we won't overflow totalSeconds.
        const totalSeconds: long = Convert.ToLong(hour).mul(3600).add(Convert.ToLong(minute).mul(60).add(second));
        if (totalSeconds.greaterThan(TimeSpan.MaxSeconds) || totalSeconds.lessThan(TimeSpan.MinSeconds)) {
            throw new ArgumentOutOfRangeException(null as any, Environment.GetResourceString("Overflow_TimeSpanTooLong"));
        }
        return totalSeconds.mul(TimeSpan.TicksPerSecond);
    }

    // See System.Globalization.TimeSpanParse and System.Globalization.TimeSpanFormat
    // #region ParseAndFormat
    /*    public static  Parse( s: string):TimeSpan {
           return TimeSpanParse.Parse(s, null);
       } */
    public static Parse(input: string, formatProvider: IFormatProvider = null as any): TimeSpan {
        return TimeSpanParse.Parse(input, formatProvider);
    }
    public static ParseExact(input: string, format: string, formatProvider: IFormatProvider): TimeSpan;
    public static ParseExact(input: string, formats: string[], formatProvider: IFormatProvider): TimeSpan;
    public static ParseExact(input: string, format: string, formatProvider: IFormatProvider, styles: TimeSpanStyles): TimeSpan;
    public static ParseExact(input: string, formats: string[], formatProvider: IFormatProvider, styles: TimeSpanStyles): TimeSpan;
    public static ParseExact(...args: any[]): TimeSpan {
        if (args.length === 3 && is.string(args[0]) && is.string(args[1])) {
            const input: string = args[0];
            const format: string = args[1];
            const formatProvider: IFormatProvider = args[2];
            return TimeSpanParse.ParseExact(input, format, formatProvider, 0/* TimeSpanStyles.None */);
        } else if (args.length === 3 && is.string(args[0]) && is.array(args[1])) {
            const input: string = args[0];
            const formats: string[] = args[1];
            const formatProvider: IFormatProvider = args[2];
            return TimeSpanParse.ParseExactMultiple(input, formats, formatProvider, 0/* TimeSpanStyles.None */);
        } else if (args.length === 4 && is.string(args[0]) && is.string(args[1])) {
            const input: string = args[0];
            const format: string = args[1];
            const formatProvider: IFormatProvider = args[2];
            const styles: TimeSpanStyles = args[3];
            TimeSpanParse.ValidateStyles(styles, "styles");
            return TimeSpanParse.ParseExact(input, format, formatProvider, styles);
        } else if (args.length === 4 && is.string(args[0]) && is.array(args[1])) {
            const input: string = args[0];
            const formats: string[] = args[1];
            const formatProvider: IFormatProvider = args[2];
            const styles: TimeSpanStyles = args[3];
            TimeSpanParse.ValidateStyles(styles, "styles");
            return TimeSpanParse.ParseExactMultiple(input, formats, formatProvider, styles);
        }
        throw new ArgumentOutOfRangeException('');
    }

    public static TryParse(s: string, result: Out<TimeSpan>): boolean;
    public static TryParse(input: string, formatProvider: IFormatProvider, result: Out<TimeSpan>): boolean;
    public static TryParse(...args: any[]): boolean {
        if (args.length === 2) {
            const s: string = args[0];
            const result: Out<TimeSpan> = args[1];
            return TimeSpanParse.TryParse(s, null as any, result);
        } else if (args.length === 3) {
            const input: string = args[0];
            const formatProvider: IFormatProvider = args[1];
            const result: Out<TimeSpan> = args[2];
            return TimeSpanParse.TryParse(input, formatProvider, result);
        }
        throw new ArgumentOutOfRangeException('');
    }

    public static TryParseExact(input: string, format: string, formatProvider: IFormatProvider, result: Out<TimeSpan>): boolean;
    public static TryParseExact(input: string, formats: string[], formatProvider: IFormatProvider, result: Out<TimeSpan>): boolean;
    public static TryParseExact(input: string, format: string, formatProvider: IFormatProvider, styles: TimeSpanStyles, result: Out<TimeSpan>): boolean;
    public static TryParseExact(...args: any[]): boolean {
        if (args.length === 4 && is.string(args[0]) && is.string(args[1])) {
            const input: string = args[0];
            const format: string = args[1];
            const formatProvider: IFormatProvider = args[2];
            const result: Out<TimeSpan> = args[3];
            return TimeSpanParse.TryParseExact(input, format, formatProvider, 0/* TimeSpanStyles.None */, result);
        } else if (args.length === 4 && is.string(args[0]) && is.array(args[1])) {
            const input: string = args[0];
            const formats: string[] = args[1];
            const formatProvider: IFormatProvider = args[2];
            const result: Out<TimeSpan> = args[3];
            return TimeSpanParse.TryParseExactMultiple(input, formats, formatProvider, 0/* TimeSpanStyles.None */, result);
        } else if (args.length === 5 && is.string(args[0]) && is.string(args[1])) {
            const input: string = args[0];
            const format: string = args[1];
            const formatProvider: IFormatProvider = args[2];
            const styles: TimeSpanStyles = args[3];
            const result: Out<TimeSpan> = args[4];
            TimeSpanParse.ValidateStyles(styles, "styles");
            return TimeSpanParse.TryParseExact(input, format, formatProvider, styles, result);
        } else if (args.length === 5 && is.string(args[0]) && is.array(args[1])) {
            const input: string = args[0];
            const formats: string[] = args[1];
            const formatProvider: IFormatProvider = args[2];
            const styles: TimeSpanStyles = args[3];
            const result: Out<TimeSpan> = args[4];
            TimeSpanParse.ValidateStyles(styles, "styles");
            return TimeSpanParse.TryParseExactMultiple(input, formats, formatProvider, styles, result);
        }
        throw new ArgumentOutOfRangeException('');
    }


    public ToString(): string;
    public ToString(format: string): string;
    public ToString(format: string, formatProvider: IFormatProvider): string;
    public ToString(...args: any[]): string {
        if (args.length === 0) {
            return TimeSpanFormat.Format(this, null as any, null as any);
        } else if (args.length === 1) {
            const format: string = args[0];
            return TimeSpanFormat.Format(this, format, null as any);
        } else if (args.length === 2) {
            const format: string = args[0];
            const formatProvider: IFormatProvider = args[1];
            if (TimeSpan.LegacyMode) {
                return TimeSpanFormat.Format(this, null as any, null as any);
            }
            else {
                return TimeSpanFormat.Format(this, format, formatProvider);
            }
        }
        throw new ArgumentOutOfRangeException('');
    }

    /*   public static Sub(t: TimeSpan): TimeSpan {
          if (t._ticks.equals(TimeSpan.MinValue._ticks))
              throw new OverflowException(Environment.GetResourceString("Overflow_NegateTwosCompNum"));
          return new TimeSpan(t._ticks.neg());
      } */

    public static Sub(t1: TimeSpan, t2: TimeSpan): TimeSpan {
        return t1.Subtract(t2);
    }

    /*   public static TimeSpan operator + (TimeSpan t) {
      return t;
  } */

    public static Add(t1: TimeSpan, t2: TimeSpan): TimeSpan {
        return t1.Add(t2);
    }

    /*    public static Equals (TimeSpan t1, TimeSpan t2):boolean {
       return t1._ticks == t2._ticks;
   } */

    public static NotEquals(t1: TimeSpan, t2: TimeSpan): boolean {
        return t1._ticks.notEquals(t2._ticks);
    }

    public static LessThan(t1: TimeSpan, t2: TimeSpan): boolean {
        return t1._ticks.lessThan(t2._ticks);
    }

    public static LessThanOrEqual(t1: TimeSpan, t2: TimeSpan): boolean {
        return t1._ticks.lessThanOrEqual(t2._ticks);
    }

    public static GreaterThan(t1: TimeSpan, t2: TimeSpan): boolean {
        return t1._ticks.greaterThan(t2._ticks);
    }

    public static GreaterThanOrEqual(t1: TimeSpan, t2: TimeSpan): boolean {
        return t1._ticks.greaterThanOrEqual(t2._ticks);
    }

    public static Div(timeSpan: TimeSpan, divisor: double): TimeSpan;
    public static Div(t1: TimeSpan, t2: TimeSpan): double;
    public static Div(...args: any[]): TimeSpan | double {
        if (args.length === 2 && is.typeof<TimeSpan>(args[0], System.Types.TimeSpan) && is.double(args[1])) {
            const timeSpan: TimeSpan = args[0];
            const divisor: double = args[1];
            if (isNaN(divisor.toNumber())) {
                throw new ArgumentException(SR.Arg_CannotBeNaN);
            }

            const ticks: double = Convert.ToDouble(Math.round(timeSpan.Ticks.div(divisor).toNumber()));
            if (ticks > Int64MaxValue || ticks < Int64MinValue || isNaN(ticks.toNumber())) {
                throw new OverflowException(SR.Overflow_TimeSpanTooLong);
            }

            return TimeSpan.FromTicks(ticks);
        } else if (args.length === 2 && is.typeof<TimeSpan>(args[0], System.Types.TimeSpan) && is.typeof<TimeSpan>(args[1], System.Types.TimeSpan)) {
            const t1: TimeSpan = args[0];
            const t2: TimeSpan = args[1];
            return t1.Ticks.div(t2.Ticks) as any;
        }
        throw new ArgumentOutOfRangeException('');
    }



    private static LegacyFormatMode(): boolean {
        return false;
    }



    private static GetLegacyFormatMode(): boolean {

        return CompatibilitySwitches.IsAppEarlierThanSilverlight4;
    }

    private static _legacyConfigChecked: boolean = false;
    private static _legacyMode: boolean = false;

    private static get LegacyMode(): boolean {
        if (!TimeSpan._legacyConfigChecked) {
            // no need to lock - idempotent
            TimeSpan._legacyMode = TimeSpan.GetLegacyFormatMode();
            TimeSpan._legacyConfigChecked = true;
        }
        return TimeSpan._legacyMode;
    }
}