
// DateTimeOffset is a value type that consists of a DateTime and a time zone offset,
// ie. how far away the time is from GMT. The DateTime is stored whole, and the offset
// is stored as an Int16 internally to save space, but presented as a TimeSpan.
//
// The range is constrained so that both the represented clock time and the represented
// UTC time fit within the boundaries of MaxValue. This gives it the same range as DateTime
// for actual UTC times, and a slightly constrained range on one end when an offset is
// present.
//
// This class should be substitutable for date time in most cases; so most operations
// effectively work on the clock time. However, the underlying UTC time is what counts
// for the purposes of identity, sorting and subtracting two instances.
//
//
// There are theoretically two date times stored, the UTC and the relative local representation
// or the 'clock' time. It actually does not matter which is stored in m_dateTime, so it is desirable
// for most methods to go through the helpers UtcDateTime and ClockDateTime both to abstract this
// out and for internal readability.

import { IComparable } from "./IComparable";
import { IEquatable } from "./IEquatable";
import { IFormattable } from "./IFormattable";
import { long, int, double, New } from './float';
import { TimeSpan } from "./Timespan";
import { is } from "./is";
import { System } from "./SystemTypes";
//import { TimeZoneInfo, TimeZoneInfoOptions } from "./TimeZoneInfo";
import { DateTime } from "./Time/__DateTime";
import { Environment } from "./Environment";
import { DateTimeKind } from "./DateTimeKind";
import { ArgumentException } from "./Exceptions/ArgumentException";
//import { Calendar } from "./Globalization/Calendar";
type Calendar = any;
import { DayOfWeek } from "./Time/DayOfWeek";
import { ArgumentOutOfRangeException } from "./Exceptions/ArgumentOutOfRangeException";
import { TString } from "./Text/TString";
import { Override } from "./Reflection/Decorators/ClassInfo";
import { DateTimeParse } from "./Globalization/Datetimeparse";
import { DateTimeStyles } from "./Time/DateTimeStyles";
import { Out } from './Out';
import { IFormatProvider } from "./IFormatProvider";
//import { DateTimeFormat } from "./Globalization/DateTimeFormat";
import { Convert } from "./convert";
//import { DateTimeFormatInfo } from "./Globalization/CultureInfo";
import { Exception } from "./Exception";
import { EventBus } from './Events/EventBus';

declare var DateTimeFormatInfo, TimeZoneInfo, TimeZoneInfoOptions;
export class DateTimeOffset implements IFormattable, IComparable<DateTimeOffset>, IEquatable<DateTimeOffset> {

    // Constants
    public /* internal */ static readonly MaxOffset: long = TimeSpan.TicksPerHour.mul(14);
    public /* internal */ static readonly MinOffset: long = DateTimeOffset.MaxOffset.neg();

    private static readonly UnixEpochTicks: long = TimeSpan.TicksPerDay.mul(DateTime.DaysTo1970); // 621,355,968,000,000,000
    private static readonly UnixEpochSeconds: long = DateTimeOffset.UnixEpochTicks.div(TimeSpan.TicksPerSecond); // 62,135,596,800
    private static readonly UnixEpochMilliseconds: long = DateTimeOffset.UnixEpochTicks.div(TimeSpan.TicksPerMillisecond); // 62,135,596,800,000

    // Static Fields
    public static readonly MinValue: DateTimeOffset = new DateTimeOffset(DateTime.MinTicks, TimeSpan.Zero);
    public static readonly MaxValue: DateTimeOffset = new DateTimeOffset(DateTime.MaxTicks, TimeSpan.Zero);

    // Instance Fields
    private m_dateTime: DateTime = null as any;
    private m_offsetMinutes: int = 0;

    // Constructors

