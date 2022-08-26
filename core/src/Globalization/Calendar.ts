/*@******************************************************************************************************************************
*                                                                                                                               *
* ████████╗██╗   ██╗██╗   ██╗ █████╗ ██╗         ███████╗██████╗  █████╗ ███╗   ███╗███████╗██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗ *
* ╚══██╔══╝██║   ██║██║   ██║██╔══██╗██║         ██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔════╝██║    ██║██╔═══██╗██╔══██╗██║ ██╔╝ *
*    ██║   ██║   ██║██║   ██║███████║██║         █████╗  ██████╔╝███████║██╔████╔██║█████╗  ██║ █╗ ██║██║   ██║██████╔╝█████╔╝  *
*    ██║   ██║   ██║╚██╗ ██╔╝██╔══██║██║         ██╔══╝  ██╔══██╗██╔══██║██║╚██╔╝██║██╔══╝  ██║███╗██║██║   ██║██╔══██╗██╔═██╗  *
*    ██║   ╚██████╔╝ ╚████╔╝ ██║  ██║███████╗    ██║     ██║  ██║██║  ██║██║ ╚═╝ ██║███████╗╚███╔███╔╝╚██████╔╝██║  ██║██║  ██╗ *
*    ╚═╝    ╚═════╝   ╚═══╝  ╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝ ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ *
*                                                                                                                               *
*                                                                                                                               *
* This file is part of Tuval Framework.                                                                                         *
* Copyright (c) Tuvalsoft 2018 All rights reserved.                                                                             *
*                                                                                                                               *
* Licensed under the GNU General Public License v3.0.                                                                           *
* More info at: https://choosealicense.com/licenses/gpl-3.0/                                                                    *
* Tuval Framework Created By Selim TAN in 2020                                                                                  *
******************************************************************************************************************************@*/

import { Convert } from "../convert";
import { Environment } from "../Environment";
import { ArgumentException } from '../Exceptions/ArgumentException';
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { TObject } from "../Extensions";
import { long, int, double, IntArray } from '../float';
import { ICloneable } from "../ICloneable";
import { Internal, Virtual } from "../Reflection/Decorators/ClassInfo";
import { CalendarAlgorithmType } from "./CalendarAlgorithmType";
import { CalendarData } from "./CalendarData";
import { TString } from '../Text/TString';
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { is } from "../is";
import { System } from "../SystemTypes";
import { DayOfWeek } from "../Time/DayOfWeek";
import { CalendarWeekRule } from "./CalendarWeekRule";
import { DateTime } from "../Time/__DateTime";
import { Out } from "../Out";
import { TimeSpan } from "../Timespan";

export abstract class Calendar extends TObject implements ICloneable<Calendar>{

    // Number of 100ns (10E-7 second) ticks per time unit
    public /* internal */ static readonly TicksPerMillisecond: long = Convert.ToLong(10000);
    public /* internal */ static readonly TicksPerSecond: long = Calendar.TicksPerMillisecond.mul(1000);
    public /* internal */ static readonly TicksPerMinute: long = Calendar.TicksPerSecond.mul(60);
    public /* internal */ static readonly TicksPerHour: long = Calendar.TicksPerMinute.mul(60);
    public /* internal */ static readonly TicksPerDay: long = Calendar.TicksPerHour.mul(24);

    // Number of milliseconds per time unit
    public /* internal */ static readonly MillisPerSecond: int = 1000;
    public /* internal */ static readonly MillisPerMinute: int = Calendar.MillisPerSecond * 60;
    public /* internal */ static readonly MillisPerHour: int = Calendar.MillisPerMinute * 60;
    public /* internal */ static readonly MillisPerDay: int = Calendar.MillisPerHour * 24;

    // Number of days in a non-leap year
    public /* internal */ static readonly DaysPerYear: int = 365;
    // Number of days in 4 years
    public /* internal */ static readonly DaysPer4Years: int = Calendar.DaysPerYear * 4 + 1;
    // Number of days in 100 years
    public /* internal */ static readonly DaysPer100Years: int = Calendar.DaysPer4Years * 25 - 1;
    // Number of days in 400 years
    public /* internal */ static readonly DaysPer400Years: int = Calendar.DaysPer100Years * 4 + 1;

    // Number of days from 1/1/0001 to 1/1/10000
    public /* internal */ static readonly DaysTo10000: int = Calendar.DaysPer400Years * 25 - 366;

    public /* internal */ static readonly MaxMillis: long = Convert.ToLong(Calendar.DaysTo10000 * Calendar.MillisPerDay);

    //
    //  Calendar ID Values.  This is used to get data from calendar.nlp.
    //  The order of calendar ID means the order of data items in the table.
    //

