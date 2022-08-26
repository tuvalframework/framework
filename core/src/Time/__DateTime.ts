import { double, long, IntArray, New, int, char, UInt64, Int64 } from '../float';
import { Convert } from '../convert';
import { DateTimeKind } from '../DateTimeKind';
import { Environment } from '../Environment';
import { TimeSpan } from '../Timespan';
import { Calendar } from '../Globalization/Calendar';
import { ArgumentException } from '../Exceptions/ArgumentException';
import { ArgumentNullException } from '../Exceptions/ArgumentNullException';
import { Int32 } from '../Int32';
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
//import { TimeZoneInfo, TimeZoneInfoOptions } from '../TimeZoneInfo';
import { Out } from '../Out';
import { DayOfWeek } from './DayOfWeek';
import { Override } from '../Reflection/Decorators/ClassInfo';
import { Context } from '../Context/Context';
import { GlobalObject } from '../Context/CoreModule/GlobalObject';
import { IFormatProvider } from '../IFormatProvider';
import { DateTimeStyles } from './DateTimeStyles';
import { OverflowException } from '../Extensions/OverflowException';
import { DateTimeFormat } from '../Globalization/DateTimeFormat';
import { DateTimeParse } from '../Globalization/Datetimeparse';
import { CultureInfo, DateTimeFormatInfo } from '../Globalization/CultureInfo';
import { IComparable } from '../IComparable';
import { IFormattable } from '../IFormattable';
import { IConvertible } from '../IConvertable';
import { ISerializable } from '../serialization_/ISerializable';
import { IEquatable } from '../IEquatable';
import { is } from '../is';
import { System } from '../SystemTypes';
import { TypeCode } from '../TypeCode';
import { NotImplementedException } from '../Exceptions';

declare var TimeZoneInfo, TimeZoneInfoOptions;
export class DateTime implements IComparable<DateTime>, /* IFormattable */ /* IConvertible */ /* ISerializable */ IEquatable<DateTime> {

    public get Value(): DateTime {
        throw new NotImplementedException('');
    }
    // Number of 100ns ticks per time unit
    private static readonly TicksPerMillisecond: long = Convert.ToLong(10000);
    private static readonly TicksPerSecond: long = DateTime.TicksPerMillisecond.mul(1000);
    private static readonly TicksPerMinute: long = DateTime.TicksPerSecond.mul(60);
    private static readonly TicksPerHour: long = DateTime.TicksPerMinute.mul(60);
    private static readonly TicksPerDay: long = DateTime.TicksPerHour.mul(24);

    // Number of milliseconds per time unit
    private static MillisPerSecond: int = 1000;
    private static MillisPerMinute: int = DateTime.MillisPerSecond * 60;
    private static MillisPerHour: int = DateTime.MillisPerMinute * 60;
    private static MillisPerDay: int = DateTime.MillisPerHour * 24;

    // Number of days in a non-leap year
    private static readonly DaysPerYear: int = 365;
    // Number of days in 4 years
    private static readonly DaysPer4Years: int = DateTime.DaysPerYear * 4 + 1;       // 1461
    // Number of days in 100 years
    private static readonly DaysPer100Years: int = DateTime.DaysPer4Years * 25 - 1;  // 36524
    // Number of days in 400 years
    private static readonly DaysPer400Years: int = DateTime.DaysPer100Years * 4 + 1; // 146097

    // Number of days from 1/1/0001 to 12/31/1600
    private static readonly DaysTo1601: int = DateTime.DaysPer400Years * 4;          // 584388
    // Number of days from 1/1/0001 to 12/30/1899
    private static readonly DaysTo1899: int = DateTime.DaysPer400Years * 4 + DateTime.DaysPer100Years * 3 - 367;
    // Number of days from 1/1/0001 to 12/31/1969
    public /* internal */ static readonly DaysTo1970: int = DateTime.DaysPer400Years * 4 + DateTime.DaysPer100Years * 3 + DateTime.DaysPer4Years * 17 + DateTime.DaysPerYear; // 719,162
    // Number of days from 1/1/0001 to 12/31/9999
    private static readonly DaysTo10000: int = DateTime.DaysPer400Years * 25 - 366;  // 3652059

    public /* internal */ static readonly MinTicks: long = Convert.ToLong(0);
    public /* internal */ static readonly MaxTicks: long = DateTime.TicksPerDay.mul(DateTime.DaysTo10000).sub(1);
    private static readonly MaxMillis: long = Convert.ToLong(DateTime.DaysTo10000).mul(DateTime.MillisPerDay);

    private static readonly FileTimeOffset: long = DateTime.TicksPerDay.mul(DateTime.DaysTo1601);
    private static readonly DoubleDateOffset: long = DateTime.TicksPerDay.mul(DateTime.DaysTo1899);
    // The minimum OA date is 0100/01/01 (Note it's year 100).
    // The maximum OA date is 9999/12/31
    private static readonly OADateMinAsTicks: long = Convert.ToLong(DateTime.DaysPer100Years - DateTime.DaysPerYear).mul(DateTime.TicksPerDay);
    // All OA dates must be greater than (not >=) OADateMinAsDouble
    private static readonly OADateMinAsDouble: double = Convert.ToDouble(-657435.0);
    // All OA dates must be less than (not <=) OADateMaxAsDouble
    private static readonly OADateMaxAsDouble: double = Convert.ToDouble(2958466.0);

    private static readonly DatePartYear: int = 0;
    private static readonly DatePartDayOfYear: int = 1;
    private static readonly DatePartMonth: int = 2;
    private static readonly DatePartDay: int = 3;

    public static readonly s_isLeapSecondsSupportedSystem: boolean = true;//DateTime.SystemSupportLeapSeconds();

    private static readonly DaysToMonth365: IntArray = New.IntArray([0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365]);
    private static readonly DaysToMonth366: IntArray = New.IntArray([0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366]);

    public static readonly MinValue: DateTime = new DateTime(DateTime.MinTicks, DateTimeKind.Unspecified);
    public static readonly MaxValue: DateTime = new DateTime(DateTime.MaxTicks, DateTimeKind.Unspecified);

    private static readonly TicksMask: UInt64 = Convert.ToLong(/* 0x3FFFFFFFFFFFFFFF */4611686018427387903);
    private static readonly FlagsMask: UInt64 = Convert.ToLong(0xC000000000000000);
    private static readonly LocalMask: UInt64 = Convert.ToLong(0x8000000000000000);
    private static readonly TicksCeiling: Int64 = Convert.ToInt64(0x4000000000000000);
    private static readonly KindUnspecified: UInt64 = Convert.ToLong(0x0000000000000000);
    private static readonly KindUtc: UInt64 = Convert.ToLong(0x4000000000000000);
    private static readonly KindLocal: UInt64 = Convert.ToLong(0x8000000000000000);
    private static readonly KindLocalAmbiguousDst: UInt64 = Convert.ToLong(0xC000000000000000);
    private static readonly KindShift: int = 62;

    private static readonly TicksField: string = "ticks";
    private static readonly DateDataField: string = "dateData";

    // The data is stored as an unsigned 64-bit integeter
    //   Bits 01-62: The value of 100-nanosecond ticks where 0 represents 1/1/0001 12:00am, up until the value
    //               12/31/9999 23:59:59.9999999
    //   Bits 63-64: A four-state value that describes the DateTimeKind value of the date time, with a 2nd
    //               value for the rare case where the date time is local, but is in an overlapped daylight
    //               savings time hour and it is in daylight savings time. This allows distinction of these
    //               otherwise ambiguous local times and prevents data loss when round tripping from Local to
    //               UTC time.
    private dateData: UInt64 = Convert.ToLong(0);