    // Constructs a DateTimeOffset from a tick count and offset
    public constructor(ticks: long, offset: TimeSpan);
    public constructor(dateTime: DateTime, offset: TimeSpan);
    public constructor(dateTime: DateTime);
    public constructor(year: int, month: int, day: int, hour: int, minute: int, second: int, offset: TimeSpan);
    public constructor(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int, offset: TimeSpan);
    public constructor(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int, calendar: Calendar, offset: TimeSpan);
    public constructor(...args: any[]) {
        if (args.length === 2 && is.long(args[0]) && is.typeof<TimeSpan>(args[0], System.Types.TimeSpan)) {
            const ticks: long = args[0];
            const offset: TimeSpan = args[1];
            this.m_offsetMinutes = DateTimeOffset.ValidateOffset(offset);
            // Let the DateTime constructor do the range checks
            const dateTime: DateTime = new DateTime(ticks);
            this.m_dateTime = DateTimeOffset.ValidateDate(dateTime, offset);
        } else if (args.length === 1 && is.typeof<DateTime>(args[0], System.Types.DateTime)) {
            const dateTime: DateTime = args[0];
            let offset: TimeSpan;
            if (dateTime.Kind != DateTimeKind.Utc) {
                // Local and Unspecified are both treated as Local
                offset = TimeZoneInfo.GetLocalUtcOffset(dateTime, TimeZoneInfoOptions.NoThrowOnInvalidTime);
            }
            else {
                offset = new TimeSpan(Convert.ToLong(0));
            }
            this.m_offsetMinutes = DateTimeOffset.ValidateOffset(offset);
            this.m_dateTime = DateTimeOffset.ValidateDate(dateTime, offset);
        } else if (args.length === 2 && is.typeof<DateTime>(args[0], System.Types.DateTime) && is.typeof<TimeSpan>(args[1], System.Types.TimeSpan)) {
            const dateTime: DateTime = args[0];
            const offset: TimeSpan = args[1];
            if (dateTime.Kind === DateTimeKind.Local) {
                if (offset !== TimeZoneInfo.GetLocalUtcOffset(dateTime, TimeZoneInfoOptions.NoThrowOnInvalidTime)) {
                    throw new ArgumentException(Environment.GetResourceString("Argument_OffsetLocalMismatch"), "offset");
                }
            }
            else if (dateTime.Kind === DateTimeKind.Utc) {
                if (offset !== TimeSpan.Zero) {
                    throw new ArgumentException(Environment.GetResourceString("Argument_OffsetUtcMismatch"), "offset");
                }
            }
            this.m_offsetMinutes = DateTimeOffset.ValidateOffset(offset);
            this.m_dateTime = DateTimeOffset.ValidateDate(dateTime, offset);
        } else if (args.length === 7) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            const hour: int = args[3];
            const minute: int = args[4];
            const second: int = args[5];
            const offset: TimeSpan = args[6];
            this.m_offsetMinutes = DateTimeOffset.ValidateOffset(offset);
            this.m_dateTime = DateTimeOffset.ValidateDate(new DateTime(year, month, day, hour, minute, second), offset);
        } else if (args.length === 8) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            const hour: int = args[3];
            const minute: int = args[4];
            const second: int = args[5];
            const millisecond: int = args[6];
            const offset: TimeSpan = args[7];
            this.m_offsetMinutes = DateTimeOffset.ValidateOffset(offset);
            this.m_dateTime = DateTimeOffset.ValidateDate(new DateTime(year, month, day, hour, minute, second, millisecond), offset);
        } else if (args.length === 9) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            const hour: int = args[3];
            const minute: int = args[4];
            const second: int = args[5];
            const millisecond: int = args[6];
            const calendar: Calendar = args[7];
            const offset: TimeSpan = args[8];
            this.m_offsetMinutes = DateTimeOffset.ValidateOffset(offset);
            this.m_dateTime = DateTimeOffset.ValidateDate(new DateTime(year, month, day, hour, minute, second, millisecond, calendar), offset);
        }
    }


    // Returns a DateTimeOffset representing the current date and time. The
    // resolution of the returned value depends on the system timer. For
    // Windows NT 3.5 and later the timer resolution is approximately 10ms,
    // for Windows NT 3.1 it is approximately 16ms, and for Windows 95 and 98
    // it is approximately 55ms.
    //
    public static get Now(): DateTimeOffset {
        return new DateTimeOffset(DateTime.Now);
    }

    public static get UtcNow(): DateTimeOffset {
        return new DateTimeOffset(DateTime.UtcNow);
    }

    public get DateTime(): DateTime {
        return this.ClockDateTime;
    }

    public get UtcDateTime(): DateTime {
        return DateTime.SpecifyKind(this.m_dateTime, DateTimeKind.Utc);
    }


    public get LocalDateTime(): DateTime {
        return this.UtcDateTime.ToLocalTime();
    }

    // Adjust to a given offset with the same UTC time.  Can throw ArgumentException
    //
    public ToOffset(offset: TimeSpan): DateTimeOffset {
        return new DateTimeOffset((this.m_dateTime.Add(offset)).Ticks, offset);
    }


    // Instance Properties

    // The clock or visible time represented. This is just a wrapper around the internal date because this is
    // the chosen storage mechanism. Going through this helper is good for readability and maintainability.
    // This should be used for display but not identity.
    private get ClockDateTime(): DateTime {
        return new DateTime(this.m_dateTime.Add(this.Offset).Ticks, DateTimeKind.Unspecified);
    }

    // Returns the date part of this DateTimeOffset. The resulting value
    // corresponds to this DateTimeOffset with the time-of-day part set to
    // zero (midnight).
    //
    public get Date(): DateTime {
        return this.ClockDateTime.Date;
    }

    // Returns the day-of-month part of this DateTimeOffset. The returned
    // value is an integer between 1 and 31.
    //
    public get Day(): int {
        return this.ClockDateTime.Day;
    }


    // Returns the day-of-week part of this DateTimeOffset. The returned value
    // is an integer between 0 and 6, where 0 indicates Sunday, 1 indicates
    // Monday, 2 indicates Tuesday, 3 indicates Wednesday, 4 indicates
    // Thursday, 5 indicates Friday, and 6 indicates Saturday.
    //
    public get DayOfWeek(): DayOfWeek {
        return this.ClockDateTime.DayOfWeek;
    }

    // Returns the day-of-year part of this DateTimeOffset. The returned value
    // is an integer between 1 and 366.
    //
    public get DayOfYear(): int {
        return this.ClockDateTime.DayOfYear;
    }

    // Returns the hour part of this DateTimeOffset. The returned value is an
    // integer between 0 and 23.
    //
    public get Hour(): int {
        return this.ClockDateTime.Hour;
    }


    // Returns the millisecond part of this DateTimeOffset. The returned value
    // is an integer between 0 and 999.
    //
    public get Millisecond(): int {
        return this.ClockDateTime.Millisecond;
    }

    // Returns the minute part of this DateTimeOffset. The returned value is
    // an integer between 0 and 59.
    //
    public get Minute(): int {
        return this.ClockDateTime.Minute;
    }

    // Returns the month part of this DateTimeOffset. The returned value is an
    // integer between 1 and 12.
    //
    public get Month(): int {
        return this.ClockDateTime.Month;
    }

    public get Offset(): TimeSpan {
        return new TimeSpan(0, this.m_offsetMinutes, 0);
    }

    // Returns the second part of this DateTimeOffset. The returned value is
    // an integer between 0 and 59.
    //
    public get Second(): int {
        return this.ClockDateTime.Second;
    }

    // Returns the tick count for this DateTimeOffset. The returned value is
    // the number of 100-nanosecond intervals that have elapsed since 1/1/0001
    // 12:00am.
    //
    public get Ticks(): long {
        return this.ClockDateTime.Ticks;
    }

    public get UtcTicks(): long {
        return this.UtcDateTime.Ticks;
    }

    // Returns the time-of-day part of this DateTimeOffset. The returned value
    // is a TimeSpan that indicates the time elapsed since midnight.
    //
    public get TimeOfDay(): TimeSpan {
        return this.ClockDateTime.TimeOfDay;
    }

    // Returns the year part of this DateTimeOffset. The returned value is an
    // integer between 1 and 9999.
    //
    public get Year(): int {
        return this.ClockDateTime.Year;
    }

    // Returns the DateTimeOffset resulting from adding the given
    // TimeSpan to this DateTimeOffset.
    //
    public Add(timeSpan: TimeSpan): DateTimeOffset {
        return new DateTimeOffset(this.ClockDateTime.Add(timeSpan), this.Offset);
    }

    // Returns the DateTimeOffset resulting from adding a fractional number of
    // days to this DateTimeOffset. The result is computed by rounding the
    // fractional number of days given by value to the nearest
    // millisecond, and adding that interval to this DateTimeOffset. The
    // value argument is permitted to be negative.
    //
    public AddDays(days: double): DateTimeOffset {
        return new DateTimeOffset(this.ClockDateTime.AddDays(days), this.Offset);
    }

    // Returns the DateTimeOffset resulting from adding a fractional number of
    // hours to this DateTimeOffset. The result is computed by rounding the
    // fractional number of hours given by value to the nearest
    // millisecond, and adding that interval to this DateTimeOffset. The
    // value argument is permitted to be negative.
    //
    public AddHours(hours: double): DateTimeOffset {
        return new DateTimeOffset(this.ClockDateTime.AddHours(hours), this.Offset);
    }

    // Returns the DateTimeOffset resulting from the given number of
    // milliseconds to this DateTimeOffset. The result is computed by rounding
    // the number of milliseconds given by value to the nearest integer,
    // and adding that interval to this DateTimeOffset. The value
    // argument is permitted to be negative.
    //
    public AddMilliseconds(milliseconds: double): DateTimeOffset {
        return new DateTimeOffset(this.ClockDateTime.AddMilliseconds(milliseconds), this.Offset);
    }

    // Returns the DateTimeOffset resulting from adding a fractional number of
    // minutes to this DateTimeOffset. The result is computed by rounding the
    // fractional number of minutes given by value to the nearest
    // millisecond, and adding that interval to this DateTimeOffset. The
    // value argument is permitted to be negative.
    //
    public AddMinutes(minutes: double): DateTimeOffset {
        return new DateTimeOffset(this.ClockDateTime.AddMinutes(minutes), this.Offset);
    }

    public AddMonths(months: int): DateTimeOffset {
        return new DateTimeOffset(this.ClockDateTime.AddMonths(months), this.Offset);
    }

    // Returns the DateTimeOffset resulting from adding a fractional number of
    // seconds to this DateTimeOffset. The result is computed by rounding the
    // fractional number of seconds given by value to the nearest
    // millisecond, and adding that interval to this DateTimeOffset. The
    // value argument is permitted to be negative.
    //
    public AddSeconds(seconds: double): DateTimeOffset {
        return new DateTimeOffset(this.ClockDateTime.AddSeconds(seconds), this.Offset);
    }

    // Returns the DateTimeOffset resulting from adding the given number of
    // 100-nanosecond ticks to this DateTimeOffset. The value argument
    // is permitted to be negative.
    //
    public AddTicks(ticks: long): DateTimeOffset {
        return new DateTimeOffset(this.ClockDateTime.AddTicks(ticks), this.Offset);
    }

    // Returns the DateTimeOffset resulting from adding the given number of
    // years to this DateTimeOffset. The result is computed by incrementing
    // (or decrementing) the year part of this DateTimeOffset by value
    // years. If the month and day of this DateTimeOffset is 2/29, and if the
    // resulting year is not a leap year, the month and day of the resulting
    // DateTimeOffset becomes 2/28. Otherwise, the month, day, and time-of-day
    // parts of the result are the same as those of this DateTimeOffset.
    //
    public AddYears(years: int): DateTimeOffset {
        return new DateTimeOffset(this.ClockDateTime.AddYears(years), this.Offset);
    }

    // Compares two DateTimeOffset values, returning an integer that indicates
    // their relationship.
    //
    public static Compare(first: DateTimeOffset, second: DateTimeOffset): int {
        return DateTime.Compare(first.UtcDateTime, second.UtcDateTime);
    }

    // Compares this DateTimeOffset to a given object. This method provides an
    // implementation of the IComparable interface. The object
    // argument must be another DateTimeOffset, or otherwise an exception
    // occurs.  Null is considered less than any instance.
    //
    public CompareTo(other: DateTimeOffset): int {
        const otherUtc: DateTime = other.UtcDateTime;
        const utc: DateTime = this.UtcDateTime;
        if (utc.greaterThan(otherUtc)) return 1;
        if (utc.lessThan(otherUtc)) return -1;
        return 0;
    }


    // Checks if this DateTimeOffset is equal to a given object. Returns
    // true if the given object is a boxed DateTimeOffset and its value
    // is equal to the value of this DateTimeOffset. Returns false
    // otherwise.
    //
    /*   @Override
      public   Equals(Object obj):boolean {
          if (obj is DateTimeOffset) {
              return UtcDateTime.Equals(((DateTimeOffset)obj).UtcDateTime);
          }
          return false;
      } */

    public Equals(other: DateTimeOffset): boolean {
        return this.UtcDateTime.Equals(other.UtcDateTime);
    }

    public EqualsExact(other: DateTimeOffset) {
        //
        // returns true when the ClockDateTime, Kind, and Offset match
        //
        // currently the Kind should always be Unspecified, but there is always the possibility that a future version
        // of DateTimeOffset overloads the Kind field
        //
        return (this.ClockDateTime.Equals(other.ClockDateTime) && this.Offset.Equals(other.Offset) && this.ClockDateTime.Kind === other.ClockDateTime.Kind);
    }

    // Compares two DateTimeOffset values for equality. Returns true if
    // the two DateTimeOffset values are equal, or false if they are
    // not equal.
    //
    public static Equals(first: DateTimeOffset, second: DateTimeOffset): boolean {
        return DateTime.Equals(first.UtcDateTime, second.UtcDateTime);
    }

    // Creates a DateTimeOffset from a Windows filetime. A Windows filetime is
    // a long representing the date and time as the number of
    // 100-nanosecond intervals that have elapsed since 1/1/1601 12:00am.
    //
    public static FromFileTime(fileTime: long): DateTimeOffset {
        return new DateTimeOffset(DateTime.FromFileTime(fileTime));
    }

    public static FromUnixTimeSeconds(seconds: long): DateTimeOffset {
        const MinSeconds: long = DateTime.MinTicks.div(TimeSpan.TicksPerSecond).sub(DateTimeOffset.UnixEpochSeconds);
        const MaxSeconds: long = DateTime.MaxTicks.div(TimeSpan.TicksPerSecond).sub(DateTimeOffset.UnixEpochSeconds);

        if (seconds.lessThan(MinSeconds) || seconds.greaterThan(MaxSeconds)) {
            throw new ArgumentOutOfRangeException("seconds",
                TString.Format(Environment.GetResourceString("ArgumentOutOfRange_Range"), MinSeconds, MaxSeconds));
        }

        const ticks: long = seconds.mul(TimeSpan.TicksPerSecond).add(DateTimeOffset.UnixEpochTicks);
        return new DateTimeOffset(ticks, TimeSpan.Zero);
    }

    public static FromUnixTimeMilliseconds(milliseconds: long): DateTimeOffset {
        const MinMilliseconds: long = DateTime.MinTicks.div(TimeSpan.TicksPerMillisecond).sub(DateTimeOffset.UnixEpochMilliseconds);
        const MaxMilliseconds: long = DateTime.MaxTicks.div(TimeSpan.TicksPerMillisecond).sub(DateTimeOffset.UnixEpochMilliseconds);

        if (milliseconds.lessThan(MinMilliseconds) || milliseconds.greaterThan(MaxMilliseconds)) {
            throw new ArgumentOutOfRangeException("milliseconds",
                TString.Format(Environment.GetResourceString("ArgumentOutOfRange_Range"), MinMilliseconds, MaxMilliseconds));
        }

        const ticks: long = milliseconds.mul(TimeSpan.TicksPerMillisecond).add(DateTimeOffset.UnixEpochTicks);
        return new DateTimeOffset(ticks, TimeSpan.Zero);
    }

    // ----- SECTION: private serialization instance methods  ----------------*



    // Returns the hash code for this DateTimeOffset.
    //
    @Override
    public GetHashCode(): int {
        return this.UtcDateTime.GetHashCode();
    }

    // Constructs a DateTimeOffset from a string. The string must specify a
    // date and optionally a time in a culture-specific or universal format.
    // Leading and trailing whitespace characters are allowed.
    //
    public static Parse(input: string): DateTimeOffset;
    public static Parse(input: string, formatProvider: IFormatProvider): DateTimeOffset;
    public static Parse(input: string, formatProvider: IFormatProvider, styles: DateTimeStyles): DateTimeOffset;
    public static Parse(...args: any[]): DateTimeOffset {
        if (args.length === 1) {
            const input: string = args[0];
            let offset: Out<TimeSpan> = New.Out();
            const dateResult: DateTime = DateTimeParse.Parse(input, DateTimeFormatInfo.CurrentInfo,
                DateTimeStyles.None,
                offset);
            return new DateTimeOffset(dateResult.Ticks, offset.value);
        } else if (args.length === 2) {
            const input: string = args[0];
            const formatProvider: IFormatProvider = args[1];
            return DateTimeOffset.Parse(input, formatProvider, DateTimeStyles.None);
        } else if (args.length === 3) {
            const input: string = args[0];
            const formatProvider: IFormatProvider = args[1];
            let styles: DateTimeStyles = args[2];
            styles = DateTimeOffset.ValidateStyles(styles, "styles");
            let offset: Out<TimeSpan> = New.Out();
            const dateResult: DateTime = DateTimeParse.Parse(input, DateTimeFormatInfo.GetInstance(formatProvider),
                styles,
                offset);
            return new DateTimeOffset(dateResult.Ticks, offset.value);
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Constructs a DateTimeOffset from a string. The string must specify a
    // date and optionally a time in a culture-specific or universal format.
    // Leading and trailing whitespace characters are allowed.
    //
    public static ParseExact(input: string, format: string, formatProvider: IFormatProvider): DateTimeOffset;
    public static ParseExact(input: string, format: string, formatProvider: IFormatProvider, styles: DateTimeStyles): DateTimeOffset;
    public static ParseExact(input: string, formats: string[], formatProvider: IFormatProvider, styles: DateTimeStyles): DateTimeOffset;
    public static ParseExact(...args: any[]): DateTimeOffset {
        if (args.length === 3) {
            const input: string = args[0];
            const format: string = args[1];
            const formatProvider: IFormatProvider = args[2];
            return DateTimeOffset.ParseExact(input, format, formatProvider, DateTimeStyles.None);
        } else if (args.length === 4 && is.string(args[0]) && is.string(args[1])) {
            const input: string = args[0];
            const format: string = args[1];
            const formatProvider: IFormatProvider = args[2];
            let styles: DateTimeStyles = args[3];
            styles = DateTimeOffset.ValidateStyles(styles, "styles");
            let offset: Out<TimeSpan> = New.Out();
            let dateResult: DateTime = DateTimeParse.ParseExact(input,
                format,
                DateTimeFormatInfo.GetInstance(formatProvider),
                styles,
                offset);
            return new DateTimeOffset(dateResult.Ticks, offset.value);
        } else if (args.length === 4 && is.string(args[0]) && is.array(args[1])) {
            const input: string = args[0];
            const formats: string[] = args[1];
            const formatProvider: IFormatProvider = args[2];
            let styles: DateTimeStyles = args[3];
            styles = DateTimeOffset.ValidateStyles(styles, "styles");
            let offset: Out<TimeSpan> = New.Out();
            let dateResult: DateTime = DateTimeParse.ParseExactMultiple(input,
                formats,
                DateTimeFormatInfo.GetInstance(formatProvider),
                styles,
                offset);
            return new DateTimeOffset(dateResult.Ticks, offset.value);
        }
        throw new ArgumentOutOfRangeException('');
    }

    public Subtract(value: DateTimeOffset): TimeSpan;
    public Subtract(value: TimeSpan): DateTimeOffset;
    public Subtract(...args: any[]): TimeSpan | DateTimeOffset {
        if (args.length === 1 && is.typeof<DateTimeOffset>(args[0], System.Types.DateTimeOffset)) {
            const value: DateTimeOffset = args[0];
            return this.UtcDateTime.Subtract(value.UtcDateTime);
        } else if (args.length === 1 && is.typeof<TimeSpan>(args[0], System.Types.TimeSpan)) {
            const value: TimeSpan = args[0];
            return new DateTimeOffset(this.ClockDateTime.Subtract(value), this.Offset);
        }
        throw new ArgumentOutOfRangeException('');
    }

    public ToFileTime(): long {
        return this.UtcDateTime.ToFileTime();
    }

    public ToUnixTimeSeconds(): long {
        // Truncate sub-second precision before offsetting by the Unix Epoch to avoid
        // the last digit being off by one for dates that result in negative Unix times.
        //
        // For example, consider the DateTimeOffset 12/31/1969 12:59:59.001 +0
        //   ticks            = 621355967990010000
        //   ticksFromEpoch   = ticks - UnixEpochTicks                   = -9990000
        //   secondsFromEpoch = ticksFromEpoch / TimeSpan.TicksPerSecond = 0
        //
        // Notice that secondsFromEpoch is rounded *up* by the truncation induced by integer division,
        // whereas we actually always want to round *down* when converting to Unix time. This happens
        // automatically for positive Unix time values. Now the example becomes:
        //   seconds          = ticks / TimeSpan.TicksPerSecond = 62135596799
        //   secondsFromEpoch = seconds - UnixEpochSeconds      = -1
        //
        // In other words, we want to consistently round toward the time 1/1/0001 00:00:00,
        // rather than toward the Unix Epoch (1/1/1970 00:00:00).
        const seconds: long = this.UtcDateTime.Ticks.div(TimeSpan.TicksPerSecond);
        return seconds.sub(DateTimeOffset.UnixEpochSeconds);
    }

    public ToUnixTimeMilliseconds(): long {
        // Truncate sub-millisecond precision before offsetting by the Unix Epoch to avoid
        // the last digit being off by one for dates that result in negative Unix times
        const milliseconds: long = this.UtcDateTime.Ticks.div(TimeSpan.TicksPerMillisecond);
        return milliseconds.sub(DateTimeOffset.UnixEpochMilliseconds);
    }

    public ToLocalTime(): DateTimeOffset;
    public ToLocalTime(throwOnOverflow: boolean): DateTimeOffset;
    public ToLocalTime(...args: any[]): DateTimeOffset {
        if (args.length === 0) {
            return this.ToLocalTime(false);
        } else if (args.length === 1) {
            const throwOnOverflow: boolean = args[0];
            return new DateTimeOffset(this.UtcDateTime.ToLocalTime(throwOnOverflow));
        }
        throw new ArgumentOutOfRangeException('');
    }

    public ToString(): string;
    public ToString(format: string): string;
    public ToString(formatProvider: IFormatProvider): string;
    public ToString(format: string, formatProvider: IFormatProvider): string;
    public ToString(...args: any[]): string {
        if (args.length === 0) {
            throw new Exception('düzelt');
            //return DateTimeFormat.Format(this.ClockDateTime, null as any, DateTimeFormatInfo.CurrentInfo, this.Offset);
        } else if (args.length === 1) {
            const format: string = args[0];
            throw new Exception('düzelt');
            // return DateTimeFormat.Format(this.ClockDateTime, format, DateTimeFormatInfo.CurrentInfo, this.Offset);
        } else if (args.length === 1 && is.typeof<IFormatProvider>(args[0], System.Types.IFormatProvider)) {
            const formatProvider: IFormatProvider = args[0];
            throw new Exception('düzelt');
            //return DateTimeFormat.Format(this.ClockDateTime, null as any, DateTimeFormatInfo.GetInstance(formatProvider), this.Offset);
        } else if (args.length === 2) {
            const format: string = args[0];
            const formatProvider: IFormatProvider = args[1];
            throw new Exception('düzelt');
            //return DateTimeFormat.Format(this.ClockDateTime, format, DateTimeFormatInfo.GetInstance(formatProvider), this.Offset);
        }
        throw new ArgumentOutOfRangeException('');
    }

    public ToUniversalTime(): DateTimeOffset {
        return new DateTimeOffset(this.UtcDateTime);
    }

    public static TryParse(input: string, result: Out<DateTimeOffset>): boolean;
    public static TryParse(input: string, formatProvider: IFormatProvider, styles: DateTimeStyles, result: Out<DateTimeOffset>): boolean;
    public static TryParse(...args: any[]): boolean {
        if (args.length === 2) {
            const input: string = args[0];
            const result: Out<DateTimeOffset> = args[1];
            let offset: Out<TimeSpan> = New.Out();
            let dateResult: Out<DateTime> = New.Out();
            const parsed: boolean = DateTimeParse.TryParse(input,
                DateTimeFormatInfo.CurrentInfo,
                DateTimeStyles.None,
                dateResult,
                offset);
            result.value = new DateTimeOffset(dateResult.value.Ticks, offset.value);
            return parsed;
        } else if (args.length === 4) {
            const input: string = args[0];
            const formatProvider: IFormatProvider = args[1];
            let styles: DateTimeStyles = args[2];
            const result: Out<DateTimeOffset> = args[3];
            styles = DateTimeOffset.ValidateStyles(styles, "styles");
            const offset: Out<TimeSpan> = New.Out();
            const dateResult: Out<DateTime> = New.Out();
            const parsed: boolean = DateTimeParse.TryParse(input,
                DateTimeFormatInfo.GetInstance(formatProvider),
                styles,
                dateResult,
                offset);
            result.value = new DateTimeOffset(dateResult.value.Ticks, offset.value);
            return parsed;
        }
        throw new ArgumentOutOfRangeException('');
    }


    public static TryParseExact(input: string, format: string, formatProvider: IFormatProvider, styles: DateTimeStyles, result: Out<DateTimeOffset>): boolean;
    public static TryParseExact(input: string, formats: string[], formatProvider: IFormatProvider, styles: DateTimeStyles, result: Out<DateTimeOffset>): boolean;
    public static TryParseExact(...args: any[]): boolean {
        if (args.length === 5 && is.string(args[0]) && is.string(args[1])) {
            const input: string = args[0];
            const format: string = args[1];
            const formatProvider: IFormatProvider = args[2];
            let styles: DateTimeStyles = args[3];
            const result: Out<DateTimeOffset> = args[4];
            styles = DateTimeOffset.ValidateStyles(styles, "styles");
            const offset: Out<TimeSpan> = New.Out();
            const dateResult: Out<DateTime> = New.Out();
            const parsed: boolean = DateTimeParse.TryParseExact(input,
                format,
                DateTimeFormatInfo.GetInstance(formatProvider),
                styles,
                dateResult,
                offset);
            result.value = new DateTimeOffset(dateResult.value.Ticks, offset.value);
            return parsed;
        } else if (args.length === 5 && is.string(args[0]) && is.array(args[1])) {
            const input: string = args[0];
            const formats: string[] = args[1];
            const formatProvider: IFormatProvider = args[2];
            let styles: DateTimeStyles = args[3];
            const result: Out<DateTimeOffset> = args[4];
            styles = DateTimeOffset.ValidateStyles(styles, "styles");
            const offset: Out<TimeSpan> = New.Out();;
            const dateResult: Out<DateTime> = New.Out();
            const parsed: boolean = DateTimeParse.TryParseExactMultiple(input,
                formats,
                DateTimeFormatInfo.GetInstance(formatProvider),
                styles,
                dateResult,
                offset);
            result.value = new DateTimeOffset(dateResult.value.Ticks, offset.value);
            return parsed;
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Ensures the TimeSpan is valid to go in a DateTimeOffset.
    private static ValidateOffset(offset: TimeSpan): int {
        const ticks: long = offset.Ticks;
        if (ticks.mod(TimeSpan.TicksPerMinute).notEquals(0)) {
            throw new ArgumentException(Environment.GetResourceString("Argument_OffsetPrecision"), "offset");
        }
        if (ticks.lessThan(DateTimeOffset.MinOffset) || ticks.greaterThan(DateTimeOffset.MaxOffset)) {
            throw new ArgumentOutOfRangeException("offset", Environment.GetResourceString("Argument_OffsetOutOfRange"));
        }
        return offset.Ticks.div(TimeSpan.TicksPerMinute).toNumber();
    }

    // Ensures that the time and offset are in range.
    private static ValidateDate(dateTime: DateTime, offset: TimeSpan): DateTime {
        // The key validation is that both the UTC and clock times fit. The clock time is validated
        // by the DateTime constructor.
        //Contract.Assert(offset.Ticks >= MinOffset && offset.Ticks <= MaxOffset, "Offset not validated.");
        // This operation cannot overflow because offset should have already been validated to be within
        // 14 hours and the DateTime instance is more than that distance from the boundaries of Int64.
        const utcTicks: long = dateTime.Ticks.sub(offset.Ticks);
        if (utcTicks < DateTime.MinTicks || utcTicks > DateTime.MaxTicks) {
            throw new ArgumentOutOfRangeException("offset", Environment.GetResourceString("Argument_UTCOutOfRange"));
        }
        // make sure the Kind is set to Unspecified
        //
        return new DateTime(utcTicks, DateTimeKind.Unspecified);
    }

    private static ValidateStyles(style: DateTimeStyles, parameterName: string): DateTimeStyles {
        if ((style & DateTimeFormatInfo.InvalidDateTimeStyles) !== 0) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidDateTimeStyles"), parameterName);
        }
        if (((style & (DateTimeStyles.AssumeLocal)) !== 0) && ((style & (DateTimeStyles.AssumeUniversal)) !== 0)) {
            throw new ArgumentException(Environment.GetResourceString("Argument_ConflictingDateTimeStyles"), parameterName);
        }
        if ((style & DateTimeStyles.NoCurrentDateDefault) != 0) {
            throw new ArgumentException(Environment.GetResourceString("Argument_DateTimeOffsetInvalidDateTimeStyles"), parameterName);
        }

        //Contract.EndContractBlock();
        // RoundtripKind does not make sense for DateTimeOffset; ignore this flag for backward compatibility with DateTime
        style &= ~DateTimeStyles.RoundtripKind;

        // AssumeLocal is also ignored as that is what we do by default with DateTimeOffset.Parse
        style &= ~DateTimeStyles.AssumeLocal;

        return style;
    }

    // Operators

    public static FromDateTime(dateTime: DateTime): DateTimeOffset {
        return new DateTimeOffset(dateTime);
    }

    public Sub(timeSpan: TimeSpan): DateTimeOffset {
        return new DateTimeOffset(this.ClockDateTime.Subtract(timeSpan), this.Offset);
    }

    /* public Sub(right: DateTimeOffset): DateTimeOffset {
        return DateTimeOffset.FromDateTime(this.UtcDateTime.Subtract(right.UtcDateTime));
    } */

    /*  public static bool operator == (DateTimeOffset left, DateTimeOffset right) {
     return left.UtcDateTime == right.UtcDateTime;
 } */

    /* public static bool operator != (DateTimeOffset left, DateTimeOffset right) {
return left.UtcDateTime != right.UtcDateTime;
} */

    /*  public static bool operator < (DateTimeOffset left, DateTimeOffset right) {
 return left.UtcDateTime < right.UtcDateTime;
}

     public static bool operator <= (DateTimeOffset left, DateTimeOffset right) {
 return left.UtcDateTime <= right.UtcDateTime;
}

     public static bool operator > (DateTimeOffset left, DateTimeOffset right) {
 return left.UtcDateTime > right.UtcDateTime;
}

     public static bool operator >= (DateTimeOffset left, DateTimeOffset right) {
 return left.UtcDateTime >= right.UtcDateTime;
} */
}

EventBus.Default.fire('DateTimeOffset_Loaded', { value: DateTimeOffset });