    public /* internal */ static readonly CAL_GREGORIAN: int = 1;     // Gregorian (localized) calendar
    public /* internal */ static readonly CAL_GREGORIAN_US: int = 2;     // Gregorian (U.S.) calendar
    public /* internal */ static readonly CAL_JAPAN: int = 3;     // Japanese Emperor Era calendar
    public /* internal */ static readonly CAL_TAIWAN: int = 4;     // Taiwan Era calendar
    public /* internal */ static readonly CAL_KOREA: int = 5;     // Korean Tangun Era calendar
    public /* internal */ static readonly CAL_HIJRI: int = 6;     // Hijri (Arabic Lunar) calendar
    public /* internal */ static readonly CAL_THAI: int = 7;     // Thai calendar
    public /* internal */ static readonly CAL_HEBREW: int = 8;     // Hebrew (Lunar) calendar
    public /* internal */ static readonly CAL_GREGORIAN_ME_FRENCH: int = 9;     // Gregorian Middle East French calendar
    public /* internal */ static readonly CAL_GREGORIAN_ARABIC: int = 10;     // Gregorian Arabic calendar
    public /* internal */ static readonly CAL_GREGORIAN_XLIT_ENGLISH: int = 11;     // Gregorian Transliterated English calendar
    public /* internal */ static readonly CAL_GREGORIAN_XLIT_FRENCH: int = 12;
    public /* internal */ static readonly CAL_JULIAN: int = 13;
    public /* internal */ static readonly CAL_JAPANESELUNISOLAR: int = 14;
    public /* internal */ static readonly CAL_CHINESELUNISOLAR: int = 15;
    public /* internal */ static readonly CAL_SAKA: int = 16;     // reserved to match Office but not implemented in our code
    public /* internal */ static readonly CAL_LUNAR_ETO_CHN: int = 17;     // reserved to match Office but not implemented in our code
    public /* internal */ static readonly CAL_LUNAR_ETO_KOR: int = 18;     // reserved to match Office but not implemented in our code
    public /* internal */ static readonly CAL_LUNAR_ETO_ROKUYOU: int = 19;     // reserved to match Office but not implemented in our code
    public /* internal */ static readonly CAL_KOREANLUNISOLAR: int = 20;
    public /* internal */ static readonly CAL_TAIWANLUNISOLAR: int = 21;
    public /* internal */ static readonly CAL_PERSIAN: int = 22;
    public /* internal */ static readonly CAL_UMALQURA: int = 23;

    public /* internal */  m_currentEraValue: int = -1;

    private m_isReadOnly: boolean = false;

    // The minimum supported DateTime range for the calendar.

    @Virtual
    protected Get_MinSupportedDateTime(): DateTime {
        return (DateTime.MinValue);
    }
    public get MinSupportedDateTime(): DateTime {
        return this.Get_MinSupportedDateTime();
    }

    // The maximum supported DateTime range for the calendar.

    @Virtual
    protected Get_MaxSupportedDateTime(): DateTime {
        return (DateTime.MaxValue);
    }
    public get MaxSupportedDateTime(): DateTime {
        return this.Get_MaxSupportedDateTime();
    }
    protected constructor() {
        super();
        //Do-nothing constructor.
    }

    ///
    // This can not be abstract, otherwise no one can create a subclass of Calendar.
    //

    @Virtual
    protected Get_ID(): int {
        return -1;
    }
    public get ID(): int {
        return this.Get_ID();
    }

    ///
    // Return the Base calendar ID for calendars that didn't have defined data in calendarData
    //

    @Virtual
    protected Get_BaseCalendarID(): int {
        return this.ID;
    }
    public get BaseCalendarID(): int {
        return this.Get_BaseCalendarID();
    }