    public constructor(ticks: long);
    public constructor(ticks: long, kind: DateTimeKind);
    public /* internal */ constructor(ticks: long, kind: DateTimeKind, isAmbiguousDst: boolean);
    public constructor(year: int, month: int, day: int);
    public constructor(year: int, month: int, day: int, calendar: Calendar);
    public constructor(year: int, month: int, day: int, hour: int, minute: int, second: int);
    //public constructor(year: int, month: int, day: int, hour: int, minute: int, second: int, kind: DateTimeKind);
    public constructor(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int);
    public constructor(year: int, month: int, day: int, hour: int, minute: int, second: int, calendar: Calendar);
    public constructor(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int, kind: DateTimeKind);
    public constructor(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int, calendar: Calendar);
    public constructor(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int, calendar: Calendar, kind: DateTimeKind);
    public constructor(...args: any[]) {
        if (args.length === 1 && is.long(args[0])) {
            const ticks: long = args[0];
            this.constructor1(ticks);
        } else if (args.length === 2 && is.long(args[0]) && is.int(args[1])) {
            const ticks: long = args[0];
            const kind: DateTimeKind = args[1];
            this.constructor3(ticks, kind);
        } else if (args.length === 3 && is.long(args[0]) && is.int(args[1]) && is.boolean(args[2])) {
            const ticks: long = args[0];
            const kind: DateTimeKind = args[1];
            const isAmbiguousDst: boolean = args[2];
            this.constructor4(ticks, kind, isAmbiguousDst);
        } else if (args.length === 3 && is.int(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            this.constructor5(year, month, day);
        } else if (args.length === 4 && is.int(args[0]) && is.int(args[1]) && is.int(args[2]) && is.typeof<Calendar>(args[3], System.Types.Globalization.Calendar)) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            const calendar: Calendar = args[3];
            this.constructor6(year, month, day, calendar);
        } else if (args.length === 6 && is.int(args[0]) && is.int(args[1]) && is.int(args[2]) && is.int(args[3]) && is.int(args[4]) && is.int(args[5])) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            const hour: int = args[3];
            const minute: int = args[4];
            const second: int = args[5];
            this.constructor7(year, month, day, hour, minute, second);
        } else if (args.length === 7 && is.int(args[0]) && is.int(args[1]) && is.int(args[2]) && is.int(args[3]) && is.int(args[4]) && is.int(args[5]) && is.int(args[6])) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            const hour: int = args[3];
            const minute: int = args[4];
            const second: int = args[5];
            const millisecond: int = args[6];
            this.constructor10(year, month, day, hour, minute, second, millisecond);
        } else if (args.length === 7 && is.int(args[0]) && is.int(args[1]) && is.int(args[2]) && is.int(args[3]) && is.int(args[4]) && is.int(args[5]) && is.typeof<Calendar>(args[6], System.Types.Globalization.Calendar)) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            const hour: int = args[3];
            const minute: int = args[4];
            const second: int = args[5];
            const calendar: Calendar = args[6];
            this.constructor9(year, month, day, hour, minute, second, calendar);
        } else if (args.length === 8 && is.int(args[0]) && is.int(args[1]) && is.int(args[2]) && is.int(args[3]) && is.int(args[4]) && is.int(args[5]) && is.int(args[6]) && is.int(args[7])) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            const hour: int = args[3];
            const minute: int = args[4];
            const second: int = args[5];
            const millisecond: int = args[6];
            const kind: DateTimeKind = args[7];
            this.constructor11(year, month, day, hour, minute, second, millisecond, kind);
        } else if (args.length === 8 && is.int(args[0]) && is.int(args[1]) && is.int(args[2]) && is.int(args[3]) && is.int(args[4]) && is.int(args[5]) && is.int(args[6]) && is.typeof<Calendar>(args[7], System.Types.Globalization.Calendar)) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            const hour: int = args[3];
            const minute: int = args[4];
            const second: int = args[5];
            const millisecond: int = args[6];
            const calendar: Calendar = args[7];
            this.constructor12(year, month, day, hour, minute, second, millisecond, calendar);
        } else if (args.length === 9 && is.int(args[0]) && is.int(args[1]) && is.int(args[2]) && is.int(args[3]) && is.int(args[4]) && is.int(args[5]) && is.int(args[6]) && is.typeof<Calendar>(args[7], System.Types.Globalization.Calendar) && is.int(args[8])) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            const hour: int = args[3];
            const minute: int = args[4];
            const second: int = args[5];
            const millisecond: int = args[6];
            const calendar: Calendar = args[7];
            const kind: DateTimeKind = args[8];
            this.constructor13(year, month, day, hour, minute, second, millisecond, calendar, kind);
        }
    }

    // Constructs a DateTime from a tick count. The ticks
    // argument specifies the date as the number of 100-nanosecond intervals
    // that have elapsed since 1/1/0001 12:00am.
    //
    public constructor1(ticks: long) {
        /* if (ticks < MinTicks || ticks > MaxTicks)
            throw new ArgumentOutOfRangeException("ticks", Environment.GetResourceString("ArgumentOutOfRange_DateTimeBadTicks"));
        Contract.EndContractBlock(); */
        this.dateData = Convert.ToLong(ticks);
    }

    private constructor2(dateData: Int64) {
        this.dateData = dateData;
    }

    public constructor3(ticks: long, kind: DateTimeKind) {
        /* if (ticks < DateTime.MinTicks || ticks > DateTime.MaxTicks) {
            throw new ArgumentOutOfRangeException("ticks", Environment.GetResourceString("ArgumentOutOfRange_DateTimeBadTicks"));
        }
        if (kind < DateTimeKind.Unspecified || kind > DateTimeKind.Local) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidDateTimeKind"), "kind");
        }
        Contract.EndContractBlock(); */
        const a = Convert.ToLong(ticks);
        const b = Convert.ToLong(kind);
        const c = b.shl(62/* DateTime.KindShift */);
        this.dateData = a.or(c);
    }

    public /* internal */ constructor4(ticks: long, kind: DateTimeKind, isAmbiguousDst: boolean) {
        /* if (ticks < MinTicks || ticks > MaxTicks) {
            throw new ArgumentOutOfRangeException("ticks", Environment.GetResourceString("ArgumentOutOfRange_DateTimeBadTicks"));
        }
        Contract.Requires(kind == DateTimeKind.Local, "Internal Constructor is for local times only");
        Contract.EndContractBlock(); */
        this.dateData = (Convert.ToLong(ticks).or(isAmbiguousDst ? DateTime.KindLocalAmbiguousDst : DateTime.KindLocal));
    }

    // Constructs a DateTime from a given year, month, and day. The
    // time-of-day of the resulting DateTime is always midnight.
    //
    public constructor5(year: int, month: int, day: int) {
        this.dateData = Convert.ToLong(DateTime.DateToTicks(year, month, day));
    }

    // Constructs a DateTime from a given year, month, and day for
    // the specified calendar. The
    // time-of-day of the resulting DateTime is always midnight.
    //
    public constructor6(year: int, month: int, day: int, calendar: Calendar) {
        this.constructor9(year, month, day, 0, 0, 0, calendar);
    }

    // Constructs a DateTime from a given year, month, day, hour,
    // minute, and second.
    //
    public constructor7(year: int, month: int, day: int, hour: int, minute: int, second: int) {
        this.dateData = Convert.ToLong(DateTime.DateToTicks(year, month, day).add(DateTime.TimeToTicks(hour, minute, second)));
    }

    public constructor8(year: int, month: int, day: int, hour: int, minute: int, second: int, kind: DateTimeKind) {
        /* if (kind < DateTimeKind.Unspecified || kind > DateTimeKind.Local) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidDateTimeKind"), "kind");
        }
        Contract.EndContractBlock(); */
        const ticks: Int64 = DateTime.DateToTicks(year, month, day).add(DateTime.TimeToTicks(hour, minute, second));
        this.dateData = (Convert.ToLong(ticks).or(Convert.ToLong(kind).shl(DateTime.KindShift)));
    }

    // Constructs a DateTime from a given year, month, day, hour,
    // minute, and second for the specified calendar.
    //
    public constructor9(year: int, month: int, day: int, hour: int, minute: int, second: int, calendar: Calendar) {
        /*  if (calendar == null)
             throw new ArgumentNullException("calendar");
         Contract.EndContractBlock(); */
        this.dateData = Convert.ToLong(calendar.ToDateTime(year, month, day, hour, minute, second, 0).Ticks);
    }

    // Constructs a DateTime from a given year, month, day, hour,
    // minute, and second.
    //
    public constructor10(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int) {
        /* if (millisecond < 0 || millisecond >= MillisPerSecond) {
            throw new ArgumentOutOfRangeException("millisecond", Environment.GetResourceString("ArgumentOutOfRange_Range", 0, MillisPerSecond - 1));
        }
        Contract.EndContractBlock(); */
        let ticks: Int64 = DateTime.DateToTicks(year, month, day).add(DateTime.TimeToTicks(hour, minute, second));
        ticks = ticks.add(DateTime.TicksPerMillisecond.mul(millisecond));
        if (ticks < DateTime.MinTicks || ticks > DateTime.MaxTicks)
            throw new ArgumentException(Environment.GetResourceString("Arg_DateTimeRange"));
        this.dateData = Convert.ToLong(ticks);
    }

    public constructor11(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int, kind: DateTimeKind) {
        /* if (millisecond < 0 || millisecond >= MillisPerSecond) {
            throw new ArgumentOutOfRangeException("millisecond", Environment.GetResourceString("ArgumentOutOfRange_Range", 0, MillisPerSecond - 1));
        }
        if (kind < DateTimeKind.Unspecified || kind > DateTimeKind.Local) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidDateTimeKind"), "kind");
        }
        Contract.EndContractBlock(); */
        let ticks: Int64 = DateTime.DateToTicks(year, month, day).add(DateTime.TimeToTicks(hour, minute, second));
        ticks = ticks.add(DateTime.TicksPerMillisecond.mul(millisecond));
        if (ticks < DateTime.MinTicks || ticks > DateTime.MaxTicks)
            throw new ArgumentException(Environment.GetResourceString("Arg_DateTimeRange"));

        this.dateData = (Convert.ToLong(ticks).or((Convert.ToLong(kind).shl(DateTime.KindShift))));
    }

    // Constructs a DateTime from a given year, month, day, hour,
    // minute, and second for the specified calendar.
    //
    public constructor12(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int, calendar: Calendar) {
        /*  if (calendar == null)
             throw new ArgumentNullException("calendar");
         if (millisecond < 0 || millisecond >= MillisPerSecond) {
             throw new ArgumentOutOfRangeException("millisecond", Environment.GetResourceString("ArgumentOutOfRange_Range", 0, MillisPerSecond - 1));
         }
         Contract.EndContractBlock(); */
        let ticks: Int64 = calendar.ToDateTime(year, month, day, hour, minute, second, 0).Ticks;
        ticks = ticks.add(DateTime.TicksPerMillisecond.mul(millisecond));
        if (ticks < DateTime.MinTicks || ticks > DateTime.MaxTicks)
            throw new ArgumentException(Environment.GetResourceString("Arg_DateTimeRange"));

        this.dateData = Convert.ToLong(ticks);
    }

    public constructor13(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int, calendar: Calendar, kind: DateTimeKind) {
        /* if (calendar == null)
            throw new ArgumentNullException("calendar");
        if (millisecond < 0 || millisecond >= MillisPerSecond) {
            throw new ArgumentOutOfRangeException("millisecond", Environment.GetResourceString("ArgumentOutOfRange_Range", 0, MillisPerSecond - 1));
        }
        if (kind < DateTimeKind.Unspecified || kind > DateTimeKind.Local) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidDateTimeKind"), "kind");
        }
        Contract.EndContractBlock(); */
        let ticks: Int64 = calendar.ToDateTime(year, month, day, hour, minute, second, 0).Ticks;
        ticks = ticks.add(DateTime.TicksPerMillisecond.mul(millisecond));
        if (ticks < DateTime.MinTicks || ticks > DateTime.MaxTicks)
            throw new ArgumentException(Environment.GetResourceString("Arg_DateTimeRange"));

        this.dateData = (Convert.ToLong(ticks).or(Convert.ToLong(kind).shl(DateTime.KindShift)));
    }

    /*   private constructor14(info: SerializationInfo, context: StreamingContext) {

          let foundTicks: boolean = false;
          let foundDateData: boolean = false;
          let serializedTicks: Int64 = Convert.ToLong(0);
          let serializedDateData: UInt64 = Convert.ToLong(0);



          const enumerator: SerializationInfoEnumerator = info.GetEnumerator();
          while (enumerator.MoveNext()) {
              switch (enumerator.Name) {
                  case DateTime.TicksField:
                      serializedTicks = Convert.ToInt64(enumerator.Value, CultureInfo.InvariantCulture);
                      foundTicks = true;
                      break;
                  case DateTime.DateDataField:
                      serializedDateData = Convert.ToLong(enumerator.Value, CultureInfo.InvariantCulture);
                      foundDateData = true;
                      break;
                  default:
                      // Ignore other fields for forward compatability.
                      break;
              }
          }
          if (foundDateData) {
              this.dateData = serializedDateData;
          }
          else if (foundTicks) {
              this.dateData = Convert.ToLong(serializedTicks);
          }
          else {
              throw new SerializationException(Environment.GetResourceString("Serialization_MissingDateTimeData"));
          }
          const ticks: Int64 = this.InternalTicks;
          if (ticks < DateTime.MinTicks || ticks > DateTime.MaxTicks) {
              throw new SerializationException(Environment.GetResourceString("Serialization_DateTimeTicksOutOfRange"));
          }
      } */



    public /* internal */ get InternalTicks(): Int64 {
        let a = Convert.ToLong(0x3FFFFFFFFFFFFFFF);
        a = a.sub(1);
        return Convert.ToInt64(this.dateData.and(a/* DateTime.TicksMask */));
    }


    private get InternalKind(): UInt64 {
        return (this.dateData.and(DateTime.FlagsMask));
    }

    // Returns the DateTime resulting from adding the given
    // TimeSpan to this DateTime.
    //
    public Add(value: TimeSpan): DateTime {
        return this.AddTicks(value._ticks);
    }

    // Returns the DateTime resulting from adding a fractional number of
    // time units to this DateTime.
    private add(value: double, scale: int): DateTime {
        let millis: long;
        try {
            millis = (value.mul(scale).add(value.greaterThanOrEqual(0) ? 0.5 : -0.5));
        } catch (OverFlowException) {
            throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("ArgumentOutOfRange_AddValue"));
        }
        if (millis.lessThanOrEqual(DateTime.MaxMillis.neg()) || millis.greaterThanOrEqual(DateTime.MaxMillis))
            throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("ArgumentOutOfRange_AddValue"));

        return this.AddTicks(millis.mul(DateTime.TicksPerMillisecond));
    }

    // Returns the DateTime resulting from adding a fractional number of
    // days to this DateTime. The result is computed by rounding the
    // fractional number of days given by value to the nearest
    // millisecond, and adding that interval to this DateTime. The
    // value argument is permitted to be negative.
    //
    public AddDays(value: double): DateTime {
        return this.add(value, DateTime.MillisPerDay);
    }

    // Returns the DateTime resulting from adding a fractional number of
    // hours to this DateTime. The result is computed by rounding the
    // fractional number of hours given by value to the nearest
    // millisecond, and adding that interval to this DateTime. The
    // value argument is permitted to be negative.
    //
    public AddHours(value: double): DateTime {
        return this.add(value, DateTime.MillisPerHour);
    }

    // Returns the DateTime resulting from the given number of
    // milliseconds to this DateTime. The result is computed by rounding
    // the number of milliseconds given by value to the nearest integer,
    // and adding that interval to this DateTime. The value
    // argument is permitted to be negative.
    //
    public AddMilliseconds(value: double): DateTime;
    public AddMilliseconds(value: int): DateTime;
    public AddMilliseconds(...args: any[]): DateTime {
        if (args.length === 1 && is.double(args[0])) {
            const value: double = args[0];
            return this.add(value, 1);
        } else if (args.length === 1 && is.int(args[0])) {
            const value: int = args[0];
            return this.add(Convert.ToDouble(value), 1);
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Returns the DateTime resulting from adding a fractional number of
    // minutes to this DateTime. The result is computed by rounding the
    // fractional number of minutes given by value to the nearest
    // millisecond, and adding that interval to this DateTime. The
    // value argument is permitted to be negative.
    //
    public AddMinutes(value: double): DateTime {
        return this.add(value, DateTime.MillisPerMinute);
    }

    // Returns the DateTime resulting from adding the given number of
    // months to this DateTime. The result is computed by incrementing
    // (or decrementing) the year and month parts of this DateTime by
    // months months, and, if required, adjusting the day part of the
    // resulting date downwards to the last day of the resulting month in the
    // resulting year. The time-of-day part of the result is the same as the
    // time-of-day part of this DateTime.
    //
    // In more precise terms, considering this DateTime to be of the
    // form y / m / d + t, where y is the
    // year, m is the month, d is the day, and t is the
    // time-of-day, the result is y1 / m1 / d1 + t,
    // where y1 and m1 are computed by adding months months
    // to y and m, and d1 is the largest value less than
    // or equal to d that denotes a valid day in month m1 of year
    // y1.
    //
    public AddMonths(months: int): DateTime {
        /*  if (months < -120000 || months > 120000) throw new ArgumentOutOfRangeException("months" +  Environment.GetResourceString("ArgumentOutOfRange_DateTimeBadMonths"));
         Contract.EndContractBlock(); */
        let y: int = this.GetDatePart(DateTime.DatePartYear);
        let m: int = this.GetDatePart(DateTime.DatePartMonth);
        let d: int = this.GetDatePart(DateTime.DatePartDay);
        const i: int = m - 1 + months;
        if (i >= 0) {
            m = i % 12 + 1;
            y = y + i / 12;
        }
        else {
            m = 12 + (i + 1) % 12;
            y = y + (i - 11) / 12;
        }
        if (y < 1 || y > 9999) {
            throw new ArgumentOutOfRangeException("months", Environment.GetResourceString("ArgumentOutOfRange_DateArithmetic"));
        }
        const days: int = DateTime.DaysInMonth(y, m);
        if (d > days)
            d = days;
        return new DateTime(DateTime.DateToTicks(y, m, d).add(this.InternalTicks.mod(DateTime.TicksPerDay)).or(this.InternalKind));
    }

    // Returns the DateTime resulting from adding a fractional number of
    // seconds to this DateTime. The result is computed by rounding the
    // fractional number of seconds given by value to the nearest
    // millisecond, and adding that interval to this DateTime. The
    // value argument is permitted to be negative.
    //
    public AddSeconds(value: double): DateTime {
        return this.add(value, DateTime.MillisPerSecond);
    }

    // Returns the DateTime resulting from adding the given number of
    // 100-nanosecond ticks to this DateTime. The value argument
    // is permitted to be negative.
    //
    public AddTicks(value: long): DateTime;
    public AddTicks(value: int): DateTime;
    public AddTicks(...args: any[]): DateTime {
        if (args.length === 1 && is.long(args[0])) {
            const value: long = args[0];
            let ticks: long = this.InternalTicks;
            if (value.greaterThan(DateTime.MaxTicks.sub(ticks)) || value.lessThan(DateTime.MinTicks.sub(ticks))) {
                throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("ArgumentOutOfRange_DateArithmetic"));
            }
            return new DateTime((ticks.sub(value)).or(this.InternalKind));
        } else if (args.length === 1 && is.int(args[0])) {
            const value: int = args[0];
            return this.AddTicks(Convert.ToLong(value));
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Returns the DateTime resulting from adding the given number of
    // years to this DateTime. The result is computed by incrementing
    // (or decrementing) the year part of this DateTime by value
    // years. If the month and day of this DateTime is 2/29, and if the
    // resulting year is not a leap year, the month and day of the resulting
    // DateTime becomes 2/28. Otherwise, the month, day, and time-of-day
    // parts of the result are the same as those of this DateTime.
    //
    public AddYears(value: int): DateTime {
        /* if (value < -10000 || value > 10000)
        throw new ArgumentOutOfRangeException("years", Environment.GetResourceString("ArgumentOutOfRange_DateTimeBadYears"));
        Contract.EndContractBlock(); */
        return this.AddMonths(value * 12);
    }

    // Compares two DateTime values, returning an integer that indicates
    // their relationship.
    //
    public static Compare(t1: DateTime, t2: DateTime): int {
        const ticks1: Int64 = t1.InternalTicks;
        const ticks2: Int64 = t2.InternalTicks;
        if (ticks1.greaterThan(ticks2))
            return 1;
        if (ticks1.lessThan(ticks2))
            return -1;
        return 0;
    }

    // Compares this DateTime to a given object. This method provides an
    // implementation of the IComparable interface. The object
    // argument must be another DateTime, or otherwise an exception
    // occurs.  Null is considered less than any instance.
    //
    // Returns a value less than zero if this  object
    public CompareTo(value: DateTime): int {
        if (value == null)
            return 1;
        /* if (!(value is DateTime)) {
            throw new ArgumentException(Environment.GetResourceString("Arg_MustBeDateTime"));
        } */

        const valueTicks: long = value.InternalTicks;
        const ticks: long = this.InternalTicks;
        if (ticks.greaterThan(valueTicks))
            return 1;
        if (ticks.lessThan(valueTicks))
            return -1;
        return 0;
    }

    /* public int CompareTo(DateTime value) {
        long valueTicks = value.InternalTicks;
        long ticks = InternalTicks;
        if (ticks > valueTicks) return 1;
        if (ticks < valueTicks) return -1;
        return 0;
    } */

    // Returns the tick count corresponding to the given year, month, and day.
    // Will check the if the parameters are valid.
    private static DateToTicks(year: int, month: int, day: int): long {
        if (year >= 1 && year <= 9999 && month >= 1 && month <= 12) {
            const days: IntArray = DateTime.IsLeapYear(year) ? DateTime.DaysToMonth366 : DateTime.DaysToMonth365;
            if (day >= 1 && day <= days[month] - days[month - 1]) {
                const y: int = year - 1;
                const n: int = y * 365 + y / 4 - y / 100 + y / 400 + days[month - 1] + day - 1;
                return Convert.ToLong(n).mul(DateTime.TicksPerDay);
            }
        }
        throw new ArgumentOutOfRangeException(Environment.GetResourceString("ArgumentOutOfRange_BadYearMonthDay"));
    }

    // Return the tick count corresponding to the given hour, minute, second.
    // Will check the if the parameters are valid.
    private static TimeToTicks(hour: int, minute: int, second: int): long {
        //TimeSpan.TimeToTicks is a family access function which does no error checking, so
        //we need to put some error checking out here.
        if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60 && second >= 0 && second < 60) {
            return (TimeSpan.TimeToTicks(hour, minute, second));
        }
        throw new ArgumentOutOfRangeException(Environment.GetResourceString("ArgumentOutOfRange_BadHourMinuteSecond"));
    }

    // Returns the number of days in the month given by the year and
    // month arguments.
    //
    public static DaysInMonth(year: int, month: int): int {
        /*  if (month < 1 || month > 12) throw new ArgumentOutOfRangeException("month", Environment.GetResourceString("ArgumentOutOfRange_Month"));
         Contract.EndContractBlock(); */
        // IsLeapYear checks the year argument
        const days: IntArray = DateTime.IsLeapYear(year) ? DateTime.DaysToMonth366 : DateTime.DaysToMonth365;
        return days[month] - days[month - 1];
    }

    // Converts an OLE Date to a tick count.
    // This function is duplicated in COMDateTime.cpp
    public /* internal */ static DoubleDateToTicks(value: double): long {
        // The check done this way will take care of NaN
        if (!(value.lessThan(DateTime.OADateMaxAsDouble)) || !(value.greaterThan(DateTime.OADateMinAsDouble)))
            throw new ArgumentException(Environment.GetResourceString("Arg_OleAutDateInvalid"));

        // Conversion to long will not cause an overflow here, as at this point the "value" is in between OADateMinAsDouble and OADateMaxAsDouble
        let millis: long = Convert.ToLong(value.mul(DateTime.MillisPerDay).add(value.greaterThan(0) ? 0.5 : -0.5));
        // The interesting thing here is when you have a value like 12.5 it all positive 12 days and 12 hours from 01/01/1899
        // However if you a value of -12.25 it is minus 12 days but still positive 6 hours, almost as though you meant -11.75 all negative
        // This line below fixes up the millis in the negative case
        if (millis.lessThan(0)) {
            millis = millis.sub((millis.mod(DateTime.MillisPerDay)).mul(2));
        }

        millis = millis.add(DateTime.DoubleDateOffset.div(DateTime.TicksPerMillisecond));

        if (millis.lessThan(0) || millis.greaterThanOrEqual(DateTime.MaxMillis))
            throw new ArgumentException(Environment.GetResourceString("Arg_OleAutDateScale"));

        return millis.mul(DateTime.TicksPerMillisecond);
    }
    // Checks if this DateTime is equal to a given object. Returns
    // true if the given object is a boxed DateTime and its value
    // is equal to the value of this DateTime. Returns false
    // otherwise.
    //
    public Equals(value: DateTime): boolean {
        return this.InternalTicks.equals(value.InternalTicks);
    }

    // Compares two DateTime values for equality. Returns true if
    // the two DateTime values are equal, or false if they are
    // not equal.
    //
    /* public static Equals(t1: DateTime, t2: DateTime): boolean {
        return t1.InternalTicks.equals(t2.InternalTicks);
    } */

    public static FromBinary(dateData: Int64): DateTime {
        if ((dateData.and(DateTime.LocalMask)).notEquals(Convert.ToLong(0))) {
            // Local times need to be adjusted as you move from one time zone to another,
            // just as they are when serializing in text. As such the format for local times
            // changes to store the ticks of the UTC time, but with flags that look like a
            // local date.
            let ticks: Int64 = dateData.and(DateTime.TicksMask);
            // Negative ticks are stored in the top part of the range and should be converted back into a negative number
            if (ticks.greaterThan(DateTime.TicksCeiling.sub(DateTime.TicksPerDay))) {
                ticks = ticks.sub(DateTime.TicksCeiling);
            }
            // Convert the ticks back to local. If the UTC ticks are out of range, we need to default to
            // the UTC offset from MinValue and MaxValue to be consistent with Parse.
            let isAmbiguousLocalDst: Out<boolean> = New.Out(false);
            let offsetTicks: Int64;
            if (ticks.lessThan(DateTime.MinTicks)) {
                offsetTicks = TimeZoneInfo.GetLocalUtcOffset(DateTime.MinValue, TimeZoneInfoOptions.NoThrowOnInvalidTime).Ticks;
            }
            else if (ticks.greaterThan(DateTime.MaxTicks)) {
                offsetTicks = TimeZoneInfo.GetLocalUtcOffset(DateTime.MaxValue, TimeZoneInfoOptions.NoThrowOnInvalidTime).Ticks;
            }
            else {
                // Because the ticks conversion between UTC and local is lossy, we need to capture whether the
                // time is in a repeated hour so that it can be passed to the DateTime constructor.
                const utcDt: DateTime = new DateTime(ticks, DateTimeKind.Utc);
                let isDaylightSavings: Out<boolean> = New.Out(false);
                offsetTicks = TimeZoneInfo.GetUtcOffsetFromUtc(utcDt, TimeZoneInfo.Local, isDaylightSavings, isAmbiguousLocalDst).Ticks;
            }
            ticks = ticks.add(offsetTicks);
            // Another behaviour of parsing is to cause small times to wrap around, so that they can be used
            // to compare times of day
            if (ticks.lessThan(0)) {
                ticks = ticks.add(DateTime.TicksPerDay);
            }
            if (ticks.lessThan(DateTime.MinTicks) || ticks.greaterThan(DateTime.MaxTicks)) {
                throw new ArgumentException(Environment.GetResourceString("Argument_DateTimeBadBinaryData"), "dateData");
            }
            return new DateTime(ticks, DateTimeKind.Local, isAmbiguousLocalDst.value);
        }
        else {
            return DateTime.FromBinaryRaw(dateData);
        }
    }

    // A version of ToBinary that uses the real representation and does not adjust local times. This is needed for
    // scenarios where the serialized data must maintain compatability
    public /* internal */ static FromBinaryRaw(dateData: Int64): DateTime {
        const ticks: Int64 = dateData.and(DateTime.TicksMask);
        if (ticks.lessThan(DateTime.MinTicks) || ticks.greaterThan(DateTime.MaxTicks))
            throw new ArgumentException(Environment.GetResourceString("Argument_DateTimeBadBinaryData"), "dateData");
        return new DateTime(dateData);
    }

    // Creates a DateTime from a Windows filetime. A Windows filetime is
    // a long representing the date and time as the number of
    // 100-nanosecond intervals that have elapsed since 1/1/1601 12:00am.
    //
    public static FromFileTime(fileTime: long): DateTime {
        return DateTime.FromFileTimeUtc(fileTime).ToLocalTime();
    }

    public static FromFileTimeUtc(fileTime: long): DateTime {
        /*  if (fileTime.lessThan(0) || fileTime.greaterThan(DateTime.MaxTicks.sub(DateTime.FileTimeOffset))) {
             throw new ArgumentOutOfRangeException("fileTime", Environment.GetResourceString("ArgumentOutOfRange_FileTimeInvalid"));
         }
         Contract.EndContractBlock(); */

        // This is the ticks in Universal time for this fileTime.
        const universalTicks: long = fileTime.add(DateTime.FileTimeOffset);
        return new DateTime(universalTicks, DateTimeKind.Utc);
    }

    // Creates a DateTime from an OLE Automation Date.
    //
    public static FromOADate(d: double): DateTime {
        return new DateTime(DateTime.DoubleDateToTicks(d), DateTimeKind.Unspecified);
    }

    /* private GetObjectData(info: SerializationInfo, context: StreamingContext): void {

        info.AddValue(DateTime.TicksField, this.InternalTicks);
        info.AddValue(DateTime.DateDataField, this.dateData);
    } */

    public IsDaylightSavingTime(): boolean {
        if (this.Kind === DateTimeKind.Utc) {
            return false;
        }
        return TimeZoneInfo.Local.IsDaylightSavingTime(this, TimeZoneInfoOptions.NoThrowOnInvalidTime);
    }

    public static SpecifyKind(value: DateTime, kind: DateTimeKind): DateTime {
        return new DateTime(value.InternalTicks, kind);
    }

    public ToBinary(): Int64 {
        if (this.Kind === DateTimeKind.Local) {
            // Local times need to be adjusted as you move from one time zone to another,
            // just as they are when serializing in text. As such the format for local times
            // changes to store the ticks of the UTC time, but with flags that look like a
            // local date.

            // To match serialization in text we need to be able to handle cases where
            // the UTC value would be out of range. Unused parts of the ticks range are
            // used for this, so that values just past max value are stored just past the
            // end of the maximum range, and values just below minimum value are stored
            // at the end of the ticks area, just below 2^62.
            const offset: TimeSpan = TimeZoneInfo.GetLocalUtcOffset(this, TimeZoneInfoOptions.NoThrowOnInvalidTime);
            const ticks: Int64 = this.Ticks;
            let storedTicks: Int64 = ticks.sub(offset.Ticks);
            if (storedTicks.lessThan(0)) {
                storedTicks = DateTime.TicksCeiling.add(storedTicks);
            }
            return storedTicks.or(DateTime.LocalMask);
        }
        else {
            return this.dateData;
        }
    }

    // Return the underlying data, without adjust local times to the right time zone. Needed if performance
    // or compatability are important.
    public /* internal */  ToBinaryRaw(): Int64 {
        return this.dateData;
    }

    // Returns the date part of this DateTime. The resulting value
    // corresponds to this DateTime with the time-of-day part set to
    // zero (midnight).
    //
    public get Date(): DateTime {
        const ticks: Int64 = this.InternalTicks;
        return new DateTime(ticks.sub(ticks.mod(DateTime.TicksPerDay)).or(this.InternalKind));
    }

    // Returns a given date part of this DateTime. This method is used
    // to compute the year, day-of-year, month, or day part.
    private GetDatePart(part: int): int {
        const ticks: Int64 = this.InternalTicks;
        // n = number of days since 1/1/0001
        let n: int = Convert.ToInt32(ticks.div(DateTime.TicksPerDay));
        // y400 = number of whole 400-year periods since 1/1/0001
        const y400: int = Convert.ToInt32(n / DateTime.DaysPer400Years);
        // n = day number within 400-year period
        n -= y400 * DateTime.DaysPer400Years;
        // y100 = number of whole 100-year periods within 400-year period
        let y100: int = Convert.ToInt32(n / DateTime.DaysPer100Years);
        // Last 100-year period has an extra day, so decrement result if 4
        if (y100 === 4) {
            y100 = 3;
        }
        // n = day number within 100-year period
        n -= y100 * DateTime.DaysPer100Years;
        // y4 = number of whole 4-year periods within 100-year period
        const y4: int = Convert.ToInt32(n / DateTime.DaysPer4Years);
        // n = day number within 4-year period
        n -= y4 * DateTime.DaysPer4Years;
        // y1 = number of whole years within 4-year period
        let y1: int = Convert.ToInt32(n / DateTime.DaysPerYear);
        // Last year has an extra day, so decrement result if 4
        if (y1 === 4) {
            y1 = 3;
        }
        // If year was requested, compute and return it
        if (part === DateTime.DatePartYear) {
            return y400 * 400 + y100 * 100 + y4 * 4 + y1 + 1;
        }
        // n = day number within year
        n -= y1 * DateTime.DaysPerYear;
        // If day-of-year was requested, return it
        if (part === DateTime.DatePartDayOfYear) return n + 1;
        // Leap year calculation looks different from IsLeapYear since y1, y4,
        // and y100 are relative to year 1, not year 0
        const leapYear: boolean = y1 === 3 && (y4 !== 24 || y100 === 3);
        const days: IntArray = leapYear ? DateTime.DaysToMonth366 : DateTime.DaysToMonth365;
        // All months have less than 32 days, so n >> 5 is a good conservative
        // estimate for the month
        let m: int = n >> 5 + 1;
        // m = 1-based month number
        while (n >= days[m]) {
            m++;
        }
        // If month was requested, return it
        if (part === DateTime.DatePartMonth) {
            return m;
        }
        // Return 1-based day-of-month
        return n - days[m - 1] + 1;
    }

    // Returns the day-of-month part of this DateTime. The returned
    // value is an integer between 1 and 31.
    //
    public get Day(): int {
        //Contract.Ensures(Contract.Result<int>() >= 1);
        //Contract.Ensures(Contract.Result<int>() <= 31);
        return this.GetDatePart(DateTime.DatePartDay);
    }


    // Returns the day-of-week part of this DateTime. The returned value
    // is an integer between 0 and 6, where 0 indicates Sunday, 1 indicates
    // Monday, 2 indicates Tuesday, 3 indicates Wednesday, 4 indicates
    // Thursday, 5 indicates Friday, and 6 indicates Saturday.
    //
    public get DayOfWeek(): DayOfWeek {
        // Contract.Ensures(Contract.Result<DayOfWeek>() >= DayOfWeek.Sunday);
        // Contract.Ensures(Contract.Result<DayOfWeek>() <= DayOfWeek.Saturday);
        return <DayOfWeek>((this.InternalTicks.div(DateTime.TicksPerDay).add(1)).mod(7)).toNumber();
    }


    // Returns the day-of-year part of this DateTime. The returned value
    // is an integer between 1 and 366.
    //
    public get DayOfYear(): int {
        //Contract.Ensures(Contract.Result<int>() >= 1);
        //Contract.Ensures(Contract.Result<int>() <= 366);  // leap year
        return this.GetDatePart(DateTime.DatePartDayOfYear);
    }

    // Returns the hash code for this DateTime.
    //
    @Override
    public GetHashCode(): int {
        const ticks: Int64 = this.InternalTicks;
        return ticks.toNumber() ^ ticks.shr(32).toNumber();
    }

    // Returns the hour part of this DateTime. The returned value is an
    // integer between 0 and 23.
    //
    public get Hour(): int {
        /* Contract.Ensures(Contract.Result<int>() >= 0);
        Contract.Ensures(Contract.Result<int>() < 24); */
        return this.InternalTicks.div(DateTime.TicksPerHour).mod(24).toNumber();
    }


    public /* internal */  IsAmbiguousDaylightSavingTime(): boolean {
        return (this.InternalKind === DateTime.KindLocalAmbiguousDst);
    }

    public get Kind(): DateTimeKind {
        switch (this.InternalKind) {
            case DateTime.KindUnspecified:
                return DateTimeKind.Unspecified;
            case DateTime.KindUtc:
                return DateTimeKind.Utc;
            default:
                return DateTimeKind.Local;
        }
    }


    // Returns the millisecond part of this DateTime. The returned value
    // is an integer between 0 and 999.
    //
    public get Millisecond(): int {
        /* Contract.Ensures(Contract.Result<int>() >= 0);
        Contract.Ensures(Contract.Result<int>() < 1000); */
        return this.InternalTicks.div(DateTime.TicksPerMillisecond).mod(1000).toNumber();
    }

    // Returns the minute part of this DateTime. The returned value is
    // an integer between 0 and 59.
    //
    public get Minute(): int {
        /* Contract.Ensures(Contract.Result<int>() >= 0);
        Contract.Ensures(Contract.Result<int>() < 60); */
        return this.InternalTicks.div(DateTime.TicksPerMinute).mod(60).toNumber();
    }

    // Returns the month part of this DateTime. The returned value is an
    // integer between 1 and 12.
    //
    public get Month(): int {
        // Contract.Ensures(Contract.Result<int>() >= 1);
        return this.GetDatePart(DateTime.DatePartMonth);
    }

    // Returns a DateTime representing the current date and time. The
    // resolution of the returned value depends on the system timer. For
    // Windows NT 3.5 and later the timer resolution is approximately 10ms,
    // for Windows NT 3.1 it is approximately 16ms, and for Windows 95 and 98
    // it is approximately 55ms.
    //
    public static get Now(): DateTime {
        // Contract.Ensures(Contract.Result<DateTime>().Kind == DateTimeKind.Local);

        const utc: DateTime = this.UtcNow;
        let isAmbiguousLocalDst: Out<boolean> = New.Out(false);
        const offset: Int64 = Context.Current.get("TimeZoneInfo").GetDateTimeNowUtcOffsetFromUtc(utc, isAmbiguousLocalDst).Ticks;
        const tick: long = utc.Ticks.add(offset);
        if (tick.greaterThan(DateTime.MaxTicks)) {
            return new DateTime(DateTime.MaxTicks, DateTimeKind.Local);
        }
        if (tick.lessThan(DateTime.MinTicks)) {
            return new DateTime(DateTime.MinTicks, DateTimeKind.Local);
        }
        return new DateTime(tick, DateTimeKind.Local, isAmbiguousLocalDst.value);

    }

    public static get UtcNow(): DateTime {
        //Contract.Ensures(Contract.Result<DateTime>().Kind == DateTimeKind.Utc);
        // following code is tuned for speed. Don't change it without running benchmark.
        let ticks: long = Convert.ToLong(0);
        ticks = DateTime.GetSystemTimeAsFileTime();
        return new DateTime(ticks/* .add(DateTime.FileTimeOffset).or(DateTime.KindUtc) */);
    }


    public /* internal */ static GetSystemTimeAsFileTime(): long {
        const dd = new Date();
        const offset = dd.getTimezoneOffset() * DateTime.MillisPerMinute;
        const dateUTC = dd.getTime() + offset;
        const utcMilis = dateUTC;
        const ticks = Convert.ToLong(dd.getTime() * 10000).add(621355968000000000);
        return ticks;
        // return Convert.ToLong((GlobalObject.Instance.performance.timeOrigin + GlobalObject.Instance.performance.now()) * 10000);
    }



    // Returns the second part of this DateTime. The returned value is
    // an integer between 0 and 59.
    //
    public get Second(): int {
        /* Contract.Ensures(Contract.Result<int>() >= 0);
        Contract.Ensures(Contract.Result<int>() < 60); */
        return this.InternalTicks.div(DateTime.TicksPerSecond).mod(60).toNumber();
    }

    // Returns the tick count for this DateTime. The returned value is
    // the number of 100-nanosecond intervals that have elapsed since 1/1/0001
    // 12:00am.
    //
    public get Ticks(): long {
        return this.InternalTicks;
    }

    // Returns the time-of-day part of this DateTime. The returned value
    // is a TimeSpan that indicates the time elapsed since midnight.
    //
    public get TimeOfDay(): TimeSpan {
        return new TimeSpan(this.InternalTicks.mod(DateTime.TicksPerDay));
    }

    // Returns a DateTime representing the current date. The date part
    // of the returned value is the current date, and the time-of-day part of
    // the returned value is zero (midnight).
    //
    public static get Today(): DateTime {
        return DateTime.Now.Date;
    }

    // Returns the year part of this DateTime. The returned value is an
    // integer between 1 and 9999.
    //
    public get Year(): int {
        // Contract.Ensures(Contract.Result<int>() >= 1 && Contract.Result<int>() <= 9999);
        return this.GetDatePart(DateTime.DatePartYear);
    }

    // Checks whether a given year is a leap year. This method returns true if
    // year is a leap year, or false if not.
    //
    public static IsLeapYear(year: int): boolean {
        if (year < 1 || year > 9999) {
            throw new ArgumentOutOfRangeException("year", Environment.GetResourceString("ArgumentOutOfRange_Year"));
        }
        //Contract.EndContractBlock();
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }

    // Constructs a DateTime from a string. The string must specify a
    // date and optionally a time in a culture-specific or universal format.
    // Leading and trailing whitespace characters are allowed.
    //
    public static Parse(s: string): DateTime;
    // Constructs a DateTime from a string. The string must specify a
    // date and optionally a time in a culture-specific or universal format.
    // Leading and trailing whitespace characters are allowed.
    //
    public static Parse(s: string, provider: IFormatProvider): DateTime;
    public static Parse(s: string, provider: IFormatProvider, styles: DateTimeStyles): DateTime;
    public static Parse(...args: any[]): DateTime {
        if (args.length === 1 && is.string(args[0])) {
            const s: string = args[0];
            return (DateTimeParse.Parse(s, DateTimeFormatInfo.CurrentInfo, DateTimeStyles.None));
        } else if (args.length === 2 && is.string(args[0]) && is.typeof<IFormatProvider>(args[1], System.Types.IFormatProvider)) {
            const s: string = args[0];
            const provider: IFormatProvider = args[1];
            return (DateTimeParse.Parse(s, DateTimeFormatInfo.GetInstance(provider), DateTimeStyles.None));
        } else if (args.length === 3 && is.string(args[0]) && is.typeof<IFormatProvider>(args[1], System.Types.IFormatProvider) && is.int(args[2])) {
            const s: string = args[0];
            const provider: IFormatProvider = args[1];
            const styles: DateTimeStyles = args[2];
            DateTimeFormatInfo.ValidateStyles(styles, "styles");
            return (DateTimeParse.Parse(s, DateTimeFormatInfo.GetInstance(provider), styles));
        }
        throw new ArgumentException('');
    }

    // Constructs a DateTime from a string. The string must specify a
    // date and optionally a time in a culture-specific or universal format.
    // Leading and trailing whitespace characters are allowed.
    //
    public static ParseExact(s: string, format: string, provider: IFormatProvider): DateTime;
    // Constructs a DateTime from a string. The string must specify a
    // date and optionally a time in a culture-specific or universal format.
    // Leading and trailing whitespace characters are allowed.
    //
    public static ParseExact(s: string, format: string, provider: IFormatProvider, style: DateTimeStyles): DateTime;
    public static ParseExact(s: string, formats: string[], provider: IFormatProvider, style: DateTimeStyles): DateTime;
    public static ParseExact(...args: any[]): DateTime {
        if (args.length === 3 && is.string(args[0]) && is.string(args[1]) /* && is.typeof<IFormatProvider>(args[2], System.Types.IFormatProvider) */) {
            const s: string = args[0];
            const format: string = args[1];
            const provider: IFormatProvider = args[2];
            return (DateTimeParse.ParseExact(s, format, DateTimeFormatInfo.GetInstance(provider), DateTimeStyles.None));
        } else if (args.length === 4 && is.string(args[0]) && is.string(args[1]) && is.typeof<IFormatProvider>(args[2], System.Types.IFormatProvider)) {
            const s: string = args[0];
            const format: string = args[1];
            const provider: IFormatProvider = args[2];
            const style: DateTimeStyles = args[3];
            DateTimeFormatInfo.ValidateStyles(style, "style");
            return (DateTimeParse.ParseExact(s, format, DateTimeFormatInfo.GetInstance(provider), style));
        } else if (args.length === 4 && is.string(args[0]) && is.array(args[1]) && is.typeof<IFormatProvider>(args[2], System.Types.IFormatProvider)) {
            const s: string = args[0];
            const formats: string[] = args[1];
            const provider: IFormatProvider = args[2];
            const style: DateTimeStyles = args[3];
            DateTimeFormatInfo.ValidateStyles(style, "style");
            return DateTimeParse.ParseExactMultiple(s, formats, DateTimeFormatInfo.GetInstance(provider), style);
        }
        throw new ArgumentException('');
    }


    public Subtract(value: DateTime): TimeSpan;
    public Subtract(value: TimeSpan): DateTime;
    public Subtract(...args: any[]): TimeSpan | DateTime {
        if (args.length === 1 && is.typeof<DateTime>(args[0], System.Types.DateTime)) {
            const value: DateTime = args[0];
            return new TimeSpan(this.InternalTicks.sub(value.InternalTicks));
        } else if (args.length === 1 && is.typeof<TimeSpan>(args[0], System.Types.TimeSpan)) {
            const value: TimeSpan = args[0];
            const ticks: long = this.InternalTicks;
            const valueTicks: long = value._ticks;
            if (ticks.sub(DateTime.MinTicks).lessThan(valueTicks) || ticks.sub(DateTime.MaxTicks).greaterThan(valueTicks)) {
                throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("ArgumentOutOfRange_DateArithmetic"));
            }
            return new DateTime(ticks.sub(valueTicks).or(this.InternalKind));
        }
        throw new ArgumentException('');
    }

    // This function is duplicated in COMDateTime.cpp
    private static TicksToOADate(value: long): double {
        if (value.equals(Convert.ToDouble(0)))
            return Convert.ToDouble(0.0);  // Returns OleAut's zero'ed date value.
        if (value.lessThan(DateTime.TicksPerDay)) // This is a fix for VB. They want the default day to be 1/1/0001 rathar then 12/30/1899.
            value = value.add(DateTime.DoubleDateOffset); // We could have moved this fix down but we would like to keep the bounds check.
        if (value.lessThan(DateTime.OADateMinAsTicks))
            throw new OverflowException(Environment.GetResourceString("Arg_OleAutDateInvalid"));
        // Currently, our max date == OA's max date (12/31/9999), so we don't
        // need an overflow check in that direction.
        let millis: long = (value.sub(DateTime.DoubleDateOffset)).div(DateTime.TicksPerMillisecond);
        if (millis.lessThan(0)) {
            const frac: long = millis.mod(DateTime.MillisPerDay);
            if (frac.notEquals(Convert.ToDouble(0)))
                millis = millis.sub(frac.add(DateTime.MillisPerDay).mul(2));
        }
        return millis.div(DateTime.MillisPerDay);
    }

    // Converts the DateTime instance into an OLE Automation compatible
    // double date.
    public ToOADate(): double {
        return DateTime.TicksToOADate(this.InternalTicks);
    }

    public ToFileTime(): long {
        // Treats the input as local if it is not specified
        return this.ToUniversalTime().ToFileTimeUtc();
    }

    public ToFileTimeUtc(): long {
        // Treats the input as universal if it is not specified
        let ticks: long = ((this.InternalKind.and(DateTime.LocalMask)).notEquals(Convert.ToDouble(0))) ? this.ToUniversalTime().InternalTicks : this.InternalTicks;
        ticks = ticks.sub(DateTime.FileTimeOffset);
        if (ticks.lessThan(0)) {
            throw new ArgumentOutOfRangeException(Environment.GetResourceString("ArgumentOutOfRange_FileTimeInvalid"));
        }
        return ticks;
    }

    public ToLocalTime(): DateTime;
    public /* internal */  ToLocalTime(throwOnOverflow: boolean): DateTime;
    public ToLocalTime(...args: any[]): DateTime {
        if (args.length === 0) {
            return this.ToLocalTime(false);
        } else if (args.length === 1 && is.boolean(args[0])) {
            const throwOnOverflow: boolean = args[0];
            if (this.Kind === DateTimeKind.Local) {
                return this;
            }
            let isDaylightSavings: Out<boolean> = New.Out(false);
            let isAmbiguousLocalDst: Out<boolean> = New.Out(false);
            const offset: Int64 = TimeZoneInfo.GetUtcOffsetFromUtc(this, TimeZoneInfo.Local, isDaylightSavings, isAmbiguousLocalDst).Ticks;
            const tick: long = this.Ticks.sub(offset);
            if (tick.greaterThan(DateTime.MaxTicks)) {
                if (throwOnOverflow)
                    throw new ArgumentException(Environment.GetResourceString("Arg_ArgumentOutOfRangeException"));
                else
                    return new DateTime(DateTime.MaxTicks, DateTimeKind.Local);
            }
            if (tick.lessThan(DateTime.MinTicks)) {
                if (throwOnOverflow)
                    throw new ArgumentException(Environment.GetResourceString("Arg_ArgumentOutOfRangeException"));
                else
                    return new DateTime(DateTime.MinTicks, DateTimeKind.Local);
            }
            return new DateTime(tick, DateTimeKind.Local, isAmbiguousLocalDst.value);
        }
        throw new ArgumentException('');
    }

    public ToLongDateString(): string {
        //Contract.Ensures(Contract.Result<String>() != null);
        return DateTimeFormat.Format(this, "D", DateTimeFormatInfo.CurrentInfo);
    }

    public ToLongTimeString(): string {
        //Contract.Ensures(Contract.Result<String>() != null);
        return DateTimeFormat.Format(this, "T", DateTimeFormatInfo.CurrentInfo);
    }

    public ToShortDateString(): string {
        //Contract.Ensures(Contract.Result<String>() != null);
        return DateTimeFormat.Format(this, "d", DateTimeFormatInfo.CurrentInfo);
    }

    public ToShortTimeString(): string {
        //Contract.Ensures(Contract.Result<String>() != null);
        return DateTimeFormat.Format(this, "t", DateTimeFormatInfo.CurrentInfo);
    }

    public ToString(): string;
    public ToString(format: string): string;
    public ToString(provider: IFormatProvider): string;
    public ToString(format: string, provider: IFormatProvider): string;
    public ToString(...args: any[]) {
        if (args.length === 0) {
            // Contract.Ensures(Contract.Result<String>() != null);
            return DateTimeFormat.Format(this, null as any, DateTimeFormatInfo.CurrentInfo);
        } else if (args.length === 1 && is.string(args[0])) {
            const format: string = args[0];
            return DateTimeFormat.Format(this, format, DateTimeFormatInfo.CurrentInfo);
        } else if (args.length === 1 && is.typeof<IFormatProvider>(args[0], System.Types.IFormatProvider)) {
            const provider: IFormatProvider = args[0];
            return DateTimeFormat.Format(this, null as any, DateTimeFormatInfo.GetInstance(provider));
        } else if (args.length === 2 && is.string(args[0]) && is.typeof<IFormatProvider>(args[0], System.Types.IFormatProvider)) {
            const format: string = args[0];
            const provider: IFormatProvider = args[1];
            return DateTimeFormat.Format(this, format, DateTimeFormatInfo.GetInstance(provider));
        }
    }


    public ToUniversalTime(): DateTime {
        return TimeZoneInfo.ConvertTimeToUtc(this, TimeZoneInfoOptions.NoThrowOnInvalidTime);
    }

    public static TryParse(s: string, result: Out<DateTime>): boolean;
    public static TryParse(s: string, provider: IFormatProvider, styles: DateTimeStyles, result: Out<DateTime>): boolean;
    public static TryParse(...args: any[]): boolean {
        if (args.length === 2 && is.string(args[0])) {
            const s: string = args[0];
            const result: Out<DateTime> = args[1];
            return DateTimeParse.TryParse(s, DateTimeFormatInfo.CurrentInfo, DateTimeStyles.None, result);
        } else if (args.length === 4) {
            const s: string = args[0];
            const provider: IFormatProvider = args[1];
            const styles: DateTimeStyles = args[2];
            const result: Out<DateTime> = args[3];
            DateTimeFormatInfo.ValidateStyles(styles, "styles");
            return DateTimeParse.TryParse(s, DateTimeFormatInfo.GetInstance(provider), styles, result);
        }
        throw new ArgumentException('');
    }



    public static TryParseExact(s: string, format: string, provider: IFormatProvider, style: DateTimeStyles, result: Out<DateTime>): boolean;
    public static TryParseExact(s: string, formats: string[], provider: IFormatProvider, style: DateTimeStyles, result: Out<DateTime>): boolean;
    public static TryParseExact(...args: any[]): boolean {
        if (args.length === 5 && is.string(args[0]) && is.string(args[1]) && is.typeof<IFormatProvider>(args[2], System.Types.IFormatProvider) && is.int(args[3])) {
            const s: string = args[0];
            const format: string = args[1];
            const provider: IFormatProvider = args[2];
            const style: DateTimeStyles = args[3];
            const result: Out<DateTime> = args[4];
            DateTimeFormatInfo.ValidateStyles(style, "style");
            return DateTimeParse.TryParseExact(s, format, DateTimeFormatInfo.GetInstance(provider), style, result);
        } else if (args.length === 5 && is.string(args[0]) && is.array(args[1]) && is.typeof<IFormatProvider>(args[2], System.Types.IFormatProvider) && is.int(args[3])) {
            const s: string = args[0];
            const formats: string[] = args[1];
            const provider: IFormatProvider = args[2];
            const style: DateTimeStyles = args[3];
            const result: Out<DateTime> = args[4];
            DateTimeFormatInfo.ValidateStyles(style, "style");
            return DateTimeParse.TryParseExactMultiple(s, formats, DateTimeFormatInfo.GetInstance(provider), style, result);
        }
        throw new ArgumentException('');
    }
    public static Add(d: DateTime, t: TimeSpan): DateTime {
        const ticks: long = d.InternalTicks;
        const valueTicks: long = t._ticks;
        if (valueTicks.greaterThan(DateTime.MaxTicks.sub(ticks)) || valueTicks.lessThan(DateTime.MinTicks.sub(ticks))) {
            throw new ArgumentOutOfRangeException("t", Environment.GetResourceString("ArgumentOutOfRange_DateArithmetic"));
        }
        return new DateTime((ticks.add(valueTicks)).or(d.InternalKind));
    }

    public static Sub(d: DateTime, t: TimeSpan): DateTime;
    public static Sub(d1: DateTime, d2: DateTime): TimeSpan;
    public static Sub(...args: any[]): DateTime | TimeSpan {
        if (args.length === 2 && is.typeof<DateTime>(args[0], System.Types.DateTime) && is.typeof<TimeSpan>(args[0], System.Types.TimeSpan)) {
            const d: DateTime = args[0];
            const t: TimeSpan = args[1];
            const ticks: long = d.InternalTicks;
            const valueTicks: long = t._ticks;
            if ((ticks.sub(DateTime.MinTicks)).lessThan(valueTicks) || ticks.sub(DateTime.MaxTicks).greaterThan(valueTicks)) {
                throw new ArgumentOutOfRangeException("t", Environment.GetResourceString("ArgumentOutOfRange_DateArithmetic"));
            }
            return new DateTime((ticks.sub(valueTicks)).or(d.InternalKind));
        } else if (args.length === 2 && is.typeof<DateTime>(args[0], System.Types.DateTime) && is.typeof<DateTime>(args[0], System.Types.DateTime)) {
            const d1: DateTime = args[0];
            const d2: DateTime = args[1];
            return new TimeSpan(d1.InternalTicks.sub(d2.InternalTicks));
        }
        throw new ArgumentException('');
    }

    public static Equals(d1: DateTime, d2: DateTime): boolean {
        return d1.InternalTicks.equals(d2.InternalTicks);
    }

    public static NotEquals(d1: DateTime, d2: DateTime): boolean {
        return d1.InternalTicks.notEquals(d2.InternalTicks);
    }

    public lessThan(value: DateTime): boolean {
        return this.InternalTicks.lessThan(value.InternalTicks);
    }

    public lessThanOrEqual(value: DateTime): boolean {
        return this.InternalTicks.lessThanOrEqual(value.InternalTicks);
    }

    public greaterThan(value: DateTime): boolean {
        return this.InternalTicks.greaterThan(value.InternalTicks);
    }

    public greaterThanOrEqual(value: DateTime): boolean {
        return this.InternalTicks.greaterThanOrEqual(value.InternalTicks);
    }


    // Returns a string array containing all of the known date and time options for the
    // current culture.  The strings returned are properly formatted date and
    // time strings for the current instance of DateTime.
    public GetDateTimeFormats(): string[];
    // Returns a string array containing all of the known date and time options for the
    // using the information provided by IFormatProvider.  The strings returned are properly formatted date and
    // time strings for the current instance of DateTime.
    public GetDateTimeFormats(provider: IFormatProvider): string[];
    // Returns a string array containing all of the date and time options for the
    // given format format and current culture.  The strings returned are properly formatted date and
    // time strings for the current instance of DateTime.
    public GetDateTimeFormats(format: char): string[];
    // Returns a string array containing all of the date and time options for the
    // given format format and given culture.  The strings returned are properly formatted date and
    // time strings for the current instance of DateTime.
    public GetDateTimeFormats(format: char, provider: IFormatProvider): string[];
    public GetDateTimeFormats(...args: any[]): string[] {
        if (args.length === 0) {
            //Contract.Ensures(Contract.Result<String[]>() != null);
            return this.GetDateTimeFormats(CultureInfo.CurrentCulture);
        } else if (args.length === 1 && is.typeof<IFormatProvider>(args[0], System.Types.IFormatProvider)) {
            const provider: IFormatProvider = args[0];
            return DateTimeFormat.GetAllDateTimes(this, DateTimeFormatInfo.GetInstance(provider));
        } else if (args.length === 1 && is.char(args[0])) {
            const format = args[0];
            return (this.GetDateTimeFormats(format, CultureInfo.CurrentCulture));
        } else if (args.length === 2 && is.char(args[0]) && is.typeof<IFormatProvider>(args[0], System.Types.IFormatProvider)) {
            const format: char = args[0];
            const provider: IFormatProvider = args[1];
            return (DateTimeFormat.GetAllDateTimes(this, format, DateTimeFormatInfo.GetInstance(provider)));
        }
        throw new ArgumentException('');
    }

    //
    // IConvertible implementation
    //

    public GetTypeCode(): TypeCode {
        return TypeCode.DateTime;
    }


    /// <internalonly/>
    /* bool IConvertible.ToBoolean(IFormatProvider provider) {
        throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "Boolean"));
    }

    /// <internalonly/>
    char IConvertible.ToChar(IFormatProvider provider) {
        throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "Char"));
    }

    /// <internalonly/>
    sbyte IConvertible.ToSByte(IFormatProvider provider) {
        throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "SByte"));
    }

    /// <internalonly/>
    byte IConvertible.ToByte(IFormatProvider provider) {
        throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "Byte"));
    }

    /// <internalonly/>
    short IConvertible.ToInt16(IFormatProvider provider) {
        throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "Int16"));
    }

    /// <internalonly/>
    ushort IConvertible.ToUInt16(IFormatProvider provider) {
        throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "UInt16"));
    }

    /// <internalonly/>
    int IConvertible.ToInt32(IFormatProvider provider) {
        throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "Int32"));
    }

    /// <internalonly/>
    uint IConvertible.ToUInt32(IFormatProvider provider) {
        throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "UInt32"));
    }

    /// <internalonly/>
    long IConvertible.ToInt64(IFormatProvider provider) {
        throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "Int64"));
    }

    /// <internalonly/>
    ulong IConvertible.ToLong(IFormatProvider provider) {
        throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "UInt64"));
    }

    /// <internalonly/>
    float IConvertible.ToSingle(IFormatProvider provider) {
        throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "Single"));
    }

    /// <internalonly/>
    double IConvertible.ToDouble(IFormatProvider provider) {
        throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "Double"));
    }

    /// <internalonly/>
    Decimal IConvertible.ToDecimal(IFormatProvider provider) {
        throw new InvalidCastException(Environment.GetResourceString("InvalidCast_FromTo", "DateTime", "Decimal"));
    }

    /// <internalonly/>
    DateTime IConvertible.ToDateTime(IFormatProvider provider) {
        return this;
    }

    /// <internalonly/>
    Object IConvertible.ToType(Type type, IFormatProvider provider) {
        return Convert.DefaultToType((IConvertible)this, type, provider);
    } */

    // Tries to construct a DateTime from a given year, month, day, hour,
    // minute, second and millisecond.
    //
    /* internal */ static TryCreate(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int, result: Out<DateTime>): boolean {
        result.value = DateTime.MinValue;
        if (year < 1 || year > 9999 || month < 1 || month > 12) {
            return false;
        }
        const days: IntArray = DateTime.IsLeapYear(year) ? DateTime.DaysToMonth366 : DateTime.DaysToMonth365;
        if (day < 1 || day > days[month] - days[month - 1]) {
            return false;
        }
        if (hour < 0 || hour >= 24 || minute < 0 || minute >= 60 || second < 0 || second >= 60) {
            return false;
        }
        if (millisecond < 0 || millisecond >= DateTime.MillisPerSecond) {
            return false;
        }
        let ticks: long = DateTime.DateToTicks(year, month, day).add(DateTime.TimeToTicks(hour, minute, second));

        ticks = ticks.add(DateTime.TicksPerMillisecond.mul(millisecond));
        if (ticks.lessThan(DateTime.MinTicks) || ticks.greaterThan(DateTime.MaxTicks)) {
            return false;
        }
        result.value = new DateTime(ticks, DateTimeKind.Unspecified);
        return true;
    }


}