    // Returns  the type of the calendar.
    //
    @Virtual
    protected Get_AlgorithmType(): CalendarAlgorithmType {
        return CalendarAlgorithmType.Unknown;
    }
    public get AlgorithmType(): int {
        return this.Get_AlgorithmType();
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  IsReadOnly
    //
    //  Detect if the object is readonly.
    //
    ////////////////////////////////////////////////////////////////////////
    public get IsReadOnly(): boolean {
        return (this.m_isReadOnly);
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  Clone
    //
    //  Is the implementation of IColnable.
    //
    ////////////////////////////////////////////////////////////////////////
    @Virtual
    public Clone(): Calendar {
        const o: Calendar = this.MemberwiseClone();
        o.SetReadOnlyState(false);
        return (o);
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //  ReadOnly
    //
    //  Create a cloned readonly instance or return the input one if it is
    //  readonly.
    //
    ////////////////////////////////////////////////////////////////////////
    public static ReadOnly(calendar: Calendar): Calendar {
        if (calendar == null) { throw new ArgumentNullException("calendar"); }
        if (calendar.IsReadOnly) {
            return (calendar);
        }

        const clonedCalendar: Calendar = (calendar.MemberwiseClone());
        clonedCalendar.SetReadOnlyState(true);

        return (clonedCalendar);
    }

    @Internal
    public VerifyWritable(): void {
        if (this.m_isReadOnly) {
            throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_ReadOnly"));
        }
    }

    @Internal
    public SetReadOnlyState(readOnly: boolean): void {
        this.m_isReadOnly = readOnly;
    }


    /*=================================CurrentEraValue==========================
    **Action: This is used to convert CurretEra(0) to an appropriate era value.
    **Returns:
    **Arguments:
    **Exceptions:
    **Notes:
    ** The value is from calendar.nlp.
    ============================================================================*/

    public /* internal */ /* virtual */  get CurrentEraValue(): int {
        // The following code assumes that the current era value can not be -1.
        if (this.m_currentEraValue === -1) {
            // Contract.Assert(BaseCalendarID > 0, "[Calendar.CurrentEraValue] Expected ID > 0");
            this.m_currentEraValue = CalendarData.GetCalendarData(this.BaseCalendarID).iCurrentEra;
        }
        return (this.m_currentEraValue);
    }

    // The current era for a calendar.

    public static readonly CurrentEra: int = 0;

    public /* internal */  twoDigitYearMax: int = -1;

    public /* internal */ static CheckAddResult(ticks: long, minValue: DateTime, maxValue: DateTime): void {
        if (ticks < minValue.Ticks || ticks > maxValue.Ticks) {
            throw new ArgumentException(
                TString.Format(/* CultureInfo.InvariantCulture,  */Environment.GetResourceString("Argument_ResultCalendarRange"), minValue, maxValue));
        }
        //Contract.EndContractBlock();
    }

    public /* internal */  Add(time: DateTime, value: int, scale: int): DateTime;
    public /* internal */  Add(time: DateTime, value: double, scale: int): DateTime;
    public /* internal */  Add(...args: any[]): DateTime {
        if (arguments.length === 3 && is.typeof<DateTime>(args[0], System.Types.DateTime) && is.int(args[1]) && is.int(args[2])) {
            const time: DateTime = args[0];
            const value: int = args[1];
            const scale: int = args[2];
            this.Add(time, value, scale);
        } else if (args.length === 3 && is.typeof<DateTime>(args[0], System.Types.DateTime) && is.double(args[1]) && is.int(args[2])) {
            // From ECMA CLI spec, Partition III, section 3.27:
            //
            // If overflow occurs converting a floating-point type to an integer, or if the floating-point value
            // being converted to an integer is a NaN, the value returned is unspecified.
            //
            // Based upon this, this method should be performing the comparison against the double
            // before attempting a cast. Otherwise, the result is undefined.
            const time: DateTime = args[0];
            const value: double = args[1];
            const scale: int = args[2];
            const tempMillis: double = value.mul(scale).add(value.greaterThanOrEqual(0) ? 0.5 : -0.5); /*  (value.mul(scale)) + (value.greaterThanOrEqual(0) ? 0.5 : -0.5)); */
            if (!((tempMillis.greaterThan(Calendar.MaxMillis.neg()) && (tempMillis.lessThan(Calendar.MaxMillis))))) {
                throw new ArgumentOutOfRangeException("value", Environment.GetResourceString("ArgumentOutOfRange_AddValue"));
            }

            const millis: long = tempMillis;
            const ticks: long = time.Ticks.add(millis.mul(Calendar.TicksPerMillisecond));
            Calendar.CheckAddResult(ticks, this.MinSupportedDateTime, this.MaxSupportedDateTime);
            return new DateTime(ticks);
        }
        throw new ArgumentException('');
    }

    // Returns the DateTime resulting from adding the given number of
    // milliseconds to the specified DateTime. The result is computed by rounding
    // the number of milliseconds given by value to the nearest integer,
    // and adding that interval to the specified DateTime. The value
    // argument is permitted to be negative.
    //

    @Virtual
    public AddMilliseconds(time: DateTime, milliseconds: double): DateTime {
        return (this.Add(time, milliseconds, 1));
    }


    // Returns the DateTime resulting from adding a fractional number of
    // days to the specified DateTime. The result is computed by rounding the
    // fractional number of days given by value to the nearest
    // millisecond, and adding that interval to the specified DateTime. The
    // value argument is permitted to be negative.
    //

    @Virtual
    public AddDays(time: DateTime, days: int): DateTime {
        return (this.Add(time, days, Calendar.MillisPerDay));
    }

    // Returns the DateTime resulting from adding a fractional number of
    // hours to the specified DateTime. The result is computed by rounding the
    // fractional number of hours given by value to the nearest
    // millisecond, and adding that interval to the specified DateTime. The
    // value argument is permitted to be negative.
    //

    @Virtual
    public AddHours(time: DateTime, hours: int): DateTime {
        return (this.Add(time, hours, Calendar.MillisPerHour));
    }


    // Returns the DateTime resulting from adding a fractional number of
    // minutes to the specified DateTime. The result is computed by rounding the
    // fractional number of minutes given by value to the nearest
    // millisecond, and adding that interval to the specified DateTime. The
    // value argument is permitted to be negative.
    //

    @Virtual
    public AddMinutes(time: DateTime, minutes: int): DateTime {
        return (this.Add(time, minutes, Calendar.MillisPerMinute));
    }


    // Returns the DateTime resulting from adding the given number of
    // months to the specified DateTime. The result is computed by incrementing
    // (or decrementing) the year and month parts of the specified DateTime by
    // value months, and, if required, adjusting the day part of the
    // resulting date downwards to the last day of the resulting month in the
    // resulting year. The time-of-day part of the result is the same as the
    // time-of-day part of the specified DateTime.
    //
    // In more precise terms, considering the specified DateTime to be of the
    // form y / m / d + t, where y is the
    // year, m is the month, d is the day, and t is the
    // time-of-day, the result is y1 / m1 / d1 + t,
    // where y1 and m1 are computed by adding value months
    // to y and m, and d1 is the largest value less than
    // or equal to d that denotes a valid day in month m1 of year
    // y1.
    //

    public abstract AddMonths(time: DateTime, months: int): DateTime;

    // Returns the DateTime resulting from adding a number of
    // seconds to the specified DateTime. The result is computed by rounding the
    // fractional number of seconds given by value to the nearest
    // millisecond, and adding that interval to the specified DateTime. The
    // value argument is permitted to be negative.
    //

    @Virtual
    public AddSeconds(time: DateTime, seconds: int): DateTime {
        return this.Add(time, seconds, Calendar.MillisPerSecond);
    }

    // Returns the DateTime resulting from adding a number of
    // weeks to the specified DateTime. The
    // value argument is permitted to be negative.
    //

    @Virtual
    public AddWeeks(time: DateTime, weeks: int): DateTime {
        return (this.AddDays(time, weeks * 7));
    }


    // Returns the DateTime resulting from adding the given number of
    // years to the specified DateTime. The result is computed by incrementing
    // (or decrementing) the year part of the specified DateTime by value
    // years. If the month and day of the specified DateTime is 2/29, and if the
    // resulting year is not a leap year, the month and day of the resulting
    // DateTime becomes 2/28. Otherwise, the month, day, and time-of-day
    // parts of the result are the same as those of the specified DateTime.
    //

    public abstract AddYears(time: DateTime, years: int): DateTime;

    // Returns the day-of-month part of the specified DateTime. The returned
    // value is an integer between 1 and 31.
    //

    public abstract GetDayOfMonth(time: DateTime): int;

    // Returns the day-of-week part of the specified DateTime. The returned value
    // is an integer between 0 and 6, where 0 indicates Sunday, 1 indicates
    // Monday, 2 indicates Tuesday, 3 indicates Wednesday, 4 indicates
    // Thursday, 5 indicates Friday, and 6 indicates Saturday.
    //

    public abstract GetDayOfWeek(time: DateTime): DayOfWeek;

    // Returns the day-of-year part of the specified DateTime. The returned value
    // is an integer between 1 and 366.
    //

    public abstract GetDayOfYear(time: DateTime): int;

    // Returns the number of days in the month given by the year and
    // month arguments.
    //


    // Returns the number of days in the month given by the year and
    // month arguments for the specified era.
    public /* abstract */  GetDaysInMonth(year: int, month: int, era: int): int;
    public GetDaysInMonth(year: int, month: int): int;
    public GetDaysInMonth(...args: any[]): int {
        if (args.length === 2) {
            const year: int = args[0];
            const month: int = args[1];
            return (this.GetDaysInMonth(year, month, Calendar.CurrentEra));
        }
        throw new ArgumentOutOfRangeException('');
    }

    // Returns the number of days in the year given by the year argument for the current era.
    public GetDaysInYear(year: int): int;
    public /* abstract */  GetDaysInYear(year: int, era: int): int;
    public GetDaysInYear(...args: any[]): int {
        if (args.length === 1) {
            const year: int = args[0];
            return (this.GetDaysInYear(year, Calendar.CurrentEra));
        }
        throw new ArgumentException('');
    }

    // Returns the era for the specified DateTime value.

    public abstract GetEra(time: DateTime): int;

    /*=================================Eras==========================
    **Action: Get the list of era values.
    **Returns: The int array of the era names supported in this calendar.
    **      null if era is not used.
    **Arguments: None.
    **Exceptions: None.
    ============================================================================*/

    protected abstract Get_Eras(): IntArray;
    public get Eras(): IntArray {
        return this.Get_Eras();
    }


    // Returns the hour part of the specified DateTime. The returned value is an
    // integer between 0 and 23.
    //

    @Virtual
    public GetHour(time: DateTime): int {
        return time.Ticks.div(Calendar.TicksPerHour).mod(24).toNumber();
    }

    // Returns the millisecond part of the specified DateTime. The returned value
    // is an integer between 0 and 999.
    //

    @Virtual
    public GetMilliseconds(time: DateTime): double {
        return ((time.Ticks.div(Calendar.TicksPerMillisecond)).mod(1000));
    }

    // Returns the minute part of the specified DateTime. The returned value is
    // an integer between 0 and 59.
    //

    @Virtual
    public GetMinute(time: DateTime): int {
        return time.Ticks.div(Calendar.TicksPerMinute).mod(60).toNumber();
    }

    // Returns the month part of the specified DateTime. The returned value is an
    // integer between 1 and 12.
    //

    public abstract GetMonth(time: DateTime): int;

    // Returns the number of months in the specified year in the current era.
    public /* abstract */  GetMonthsInYear(year: int, era: int): int;
    public GetMonthsInYear(year: int): int;
    public GetMonthsInYear(...args: any[]): int {
        if (args.length === 1) {
            const year: int = args[0];
            return this.GetMonthsInYear(year, Calendar.CurrentEra);
        }
        throw new ArgumentException('');
    }

    // Returns the number of months in the specified year and era.



    // Returns the second part of the specified DateTime. The returned value is
    // an integer between 0 and 59.
    //

    @Virtual
    public GetSecond(time: DateTime): int {
        return time.Ticks.div(Calendar.TicksPerSecond).mod(60).toNumber();
    }

    /*=================================GetFirstDayWeekOfYear==========================
    **Action: Get the week of year using the FirstDay rule.
    **Returns:  the week of year.
    **Arguments:
    **  time
    **  firstDayOfWeek  the first day of week (0=Sunday, 1=Monday, ... 6=Saturday)
    **Notes:
    **  The CalendarWeekRule.FirstDay rule: Week 1 begins on the first day of the year.
    **  Assume f is the specifed firstDayOfWeek,
    **  and n is the day of week for January 1 of the specified year.
    **  Assign offset = n - f;
    **  Case 1: offset = 0
    **      E.g.
    **                     f=1
    **          weekday 0  1  2  3  4  5  6  0  1
    **          date       1/1
    **          week#      1                    2
    **      then week of year = (GetDayOfYear(time) - 1) / 7 + 1
    **
    **  Case 2: offset < 0
    **      e.g.
    **                     n=1   f=3
    **          weekday 0  1  2  3  4  5  6  0
    **          date       1/1
    **          week#      1     2
    **      This means that the first week actually starts 5 days before 1/1.
    **      So week of year = (GetDayOfYear(time) + (7 + offset) - 1) / 7 + 1
    **  Case 3: offset > 0
    **      e.g.
    **                  f=0   n=2
    **          weekday 0  1  2  3  4  5  6  0  1  2
    **          date          1/1
    **          week#         1                    2
    **      This means that the first week actually starts 2 days before 1/1.
    **      So Week of year = (GetDayOfYear(time) + offset - 1) / 7 + 1
    ============================================================================*/

    public /* internal */  GetFirstDayWeekOfYear(time: DateTime, firstDayOfWeek: int): int {
        const dayOfYear: int = this.GetDayOfYear(time) - 1;   // Make the day of year to be 0-based, so that 1/1 is day 0.
        // Calculate the day of week for the first day of the year.
        // dayOfWeek - (dayOfYear % 7) is the day of week for the first day of this year.  Note that
        // this value can be less than 0.  It's fine since we are making it positive again in calculating offset.
        const dayForJan1: int = this.GetDayOfWeek(time) - (dayOfYear % 7);
        const offset: int = (dayForJan1 - firstDayOfWeek + 14) % 7;
        //Contract.Assert(offset >= 0, "Calendar.GetFirstDayWeekOfYear(): offset >= 0");
        return ((dayOfYear + offset) / 7 + 1);
    }

    private GetWeekOfYearFullDays(time: DateTime, firstDayOfWeek: int, fullDays: int): int {
        let dayForJan1: int;
        let offset: int;
        let day: int;

        const dayOfYear: int = this.GetDayOfYear(time) - 1; // Make the day of year to be 0-based, so that 1/1 is day 0.
        //
        // Calculate the number of days between the first day of year (1/1) and the first day of the week.
        // This value will be a positive value from 0 ~ 6.  We call this value as "offset".
        //
        // If offset is 0, it means that the 1/1 is the start of the first week.
        //     Assume the first day of the week is Monday, it will look like this:
        //     Sun      Mon     Tue     Wed     Thu     Fri     Sat
        //     12/31    1/1     1/2     1/3     1/4     1/5     1/6
        //              +--> First week starts here.
        //
        // If offset is 1, it means that the first day of the week is 1 day ahead of 1/1.
        //     Assume the first day of the week is Monday, it will look like this:
        //     Sun      Mon     Tue     Wed     Thu     Fri     Sat
        //     1/1      1/2     1/3     1/4     1/5     1/6     1/7
        //              +--> First week starts here.
        //
        // If offset is 2, it means that the first day of the week is 2 days ahead of 1/1.
        //     Assume the first day of the week is Monday, it will look like this:
        //     Sat      Sun     Mon     Tue     Wed     Thu     Fri     Sat
        //     1/1      1/2     1/3     1/4     1/5     1/6     1/7     1/8
        //                      +--> First week starts here.



        // Day of week is 0-based.
        // Get the day of week for 1/1.  This can be derived from the day of week of the target day.
        // Note that we can get a negative value.  It's ok since we are going to make it a positive value when calculating the offset.
        dayForJan1 = this.GetDayOfWeek(time) - (dayOfYear % 7);

        // Now, calculate the offset.  Subtract the first day of week from the dayForJan1.  And make it a positive value.
        offset = (firstDayOfWeek - dayForJan1 + 14) % 7;
        if (offset !== 0 && offset >= fullDays) {
            //
            // If the offset is greater than the value of fullDays, it means that
            // the first week of the year starts on the week where Jan/1 falls on.
            //
            offset -= 7;
        }
        //
        // Calculate the day of year for specified time by taking offset into account.
        //
        day = dayOfYear - offset;
        if (day >= 0) {
            //
            // If the day of year value is greater than zero, get the week of year.
            //
            return (day / 7 + 1);
        }
        //
        // Otherwise, the specified time falls on the week of previous year.
        // Call this method again by passing the last day of previous year.
        //
        // the last day of the previous year may "underflow" to no longer be a valid date time for
        // this calendar if we just subtract so we need the subclass to provide us with
        // that information
        if (time <= this.MinSupportedDateTime.AddDays(Convert.ToDouble(dayOfYear))) {
            return this.GetWeekOfYearOfMinSupportedDateTime(firstDayOfWeek, fullDays);
        }
        return (this.GetWeekOfYearFullDays(time.AddDays(Convert.ToDouble((dayOfYear + 1)).neg()), firstDayOfWeek, fullDays));
    }

    private GetWeekOfYearOfMinSupportedDateTime(firstDayOfWeek: int, minimumDaysInFirstWeek: int): int {
        const dayOfYear: int = this.GetDayOfYear(this.MinSupportedDateTime) - 1;  // Make the day of year to be 0-based, so that 1/1 is day 0.
        const dayOfWeekOfFirstOfYear: int = this.GetDayOfWeek(this.MinSupportedDateTime) - dayOfYear % 7;

        // Calculate the offset (how many days from the start of the year to the start of the week)
        const offset: int = (firstDayOfWeek + 7 - dayOfWeekOfFirstOfYear) % 7;
        if (offset === 0 || offset >= minimumDaysInFirstWeek) {
            // First of year falls in the first week of the year
            return 1;
        }

        const daysInYearBeforeMinSupportedYear: int = this.DaysInYearBeforeMinSupportedYear - 1; // Make the day of year to be 0-based, so that 1/1 is day 0.
        const dayOfWeekOfFirstOfPreviousYear: int = dayOfWeekOfFirstOfYear - 1 - (daysInYearBeforeMinSupportedYear % 7);

        // starting from first day of the year, how many days do you have to go forward
        // before getting to the first day of the week?
        const daysInInitialPartialWeek: int = (firstDayOfWeek - dayOfWeekOfFirstOfPreviousYear + 14) % 7;
        let day: int = daysInYearBeforeMinSupportedYear - daysInInitialPartialWeek;
        if (daysInInitialPartialWeek >= minimumDaysInFirstWeek) {
            // If the offset is greater than the minimum Days in the first week, it means that
            // First of year is part of the first week of the year even though it is only a partial week
            // add another week
            day += 7;
        }

        return (day / 7 + 1);
    }

    // it would be nice to make this abstract but we can't since that would break previous implementations
    protected /* virtual */ get DaysInYearBeforeMinSupportedYear(): int {
        return 365;
    }


    // Returns the week of year for the specified DateTime. The returned value is an
    // integer between 1 and 53.
    //

    @Virtual
    public GetWeekOfYear(time: DateTime, rule: CalendarWeekRule, firstDayOfWeek: DayOfWeek): int {
        if (firstDayOfWeek < 0 || firstDayOfWeek > 6) {
            throw new ArgumentOutOfRangeException("firstDayOfWeek" + Environment.GetResourceString("ArgumentOutOfRange_Range" + DayOfWeek.Sunday + DayOfWeek.Saturday));
        }
        // Contract.EndContractBlock();
        switch (rule) {
            case CalendarWeekRule.FirstDay:
                return (this.GetFirstDayWeekOfYear(time, firstDayOfWeek));
            case CalendarWeekRule.FirstFullWeek:
                return (this.GetWeekOfYearFullDays(time, firstDayOfWeek, 7));
            case CalendarWeekRule.FirstFourDayWeek:
                return (this.GetWeekOfYearFullDays(time, firstDayOfWeek, 4));
        }

        throw new ArgumentOutOfRangeException("rule" + Environment.GetResourceString("ArgumentOutOfRange_Range" + CalendarWeekRule.FirstDay + CalendarWeekRule.FirstFourDayWeek));

    }

    // Returns the year part of the specified DateTime. The returned value is an
    // integer between 1 and 9999.
    //

    public abstract GetYear(time: DateTime): int;

    // Checks whether a given day in the current era is a leap day. This method returns true if
    // the date is a leap day, or false if not.
    public /* abstract */  IsLeapDay(year: int, month: int, day: int, era: int): boolean;
    public IsLeapDay(year: int, month: int, day: int): boolean;
    public IsLeapDay(...args: any[]): boolean {
        if (arguments.length === 3) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            return (this.IsLeapDay(year, month, day, Calendar.CurrentEra));
        }
        throw new ArgumentException('');
    }

    // Checks whether a given month in the specified era is a leap month. This method returns true if
    // month is a leap month, or false if not.
    public /* abstract */  IsLeapMonth(year: int, month: int, era: int): boolean;
    public IsLeapMonth(year: int, month: int): boolean;
    public IsLeapMonth(...args: any[]): boolean {
        if (args.length === 2) {
            const year: int = args[0];
            const month: int = args[1];
            return (this.IsLeapMonth(year, month, Calendar.CurrentEra));
        }
        throw new ArgumentException('');
    }



    // Returns  the leap month in a calendar year of the current era. This method returns 0
    // if this calendar does not have leap month, or this year is not a leap year.
    public GetLeapMonth(year: int): int;
    public GetLeapMonth(year: int, era: int): int;
    public GetLeapMonth(...args: any[]): int {
        if (args.length === 1 && is.int(args[0])) {
            const year: int = args[0];
            return this.GetLeapMonth(year, Calendar.CurrentEra);
        } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
            const year: int = args[0];
            const era: int = args[1];
            if (!this.IsLeapYear(year, era))
                return 0;

            const monthsCount: int = this.GetMonthsInYear(year, era);
            for (let month: int = 1; month <= monthsCount; month++) {
                if (this.IsLeapMonth(year, month, era))
                    return month;
            }
            return 0;
        }
        throw new ArgumentException('');
    }

    // Checks whether a given year in the current era is a leap year. This method returns true if
    // year is a leap year, or false if not.
    public IsLeapYear(year: int): boolean;
    public /* abstract */  IsLeapYear(year: int, era: int): boolean;
    public IsLeapYear(...args: any[]): boolean {
        if (arguments.length === 1 && is.int(args[0])) {
            const year: int = args[0];
            return (this.IsLeapYear(year, Calendar.CurrentEra));
        }
        throw new ArgumentException('');
    }

    public ToDateTime(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int): DateTime;
    public /* abstract */  ToDateTime(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int, era: int): DateTime;
    public ToDateTime(...args: any[]): DateTime {
        if (args.length === 7 && is.int(args[0]) && is.int(args[1]) && is.int(args[2]) && is.int(args[3]) && is.int(args[4]) && is.int(args[5]) && is.int(args[6])) {
            const year: int = args[0];
            const month: int = args[1];
            const day: int = args[2];
            const hour: int = args[3];
            const minute: int = args[4];
            const second: int = args[5];
            const millisecond: int = args[6];
            return this.ToDateTime(year, month, day, hour, minute, second, millisecond, Calendar.CurrentEra);
        }
        throw new ArgumentException('');
    }

    // Returns the date and time converted to a DateTime value.  Throws an exception if the n-tuple is invalid.
    //

    @Internal
    @Virtual
    public TryToDateTime(year: int, month: int, day: int, hour: int, minute: int, second: int, millisecond: int, era: int, result: Out<DateTime>): boolean {
        result.value = DateTime.MinValue;
        try {
            result.value = this.ToDateTime(year, month, day, hour, minute, second, millisecond, era);
            return true;
        }
        catch (ArgumentException) {
            return false;
        }
    }

    @Internal
    @Virtual
    public IsValidYear(year: int, era: int): boolean {
        return (year >= this.GetYear(this.MinSupportedDateTime) && year <= this.GetYear(this.MaxSupportedDateTime));
    }

    @Internal
    @Virtual
    public IsValidMonth(year: int, month: int, era: int): boolean {
        return (this.IsValidYear(year, era) && month >= 1 && month <= this.GetMonthsInYear(year, era));
    }

    @Internal
    @Virtual
    public IsValidDay(year: int, month: int, day: int, era: int): boolean {
        return (this.IsValidMonth(year, month, era) && day >= 1 && day <= this.GetDaysInMonth(year, month, era));
    }


    // Returns and assigns the maximum value to represent a two digit year.  This
    // value is the upper boundary of a 100 year range that allows a two digit year
    // to be properly translated to a four digit year.  For example, if 2029 is the
    // upper boundary, then a two digit value of 30 should be interpreted as 1930
    // while a two digit value of 29 should be interpreted as 2029.  In this example
    // , the 100 year range would be from 1930-2029.  See ToFourDigitYear().

    @Virtual
    protected Get_TwoDigitYearMax(): int {
        return this.twoDigitYearMax;
    }
    public get TwoDigitYearMax(): int {
        return this.Get_TwoDigitYearMax();
    }

    @Virtual
    protected Set_TwoDigitYearMax(value: int) {
        this.VerifyWritable();
        this.twoDigitYearMax = value;
    }
    public set TwoDigitYearMax(value: int) {
        this.Set_TwoDigitYearMax(value);
    }


    // Converts the year value to the appropriate century by using the
    // TwoDigitYearMax property.  For example, if the TwoDigitYearMax value is 2029,
    // then a two digit value of 30 will get converted to 1930 while a two digit
    // value of 29 will get converted to 2029.
    @Virtual
    public ToFourDigitYear(year: int): int {
        if (year < 0) {
            throw new ArgumentOutOfRangeException("year" + Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        //Contract.EndContractBlock();
        if (year < 100) {
            return ((Convert.ToInt32(this.TwoDigitYearMax / 100) - (year > this.TwoDigitYearMax % 100 ? 1 : 0)) * 100 + year);
        }
        // If the year value is above 100, just return the year value.  Don't have to do
        // the TwoDigitYearMax comparison.
        return (year);
    }

    // Return the tick count corresponding to the given hour, minute, second.
    // Will check the if the parameters are valid.
    @Internal
    public static TimeToTicks(hour: int, minute: int, second: int, millisecond: int): long {
        if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60 && second >= 0 && second < 60) {
            if (millisecond < 0 || millisecond >= Calendar.MillisPerSecond) {
                throw new ArgumentOutOfRangeException("millisecond" + TString.Format(/* CultureInfo.InvariantCulture + */ Environment.GetResourceString("ArgumentOutOfRange_Range"), 0, Calendar.MillisPerSecond - 1));
            }
            return TimeSpan.TimeToTicks(hour, minute, second).add(Calendar.TicksPerMillisecond.mul(millisecond));
        }
        throw new ArgumentOutOfRangeException(Environment.GetResourceString("ArgumentOutOfRange_BadHourMinuteSecond"));
    }

    @Internal
    public static GetSystemTwoDigitYearSetting(CalID: int, defaultYearValue: int): int {
        // Call nativeGetTwoDigitYearMax
        let twoDigitYearMax: int = CalendarData.nativeGetTwoDigitYearMax(CalID);
        if (twoDigitYearMax < 0) {
            twoDigitYearMax = defaultYearValue;
        }
        return twoDigitYearMax;
    }
}